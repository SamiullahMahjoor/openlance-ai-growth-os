# 27. Execution Pipeline design (Phase 3, Stage 5)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 5).** This document raised an Ambiguity Gate (Sections 3, 4):
the execution pipeline order is already frozen in `@openlance/aios-runtime`, and actually carrying it out requires
operational namespace services and a governance evaluator that do not exist. The gate was resolved by approval of
**Option A** (Section 5), the descriptive execution pipeline plan, which is what `apps/execution-pipeline`
(`@openlance/aios-execution-pipeline`) implements. [ADR-0030](adr/0030-execution-pipeline-plan.md) is Accepted. The
conflict analysis below is retained as the rationale for the shape.

## 1. Mandate

Stage 5 is to implement the Execution Pipeline as the next `apps/`-layer package, consuming the Stage 4
`RuntimeLifecyclePlan`, the Stage 3 `IntegratedApplication`, the frozen runtime model, and the frozen DI, and
recreating no lifecycle, execution states, runtime phases, transition graph, validation, dependency graph,
namespace model, or orchestration already owned elsewhere. It may own only what the constitution explicitly
assigns to the Execution Pipeline; everything else is referenced.

## 2. Constitutional review performed (from source, this session)

Read in full from source: all twelve `ai/runtime/` documents (README, inventory, execution-lifecycle,
execution-states, session-lifecycle, execution-workflow, context-loading, knowledge-resolution, validation-
pipeline, execution-boundaries, failure-recovery, event-lifecycle); all twelve `ai/operations/` documents; all
twelve `ai/evolution/` documents; ADR-0005, ADR-0020, ADR-0021, ADR-0026, ADR-0027, ADR-0028, ADR-0029; the
Stage 1 to 4 implementation docs (23 to 26) and freeze docs; and the frozen `@openlance/aios-runtime` source
(`execution-workflow.ts`, `execution-states.ts`, the barrel). Ownership was reconstructed from these sources, not
from memory.

## 3. The frozen surface (what exists and who owns it)

- **The execution pipeline is already frozen: `@openlance/aios-runtime` (Phase 2B, ADR-0020).** It exports the
  complete ordered pipeline: `EXECUTION_WORKFLOW_STEPS` (the 14 steps, `initialize` ... `validate-permissions`,
  `validate-policies`, `execute`, `monitor-state`, `handle-failures`, `return-result`, `finalize-session`) and
  `workflowStepAtOrAfter`; `VALIDATION_STAGES` (constitutional, permission, policy) and `validationStageAtOrAfter`;
  `CONTEXT_INPUTS` (the four inputs assembled into context); `RUNTIME_EVENTS` (the eight lifecycle events);
  `EXECUTION_STATES` (13) with `EXECUTION_STATE_TRANSITIONS` and `transitionAllowed`; and the failure-recovery and
  knowledge-resolution models, all frozen. The execution pipeline's order and model are this package.
- **The constitution splits "define the model" from "carry it out," and reserves carrying-out to impls that do
  not exist.** `ai/runtime/execution-workflow.md`: "The order is architectural: it defines what happens before
  what, never how any step is carried out," and its Boundaries assign "Any mechanism, algorithm, or system that
  carries out a step: the runtime and the operational namespaces, outside every knowledge document." The `execute`
  step is "The validated task runs," carried out by the operational namespaces.
- **The operational namespaces have no services, and governance has no evaluator.** All 13 namespaces are frozen
  pure ADR-0020 models: "It must never own: runtime, orchestration, execution, validation engines, scoring,
  workflows, IO ... services." ADR-0020 is absolute: "Governance provides truth. Runtime performs enforcement.
  This boundary is absolute," and it forbids exactly the shapes an execution pipeline needs (`validate(request)`,
  `evaluate(action)`, `checkPermission(runtimeContext)`, `executePolicy(...)`). So there is no reasoning / agents
  / prompts / providers / tools / memory / retrieval service to run the task, and no governance evaluator to run
  the validate-constitution / validate-permissions / validate-policies steps.
