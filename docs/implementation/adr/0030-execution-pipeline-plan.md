---
id: ADR-0030
title: The execution pipeline plan composes the frozen runtime workflow with the lifecycle plan; it references the model and executes nothing
status: Accepted
date: 2026-08-04
supersedes: []
superseded_by: null
---

# ADR-0030: The execution pipeline plan composes the frozen runtime workflow with the lifecycle plan; it references the model and executes nothing

## Status

**Accepted** (Phase 3, Stage 5). This ADR raised an Ambiguity Gate: the Stage 5 mandate, read against the frozen
surface, would require execution before the constitution allows it, invention of architecture, and duplication of
Runtime ownership. The gate was resolved by approval of **Option A** (the descriptive execution pipeline plan),
recorded below as the decision and implemented by `@openlance/aios-execution-pipeline`. It supersedes no accepted
decision, introduces no duplicate constitutional truth, and preserves ADR-0005, ADR-0020, ADR-0021, ADR-0026,
ADR-0027, ADR-0028, and ADR-0029. See `docs/implementation/27-execution-pipeline.md`.

## Context

Phase 3 built the composition root (ADR-0026), the namespace wiring (ADR-0027), the DI integration (ADR-0028), and
the runtime lifecycle plan (ADR-0029), each an immutable, descriptive, fail-closed `apps/`-layer package consuming
the prior. Stage 5 is asked to own the Execution Pipeline, consuming those and the frozen runtime model.

Three frozen facts constrain what Stage 5 can do:

- **The execution pipeline is already frozen.** `@openlance/aios-runtime` (Phase 2B, ADR-0020) exports the ordered
  workflow (`EXECUTION_WORKFLOW_STEPS`, `workflowStepAtOrAfter`), the validation stages (`VALIDATION_STAGES`,
  `validationStageAtOrAfter`), the context inputs, the lifecycle events, the states and `transitionAllowed`, and
  the failure model. The pipeline order and model are frozen; re-declaring them duplicates frozen code.
- **Carrying out the pipeline is impossible now and forbidden.** The workflow's `execute` step ("the validated
  task runs") and its validate/load/assemble steps require the operational namespaces (reasoning, agents, prompts,
  providers, tools, memory, retrieval) and a governance evaluator. Every namespace is a frozen pure ADR-0020 model
  with no services, and ADR-0020 is absolute: "Governance provides truth. Runtime performs enforcement." There is
  no service to run the task, no evaluator to run the validation steps, and no provider to call. The constitution
  assigns every step's carrying-out to "the runtime and the operational namespaces, outside every knowledge
  document," which do not yet exist.
- **Operations and Evolution disclaim execution.** Neither owns an Execution Pipeline; both assign execution to
  `ai/runtime/`. Evolution classifies adding a non-executing consumer package as the lowest-impact additive
  change, permitted only if it changes no behavior.

So a real Execution Pipeline would execute before the constitution allows it and would invent the entire
operational execution layer, while the pipeline order itself is frozen. This is why Stage 5 is design-first with
the gate raised.

## Decision

The decision is **Option A**: build a new `apps/`-layer package, `@openlance/aios-execution-pipeline`, that is a
**descriptive, immutable execution pipeline plan**. It:

1. **Consumes** the Stage 4 `RuntimeLifecyclePlan` (which nests the `IntegratedApplication`) and the frozen
   `@openlance/aios-runtime` pipeline model; it defines no workflow, validation stage, context input, event,
   state, transition, or failure model, and re-declares none of them (they are referenced from the frozen
   namespace).
2. **Executes nothing.** It holds no runtime state, drives no step, orchestrates nothing, schedules nothing,
   emits no event, and evaluates no governance rule. "Order validation" is a pure validator over the frozen
   order (delegating to `workflowStepAtOrAfter`), never a driver; "the pipeline model" is a reference view onto
   the frozen namespace, never a re-declaration.
3. **Validates only by delegation** to the frozen ordering predicates, failing closed with
   `ExecutionPipelineError[]` and no partial plan, immutable throughout.
4. Owns exactly `ExecutionPipelinePlan`, `buildExecutionPipelinePlan(...)`, and the fail-closed delegated
   validator `validateWorkflowOrder(...)`. The output is the immutable `ExecutionPipelinePlan` (lifecycle plan +
   referenced workflow, validation stages, context inputs, events), the single handle a future runtime engine
   would drive once the operational service stages exist.

## Alternatives considered

- **Option B, formal deferral.** Record that a real Execution Pipeline requires the operational namespace
  services, a governance enforcement layer, and a provider integration, none of which exist, so Stage 5's
  execution is deferred; the descriptive plan is optional. Mirrors ADR-0017. Lets the user pivot to the
  operational service stages that actually unblock execution.
- **Option C, pure pipeline verifier.** A fail-closed verifier only, emitting an immutable report and no plan
  object. Option A minus the plan.
- **Literal implementation of the mandate** (a package that runs the pipeline). Rejected: it executes before the
  constitution allows it, invents the operational execution layer, and duplicates the frozen runtime model, all
  forbidden by the mandate, ADR-0020, and the execution ban.

## Consequences

- A new `apps/`-layer package exists, depending on the runtime lifecycle plan (Stage 4), the frozen runtime
  namespace, and the kernel/errors substrate; its edges are recorded in `dependency-graph.snapshot.json`. The app
  to namespace and app to app edges are legal (ADR-0027/0028/0029).
- The layer is thin (the pipeline model is frozen and real execution is blocked on the operational service
  stages); its value is the single validated pipeline handle a future engine consumes.
- No frozen namespace, no constitution document, no dependency rule, and no prior stage or other ADR's decision
  changes. ADR-0005, ADR-0020, ADR-0021, ADR-0026, ADR-0027, ADR-0028, and ADR-0029 are preserved.

## Related constitutional references

`ai/runtime/` (the execution model this layer references, never restates) and the frozen `@openlance/aios-runtime`
namespace (the model, consumed not recreated). This ADR records an engineering composition decision; it realizes
no constitutional concept and changes no constitutional ownership.

## Related ADRs

Builds on ADR-0029 (runtime lifecycle plan), ADR-0028 (DI integration), ADR-0027 (namespace wiring), ADR-0026
(composition root), ADR-0020 and ADR-0021 (namespace model and dependency policy), ADR-0024 (Runtime is category
3), and ADR-0007 (design-first cadence). Relates to ADR-0017 (deferral reasoning), whose logic Option B would
mirror.
