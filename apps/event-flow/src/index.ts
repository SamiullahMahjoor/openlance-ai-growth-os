/**
 * @packageDocumentation
 * `@openlance/aios-event-flow`
 *
 * The AIOS application-level event flow (Phase 3, Stage 8). It declares the runtime integration chain's framework
 * event topology (which framework event types flow), realizes each as a canonical immutable `FrameworkEvent`
 * through the frozen `createEvent`, and attaches it to the Stage 7 `ErrorPropagationPlan`, producing one immutable
 * `EventFlowPlan`. It validates the topology (blank type, duplicate type), failing closed with `EventFlowError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-events` framework (subsystem 06) and the frozen
 * Stage 7 error propagation plan (ADR-0033). It consumes them and re-declares no event bus, dispatcher,
 * subscription, handler, or envelope type, and no chain handle. It holds no runtime state and executes nothing: it
 * does not publish, subscribe, dispatch, or handle any event (the bus operations are execution and are never
 * called), and runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4. Decision:
 * ADR-0034. This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI.
 *
 * Design: docs/implementation/31-event-flow.md.
 */

export { buildEventFlowPlan, validateEventFlow } from './event-flow.js';
export type { EventFlowNode, EventFlowDiagnostics, EventFlowPlan } from './event-flow.js';
export { EventFlowError } from './errors.js';
