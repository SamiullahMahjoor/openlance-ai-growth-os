import type { Clock } from '@openlance/aios-kernel';
import { isErr } from '@openlance/aios-kernel';

import type { ResultAggregator } from './aggregator.js';
import type { CancellationManager } from './cancellation.js';
import { CheckpointManager } from './checkpoint.js';
import type { ExecutionSettings } from './configuration.js';
import type { DependencyResolver } from './dependency-resolver.js';
import type { ResolvedStep } from './dependency-resolver.js';
import type { ExecutionMetrics } from './metrics.js';
import { ExecutionStateManager } from './state.js';
import type { ParallelExecutionCoordinator } from './parallel.js';
import type { RecoveryManager } from './recovery.js';
import type { RetryManager } from './retry.js';
import type { Scheduler } from './scheduler.js';
import type { TelemetryManager } from './telemetry.js';
import type { TimeoutManager } from './timeout.js';
import type {
  Delay,
  ExecutionContext,
  ExecutionRecord,
  ExecutionRequest,
  StepExecutor,
  StepOutcome,
  StepResult,
  TerminalOutcome,
} from './types.js';

/** The collaborators a {@link ExecutionCoordinator} is composed from. */
export interface CoordinatorParts {
  readonly resolver: DependencyResolver;
  readonly scheduler: Scheduler;
  readonly parallel: ParallelExecutionCoordinator;
  readonly retry: RetryManager;
  readonly timeout: TimeoutManager;
  readonly cancellation: CancellationManager;
  readonly recovery: RecoveryManager;
  readonly aggregator: ResultAggregator;
  readonly telemetry: TelemetryManager;
  readonly metrics: ExecutionMetrics;
  readonly clock: Clock;
  readonly delay: Delay;
}

/** The executing safety outcomes: an authorized plan may execute only under one of these (fail-closed on any other). */
const EXECUTING_SAFETY = new Set(['SAFE', 'SANITIZE', 'RESTRICT', 'DEGRADE']);

/**
 * The execution coordinator: it orchestrates one execution end to end. It drives the frozen execution state model
 * (created through closed), verifies the governance and safety preconditions (never re-evaluating them), resolves and
 * schedules the plan's steps, runs each stage over the injected step-execution seam with bounded retry, timeout, and
 * execution-level recovery, checkpoints completed steps (so recovery never re-executes one), and aggregates a
 * deterministic immutable record. It fails closed: a governed cancellation, a failed precondition, a coordination cycle,
 * or an exhausted recovery yields a terminal record, never an uncontrolled proceed. It orchestrates only; the per-step
 * work is the injected seam's, and it never authorizes, evaluates safety, or overrides an upstream decision.
 */
export class ExecutionCoordinator {
  readonly #parts: CoordinatorParts;
  readonly #executor: StepExecutor;

  constructor(parts: CoordinatorParts, executor: StepExecutor) {
    this.#parts = parts;
    this.#executor = executor;
  }

  /** Orchestrate one execution into an immutable record. */
  async run(
    request: ExecutionRequest,
    settings: ExecutionSettings,
    barriers: ReadonlySet<string>,
  ): Promise<ExecutionRecord> {
    const context = request.context;
    const startedAt = this.#parts.clock.now();
    const state = new ExecutionStateManager();
    const checkpoint = new CheckpointManager(settings.checkpointing);
    const results = new Map<number, StepResult>();
    this.#parts.metrics.recordExecution();
    await this.#parts.telemetry.started(context.executionId);

    state.transition('initializing');
    state.transition('loading');
    state.transition('validating');

    // The governed cancellation gate is the only frozen-legal path to `cancelled`.
    if (this.#parts.cancellation.requested(context)) {
      state.transition('cancelled');
      return this.#finalize(
        state,
        results,
        'cancelled',
        request,
        startedAt,
        'Cancellation was requested; the execution was cancelled at the governed gate before running.',
      );
    }

    // Verify the upstream decisions; never re-evaluate them.
    const precondition = this.#precondition(request);
    if (precondition !== null) {
      state.transition('failed');
      return this.#finalize(state, results, 'failed', request, startedAt, precondition);
    }

    state.transition('ready');
    state.transition('executing');

