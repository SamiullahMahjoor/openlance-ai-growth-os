# @openlance/aios-runtime

The immutable, technology-neutral **domain model** of the AI layer's execution abstraction.

- **Constitution:** `ai/runtime/` (id `OL-AI-RUNTIME-README`), the **Specification** authority layer.
- **Category:** Runtime Service (ADR-0024, category 3) - it owns the constitutional role of lifecycle and
  orchestration; realized at this layer per ADR-0020 as an **immutable, stateless domain model** (no IO).
  **Design:** [docs/implementation/19-runtime.md](../../../docs/implementation/19-runtime.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states execution truth as strongly-typed classifications, immutable definitions and invariants, and pure
deterministic algorithms that express the execution specification verbatim. Runtime is the execution kernel:
this package defines how an AI task is initialized, loaded, validated, run, monitored, recovered, and
finalized. It **defines the execution model and never carries it out**: it enforces governance mandates in a
defined order, orchestrates the loading of knowledge and the results of the operational namespaces, and owns
none of the rules, truth, or behavior it sequences, and it **defines no provider, model, framework, language,
runtime system, protocol, interface, or code** (`ai/runtime/README.md`, ADR-0020). It owns no runtime
state, no mutable state, no lifecycle, no events, no IO, and no services.

### Why a Pure Domain Model for a "Runtime Service"

ADR-0024 classifies Runtime as **category 3 (Runtime Service)** - "coordinates execution, owns lifecycle and
orchestration, consumes other namespaces." That names the runtime's **constitutional role** in the AI
Operating System. ADR-0020 - foundational to and cited by ADR-0024, and which names `ai/runtime/README.md`
(runtime owns execution) in its Related constitutional references - fixes how *every* technology-neutral
constitutional namespace is realized in code:
"a set of types, frozen data, and pure predicates... no IO," while "the category a namespace belongs to is
fixed by ADR-0024" and constrains the package "in addition to ADR-0020" (ADR-0024 §42). The frozen
`ai/runtime/` documents are technology-neutral specifications that "define the execution model" and "never
carry it out" (`ai/runtime/README.md` lines 52, 70). So the package that conforms to that spec owns the
execution model **as an immutable specification model**; the actual orchestration and execution over a
concrete task are the operational runtime's, built later, outside this constitutional-conformance package.
This is the same reconciliation as the category-4 adapters (Providers, Memory, Tools).

## Public API (single barrel, Engineering Rule 1)

All ten execution-model concerns from `ai/runtime/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the
Runtime Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `runtime.md`): `RuntimeInvariant` + `RUNTIME_INVARIANTS` (8); `RuntimeConcern` +
  `RUNTIME_CONCERNS` (10).
- **Execution lifecycle** (`execution-lifecycle.md`): `ExecutionLifecyclePhase` + `EXECUTION_LIFECYCLE_PHASES`
  (5 ordered: initialization, loading, validation, execution, finalization), with `executionPhaseAtOrAfter`.
- **Session lifecycle** (`session-lifecycle.md`): `SessionLifecyclePhase` + `SESSION_LIFECYCLE_PHASES`
  (3 ordered: establishment, active, closure), with `sessionPhaseAtOrAfter`.
- **Execution states** (`execution-states.md`): `ExecutionState` + `EXECUTION_STATES` (13), the state model's
  directed graph `EXECUTION_STATE_TRANSITIONS`, and the pure predicate `transitionAllowed` - the namespace's
  genuine deterministic algorithm. The Recovering transitions (to Executing on continue, to Failed on
  terminate) are sourced from `failure-recovery.md`, to which `execution-states.md` defers the failure
  handling behind Recovering; they are required for its "every path reaches Closed" invariant.
- **Execution workflow** (`execution-workflow.md`): `ExecutionWorkflowStep` + `EXECUTION_WORKFLOW_STEPS`
  (14 ordered, initialize to finalize-session), with `workflowStepAtOrAfter`.
- **Validation pipeline** (`validation-pipeline.md`): `ValidationStage` + `VALIDATION_STAGES` (3 ordered:
  constitutional, permission, policy), with `validationStageAtOrAfter`.
- **Context loading** (`context-loading.md`): `ContextInput` + `CONTEXT_INPUTS` (the four kinds of input:
  loaded-knowledge, memory, task, governing-context).
- **Execution boundaries** (`execution-boundaries.md`): `ExecutionBoundary` + `EXECUTION_BOUNDARIES` (the five
  boundaries: scope, isolation, authority, layer, resource).
- **Event lifecycle** (`event-lifecycle.md`): `RuntimeEvent` + `RUNTIME_EVENTS` (the eight lifecycle events;
  the three terminal events are mutually exclusive alternatives, so the set carries no ordering predicate).
- **Knowledge resolution** and **failure recovery** (`knowledge-resolution.md`, `failure-recovery.md`):
  principles and invariants only; their Specification sections narrate heterogeneous orchestration and failure
  facets, not closed taxonomies the model refers to by identity (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). The knowledge
  loading order follows the Knowledge Hierarchy and tiers owned by `knowledge/`, referenced not recreated.

Every exported symbol traces directly to a frozen `ai/runtime/` document. No runtime engine, orchestrator,
scheduler, or executor (`run(task)`, `orchestrate(...)`) is exported; that boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Runtime depends on the constitution, Governance, Agents,
Reasoning, and Retrieval (dependency-cruiser `NAMESPACE_DEPS.runtime = ['governance', 'agents', 'reasoning',
'retrieval']`). As a pure domain model it uses no type owned by any of them and imports no package - it
references those models, the memory/prompts/providers/tools namespaces, and the knowledge repository in prose
and never restates or imports them (ADR-0021, import only what you use; referenced-model non-restatement) - so
it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no governance rule, no business truth, no operational behavior (reasoning, agent behavior, memory,
retrieval, prompts, providers, tools), and no implementation. It defines the execution model; orchestrating,
scheduling, and executing a concrete task are the operational runtime's, which consumes this model.