- **Operations and Evolution disclaim execution.** `ai/operations/`: "Operations is not the runtime. The runtime
  executes, orchestrates, and schedules ... Operations never executes, orchestrates, or schedules." `ai/evolution/`:
  "Execution is owned by ai/runtime/ ... evolution neither executes nor operates." Evolution classifies *adding* a
  package that consumes frozen models as the lowest-impact additive change, permitted only if it changes no
  behavior.
- **Stages 1 to 4 are frozen, descriptive, non-executing app layers.** Composition Root (Application), Namespace
  Wiring (WiredApplication), DI Integration (IntegratedApplication), Runtime Lifecycle (RuntimeLifecyclePlan). None
  executes; each consumes the prior.

## 4. The conflicts (why the gate fires)

1. **Execution before the constitution allows it.** Carrying out the pipeline (the `execute` step, and the
   validate/load/assemble steps) requires operational namespace services and a governance evaluator that do not
   exist and that ADR-0020 forbids the namespaces from owning. There is nothing to run, no rule to evaluate, no
   provider to call.
2. **Invention of architecture.** A real Execution Pipeline would have to invent the entire operational execution
   layer (reasoning/agents/prompts/providers/tools/memory/retrieval services, a governance enforcement engine, a
   provider integration), none of which the constitution defines here and each of which is its own later stage.
3. **Duplicate Runtime ownership / recreation of frozen logic.** The pipeline order, validation order, context
   inputs, events, states, transitions, and failure model are all frozen in `@openlance/aios-runtime`. Declaring a
   pipeline that re-encodes any of them duplicates frozen code.
4. **No conflict with Operations or Evolution.** Both disclaim execution; adding a non-executing package that
   consumes frozen models is additive and permitted. The conflict is entirely with the execution ban and the
   frozen Runtime model.

## 5. Options for the user (the decision this document raises)

### Option A (recommended, consistent with Stages 1 to 4): a descriptive, immutable execution pipeline plan

A new `apps/execution-pipeline` package (`@openlance/aios-execution-pipeline`, layer `app`) that **consumes** the
Stage 4 `RuntimeLifecyclePlan` (which nests the `IntegratedApplication`) and the frozen `@openlance/aios-runtime`
pipeline model, and produces one immutable `ExecutionPipelinePlan`. It:

- **references the frozen pipeline model** (the ordered workflow steps, the validation stages, the context
  inputs, the lifecycle events), read from the frozen namespace, and re-declares none of them;
- provides **pure, fail-closed order validation** by delegating to the frozen `workflowStepAtOrAfter` (and, as
  needed, `validationStageAtOrAfter`), returning a `Result` with a structured `ExecutionPipelineError`, so a
  proposed workflow order can be validated before a later stage drives it;
- proves the frozen workflow order is well-formed and binds it to the Stage 4 lifecycle plan, producing the
  immutable `ExecutionPipelinePlan` (lifecycle plan + workflow + validation stages + context inputs + events),
  the single handle a future runtime engine would drive;
- holds **no runtime state**, drives **no step**, executes **nothing**, and orchestrates **nothing**.

It is the culmination of the Phase 3 descriptive chain: the complete, validated, immutable description of how an
execution would proceed, executing none of it. Requires ADR-0030. Honest caveat: because the pipeline model is
frozen and real execution is blocked on the operational service stages, this layer is thin (largely a validated
reference view onto the frozen workflow bound to the lifecycle plan).

### Option B: a formal deferral until the operational service stages exist

Record, in ADR-0030, that a real Execution Pipeline requires the operational namespace services (each namespace's
own later operational stage), a governance enforcement layer, and a provider integration, none of which exist, so
Stage 5's *execution* is deferred; the descriptive pipeline plan (Option A) is the most that can be built now, and
even that is optional. This mirrors ADR-0017's deferral. Strategically, the work that actually unblocks execution
is the operational namespace service stages, not another descriptive app layer; Option B lets the user pivot
there.

### Option C: a pure pipeline verifier

