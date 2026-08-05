import type { Clock, Result } from '@openlance/aios-kernel';
import { err, isErr, ok } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { ResultAggregator } from './aggregator.js';
import { CancellationManager } from './cancellation.js';
import { ExecutionConfiguration } from './configuration.js';
import type { ExecutionSettings } from './configuration.js';
import { ExecutionCoordinator } from './coordinator.js';
import { DependencyResolver } from './dependency-resolver.js';
import type { ExecutionError } from './errors.js';
import { ExecutionEvents } from './events.js';
import { ExecutionMetrics } from './metrics.js';
import { ExecutionPolicyFactory } from './factory.js';
import { ExecutionPolicyRegistry } from './registry.js';
import { ParallelExecutionCoordinator } from './parallel.js';
import { RecoveryManager } from './recovery.js';
import { RetryManager } from './retry.js';
import { Scheduler } from './scheduler.js';
import { TelemetryManager } from './telemetry.js';
import { TimeoutManager } from './timeout.js';
import type {
  Delay,
  ExecutionDiagnostics,
  ExecutionPolicyInput,
  ExecutionRecord,
  ExecutionRequest,
  ExecutionStatistics,
  StepExecutor,
} from './types.js';

/** The options a {@link RuntimeExecutionManager} is constructed from. */
export interface RuntimeExecutionManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly executor: StepExecutor;
  readonly settings?: Partial<ExecutionSettings>;
  readonly delay?: Delay;
}

/** The default inter-retry delay: immediate, so the engine is timer-free and deterministic unless a delay is injected. */
const IMMEDIATE_DELAY: Delay = { wait: async () => undefined };

/**
 * The Runtime Execution Engine facade and DI entry. It composes the policy registry, factory, configuration, metrics,
 * telemetry, and the execution coordinator (dependency resolution, scheduling, parallel execution, retry, timeout,
 * cancellation, recovery, checkpointing, and aggregation) into one operational subsystem, and exposes the engine's
 * operations: register a policy, execute a request into an immutable execution record, remove a policy, and read
 * statistics and diagnostics. It applies the frozen runtime model, executes an authorized and safe plan over the injected
 * seam, and never authorizes, evaluates safety, or overrides an upstream decision.
 */
export class RuntimeExecutionManager {
  readonly #registry: ExecutionPolicyRegistry;
  readonly #factory: ExecutionPolicyFactory;
  readonly #configuration: ExecutionConfiguration;
  readonly #metrics: ExecutionMetrics;
  readonly #coordinator: ExecutionCoordinator;

  constructor(options: RuntimeExecutionManagerOptions) {
    this.#registry = new ExecutionPolicyRegistry();
    this.#factory = new ExecutionPolicyFactory();
    this.#configuration = new ExecutionConfiguration(options.settings);
    this.#metrics = new ExecutionMetrics();
    const telemetry = new TelemetryManager(new ExecutionEvents(options.bus, options.clock));
    this.#coordinator = new ExecutionCoordinator(
      {
        resolver: new DependencyResolver(),
        scheduler: new Scheduler(),
        parallel: new ParallelExecutionCoordinator(),
        retry: new RetryManager(),
        timeout: new TimeoutManager(),
        cancellation: new CancellationManager(),
        recovery: new RecoveryManager(),
        aggregator: new ResultAggregator(),
        telemetry,
        metrics: this.#metrics,
        clock: options.clock,
        delay: options.delay ?? IMMEDIATE_DELAY,
      },
      options.executor,
    );
  }

  /** Register an execution policy; fail closed on an invalid or duplicate policy. */
  register(input: ExecutionPolicyInput): Result<string, ExecutionError> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    return ok(created.value.name);
  }

  /** Remove a registered policy; returns whether one was removed. */
  remove(name: string): boolean {
    return this.#registry.unregister(name);
  }

  /**
   * Execute a request into an immutable execution record. It verifies the governance and safety preconditions and
   * executes only an authorized, safe plan; it never re-evaluates or overrides an upstream decision, and it never throws
   * (a plan that cannot execute is a governed `failed` or `cancelled` record).
   */
  async execute(request: ExecutionRequest): Promise<ExecutionRecord> {
    return this.#coordinator.run(request, this.#configuration.settings, this.#registry.barriers());
  }

  /** A frozen operational statistics snapshot. */
  statistics(): ExecutionStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): ExecutionDiagnostics {
    const diagnostics: ExecutionDiagnostics = {
      policyCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
