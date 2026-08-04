# Event Flow, Freeze Declaration (Phase 3, Stage 8)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-event-flow` (`apps/event-flow`).
**Scope:** Phase 3, Stage 8: the application-level event flow integration, the eighth `apps/`-layer package, built
on the frozen Phase 2A substrate (in particular the frozen `@openlance/aios-events` framework) and the frozen Stage
1 to Stage 7 packages. Decision: ADR-0034 (Accepted; no supersession, as ADR-0032 already anticipates Stage 8).
Design: `docs/implementation/31-event-flow.md`.

Note on the freeze boundary: per ADR-0032 the Phase 3 integration layer is frozen together at the consolidated Stage
9 Runtime Freeze. This document records that Stage 8 is settled and audited; it does not pre-empt the Stage 9
layer-wide freeze.

## What this stage owns

An immutable **`EventFlowPlan`** describing the runtime integration chain's framework event topology (which
framework event types flow), each realized as a canonical immutable `FrameworkEvent` through the frozen event
constructor, attached to the Stage 7 chain handle. It **describes, never owns**: it references the frozen event
framework and re-declares nothing, and it **executes nothing**: it does not publish, subscribe, dispatch, or handle
any event, and runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4.

## What was built

| Module | Owns |
|---|---|
| `src/event-flow.ts` | the public types, `buildEventFlowPlan`, `validateEventFlow` |
| `src/errors.ts` | `EventFlowError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `buildEventFlowPlan(chain: ErrorPropagationPlan, clock: Clock, nodes: readonly EventFlowNode[]): Result<EventFlowPlan, EventFlowError[]>`
  - build the plan, attaching it to the chain and delegating realization, failing closed.
- `validateEventFlow(clock: Clock, nodes: readonly EventFlowNode[]): Result<readonly FrameworkEvent[], EventFlowError[]>`
  - validate the declared topology and realize each event via the frozen `createEvent`, failing closed.
- `EventFlowNode`, `EventFlowPlan`, `EventFlowDiagnostics`, `EventFlowError`.

`EventFlowNode = { type }`. `EventFlowPlan = { chain, events, diagnostics, validated: true }` (deep-frozen); `events`
are the realized frozen `FrameworkEvent` envelopes.

## Consume, never recreate

The event mechanism is owned, in full, by the frozen substrate package `@openlance/aios-events` (subsystem 06): the
`EventBus` (`publish`/`subscribe`/`subscribeAll`), the dispatcher, the subscription model, `createEventBus`, and the
`EVENT_BUS` token. This package recreates none of them and **calls no bus operation** (all are execution); it
consumes the frozen `FrameworkEvent` envelope type and delegates event realization to the frozen non-dispatching
`createEvent`. It re-declares no event, bus, dispatcher, subscription, or handler. The runtime AI event-lifecycle
(`RUNTIME_EVENTS`, owned by the Runtime namespace and already referenced by the Stage 5 pipeline plan) is a distinct
concern and is not restated.

## Validation (delegated realization, fail closed)

`validateEventFlow` rejects a blank event type (`EVENT_FLOW.BLANK_TYPE`) and a duplicate event type
(`EVENT_FLOW.DUPLICATE_TYPE`), and for each valid node delegates to the frozen `createEvent` to realize an immutable
`FrameworkEvent` (the injected `Clock` is the determinism seam; nothing is dispatched), building no partial set on a
problem. Failures ride the `Result` channel (ADR-0006), never thrown out of the API.

## Immutability

The `EventFlowPlan`, its `events` array, each realized `FrameworkEvent` (frozen by the frozen `createEvent`; its
payload is the shared frozen `EMPTY_PAYLOAD`), its `diagnostics`, and `diagnostics.types` are all `Object.freeze`d;
`chain` is the already-deep-frozen Stage 7 object. Both functions are pure; the package holds no runtime or
module-level mutable state. Both audits verified the deep freeze and purity empirically.

## Dependency graph

`@openlance/aios-event-flow -> { @openlance/aios-error-propagation, @openlance/aios-events, kernel, errors }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, and
logging are test-only devDependencies). The `app -> app` (error-propagation) and `app -> substrate` (events) edges
are legal; no dependency-cruiser rule or namespace edge changed.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 32 packages / 34 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 7 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN on the first pass, no findings at any severity. Audit 1 (ownership,
  constitutional compliance, ADR compliance, traceability, API fidelity, documentation fidelity, duplication) and
  Audit 2 (architecture, dependency correctness, immutability, purity, regression, graph correctness, implementation
  correctness). The no-execution constraint (never calls the bus), the delegated realization via `createEvent`, deep
  immutability, and the no-duplication of `RUNTIME_EVENTS` were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate (including `packages/events`, `packages/kernel`,
`packages/errors`), all 13 frozen namespaces, and the seven frozen Stage 1 to Stage 7 packages unchanged;
`.dependency-cruiser.cjs` and `scripts/` unchanged. The complete change set is the event-flow package, its design
doc, ADR-0034, the ADR index row, the `PHASE-3-COMPLETE.md` roadmap note, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The event flow plan's public API, behavior (delegated fail-closed realization, immutable `EventFlowPlan`,
consume-not-recreate boundary, executes-nothing / never-calls-the-bus boundary), and dependency edges are settled
for Stage 8. Publishing, subscribing, dispatching, or handling events, and all runtime execution, are Phase 4 and
not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen event-flow file without an architecture change process, each still running the full validation pipeline. Any
change to the public API, the describe-never-own boundary, the executes-nothing boundary, the fail-closed
delegated-realization contract, the immutable `EventFlowPlan` shape, or the consume-not-recreate boundary is an
architectural modification requiring a new or superseding ADR, an architecture review, an independent audit, and
full validation.

## Constitutional and prior layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate (including the event
framework), namespaces, and the seven prior Phase 3 packages are unchanged; this stage consumes them and modifies
none.

## Do not begin Stage 9

Phase 3 Stage 9 (Runtime Freeze) is not started. It is a separate stage; Stage 9 will be the consolidated Phase 3
Runtime Freeze of the whole integration layer.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
