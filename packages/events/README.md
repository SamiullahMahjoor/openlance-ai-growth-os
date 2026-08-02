# @openlance/aios-events

The event bus. It sits above the kernel, errors, DI, and logging, and below plugins and the namespace packages.

## Architecture

An in-process publish/subscribe bus that decouples framework packages: one can announce a fact without knowing who reacts. Delivery is deterministic (handlers run in registration order) and fault-isolated (a throwing handler cannot abort its siblings or the publisher). It is strictly internal: no network, broker, queue, persistence, or external transport.

## Ownership and constitutional boundaries

This package owns only the engineering event mechanism: how components publish and subscribe to framework-internal events (a package started, a config reloaded, a plugin registered).

It explicitly does **not** own runtime execution, orchestration, workflow, agent coordination, business or domain or operational events, monitoring, observability, event persistence, replay, retries, or distributed messaging. In particular, the runtime **AI event-lifecycle** (`ai/runtime/event-lifecycle.md`) is a separate, later concern owned by the Runtime namespace. This bus carries only framework events and implements no execution semantics.

## Dependency rules

Depends only on `@openlance/aios-kernel` (`Clock`, `Result`, `Disposable`), `@openlance/aios-errors` (`BaseError` for `EventError`), `@openlance/aios-di` (the `EVENT_BUS` token), and `@openlance/aios-logging` (an optional logger for isolated handler failures). It introduces no reverse dependency and stays within the substrate ordering.

## Event model

A `FrameworkEvent<TPayload>` carries a stable, namespaced `type`, an injected `occurredAt` timestamp, an optional `correlationId`, and a typed `payload`. Envelopes are immutable: `createEvent(clock, type, payload, correlationId?)` stamps the timestamp from the injected `Clock` and freezes the result, so identical inputs under a fixed clock produce identical envelopes.

## Dispatch model

- `subscribe(type, handler)` registers a handler for one event type and returns a `Subscription`; `dispose()` unsubscribes (idempotent).
- `subscribeAll(handler)` registers a diagnostic handler for every event.
- `publish(event)` awaits every handler in **registration order** (typed handlers first, then diagnostic handlers). A throwing handler is caught and isolated: its failure is counted and logged (if a logger is configured, off the hot path), the remaining handlers still run, and the publisher is unaffected. If any handler failed, `publish` returns `err(EventError)` aggregating the failure count; otherwise `ok`. Handlers may be synchronous or asynchronous.

## Public API

The single supported surface is the barrel (`@openlance/aios-events`); deep imports fail CI (Engineering Rule 1). The bus implementation is internal and is created through `createEventBus`.

`FrameworkEvent` · `EventHandler` · `createEvent` · `Subscription` · `EventBus` · `createEventBus` · `EVENT_BUS` · `EventError`.

## Integration points

- **DI.** The bus is registered as a singleton under the `EVENT_BUS` token so every package resolves the same bus.
- **Logging.** An optional `Logger` passed to `createEventBus` records isolated handler failures.
- **Kernel.** `occurredAt` comes from the injected `Clock`.

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. It provides an in-process pub/sub mechanism for framework events, echoing the constitution's isolation principles (fault-isolated handlers) without owning them, and defers the runtime AI event-lifecycle to the Runtime namespace. It restates no constitutional text.

## Limitations

- In-process only: no transport, broker, queue, network, or distributed messaging.
- No persistence, replay, retries, buffering, scheduling, or background workers.
- No runtime execution, orchestration, or workflow semantics.
- Handler order is registration order; there is no priority mechanism.
- The aggregated `EventError` reports the failure count and type (deterministic); individual handler errors are surfaced through the optional logger.

## Stability

`Medium` (Engineering Rule 4). Internal contracts, additive by nature; a public-surface change requires review.
