/**
 * @packageDocumentation
 * `@openlance/aios-runtime-lifecycle`
 *
 * The AIOS runtime lifecycle plan (Phase 3, Stage 4). It binds the DI-integrated application to the frozen
 * runtime lifecycle model, producing one immutable `RuntimeLifecyclePlan`: the consumed `IntegratedApplication`,
 * the model's initial state and lifecycle phases (referenced from `@openlance/aios-runtime`), and the model's
 * deterministic admission path, validated against the frozen transition relation. It validates only by delegating
 * to the frozen `transitionAllowed`, failing closed with `RuntimeLifecycleError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-runtime` model (ADR-0020) and the frozen DI
 * integration (ADR-0028). It consumes them and re-declares no execution state, transition, lifecycle phase,
 * session phase, workflow step, validation stage, boundary, or event. It holds no runtime state, has no current
 * state, and carries nothing out: it drives no transition, executes nothing, activates nothing, schedules
 * nothing, instantiates no runtime engine, and performs no orchestration. It simply proves that an
 * `IntegratedApplication` is constitutionally ready to enter the execution pipeline (Stage 5), which consumes the
 * plan. Decision: ADR-0029. This file is the single supported public API (Engineering Rule 1); deep imports into
 * internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/26-runtime-lifecycle.md.
 */

export { buildRuntimeLifecyclePlan, validateLifecyclePath } from './lifecycle.js';
export type { RuntimeLifecyclePlan } from './lifecycle.js';
export { RuntimeLifecycleError } from './errors.js';
