# @openlance/aios-execution-pipeline

The AIOS execution pipeline plan (Phase 3, Stage 5). It composes the Stage 4 `RuntimeLifecyclePlan` with the frozen
runtime pipeline model, producing one immutable **`ExecutionPipelinePlan`**.

- **Layer:** `app` (the pipeline-plan counterpart to the composition root, namespace wiring, DI integration, and
  runtime lifecycle plan; `apps/*`).
- **Design:** [docs/implementation/27-execution-pipeline.md](../../docs/implementation/27-execution-pipeline.md).
  **Decision:** [ADR-0030](../../docs/implementation/adr/0030-execution-pipeline-plan.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the Stage 4 `RuntimeLifecyclePlan` (which nests the
`IntegratedApplication`) and the frozen `@openlance/aios-runtime` pipeline model, and produces one immutable
`ExecutionPipelinePlan`. `buildExecutionPipelinePlan(lifecycle)` proves the frozen workflow order is well-formed,
references the frozen workflow steps, validation stages, context inputs, and lifecycle events, and returns the
frozen plan, or fails closed with `ExecutionPipelineError[]`.

The plan is **descriptive planning metadata, not runtime state**. It holds no runtime state and **executes
nothing**: it drives no step, orchestrates nothing, schedules nothing, emits no event, evaluates no governance
rule, and runs no operational namespace. It is the complete, validated description of how an execution would
proceed, the handle a future runtime engine would drive once the operational service stages exist.

### Consume, never recreate

It re-declares no workflow step, validation stage, context input, event, execution state, transition, or failure
model: the execution pipeline model is owned by the frozen `@openlance/aios-runtime` namespace and is referenced
here, never duplicated. It recreates no container, registry, resolver, namespace manifest, composition root, or
lifecycle plan (all frozen in Stages 1 to 4). "Order validation" is a pure validator over the frozen order
(`validateWorkflowOrder`, delegating to `workflowStepAtOrAfter`), never a driver.

Real execution is deliberately out of scope: carrying out the pipeline requires the operational namespace services
(each namespace's own later stage), a governance enforcement layer, and a provider integration, none of which
exist. This stage plans; it does not execute (ADR-0030).

## Public API (single barrel, Engineering Rule 1)

- `buildExecutionPipelinePlan(lifecycle: RuntimeLifecyclePlan): Result<ExecutionPipelinePlan, ExecutionPipelineError[]>`
  - compose the lifecycle plan with the frozen pipeline model, failing closed.
- `validateWorkflowOrder(steps: readonly ExecutionWorkflowStep[]): Result<readonly ExecutionWorkflowStep[], ExecutionPipelineError[]>`
  - validate a proposed sequence of workflow steps against the frozen constitutional order, failing closed.
- `ExecutionPipelinePlan` - the read-only plan type.
- `ExecutionPipelineError` is a `BaseError` subtype (`infrastructure`) with `EXECUTION_PIPELINE.*` codes.

`ExecutionPipelinePlan` holds the consumed `lifecycle` (unchanged), and the referenced `workflow`
(`EXECUTION_WORKFLOW_STEPS`), `validationStages` (`VALIDATION_STAGES`), `contextInputs` (`CONTEXT_INPUTS`), and
`events` (`RUNTIME_EVENTS`), plus `validated: true`, which records that the frozen workflow order passed delegated
validation.

## Validation (delegated, fail closed)

`validateWorkflowOrder` performs no validation of its own: it delegates each consecutive step pair to the frozen
`workflowStepAtOrAfter` and aggregates one `EXECUTION_PIPELINE.OUT_OF_ORDER_STEP` error per out-of-order pair,
building no partial order. `buildExecutionPipelinePlan` uses it to prove the frozen workflow order, failing closed.

## Dependency direction

`@openlance/aios-execution-pipeline -> { @openlance/aios-runtime-lifecycle, @openlance/aios-runtime, kernel,
errors }` (its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring,
di-integration, config, and logging are test-only devDependencies). The `app -> namespace` (runtime) and
`app -> app` (runtime-lifecycle) edges are legal (ADR-0027/0028/0029/0030); no namespace edge or rule changes.

## Non-responsibilities

No execution of a task; no orchestration, scheduling, or event emission; no provider / agent / prompt / reasoning
/ retrieval / memory / tool execution; no governance evaluation; no live state machine, current state, or mutable
runtime state; no runtime engine. It composes and validates the static pipeline plan; driving it is a future
runtime engine's concern, blocked on the operational service stages.
