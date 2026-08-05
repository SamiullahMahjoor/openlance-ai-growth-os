import type { AgentExecutionPlan, AgentStep } from '@openlance/aios-agent-engine';
import type { GovernanceDecision } from '@openlance/aios-governance-engine';
import type { SafetyDecision } from '@openlance/aios-safety-engine';
import type { ExecutionState, RuntimeEvent } from '@openlance/aios-runtime';

/** A read-only cancellation signal: the runtime reads it at the governed cancellation gate and never sets it. */
export interface CancellationSignal {
  readonly isCancelled: () => boolean;
}

/** How an execution runs: a normal run, a dry run, or a checkpointed resume. */
export type ExecutionMode = 'standard' | 'dry-run' | 'resume';

/**
 * The immutable runtime metadata an execution runs with. It carries the execution and correlation identity, an optional
 * absolute `deadline` (ms; `null` for none), a read-only `cancellation` signal, a `traceId`, the `mode`, and the
 * `tenant`. It is runtime metadata only: it never duplicates, reinterprets, or modifies any field of the three immutable
 * decisions.
 */
export interface ExecutionContext {
  readonly executionId: string;
  readonly correlationId: string;
  readonly deadline: number | null;
  readonly cancellation: CancellationSignal;
  readonly traceId: string;
  readonly mode: ExecutionMode;
  readonly tenant: string;
}

/**
 * The immutable, read-only execution envelope: the authorized `plan`, the `governance` decision that authorized it, the
 * `safety` decision that cleared it, and the runtime `context`. It packages the three frozen contracts unchanged with the
 * runtime metadata; it duplicates, reinterprets, and modifies none of them.
 */
export interface ExecutionRequest {
  readonly plan: AgentExecutionPlan;
  readonly governance: GovernanceDecision;
  readonly safety: SafetyDecision;
  readonly context: ExecutionContext;
}

/** The outcome of one step over the injected seam: whether it succeeded, with an explaining detail. */
export interface StepOutcome {
  readonly status: 'succeeded' | 'failed';
  readonly detail?: string;
}

/**
 * The injected step-execution seam. The engine drives orchestration and calls this port to perform each step; the
 * composition root wires it to the public contracts of the Provider, Prompt, Tool, Memory, Retrieval, and Reasoning
 * Engines (and, later, vendor adapters). The engine holds no vendor knowledge; the vendor boundary is behind this port.
 */
export interface StepExecutor {
  execute(step: AgentStep, context: ExecutionContext): Promise<StepOutcome>;
}

/**
 * The injected inter-retry delay seam. Between bounded retries the engine awaits `wait` for the retry policy's computed
 * backoff. The default is immediate (the engine is timer-free and deterministic by default); the composition root may
 * inject a real timed delay to space retries in production. Keeping the timing behind a port keeps the engine
 * deterministic.
 */
export interface Delay {
  wait(millis: number): Promise<void>;
}

/** The status of a single step's execution within the record. */
export type StepStatus = 'succeeded' | 'failed' | 'skipped' | 'cancelled';

/** The immutable result of one step: its plan index, capability, status, the attempts made, and an explaining detail. */
export interface StepResult {
  readonly index: number;
  readonly capability: string;
  readonly status: StepStatus;
  readonly attempts: number;
  readonly detail: string;
}

/** The terminal outcome of an execution (the frozen mutually-exclusive terminal states, before closure). */
export type TerminalOutcome = 'completed' | 'cancelled' | 'failed';

/**
 * An immutable execution record: the outcome the runtime carries after driving an execution to closure. It names the
 * `executionId`, the `terminal` outcome and the frozen `terminalEvent` it emitted, the per-step `steps` (deterministic,
 * by plan index), the state `path` taken through the frozen state model (the audit trail), the `startedAt` / `finishedAt`
 * timestamps, the consumed `governance` and `safety` decision ids, and an explaining `reason`. `validated: true` marks it
 * was produced by the frozen execution. It may only be consumed or archived, never modified.
 */
export interface ExecutionRecord {
  readonly executionId: string;
  readonly terminal: TerminalOutcome;
  readonly terminalEvent: RuntimeEvent;
  readonly steps: readonly StepResult[];
  readonly path: readonly ExecutionState[];
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly governance: string;
  readonly safety: string;
  readonly reason: string;
  readonly validated: true;
}

/**
 * A named execution policy: an operator- or plugin-contributed constraint on orchestration. It names capabilities that
 * must run as a sequential barrier (never parallelized), so a sensitive capability is never co-scheduled. Policies only
 * ever add constraint; they never widen what may run concurrently.
 */
export interface ExecutionPolicy {
  readonly name: string;
  readonly barrierCapabilities: readonly string[];
}

/** An execution policy's registration input; the factory validates it, normalizes its names, and freezes it. */
export interface ExecutionPolicyInput {
  readonly name: string;
  readonly barrierCapabilities?: readonly string[];
}

/** A read-only snapshot of the engine's operational counters. */
export interface ExecutionStatistics {
  readonly executions: number;
  readonly completed: number;
  readonly failed: number;
  readonly cancelled: number;
  readonly stepsRun: number;
  readonly retries: number;
}

/** A read-only operational view of the engine. */
export interface ExecutionDiagnostics {
  readonly policyCount: number;
  readonly statistics: ExecutionStatistics;
}
