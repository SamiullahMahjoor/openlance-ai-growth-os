# 31. Event Flow implementation design (Phase 3, Stage 8)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 8).** Built design-first per ADR-0007.
[ADR-0034](adr/0034-event-flow-plan.md) is Accepted (no supersession; ADR-0032 already anticipates Stage 8).
Package: `apps/event-flow` (`@openlance/aios-event-flow`).

## 1. Scope and ownership

Stage 8 builds the **application-level event flow** integration layer: an immutable `EventFlowPlan` describing the
framework event flow through the already-built integration chain, as a declared topology of framework event types,
each realized as a canonical immutable `FrameworkEvent` through the frozen event constructor, attached to the chain.
It answers only: which framework events flow through the chain, are they well-formed and unique, and how does that
declaration attach to the chain.

It **consumes, never recreates.** The event mechanism is owned, in full, by the frozen Phase 2A substrate package
`@openlance/aios-events` (subsystem 06): the `EventBus` (`publish`/`subscribe`/`subscribeAll`), the dispatcher, the
subscription model, `createEventBus`, and the `EVENT_BUS` token. This stage recreates none of them; it consumes the
frozen `FrameworkEvent` envelope type and the frozen, non-dispatching constructor `createEvent`, and consumes the
Stage 7 `ErrorPropagationPlan` (the runtime integration chain handle). The runtime AI event-lifecycle
(`RUNTIME_EVENTS`, owned by the Runtime namespace and already referenced by the Stage 5 pipeline plan) is a distinct
concern and is not restated here.

It **executes nothing.** It does not publish, subscribe, dispatch, or handle any event, and runs no provider, tool,
agent, plugin, namespace, or workflow. It realizes canonical event envelopes through the frozen `createEvent` (pure
construction, not dispatch) and produces an immutable descriptive plan.

## 2. Why this is not duplication, and the delegation

The frozen substrate owns the event *bus* mechanism, whose operations (`publish`/`subscribe`/`subscribeAll`) are all
runtime execution, forbidden in a descriptive plan; delegating to them is not appropriate here. What no package owns
is the application-level *description* of the chain's framework event flow: which framework event types flow, and
that each is well-formed and unique. The appropriate frozen delegation is the non-dispatching constructor
`createEvent`, to which this stage delegates the realization of each declared event type as an immutable
`FrameworkEvent` envelope (consuming the frozen event system without dispatching). This is directly parallel to Error
Propagation (Stage 7) declaring the error topology. It re-declares no event, bus, dispatcher, subscription, or
envelope type.

## 3. Public API and package layout

Package `apps/event-flow`, name `@openlance/aios-event-flow`, `aios.layer: "app"`. Single explicit barrel
(`src/index.ts`, no wildcard). Modules: `event-flow.ts` (types + functions), `errors.ts` (`EventFlowError`).

```ts
// One declared event-flow node: a framework event type that flows on the bus.
export interface EventFlowNode {
  readonly type: string; // a stable, namespaced framework event type (for example 'framework.plugin.started')
}

// A read-only report over the event flow plan.
export interface EventFlowDiagnostics {
  readonly eventCount: number;
  readonly types: readonly string[];
}

// The immutable event flow plan, attached to the runtime integration chain. Descriptive; executes nothing.
export interface EventFlowPlan {
  readonly chain: ErrorPropagationPlan;          // the Stage 7 chain handle, consumed unchanged
  readonly events: readonly FrameworkEvent[];    // the declared event types realized via the frozen createEvent
  readonly diagnostics: EventFlowDiagnostics;
  readonly validated: true;
}

// Validate the declared topology and realize each event via the frozen createEvent, failing closed.
export function validateEventFlow(
  clock: Clock,
  nodes: readonly EventFlowNode[],
): Result<readonly FrameworkEvent[], EventFlowError[]>;

// Build the immutable plan, attaching it to the chain, delegating realization; fail closed.
export function buildEventFlowPlan(
  chain: ErrorPropagationPlan,
  clock: Clock,
  nodes: readonly EventFlowNode[],
): Result<EventFlowPlan, EventFlowError[]>;
```

`validateEventFlow` rejects a blank event type (`EVENT_FLOW.BLANK_TYPE`) and a duplicate event type
(`EVENT_FLOW.DUPLICATE_TYPE`), and for each valid node realizes an immutable `FrameworkEvent` through the frozen
`createEvent(clock, type, {})` (the injected `Clock` is the determinism seam; the event is not dispatched). It fails
closed with no realized events on any problem. `buildEventFlowPlan` uses it and returns an immutable plan whose
`events` are the realized envelopes and whose `diagnostics` report the count and types. `EventFlowError` is an
`@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `EVENT_FLOW.*` codes; failures ride the
`Result` channel (ADR-0006).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 8 disposition |
|---|---|---|
| EventBus, publishers, subscribers, dispatch, handlers, routing, subscriptions | `@openlance/aios-events` | never recreate; never call (execution) |
| The FrameworkEvent envelope + the event constructor | `@openlance/aios-events` `FrameworkEvent` / `createEvent` | consume the type; delegate envelope realization to `createEvent` |
| The runtime AI event-lifecycle (RUNTIME_EVENTS) | `@openlance/aios-runtime` (referenced by Stage 5) | distinct concern; not restated |
| The runtime integration chain | Stages 1 to 7 (frozen) | consume the `ErrorPropagationPlan`; recreate nothing |

## 5. What it must not do

No event dispatch, publishing, subscription, handler, or listener; no runtime execution, scheduling, or
orchestration; no provider/plugin/agent/workflow run; no mutable or runtime state. It validates a declared topology,
realizes canonical envelopes through the frozen constructor, and builds an immutable plan.

## 6. Dependency graph and layer wiring

`@openlance/aios-event-flow -> { @openlance/aios-error-propagation, @openlance/aios-events, kernel, errors }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, and
logging are test-only devDependencies). The `app -> app` (error-propagation) and `app -> substrate` (events) edges
are legal; no dependency-cruiser rule or namespace edge changes.

## 7. Testing strategy (ADR-0022 / Rule 6)

100% statements/branches/functions/lines. `validateEventFlow` is tested with an empty topology (ok), a unique-type
topology (ok, realized frozen events), a blank-type topology (err, `EVENT_FLOW.BLANK_TYPE`), and a duplicate-type
topology (err, `EVENT_FLOW.DUPLICATE_TYPE`). `buildEventFlowPlan` is tested with a valid topology (ok plan, correct
events and diagnostics, attached to the chain) and an invalid topology (err, no partial plan). Immutability
(`Object.isFrozen`) is asserted on the plan, its events (each frozen by `createEvent`), diagnostics, and types.
Benchmark: the `buildEventFlowPlan` path (Rule 5 baseline).

## 8. Acceptance criteria (met)

- Consumes the frozen event subsystem (`FrameworkEvent`, `createEvent`) and the Stage 7 `ErrorPropagationPlan`;
  recreates no bus, dispatcher, subscription, handler, or envelope type, and calls no bus operation (all execution).
- `buildEventFlowPlan` returns an immutable, validated `EventFlowPlan` or a `Result` error, failing closed with no
  partial plan; it dispatches nothing and executes nothing.
- Full validation green; 100% coverage; benchmark recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate, all 13 namespaces, and the seven frozen Phase 3
  packages unchanged.