A package that only **verifies**, fail-closed, that a `RuntimeLifecyclePlan` and the frozen workflow / validation
orders are mutually consistent and ready for a future engine, delegating to the frozen predicates and emitting an
immutable `PipelineReport`. Option A minus the plan object; verdict only.

## 6. Recommended shapes (Option A), for review only

```ts
import type { ExecutionWorkflowStep, ValidationStage, ContextInput, RuntimeEvent } from '@openlance/aios-runtime';
import type { RuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

// A reference view onto the frozen pipeline model, bound to the Stage 4 lifecycle plan. Descriptive; executes
// nothing, holds no runtime state.
export interface ExecutionPipelinePlan {
  readonly lifecycle: RuntimeLifecyclePlan;              // consumed, unchanged (nests IntegratedApplication)
  readonly workflow: readonly ExecutionWorkflowStep[];   // referenced EXECUTION_WORKFLOW_STEPS
  readonly validationStages: readonly ValidationStage[]; // referenced VALIDATION_STAGES
  readonly contextInputs: readonly ContextInput[];       // referenced CONTEXT_INPUTS
  readonly events: readonly RuntimeEvent[];              // referenced RUNTIME_EVENTS
  readonly validated: true;
}

// Validate that a proposed workflow step sequence is in the frozen constitutional order, failing closed.
// Delegates to the frozen workflowStepAtOrAfter; drives nothing.
export function validateWorkflowOrder(
  steps: readonly ExecutionWorkflowStep[],
): Result<readonly ExecutionWorkflowStep[], ExecutionPipelineError[]>;

// Build the immutable pipeline plan from a Stage 4 lifecycle plan, failing closed. Pure; no IO; no execution.
export function buildExecutionPipelinePlan(
  lifecycle: RuntimeLifecyclePlan,
): Result<ExecutionPipelinePlan, ExecutionPipelineError[]>;
```

`ExecutionPipelineError` is an `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with
`EXECUTION_PIPELINE.*` codes; failures ride the `Result` channel (ADR-0006).

## 7. What Stage 5 will not do (any option)

No execution of a task; no orchestration, scheduling, or event emission; no provider / agent / prompt / reasoning
/ retrieval / memory / tool execution; no governance evaluation; no live state machine, current state, or mutable
runtime state; no runtime engine. No re-declaration of the workflow steps, validation stages, context inputs,
events, states, transitions, or failure model (all frozen in `@openlance/aios-runtime`). No new container,
registry, resolver, namespace manifest, composition root, or lifecycle plan (all frozen in Stages 1 to 4). No IO.
No modification to `ai/`, `knowledge/`, the substrate, the namespaces, or any prior stage.

## 8. Non-duplication and ownership table

| Asked to own | Already owned by | Stage 5 disposition |
|---|---|---|
| The execution pipeline order | frozen `EXECUTION_WORKFLOW_STEPS` / `workflowStepAtOrAfter` | reference, never re-declare |
| Validation order / stages | frozen `VALIDATION_STAGES` / `validationStageAtOrAfter` | reference; delegate validation |
| Context inputs, events, states, transitions, failure model | frozen `@openlance/aios-runtime` | reference, never re-declare |
| Carrying out the pipeline (execute the task) | the operational namespaces + a governance evaluator (do not exist; later stages) | not done here (execution ban) |
| Lifecycle plan / integrated app / DI / wiring | Stages 1 to 4 (frozen) | consume, recreate nothing |

## 9. The gate and its resolution

Three explicit gate triggers occur, as Sections 3 and 4 show: execution before the constitution allows it,
invention of architecture, and duplication of Runtime ownership / recreation of frozen logic. Per the Stage 5
mandate and ADR-0007, implementation stopped at the design artifacts (this document and the Proposed ADR-0030) and
awaited a direction. **Option A was approved**, and this package implements it exactly:
`buildExecutionPipelinePlan(lifecycle)` references the frozen workflow, validation stages, context inputs, and
events, proves the frozen workflow order via `validateWorkflowOrder` (delegating to `workflowStepAtOrAfter`),
executes nothing, and fails closed. ADR-0030 is Accepted. No later stage (operational services, execution engine)
is begun.
