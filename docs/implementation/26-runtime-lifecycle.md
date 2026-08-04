# 26. Runtime Lifecycle design (Phase 3, Stage 4)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 4).** This document raised an Ambiguity Gate (Sections 2, 3):
the runtime lifecycle model is already frozen (`@openlance/aios-runtime`), and "carrying it out" is execution
(Stage 5). The gate was resolved by approval of **Option A** (Section 4), the descriptive runtime lifecycle plan,
which is what `apps/runtime-lifecycle` (`@openlance/aios-runtime-lifecycle`) implements.
[ADR-0029](adr/0029-runtime-lifecycle-plan.md) is Accepted. The conflict analysis below is retained as the
rationale for the shape.

## 1. Mandate

Stage 4 is to implement Runtime Lifecycle as the next `apps/`-layer package, owning only what the constitution
assigns to Runtime Lifecycle, consuming the frozen Composition Root, Namespace Wiring, and DI Integration, and
delivering (if constitutionally valid) an immutable runtime lifecycle model, lifecycle transitions, fail-closed
validation, and diagnostics. It must not implement execution or orchestration, must not execute providers /
agents / prompts / reasoning / retrieval / memory / tools, and must not recreate DI, namespace wiring, or the
composition root. Stage 5 (Execution Pipeline) must not be begun.

## 2. The frozen surface (what already exists and who owns it)

- **The runtime lifecycle model is already frozen: `@openlance/aios-runtime` (Phase 2B, ADR-0020, ADR-0024
  category 3).** It is the immutable, technology-neutral domain model of `ai/runtime/`, and it already exports the
  entire lifecycle model: `EXECUTION_STATES` (the 13 named states), `EXECUTION_STATE_TRANSITIONS` (the permitted
  transition adjacency map) and `transitionAllowed(from, to)` (the pure state-machine predicate),
  `EXECUTION_LIFECYCLE_PHASES` (5) + `executionPhaseAtOrAfter`, `SESSION_LIFECYCLE_PHASES` (3) +
  `sessionPhaseAtOrAfter`, `EXECUTION_WORKFLOW_STEPS` (14) + `workflowStepAtOrAfter`, `VALIDATION_STAGES` (3) +
  `validationStageAtOrAfter`, `EXECUTION_BOUNDARIES`, `RUNTIME_EVENTS`, `CONTEXT_INPUTS`, and every principle and
  invariant, all frozen. The runtime lifecycle model is this package, and it is frozen.
