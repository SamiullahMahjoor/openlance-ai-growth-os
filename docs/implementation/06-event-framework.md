# Subsystem 06, Event Framework (`@openlance/aios-events`)

> **Classification:** Engineering mechanism. Owns no AI concept.
> **Adjacent architecture (deferred, not implemented in 2A):** the Runtime **event-lifecycle**: `ai/runtime/event-lifecycle.md`. This package is a generic, in-process pub/sub bus for **framework-internal** events (a package announcing that it started, a config reload, a plugin registered). It does **not** implement the runtime's AI event-lifecycle, which is built later and owned by Runtime.

## 1. Architectural analysis

The event bus decouples framework packages so one can announce a fact without knowing who reacts. It is strictly internal (no network, no broker, no distributed messaging) and deterministic: for a given set of subscriptions, delivery order is defined and stable, and a failing handler is isolated so it cannot break the publisher or other handlers (fault isolation, echoing the constitution's isolation principles without owning them). It carries only framework events; the runtime's AI events are a separate, later concern.

## 2. Package design

`@openlance/aios-events`, depends on `kernel`, `errors`, `di`, `logging`. Modules: `event`, `bus`, `subscription`, `dispatcher`. Registered as a DI singleton so any package resolves the same bus.

## 3. Interface design

```ts
export interface FrameworkEvent<TPayload = unknown> {
  readonly type: string;                 // stable, namespaced, e.g. "config.reloaded"
  readonly occurredAt: number;           // from injected Clock
  readonly correlationId?: string;
  readonly payload: TPayload;
}

export type EventHandler<E extends FrameworkEvent> = (event: E) => void | Promise<void>;

export interface Subscription extends Disposable {}   // dispose() unsubscribes

export interface EventBus {
  publish<E extends FrameworkEvent>(event: E): Promise<Result<void, EventError>>;
  subscribe<E extends FrameworkEvent>(type: E['type'], handler: EventHandler<E>): Subscription;
  subscribeAll(handler: EventHandler<FrameworkEvent>): Subscription;   // diagnostics only
}
```

Delivery: handlers for a type are invoked in **registration order**; `publish` awaits all handlers, collects handler failures, isolates them (one failing handler does not abort the others or the publisher), and returns a `Result` summarizing outcomes. `occurredAt` comes from the injected `Clock`. No retget, no persistence, no external transport.

## 4. Dependency graph

`events ◀ {kernel, errors, di, logging}`. Depended on by plugins and namespace packages.

## 5. Folder structure

```
packages/events/
  src/ index.ts event.ts bus.ts subscription.ts dispatcher.ts
  tests/ bus.test.ts dispatch-order.test.ts fault-isolation.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `FrameworkEvent` contract (typed payload; timestamp from `Clock`).
2. `EventBus` singleton with typed `subscribe`/`publish`.
3. `Subscription` (disposable unsubscribe).
4. `dispatcher` with defined ordering + handler fault isolation + failure aggregation into `Result`.
5. Diagnostic `subscribeAll` (logs via subsystem 05), off the hot path.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Scope creep into distributed messaging | Public surface has no transport/broker; README bans it; in-process only. |
| Confusion with the runtime AI event-lifecycle | Type prefixing `framework.*`; README states the Runtime deferral; no execution semantics implemented. |
| Non-deterministic delivery | Registration-order dispatch, tested; timestamp from `Clock`. |
| Handler failures cascading | Fault isolation + aggregated `Result`, tested with throwing handlers. |

## 8. Acceptance criteria

- Publish/subscribe is typed, in-process, and vendor-free.
- Delivery order is defined and deterministic (tested).
- A throwing handler does not break the publisher or sibling handlers; failures surface in the `Result` (tested).
- No distributed messaging, persistence, or external transport in the public surface.
