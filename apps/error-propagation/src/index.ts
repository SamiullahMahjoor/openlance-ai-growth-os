/**
 * @packageDocumentation
 * `@openlance/aios-error-propagation`
 *
 * The AIOS application-level error propagation (Phase 3, Stage 7). It declares the runtime integration chain's
 * coded error topology (which coded errors propagate, in which `ErrorCategory`, on the `Result` channel) and
 * attaches it to the Stage 6 `PluginLoadingPlan`, producing one immutable `ErrorPropagationPlan`. It validates the
 * topology by delegating code-uniqueness to the frozen `InMemoryErrorCodeRegistry`, failing closed with
 * `ErrorPropagationError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-errors` framework (ADR-0006), the frozen `Result`
 * channel (`@openlance/aios-kernel`), and the frozen Stage 6 plugin loading plan (ADR-0032). It consumes them and
 * re-declares no error hierarchy, category set, registry, bridge, or chain handle. It holds no runtime state and
 * executes nothing: it does not catch, retry, recover, roll back, orchestrate, schedule, or handle any runtime
 * error, and runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4. Decision: ADR-0033.
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI.
 *
 * Design: docs/implementation/30-error-propagation.md.
 */

export { buildErrorPropagationPlan, validateErrorPropagation } from './error-propagation.js';
export type {
  ErrorPropagationNode,
  ErrorPropagationDiagnostics,
  ErrorPropagationPlan,
} from './error-propagation.js';
export { ErrorPropagationError } from './errors.js';