    const resolved = this.#parts.resolver.resolve(request.plan);
    if (isErr(resolved)) {
      state.transition('recovering');
      state.transition('failed');
      return this.#finalize(state, results, 'failed', request, startedAt, resolved.error.message);
    }
    const stages = this.#parts.scheduler.schedule(
      resolved.value,
      settings.maxConcurrency,
      barriers,
    );

    let recoveriesUsed = 0;
    let failure: string | null = null;
    for (const stage of stages) {
      let stageFailed = true;
      while (stageFailed) {
        const outcomes = await this.#parts.parallel.run(stage, (resolvedStep) =>
          this.#runStep(resolvedStep, context, settings, checkpoint),
        );
        for (const outcome of outcomes) {
          results.set(outcome.index, outcome);
        }
        const failed = outcomes.find((outcome) => outcome.status === 'failed');
        if (failed === undefined) {
          stageFailed = false;
          continue;
        }
        state.transition('recovering');
        if (this.#parts.recovery.decide(recoveriesUsed, settings.maxRecoveries) === 'continue') {
          recoveriesUsed += 1;
          state.transition('executing');
          continue;
        }
        failure = failed.detail;
        break;
      }
      if (failure !== null) {
        break;
      }
    }

    if (failure !== null) {
      state.transition('failed');
      return this.#finalize(
        state,
        results,
        'failed',
        request,
        startedAt,
        `The execution failed: ${failure}.`,
      );
    }
    state.transition('completed');
    return this.#finalize(
      state,
      results,
      'completed',
      request,
      startedAt,
      'Every step completed; the execution finished successfully.',
    );
  }

  /** The precondition failure reason, or `null` when governance authorized and safety cleared the plan. */
  #precondition(request: ExecutionRequest): string | null {
    if (request.governance.decision !== 'AUTHORIZE') {
      return `Governance decision '${request.governance.id}' is ${request.governance.decision}, not AUTHORIZE; execution does not begin.`;
    }
    if (!EXECUTING_SAFETY.has(request.safety.outcome)) {
      return `Safety decision '${request.safety.id}' is ${request.safety.outcome}, not an executing outcome; execution does not begin.`;
    }
    return null;
  }

  /** Run one step over the seam with bounded retry and timeout; a checkpointed step is restored, never re-executed. */
  async #runStep(
    resolvedStep: ResolvedStep,
    context: ExecutionContext,
    settings: ExecutionSettings,
    checkpoint: CheckpointManager,
  ): Promise<StepResult> {
    const restored = checkpoint.restore(resolvedStep.index);
    if (restored !== undefined) {
      return restored;
    }
    const capability = resolvedStep.step.capability;
    let attempts = 0;
    let detail = 'step failed';
    while (true) {
      if (this.#parts.timeout.expired(context.deadline, this.#parts.clock.now())) {
        return {
          index: resolvedStep.index,
          capability,
          status: 'failed',
          attempts,
          detail: 'deadline exceeded',
        };
      }
      attempts += 1;
      this.#parts.metrics.recordStep();
      let outcome: StepOutcome;
      try {
        outcome = await this.#executor.execute(resolvedStep.step, context);
      } catch (error) {
        outcome = {
          status: 'failed',
          detail: error instanceof Error ? error.message : 'the step-execution seam threw',
        };
      }
      if (outcome.status === 'succeeded') {
        const result: StepResult = {
          index: resolvedStep.index,
          capability,
          status: 'succeeded',
          attempts,
          detail: outcome.detail ?? '',
        };
        checkpoint.record(result);
        return result;
      }
      detail = outcome.detail ?? 'step failed';
      if (!this.#parts.retry.mayRetry(attempts, settings.maxAttempts)) {
        return { index: resolvedStep.index, capability, status: 'failed', attempts, detail };
      }
      this.#parts.metrics.recordRetry();
      try {
        await this.#parts.delay.wait(
          this.#parts.retry.backoff(attempts, settings.backoffBaseMillis),
        );
      } catch {
        // A misbehaving injected delay must never break the execution; proceed to the retry immediately.
      }
    }
  }

  /** Close the execution, emit the terminal and closed events, and aggregate the immutable record. */
  async #finalize(
    state: ExecutionStateManager,
    results: ReadonlyMap<number, StepResult>,
    terminal: TerminalOutcome,
    request: ExecutionRequest,
    startedAt: number,
    reason: string,
  ): Promise<ExecutionRecord> {
    state.transition('closed');
    const finishedAt = this.#parts.clock.now();
    this.#parts.metrics.recordTerminal(terminal);
    await this.#parts.telemetry.terminal(request.context.executionId, terminal);
    await this.#parts.telemetry.closed(request.context.executionId);
    return this.#parts.aggregator.aggregate({
      executionId: request.context.executionId,
      terminal,
      terminalEvent: this.#parts.telemetry.terminalEvent(terminal),
      steps: [...results.values()],
      path: state.path,
      startedAt,
      finishedAt,
      governance: request.governance.id,
      safety: request.safety.id,
      reason,
    });
  }
}
