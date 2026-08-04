# Execution Pipeline, Freeze Declaration (Phase 3, Stage 5)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-execution-pipeline` (`apps/execution-pipeline`).
**Scope:** Phase 3, Stage 5: the execution pipeline plan, the fifth `apps/`-layer package, built on the frozen
Phase 2A substrate, the 13 frozen Phase 2B namespaces (in particular the frozen `@openlance/aios-runtime` pipeline
model), and the frozen Stage 1 to Stage 4 packages. Decision: ADR-0030 (Accepted). Design:
`docs/implementation/27-execution-pipeline.md`.

## The gate this stage resolved

The Stage 5 mandate (implement the Execution Pipeline) triggered the Ambiguity Gate on three explicit conditions:
**execution before the constitution allows it** (carrying out the pipeline, especially the `execute` step,
requires operational namespace services and a governance evaluator that do not exist and that ADR-0020 forbids the
namespaces from owning), **invention of architecture** (a real pipeline would invent the entire operational
execution layer), and **duplication of Runtime ownership** (the pipeline order, validation order, context inputs,
events, states, transitions, and failure model are all frozen in `@openlance/aios-runtime`). A full constitutional
review of all `ai/runtime/`, `ai/operations/`, and `ai/evolution/` documents from source confirmed the gate;
Operations and Evolution disclaim execution to the runtime, and Evolution treats adding a non-executing consumer
package as a permitted additive change. Per ADR-0007 and the mandate, implementation stopped at the design
artifacts and awaited a direction. **Option A** (a descriptive execution pipeline plan) was approved and is what
this package implements.

## What this stage owns

An immutable **`ExecutionPipelinePlan`** that composes the Stage 4 `RuntimeLifecyclePlan` with the frozen runtime
pipeline model. It **describes, never owns**: it references the frozen model and re-declares nothing, and it
**executes nothing**: it holds no runtime state, drives no step, orchestrates nothing, schedules nothing, emits no
event, evaluates no governance rule, runs no operational namespace, and instantiates no runtime engine. It is the
complete, validated description of how an execution would proceed, the handle a future runtime engine would drive
once the operational service stages exist.

## What was built

| Module | Owns |
|---|---|
| `src/pipeline.ts` | the public types, `buildExecutionPipelinePlan`, `validateWorkflowOrder` |
| `src/errors.ts` | `ExecutionPipelineError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `buildExecutionPipelinePlan(lifecycle: RuntimeLifecyclePlan): Result<ExecutionPipelinePlan, ExecutionPipelineError[]>`
  - compose the lifecycle plan with the frozen pipeline model, failing closed.
- `validateWorkflowOrder(steps: readonly ExecutionWorkflowStep[]): Result<readonly ExecutionWorkflowStep[], ExecutionPipelineError[]>`
  - validate a proposed workflow-step sequence against the frozen constitutional order, failing closed.
- `ExecutionPipelinePlan`, `ExecutionPipelineError`.

`ExecutionPipelinePlan = { lifecycle, workflow, validationStages, contextInputs, events, validated: true }`
(deep-frozen). `workflow` is the frozen `EXECUTION_WORKFLOW_STEPS`, `validationStages` is `VALIDATION_STAGES`,
`contextInputs` is `CONTEXT_INPUTS`, and `events` is `RUNTIME_EVENTS`, all referenced by identity from the frozen
namespace; `validated: true` records that the frozen workflow order passed delegated validation.

## Consume, never recreate; never execute

It consumes the frozen `@openlance/aios-runtime` pipeline model and the frozen Stage 4 `RuntimeLifecyclePlan`
(ADR-0029), and re-declares no workflow step, validation stage, context input, event, execution state,
transition, or failure model. It recreates no container, registry, resolver, namespace manifest, composition
root, or lifecycle plan (Stages 1 to 4). "Order validation" is a pure validator over the frozen order
(`validateWorkflowOrder`, delegating to `workflowStepAtOrAfter`), never a driver. Real execution is out of scope
by construction: carrying out the pipeline requires the operational namespace services, a governance enforcement
layer, and a provider integration, none of which exist; this stage plans, it does not execute.

## Validation (delegated, fail closed)

`validateWorkflowOrder` performs no validation of its own; it delegates each consecutive step pair to the frozen
`workflowStepAtOrAfter` and aggregates one `EXECUTION_PIPELINE.OUT_OF_ORDER_STEP` error per out-of-order pair,
building no partial order. `buildExecutionPipelinePlan` uses it (through kernel `map`) to prove the frozen
workflow order, failing closed. Failures ride the `Result` channel (ADR-0006), never thrown.

## Immutability

The `ExecutionPipelinePlan` is `Object.freeze`d; `workflow`, `validationStages`, `contextInputs`, and `events`
are the frozen namespace arrays (referenced by identity); `lifecycle` is the already-deep-frozen Stage 4 object.
`validateWorkflowOrder` returns a frozen array. Both functions are pure; the package holds no mutable state. Both
audits verified the deep freeze empirically.

## Dependency graph

`@openlance/aios-execution-pipeline -> { @openlance/aios-runtime-lifecycle, @openlance/aios-runtime, kernel,
errors }` (its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring,
di-integration, config, and logging are test-only devDependencies). The `app -> namespace` (runtime) and
`app -> app` (runtime-lifecycle) edges are legal (ADR-0027/0028/0029/0030); the `@openlance/aios-runtime` and
`@openlance/aios-runtime-lifecycle` snapshot entries are unchanged. No dependency-cruiser rule changed.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 29 packages / 30 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 6 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN on the first pass, no findings at any severity. Audit 1 (constitutional
  traceability, ownership, API fidelity, duplication, ADR compliance) and Audit 2 (purity, architecture,
  dependency correctness, regression, immutability, implementation correctness). Deep immutability, the
  no-execution constraint, no invention, no duplication, and the fail-closed delegation were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen Phase 2B namespaces (including
`packages/namespaces/runtime`), and the frozen Stage 1 to Stage 4 packages unchanged; `.dependency-cruiser.cjs`
and `scripts/` unchanged; no other ADR's decision changed except the new ADR-0030 (Accepted). The complete change
set is the execution-pipeline package, its design doc, ADR-0030, the ADR index row, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The pipeline plan's public API, behavior (delegated fail-closed order validation, immutable
`ExecutionPipelinePlan`, referenced-not-recreated model, executes-nothing boundary), and dependency edges are
settled for Stage 5. Carrying out the pipeline (execution, orchestration, scheduling, governance evaluation,
operational namespace services, a runtime engine, a provider integration) and all later stages are **not** part of
this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen execution-pipeline file without an architecture change process, each still running the full validation
pipeline. Any change to the public API, the describe-never-own boundary, the executes-nothing boundary, the
fail-closed delegated-validation contract, the immutable `ExecutionPipelinePlan` shape, or the consume-not-recreate
boundary is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Constitutional and prior-phase layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate, namespaces (including the
runtime model), composition root, namespace wiring, DI integration, and runtime lifecycle plan are unchanged; this
stage consumes them and modifies none.

## Do not begin any later stage

The operational namespace service stages, a governance enforcement layer, a provider integration, a runtime
execution engine, and any actual execution are not started. Each is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
