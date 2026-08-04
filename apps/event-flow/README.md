# @openlance/aios-event-flow

The AIOS application-level event flow (Phase 3, Stage 8). It declares the runtime integration chain's framework
event topology (which framework event types flow), realizes each as a canonical immutable `FrameworkEvent`, and
attaches it to the Stage 7 chain, producing one immutable **`EventFlowPlan`**.

- **Layer:** `app` (the event-topology counterpart to the prior Phase 3 integration packages; `apps/*`).
- **Design:** [docs/implementation/31-event-flow.md](../../docs/implementation/31-event-flow.md).
  **Decision:** [ADR-0034](../../docs/implementation/adr/0034-event-flow-plan.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the frozen `@openlance/aios-events` framework and the Stage 7
`ErrorPropagationPlan`, and produces one immutable `EventFlowPlan`. `buildEventFlowPlan(chain, clock, nodes)`
validates the declared topology and realizes each declared event type as a `FrameworkEvent` through the frozen
`createEvent`, returning the frozen plan attached to the chain, or failing closed with `EventFlowError[]`.

The plan is **descriptive planning metadata, not runtime state**. It holds no runtime state and **executes
nothing**: it does not publish, subscribe, dispatch, or handle any event, and runs no provider, tool, agent,
plugin, namespace, or workflow. Those are Phase 4. It answers only: which framework events flow through the chain,
are they well-formed and unique, and how does that declaration attach to the chain.

### Consume, never recreate

The event mechanism is owned, in full, by the frozen substrate package `@openlance/aios-events` (subsystem 06): the
`EventBus` (`publish`/`subscribe`/`subscribeAll`), the dispatcher, the subscription model, `createEventBus`, and the
`EVENT_BUS` token. This package recreates none of them and calls no bus operation (all of them are execution). It
consumes the frozen `FrameworkEvent` envelope type and delegates event realization to the frozen non-dispatching
`createEvent`. It re-declares no event, bus, dispatcher, subscription, or handler. The runtime AI event-lifecycle
(`RUNTIME_EVENTS`, owned by the Runtime namespace) is a distinct concern and is not restated.

## Public API (single barrel, Engineering Rule 1)

- `buildEventFlowPlan(chain: ErrorPropagationPlan, clock: Clock, nodes: readonly EventFlowNode[]): Result<EventFlowPlan, EventFlowError[]>`
  - build the plan, attaching it to the chain and delegating realization, failing closed.
- `validateEventFlow(clock: Clock, nodes: readonly EventFlowNode[]): Result<readonly FrameworkEvent[], EventFlowError[]>`
  - validate the declared topology and realize each event via the frozen `createEvent`, failing closed.
- `EventFlowNode`, `EventFlowPlan`, `EventFlowDiagnostics` - the read-only types.
- `EventFlowError` is a `BaseError` subtype (`infrastructure`) with `EVENT_FLOW.*` codes.

`EventFlowNode` is `{ type }` (a framework event type). `EventFlowPlan` holds the consumed `chain` (unchanged), the
realized `events` (frozen `FrameworkEvent` envelopes), `diagnostics` (event count and types), and `validated: true`.

## Validation (delegated realization, fail closed)

`validateEventFlow` rejects a blank event type (`EVENT_FLOW.BLANK_TYPE`) and a duplicate event type
(`EVENT_FLOW.DUPLICATE_TYPE`), and for each valid node delegates to the frozen `createEvent` to realize an immutable
`FrameworkEvent` (the injected `Clock` is the determinism seam; nothing is dispatched), building no partial set on a
problem.

## Dependency direction

`@openlance/aios-event-flow -> { @openlance/aios-error-propagation, @openlance/aios-events, kernel, errors }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, and
logging are test-only devDependencies). The `app -> app` (error-propagation) and `app -> substrate` (events) edges
are legal; no namespace edge or rule changes.

## Non-responsibilities

No event dispatch, publishing, subscription, handler, or listener; no runtime execution, scheduling, or
orchestration; no provider / plugin / agent / workflow execution; no mutable or runtime state. It declares and
validates the static event flow topology; dispatching events at run time is a Phase 4 concern.
