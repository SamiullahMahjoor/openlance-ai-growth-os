/**
 * @packageDocumentation
 * `@openlance/aios-execution-pipeline`
 *
 * The AIOS execution pipeline plan (Phase 3, Stage 5). It composes the Stage 4 `RuntimeLifecyclePlan` with the
 * frozen runtime pipeline model, producing one immutable `ExecutionPipelinePlan`: the consumed lifecycle plan and
 * the referenced ordered workflow steps, validation stages, context inputs, and lifecycle events (from
 * `@openlance/aios-runtime`), with the frozen workflow order proven against the frozen `workflowStepAtOrAfter`. It
 * validates only by delegating to the frozen ordering relation, failing closed with `ExecutionPipelineError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-runtime` model (ADR-0020) and the frozen Stage 4
 * runtime lifecycle plan (ADR-0029). It consumes them and re-declares no workflow step, validation stage, context
 * input, event, execution state, transition, or failure model. It holds no runtime state and executes nothing: it
 * drives no step, orchestrates nothing, schedules nothing, emits no event, evaluates no governance rule, and runs
 * no operational namespace. It produces the plan a future runtime engine would drive, once the operational service
 * stages exist. Decision: ADR-0030. This file is the single supported public API (Engineering Rule 1); deep
 * imports into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/27-execution-pipeline.md.
 */

export { buildExecutionPipelinePlan, validateWorkflowOrder } from './pipeline.js';
export type { ExecutionPipelinePlan } from './pipeline.js';
export { ExecutionPipelineError } from './errors.js';
