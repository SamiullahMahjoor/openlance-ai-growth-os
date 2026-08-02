/**
 * @packageDocumentation
 * `@openlance/aios-events`
 *
 * A generic, in-process publish/subscribe bus for framework-internal events (a
 * package started, a config reloaded, a plugin registered). It decouples framework
 * packages so one can announce a fact without knowing who reacts. Delivery is
 * deterministic (registration order) and fault-isolated (a throwing handler cannot
 * abort siblings or the publisher; failures are aggregated on the returned
 * `Result`). Timestamps come from an injected `Clock`.
 *
 * It owns the engineering event mechanism only. It does not own runtime execution,
 * orchestration, workflow, agent coordination, business or domain or operational
 * events, monitoring, observability, persistence, replay, retries, or distributed
 * messaging. In particular, the runtime AI event-lifecycle (ai/runtime) is a
 * separate, later concern owned by the Runtime namespace. This bus is in-process
 * only: no network, broker, queue, or external transport.
 *
 * Dependencies: @openlance/aios-kernel (Clock, Result), @openlance/aios-errors
 * (BaseError), @openlance/aios-di (the EVENT_BUS token), and @openlance/aios-logging
 * (an optional logger for isolated handler failures).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/06-event-framework.md.
 */

export type { FrameworkEvent, EventHandler } from './event.js';
export { createEvent } from './event.js';
export type { Subscription } from './subscription.js';
export type { EventBus } from './bus.js';
export { createEventBus, EVENT_BUS } from './bus.js';
export { EventError } from './dispatcher.js';