- **The constitution splits "define the model" from "carry it out," with nothing between.** `ai/runtime/README.md`:
  "It defines the execution model; it never carries it out." Every `ai/runtime/` member document repeats a
  Boundaries clause assigning the carrying-out mechanism to "the runtime, outside every knowledge document":
  execution-states.md ("Any mechanism that implements a state or transition: the runtime, outside every knowledge
  document"), execution-workflow.md ("Any mechanism, algorithm, or system that carries out a step: the runtime
  and the operational namespaces, outside every knowledge document"), and likewise context-loading,
  knowledge-resolution, failure-recovery, and event-lifecycle. The frozen namespace's own barrel states it "owns
  the constitutional role of lifecycle and orchestration" but "performs no orchestration, no execution, and no
  IO ... the actual orchestration over a concrete task is the operational runtime's."
- **The DI Integration output is the Stage 3 handle to consume.** `@openlance/aios-di-integration` produces the
  immutable `IntegratedApplication` (`{ wired, injectable, readiness, validated }`), which nests the
  `WiredApplication` (Stage 2) and, through it, the `Application` (Stage 1). This is the validated,
  substrate-composed, namespace-wired, DI-integrated handle Stage 4 builds on.

## 3. The conflicts (why the gate fires)

1. **"Immutable runtime lifecycle model" is already frozen.** The lifecycle model (states, transitions, phases,
   sessions, workflow, validation stages, boundaries, events) is `@openlance/aios-runtime`. Re-declaring any of it
   at the app layer duplicates frozen code, which the mandate forbids ("never duplicate constitutional truth,"
   "no duplication of existing frozen code") and which ADR-0020 and ADR-0025 forbid.

2. **"Lifecycle transitions" is duplication or execution.** The transition relation is the frozen
   `EXECUTION_STATE_TRANSITIONS` / `transitionAllowed`; re-encoding it duplicates frozen code. Actually driving an
   execution along transitions (holding a current state, advancing it) is execution and orchestration, which the
   mandate forbids ("must not implement execution," "must not implement orchestration," "no partial runtime
   state," "no hidden mutable state") and which the constitution assigns to "the runtime, outside every knowledge
   document."

3. **Carrying out the lifecycle is execution, and execution is a later stage.** The constitution's clean split
   leaves no non-executing "runtime lifecycle orchestration" concern between the frozen model and execution. A
   package that orchestrates the lifecycle is the Execution Pipeline (Stage 5), which the mandate forbids
   beginning.

4. **The Stage 4 vs Stage 5 boundary is ambiguous.** Given the model is frozen and carrying it out is execution
   (Stage 5), what an app-layer "Runtime Lifecycle" (Stage 4) owns that is neither is not defined by the
   constitution and must be chosen, not invented. That is the decision this checkpoint raises.

## 4. Options for the user (the decision this document raises)

### Option A (recommended): a descriptive, immutable runtime lifecycle plan, no execution

A new `apps/runtime-lifecycle` package (`@openlance/aios-runtime-lifecycle`, layer `app`) that **consumes** the
frozen `IntegratedApplication` and the frozen `@openlance/aios-runtime` lifecycle model, and produces one
immutable `RuntimeLifecyclePlan`. It:

- **references the frozen lifecycle model** (initial state `created`, the ordered lifecycle phases, the
  deterministic admission path), read from the frozen namespace, and never re-declares states, transitions,
  phases, or events;
- provides **pure, fail-closed transition-path validation** by delegating each consecutive transition to the
  frozen `transitionAllowed`, returning a `Result` with a structured `RuntimeLifecycleError` instead of a bare
  boolean, so a proposed lifecycle path can be validated before a later stage drives it;
- proves that the consumed `IntegratedApplication` is ready to enter the lifecycle by validating the model's
  deterministic admission sequence against the frozen relation, and binds it into the immutable plan;
- holds **no mutable state**, has **no "current state,"** drives **no execution**, and performs **no
  orchestration**. It is the immutable, validated plan that the Stage 5 Execution Pipeline would consume and
  drive.

"Lifecycle transitions" is realized as a pure **validator** over the frozen relation (is this proposed path
permitted?), never as a live state machine. "Immutable runtime lifecycle model" is realized as a **reference
view** onto the frozen namespace, never as a re-declaration. The descriptive planning metadata is the plan
itself (`initialState`, `phases`, `admissionPath`, `validated`); there is no separate diagnostics report.
Requires ADR-0029 (Accepted). Honest caveat: because the model is frozen and execution is deferred, this layer is a
thin descriptive binding; its value is the single validated lifecycle handle Stage 5 consumes.

### Option B: a formal deferral (mirrors ADR-0017)

Record, in ADR-0029, that the runtime lifecycle model is already frozen (`@openlance/aios-runtime`), that
carrying it out is execution owned by the operational runtime (Stage 5, Execution Pipeline), and that there is no
non-duplicating, non-executing independent Stage 4 package distinct from the descriptive plan; therefore Stage 4
produces the lifecycle-binding contract (design doc + ADR) and no runtime package now, folding the lifecycle
handle into the Execution Pipeline stage. This mirrors ADR-0017's deferral of the composition root ("most
meaningful once there is something to carry out"). Zero duplication and zero execution risk.

### Option C: a pure lifecycle verifier

A package that only **verifies**, fail-closed, that a proposed lifecycle transition or phase ordering conforms to
the frozen model and that an `IntegratedApplication` is ready to enter the lifecycle, delegating to the frozen
predicates and emitting an immutable `LifecycleReport`. Option A minus the plan object; its only output is a
verdict.

## 5. Implemented shapes (Option A)

```ts
import type { ExecutionState, ExecutionLifecyclePhase } from '@openlance/aios-runtime';
import type { IntegratedApplication } from '@openlance/aios-di-integration';

// A reference view onto the frozen runtime lifecycle model, bound to the integrated application. Descriptive
// planning metadata only: no runtime state, no current state, drives nothing.
export interface RuntimeLifecyclePlan {
  readonly integrated: IntegratedApplication;             // consumed, unchanged (nests wired -> application)
  readonly initialState: ExecutionState;                   // 'created', referenced from the frozen model
  readonly phases: readonly ExecutionLifecyclePhase[];     // referenced from EXECUTION_LIFECYCLE_PHASES
  readonly admissionPath: readonly ExecutionState[];       // the model's deterministic admission sequence, validated
  readonly validated: true;                                // records the fail-closed checks passed
}

// Validate that a proposed sequence of execution states is a permitted path through the frozen state model,
// failing closed. Pure: delegates entirely to the frozen transitionAllowed for each consecutive pair; drives
// nothing, holds no state, re-declares no transition.
export function validateLifecyclePath(
  states: readonly ExecutionState[],
): Result<readonly ExecutionState[], RuntimeLifecycleError[]>;

// Build the immutable plan from an integrated application, failing closed. It references the frozen model's
// initial state and lifecycle phases, proves the model's deterministic admission sequence against the frozen
// transition relation (via validateLifecyclePath), and produces the immutable RuntimeLifecyclePlan. Pure; no IO;
// no execution.
export function buildRuntimeLifecyclePlan(
  integrated: IntegratedApplication,
): Result<RuntimeLifecyclePlan, RuntimeLifecycleError[]>;
```

`RuntimeLifecycleError` is an `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with
`RUNTIME_LIFECYCLE.*` codes; failures ride the `Result` channel (ADR-0006). The admission sequence is the
constitution's deterministic prefix (Created through Initializing, Loading, Validating); it is not trusted but
proven, each edge validated against the frozen `transitionAllowed`, so model drift fails closed.

## 6. What Stage 4 will not do (any option)

No execution, orchestration, scheduling, or event processing. No provider / agent / prompt / reasoning /
retrieval / memory / tool execution. No live state machine, no current state, no mutable or partial runtime
state. No re-declaration of the runtime states, transitions, phases, sessions, workflow, validation stages,
boundaries, or events (all frozen in `@openlance/aios-runtime`). No new container, registry, resolver, namespace
manifest, or composition root (all frozen). No IO. No modification to `ai/`, `knowledge/`, the substrate, the
namespaces, or any prior Phase 3 stage.

## 7. Non-duplication and ownership table

| Asked to own | Already owned by | Stage 4 disposition |
|---|---|---|
| Immutable runtime lifecycle model | `@openlance/aios-runtime` (states, transitions, phases, sessions, workflow, validation, boundaries, events) | reference, never re-declare |
| Lifecycle transitions (the relation) | frozen `EXECUTION_STATE_TRANSITIONS` / `transitionAllowed` | delegate; validate/query, never re-encode |
| Lifecycle transitions (driving them) | the operational runtime (execution), Stage 5 | not done here (execution ban) |
| Fail-closed validation | frozen `transitionAllowed` | delegate; wrap on the `Result` channel |
| Diagnostics | realized by the immutable plan itself | the plan's referenced fields (`initialState`, `phases`, `admissionPath`, `validated`); no separate report |
| Consuming composition root / wiring / DI | Stages 1 to 3 (frozen) | consume `IntegratedApplication`; recreate nothing |

## 8. If Option A or C is approved: the build plan

New `apps/runtime-lifecycle` (`@openlance/aios-runtime-lifecycle`, layer `app`), single explicit barrel, modules
`lifecycle.ts` + `errors.ts`. Dependencies: `@openlance/aios-di-integration`, `@openlance/aios-runtime` (the
frozen lifecycle model), `@openlance/aios-kernel`, `@openlance/aios-errors`. Full `pnpm run validate` green; 100%
coverage; benchmark of the plan/validate path; regenerate `dependency-graph.snapshot.json`; ADR-0029 flips to
Accepted; freeze document; two independent audits (traceability, purity, regression); completion report; commit;
freeze; stop before Stage 5 (Execution Pipeline). If Option B is approved, ADR-0029 records the deferral and no
package is built.

## 9. The gate and its resolution

A duplication risk (the lifecycle model is frozen), a frozen-package conflict (`@openlance/aios-runtime` owns the
model; the mandate forbids duplicating it), an execution conflict ("lifecycle transitions" as driving is
execution, forbidden and deferred to Stage 5), and a Stage 4 vs Stage 5 boundary ambiguity all exist, as
Sections 2 and 3 show. Per the Stage 4 mandate and ADR-0007, implementation stopped at the design artifacts (this
document and the Proposed ADR-0029) and awaited a direction. **Option A was approved**, and this package
implements it exactly: `buildRuntimeLifecyclePlan(integrated)` references the frozen model's initial state and
lifecycle phases, proves the deterministic admission sequence against the frozen `transitionAllowed` via
`validateLifecyclePath`, holds no state, drives nothing, and fails closed. ADR-0029 is Accepted. Stage 5
(Execution Pipeline) is not begun.
