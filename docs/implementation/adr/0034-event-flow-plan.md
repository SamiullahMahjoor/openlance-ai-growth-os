---
id: ADR-0034
title: The event flow plan describes the chain's framework event topology and delegates envelope realization to the frozen event constructor
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0034: The event flow plan describes the chain's framework event topology and delegates envelope realization to the frozen event constructor

## Status

**Accepted** (Phase 3, Stage 8). It introduces no duplicate constitutional or engineering truth, changes no frozen
work, and preserves ADR-0005, ADR-0006, ADR-0010, ADR-0020, ADR-0021, and ADR-0026 to ADR-0033. ADR-0032 already
anticipated Stage 8 (Event Flow) in the reopened Phase 3 roadmap, so no supersession is required.

## Context

The reopened Phase 3 roadmap (ADR-0032) continues with Stage 8, Event Flow. A full source reading (the
`@openlance/aios-events` and `@openlance/aios-kernel` packages, `docs/implementation/06-event-framework.md`, and the
Stage 1 to 7 docs) establishes:

- The **event mechanism** is owned, in full, by the frozen substrate package `@openlance/aios-events` (subsystem
  06): the in-process publish/subscribe `EventBus` (`publish`/`subscribe`/`subscribeAll`), the deterministic
  fault-isolated dispatcher, the `Subscription` model, `createEventBus`, and the `EVENT_BUS` token. Its barrel
  disclaims runtime execution, orchestration, monitoring, and observability, and states that the runtime AI
  event-lifecycle (`ai/runtime`) is a separate, later concern owned by the Runtime namespace.
- The bus's operations (`publish`/`subscribe`/`subscribeAll`) are all runtime execution. The one non-dispatching
  operation is the pure constructor `createEvent(clock, type, payload)`, which stamps `occurredAt` from an injected
  `Clock` and returns a frozen `FrameworkEvent`.
- The runtime AI event model (`RUNTIME_EVENTS`) is owned by `@openlance/aios-runtime` and already referenced by the
  Stage 5 execution pipeline plan; it is distinct from the engineering `FrameworkEvent`.

What no package owns is the application-level *description* of the chain's framework event flow: which framework
event types flow, and that each is well-formed and unique. That descriptive topology is a genuine, previously
unowned integration concern, directly parallel to Error Propagation (Stage 7).

## Decision

1. **Stage 8 is a new `apps/`-layer package, `@openlance/aios-event-flow`, that owns the application-level event
   flow description only.** It produces an immutable `EventFlowPlan` declaring a topology of framework event types,
   each realized as a canonical immutable `FrameworkEvent`, attached to the Stage 7 `ErrorPropagationPlan`.
2. **It consumes, never recreates.** It consumes the frozen `FrameworkEvent` type and the frozen non-dispatching
   `createEvent`, and the Stage 7 chain handle. It re-declares no event, bus, dispatcher, subscription, handler, or
   envelope type, and it never calls a bus operation (`publish`/`subscribe`/`subscribeAll`), which are execution.
3. **It executes nothing.** It does not publish, subscribe, dispatch, or handle any event. The appropriate frozen
   delegation is `createEvent`, to which it delegates the realization of each declared event type as an immutable
   `FrameworkEvent` envelope (pure construction, not dispatch). It validates the topology fail-closed (blank type,
   duplicate type) and builds an immutable plan.
4. **Design-first cadence continues (ADR-0007).** This ADR and `docs/implementation/31-event-flow.md` are the Stage
   8 design artifacts, approved before implementation.

## Rationale

The chain's framework event flow is a real integration concern the frozen substrate does not own (the substrate owns
the bus mechanism and the envelope; the flow topology is application-level). Describing it as an immutable topology,
realizing each declared event through the frozen constructor, honors "consume, never recreate" and the execution ban,
exactly as Stages 2 to 7 did for their frozen models. Delegating to `createEvent` rather than the bus's execution
operations is the appropriate, non-executing consumption of the frozen event system.

## Consequences

- A new `apps/`-layer package exists, depending on the Stage 7 error propagation plan, the frozen
  `@openlance/aios-events` substrate package, the kernel, and the errors substrate; its edges are recorded in
  `dependency-graph.snapshot.json`. The `app -> app` and `app -> substrate` (events) edges are legal; no
  dependency-cruiser rule or namespace edge changes.
- The Phase 3 integration layer continues toward the consolidated Stage 9 Runtime Freeze (ADR-0032). Stage 9 is not
  begun here.
- No frozen namespace, no substrate package, no constitution document, and no other ADR's decision changes. The
  event framework (subsystem 06) is preserved and consumed, not modified.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership. `docs/implementation/06-event-framework.md` (the frozen event framework) is referenced and
consumed, never restated. The runtime AI event-lifecycle (`ai/runtime/event-lifecycle.md`, `RUNTIME_EVENTS`) is a
distinct, Runtime-owned concern, referenced not restated.

## Related ADRs

Builds on ADR-0033 (error propagation; the chain handle), ADR-0032 (the reopened Phase 3 roadmap), ADR-0006 (Result
error handling), ADR-0010 (the EVENT_BUS token), ADR-0026 to ADR-0030 (the Phase 3 chain), and ADR-0007
(design-first cadence).
