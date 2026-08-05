/**
 * @packageDocumentation
 * `@openlance/aios-runtime-execution-engine`
 *
 * The AIOS Runtime Execution Engine (Phase 4, Stage 10): the Runtime's operational execution subsystem, the operational
 * realization of the frozen `ai/runtime/` model ("the actual orchestration over a concrete task is the operational
 * runtime's"). It consumes an immutable `ExecutionRequest` (the authorized `AgentExecutionPlan`, the `GovernanceDecision`
 * that authorized it, the `SafetyDecision` that cleared it, and an immutable `ExecutionContext`), verifies the governance
 * and safety preconditions, and executes an authorized, safe plan by driving the frozen execution state machine and
 * orchestrating the plan's steps over an injected `StepExecutor` seam, with bounded retry, timeout, cancellation,
 * execution-level recovery, and idempotent checkpointing, producing an immutable `ExecutionRecord`.
 *
 * The runtime pipeline is Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime, with the Operations
 * Engine (Stage 11, `ai/operations/`, which observes the running runtime and never executes) deferred. It **executes and
 * records**: it authorizes nothing, evaluates no safety, selects and invokes no provider directly (the seam does),
 * performs no inference, and never re-evaluates, rewrites, or overrides the plan, the governance decision, or the safety
 * decision. It applies the frozen state model, lifecycle, workflow, failure-recovery, boundaries, and events; it is
 * deterministic in orchestration and fail-closed; and it holds no vendor knowledge (ADR-0044). This file is the single
 * supported public API (Engineering Rule 1).
 */

export type {
  CancellationSignal,
  ExecutionMode,
  ExecutionContext,
  ExecutionRequest,
  StepOutcome,
  StepExecutor,
  Delay,
  StepStatus,
  StepResult,
  TerminalOutcome,
  ExecutionRecord,
  ExecutionPolicy,
  ExecutionPolicyInput,
  ExecutionStatistics,
  ExecutionDiagnostics,
} from './types.js';

export { ExecutionError } from './errors.js';
export { ExecutionConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { ExecutionSettings } from './configuration.js';
export { ExecutionStateManager } from './state.js';
export { ExecutionLifecycleManager } from './lifecycle.js';
export { DependencyResolver } from './dependency-resolver.js';
export type { ResolvedStep } from './dependency-resolver.js';
export { Scheduler } from './scheduler.js';
export type { ExecutionStage } from './scheduler.js';
export { ParallelExecutionCoordinator } from './parallel.js';
export { RetryManager } from './retry.js';
export { TimeoutManager } from './timeout.js';
export { CancellationManager } from './cancellation.js';
export { RecoveryManager } from './recovery.js';
export { CheckpointManager } from './checkpoint.js';
export { ResultAggregator } from './aggregator.js';
export type { RecordInput } from './aggregator.js';
export { ExecutionCoordinator } from './coordinator.js';
export type { CoordinatorParts } from './coordinator.js';
export { TelemetryManager } from './telemetry.js';
export { ExecutionMetrics } from './metrics.js';
export { ExecutionEvents, EXECUTION_EVENT_PREFIX } from './events.js';
export { ExecutionPolicyFactory } from './factory.js';
export { ExecutionPolicyRegistry } from './registry.js';
export { ExecutionPluginBridge } from './plugin-bridge.js';
export type { ExecutionPlugin } from './plugin-bridge.js';
export { RuntimeExecutionManager } from './manager.js';
export type { RuntimeExecutionManagerOptions } from './manager.js';
export { runtimeExecutionEngineModule, RUNTIME_EXECUTION_MANAGER } from './module.js';
