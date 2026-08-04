# 28. Governance Enforcement design (Phase 3, Stage 6)

**Status: RESOLVED (Ambiguity Gate raised; Phase 3/Phase 4 boundary reassessed; Option B approved).** This document
raised the gate and reassessed the boundary (Sections 4, 5): Governance Enforcement has no new descriptive
constitutional ownership, so every descriptive construction duplicates frozen ownership and every executing one
invents enforcement. The gate was resolved by approval of **Option B** (Section 7): the Phase 3 descriptive chain is
complete at Stage 5, no Stage 6 package is built, and Governance Enforcement is recorded as an operational Phase 4
capability. [ADR-0031](adr/0031-governance-enforcement-boundary.md) is Accepted. The analysis below is retained as
the rationale.

## 1. Mandate

Stage 6 is to implement Governance Enforcement as the next `apps/`-layer package, consuming the frozen governance
and runtime namespaces and the Stage 1 to 5 handles, and may describe enforcement planning, enforcement readiness,
governance checkpoints, and an immutable governance enforcement plan. It must not enforce policies, execute
governance, evaluate permissions, schedule execution, transition runtime, emit runtime events, or activate
namespaces; those belong to later operational implementations. It must recreate no governance model, permission,
policy, autonomy, risk, escalation, runtime lifecycle, execution state, execution workflow, dependency graph,
namespace graph, DI, or composition, and must consume existing truth only.

## 2. Constitutional review performed (from source, this session)

Read in full from source: all eleven `ai/governance/` documents (README, inventory, constitutional-validation,
permission-governance, policy-enforcement, risk-management, escalation, autonomy-boundaries, human-oversight,
decision-making, change-governance); all twelve `ai/runtime/` documents; all twelve `ai/operations/` documents;
all twelve `ai/safety/` documents; all twelve `ai/evolution/` documents; the Accepted ADRs (0005, 0020, 0021,
0026, 0027, 0028, 0029, 0030, and the foundational 0006/0007/0022/0024/0025); the Stage 1 to 5 implementation and
freeze docs; and the frozen `@openlance/aios-governance` and `@openlance/aios-runtime` source. Ownership was
reconstructed from these sources, not from memory.

## 3. The frozen surface (what exists and who owns it)

