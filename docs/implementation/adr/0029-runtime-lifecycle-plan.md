---
id: ADR-0029
title: The runtime lifecycle plan consumes the frozen runtime model and the DI integration; it references the model and carries nothing out
status: Accepted
date: 2026-08-04
supersedes: []
superseded_by: null
---

# ADR-0029: The runtime lifecycle plan consumes the frozen runtime model and the DI integration; it references the model and carries nothing out

## Status

**Accepted** (Phase 3, Stage 4). This ADR raised an Ambiguity Gate: the Stage 4 mandate, read against the frozen
surface, presented a duplication risk, a frozen-package conflict, an execution conflict, and a Stage 4 vs Stage 5
boundary ambiguity. The gate was resolved by approval of **Option A** (the descriptive runtime lifecycle plan),
recorded below as the decision and implemented by `@openlance/aios-runtime-lifecycle`. It supersedes no accepted
decision (there was no prior runtime-lifecycle deferral to supersede), introduces no duplicate constitutional
truth, and preserves ADR-0005, ADR-0020, ADR-0021, ADR-0026, ADR-0027, and ADR-0028. See
`docs/implementation/26-runtime-lifecycle.md`.

## Context

Phase 3 built the composition root (ADR-0026), the namespace wiring (ADR-0027), and the DI integration
(ADR-0028), each an immutable, descriptive, fail-closed `apps/`-layer package consuming the prior. Stage 4 is
asked to own Runtime Lifecycle as the next app package: an immutable runtime lifecycle model, lifecycle
transitions, fail-closed validation, and diagnostics, without implementing execution or orchestration.

Two frozen facts constrain what Stage 4 can do:

- **The runtime lifecycle model is already frozen.** `@openlance/aios-runtime` (Phase 2B, ADR-0020) is the
  immutable domain model of `ai/runtime/`, exporting the 13 execution states, the transition adjacency map and
  `transitionAllowed`, the execution/session lifecycle phases, workflow steps, and validation stages with their
  ordering predicates, plus boundaries and events. Re-declaring any of it duplicates frozen code.
- **The constitution splits "define the model" from "carry it out," with nothing between.** `ai/runtime/` states
  "It defines the execution model; it never carries it out," and every member document assigns the carrying-out
  mechanism to "the runtime, outside every knowledge document." Driving a live execution through the lifecycle is
  execution and orchestration, which the mandate forbids and which is the Execution Pipeline (Stage 5).

So the mandate's "immutable runtime lifecycle model" is already frozen, its "lifecycle transitions" is either the
frozen relation (duplication) or driving them (execution), and there is no constitutionally defined non-executing
"runtime lifecycle orchestration" concern between the frozen model and execution. This is why Stage 4 is
design-first with the gate raised, resolved by the decision below.

## Decision

The decision is **Option A**: a new `apps/`-layer package, `@openlance/aios-runtime-lifecycle`, a **descriptive,
immutable runtime lifecycle plan**. It:

1. **Consumes** the frozen `IntegratedApplication` (ADR-0028) and the frozen `@openlance/aios-runtime` lifecycle
   model; it defines no states, transitions, phases, sessions, workflow, validation stages, boundaries, or
   events, and re-declares none of them (they are referenced from the frozen namespace).
2. **Carries nothing out.** It holds no runtime state, has no current state, drives no transition, and performs
   no execution, orchestration, scheduling, activation, or event processing, and instantiates no runtime engine.
   "Lifecycle transitions" is realized as a pure validator over the frozen relation (delegating to
   `transitionAllowed`), never as a live state machine; "immutable runtime lifecycle model" is realized as a
   reference view onto the frozen namespace, never as a re-declaration.
3. **Validates only by delegation** to the frozen `transitionAllowed`, and it fails closed, returning
   `RuntimeLifecycleError[]` with no partial plan, immutable throughout.
4. Owns exactly `RuntimeLifecyclePlan`, `buildRuntimeLifecyclePlan(...)`, immutable planning metadata, and the
   fail-closed delegated validator `validateLifecyclePath(...)`. `buildRuntimeLifecyclePlan` proves that an
   `IntegratedApplication` is constitutionally ready to enter Stage 5 by binding it to the frozen model's initial
   state and lifecycle phases and validating the model's deterministic admission sequence against the frozen
   transition relation. The output is the immutable `RuntimeLifecyclePlan` that Stage 5 (the Execution Pipeline)
   consumes.

## Alternatives considered

- **Option B, formal deferral.** Record that the lifecycle model is frozen (`@openlance/aios-runtime`) and
  carrying it out is execution (Stage 5), folding the lifecycle handle into the Execution Pipeline stage. Mirrors
  ADR-0017's deferral. Not chosen: a non-duplicating descriptive plan is available now and is the handle Stage 5
  will consume.
- **Option C, pure lifecycle verifier.** A fail-closed verifier only, emitting an immutable report and no plan
  object. Not chosen: the plan object is the useful Stage 5 input; the verifier is a strict subset.
- **Literal implementation of the mandate** (a package that owns the lifecycle model and drives transitions).
  Rejected: it duplicates the frozen `@openlance/aios-runtime` model, or it implements execution and holds
  runtime state, both forbidden by the mandate and by ADR-0020, ADR-0025, and the execution ban.

## Consequences

- A new `apps/`-layer package exists, depending on the DI integration, the frozen runtime namespace, and the
  kernel/errors substrate; its edges are recorded in `dependency-graph.snapshot.json`. It introduces the first
  app dependency on a namespace for its model (a legal app -> namespace edge, ADR-0027/0028), which it references
  and never re-declares.
- The layer is thin today (the model is frozen and execution is deferred); its value is the single validated
  lifecycle handle Stage 5 consumes.
- No frozen namespace, no constitution document, no dependency rule, the composition root, the namespace wiring,
  the DI integration, and no other ADR's decision changes. ADR-0005, ADR-0020, ADR-0021, ADR-0026, ADR-0027, and
  ADR-0028 are preserved.

## Related constitutional references

`ai/runtime/` (the execution model this layer references, never restates) and the frozen `@openlance/aios-runtime`
namespace (the model, consumed not recreated). This ADR records an engineering composition decision; it realizes
no constitutional concept and changes no constitutional ownership.

## Related ADRs

Builds on ADR-0028 (DI integration), ADR-0027 (namespace wiring), ADR-0026 (composition root), ADR-0020 and
ADR-0021 (namespace model and dependency policy), ADR-0024 (Runtime is category 3), and ADR-0007 (design-first
cadence). Relates to ADR-0017 (deferral reasoning), whose logic the rejected Option B would mirror.