- **Governance owns the rules, not their enforcement, and the entire rule set is frozen.** `ai/governance/README.md`:
  "It defines the rules; it never carries them out"; "The runtime carries out actions; governance defines what
  actions are permitted and how they are validated. Documenting a rule is not executing it"; "A governance document
  never defines an algorithm, a score, a workflow, a prompt, or any executable procedure. It states the rule, never
  the mechanism." Every governing document draws the same split and hands the doing to the runtime:
  constitutional-validation.md ("the operational namespaces and the runtime are responsible for performing
  validation as execution"; boundary "The runtime that performs validation, and any validation algorithm or
  mechanism: the operational namespaces and the runtime"), permission-governance.md ("The runtime that checks or
  enforces a permission at execution: the operational namespaces and the runtime"), policy-enforcement.md ("The
  runtime that applies or checks a policy: the operational namespaces and the runtime"), and likewise risk,
  escalation, autonomy, human-oversight, decision, and change. The frozen `@openlance/aios-governance` namespace
  models the whole rule set (permission, validation, policy-enforcement, escalation, risk, autonomy, human-oversight,
  decision-making, change-governance) as pure ADR-0020 definitions and predicates, and "performs no validation,
  enforcement, scoring, or runtime work."
- **The validation order is a runtime-model concern, frozen.** `@openlance/aios-runtime` exports `VALIDATION_STAGES`
  (constitutional, permission, policy) and `validationStageAtOrAfter`, and the `validate-constitution`,
  `validate-permissions`, `validate-policies` workflow steps, from `ai/runtime/validation-pipeline.md` and
  `ai/runtime/execution-workflow.md`.
- **Stage 5 already references the enforcement order.** The frozen `ExecutionPipelinePlan` (ADR-0030) already holds
  `validationStages` (the frozen `VALIDATION_STAGES`) and the frozen `workflow` including the three validate steps.
- **Enforcement is runtime execution, absolute.** ADR-0020: "Governance provides truth. Runtime performs
  enforcement. This boundary is absolute." Safety confirms: "The runtime executes and enforces at run time; safety
  defines the protective model the runtime applies." Operations disclaims execution to the runtime. Carrying out
  enforcement requires a governance evaluator and a live runtime context, neither of which exists (the operational
  namespace services and the enforcement engine are unbuilt).
- **Evolution permits adding only non-duplicating, non-behavior-changing packages.** Adding is the lowest-impact
  additive category, but only when it changes no existing document and re-owns no concern; the governance invariant
  "One owner per concern ... no two documents own the same concern" and rule "Nothing is duplicated" bind here.

## 4. Ownership analysis (the crux)

"Governance Enforcement" decomposes, exhaustively, into three parts, each already owned:

1. **The rules** (what is validated, which policy prevails, what oversight a trust level needs): owned by
   `ai/governance/` and frozen in `@openlance/aios-governance`.
2. **The order** (constitutional before permission before policy, validation before execute): a runtime-model
   concern, frozen in `@openlance/aios-runtime` (`VALIDATION_STAGES`, the validate workflow steps), and already
   referenced by the Stage 5 `ExecutionPipelinePlan`.
3. **Carrying it out** (performing the validation, checking the permission, applying the policy against a live
   execution's context): runtime execution, assigned by every governance document to "the operational namespaces
   and the runtime," forbidden here and dependent on an operational layer that does not exist.

There is no fourth, residual "governance enforcement" concern for a new package to own. A descriptive Stage 6 could
only **reference** parts 1 and 2, which duplicates Governance ownership, Runtime ownership, and the Stage 5
`ExecutionPipelinePlan`, and re-owns concerns the constitution assigns once (violating "one owner per concern" and
"nothing is duplicated"). Mapping a validation stage to the governance authority it checks is already encoded in the
frozen runtime `VALIDATION_STAGE` descriptions (duplication) or, if mapped to specific governance mandate arrays,
is a new cross-namespace relationship the constitution does not define (invention, against ADR-0025). An executing
Stage 6 would invent policy evaluation and enforcement logic and execute the runtime (against ADR-0020). Every path
trips the gate.

## 5. The Phase 3 / Phase 4 boundary (the reassessment requested)

Stages 1 to 5 each bound a **genuinely new** frozen model into the chain: Stage 1 the DI object graph, Stage 2 the
namespace manifest, Stage 3 the injectable substrate surface, Stage 4 the lifecycle states and admission path,
Stage 5 the workflow order, validation stages, context inputs, and events. Each added a handle that did not exist
before.

**Stage 6 would bind nothing new.** Its two referable parts (the governance rules and the validation order) are
already frozen and, for the order, already present in the Stage 5 plan. This is the boundary flagged in the Stage 5
completion: the descriptive integration chain has delivered its unique ownership and is complete at Stage 5. What
remains, real governance enforcement, is not a descriptive layer but an **operational** capability: the runtime
enforcement engine that evaluates the frozen governance rules against a live execution's context, which is Phase 4
(operational implementations) and depends on the operational namespace services that do not yet exist.

## 6. The gate

Every construction of Stage 6 trips a listed gate condition: a descriptive plan **duplicates Governance ownership,
Runtime ownership, and Execution Pipeline ownership** and **recreates constitutional models by reference**; an
executing package **invents policy evaluation, invents enforcement logic, and executes the runtime**, violating
ADR-0020. Per the Stage 6 mandate and ADR-0007, implementation stops here.

## 7. Options for the user

### Option B (recommended): declare the Phase 3 descriptive chain complete; Governance Enforcement is Phase 4

Record, in ADR-0031, that the Phase 3 runtime-integration chain is **complete at Stage 5**, having delivered the
composition root, namespace wiring, DI integration, runtime lifecycle plan, and execution pipeline plan as the
immutable, descriptive, non-executing integration surface. Governance Enforcement introduces no new descriptive
ownership; as a real capability it is the runtime enforcement engine, an **operational implementation** that begins
**Phase 4**, design-first, and depends on the operational namespace services and a governance evaluator that are
themselves Phase 4 stages. No Stage 6 package is built now. This directly honors "one owner per concern," "nothing
is duplicated," ADR-0020, and the Phase 3/Phase 4 boundary reassessment.

### Option A: a thin descriptive governance enforcement plan

A new `apps/governance-enforcement` package producing an immutable `GovernanceEnforcementPlan` that composes the
Stage 5 `ExecutionPipelinePlan` with references to the frozen governance validation stages and mandates, validating
the frozen validation-stage order by delegating to `validationStageAtOrAfter`. Honest assessment: this is a near-pure
wrapper over the Stage 5 plan and the frozen `VALIDATION_STAGES`; it re-owns the enforcement order the Stage 5 plan
already carries and adds no concern the constitution assigns to it. It is presented for completeness but sits at the
edge of the duplication gate.

### Option C: a pure governance readiness verifier

A package that only verifies, fail-closed, that a `RuntimeLifecyclePlan` or `ExecutionPipelinePlan`'s validation
stages are consistent with the frozen governance validation order, emitting an immutable report. Thinner than
Option A; still references only frozen parts 1 and 2 and owns no new concern.

## 8. Recommendation

**Option B.** The ownership analysis (Section 4) and the boundary reassessment (Section 5) show Stage 6 has no
genuinely new constitutional ownership to take. Building it as a descriptive wrapper would duplicate frozen
ownership; building it as an engine would execute and invent. The correct move is to declare Phase 3 complete at
Stage 5 and treat Governance Enforcement as the first Phase 4 operational stage, designed and approved on its own
terms when the operational layer it needs is built. Please choose a direction (Option B, A, or C, or a refinement)
before any code is written.
