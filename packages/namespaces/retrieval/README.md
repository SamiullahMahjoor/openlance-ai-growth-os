# @openlance/aios-retrieval

The immutable, technology-neutral **domain model** of the AI layer's knowledge-determination abstraction.

- **Constitution:** `ai/retrieval/` (id `OL-AI-RETRIEVAL-README`), the **Specification** authority layer.
- **Category:** Infrastructure Adapter (ADR-0024, category 4) - it owns the AI layer's determination
  boundary to the knowledge repository; realized at this layer per ADR-0020 as an **immutable, stateless
  domain model** (no IO). ADR-0024 does not enumerate Retrieval among its examples; its category is
  declared here per ADR-0024 (no new ADR). **Design:** [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states retrieval truth as strongly-typed classifications, immutable definitions and invariants, and
pure deterministic predicates that express the retrieval specification verbatim. Retrieval is the
knowledge-determination layer: this package defines how the minimum sufficient, dependency-complete,
authority-correct set of knowledge a task requires is discovered, selected, expanded, prioritized,
assembled, and validated. It **never loads knowledge, never assembles the execution context, never
executes, and never defines a search engine, index, embedding, ranking, database, algorithm, or code**
(`ai/retrieval/README.md`, ADR-0020): retrieval determines the set to load and produces the retrieval
result; the runtime loads it (`ai/runtime/knowledge-resolution.md`) and assembles the execution context
(`ai/runtime/context-loading.md`). It consumes the knowledge repository one-directionally and never owns,
writes, or amends business truth. It owns no runtime, no mutable state, no lifecycle, no events, no IO,
and no services.

### Why a Pure Domain Model for an "Infrastructure Adapter"

ADR-0024 does not name Retrieval in its examples; its category is declared in this design per ADR-0024.
Retrieval is a foundational service that consumes the knowledge repository (dependency-map §68 groups it
with Providers and Memory), so it is category 4 (Infrastructure Adapter): the AI layer's determination
boundary to the knowledge repository. ADR-0020 - foundational to and cited by ADR-0024 - fixes how *every*
technology-neutral constitutional namespace is realized in code: "a set of types, frozen data, and pure
predicates... no IO," while "the category a namespace belongs to is fixed by ADR-0024." The constitution
independently forbids this namespace from searching, loading, or containing code. So Retrieval owns the
determination boundary **as an immutable specification model**; the actual determination-execution over a
real task and repository is the runtime's. Those runtime evaluations (discovering, selecting, resolving,
prioritizing, assembling, and validating a concrete result) are deferred to the runtime, exactly as a
governance concern defers its runtime evaluation.

## Public API (single barrel, Engineering Rule 1)

All ten retrieval concerns from `ai/retrieval/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of
the Retrieval Document Standard), and, where the **Specification** enumerates a genuine closed domain set,
that classification too.

- **Namespace** (`README.md`, `retrieval.md`): `RetrievalInvariant` + `RETRIEVAL_INVARIANTS` (the nine
  retrieval invariants every concern instantiates); `RetrievalConcern` + `RETRIEVAL_CONCERNS` (the ten
  concerns). The namespace is deterministic and scalable.
- **Retrieval lifecycle** (`retrieval-lifecycle.md`): principles, invariants, and `RetrievalLifecyclePhase`
  + `RETRIEVAL_LIFECYCLE_PHASES` (the five ordered phases: request, determination, assembly, validation,
  result), with the pure predicate `retrievalPhaseAtOrAfter`.
- **Retrieval workflow** (`retrieval-workflow.md`): principles, invariants, and `RetrievalWorkflowStep` +
  `RETRIEVAL_WORKFLOW_STEPS` (the eight ordered steps: receive-request, discover, select,
  resolve-dependencies, prioritize, assemble, validate, produce-result), with the pure predicate
  `retrievalStepAtOrAfter`.
- **Knowledge discovery / selection**, **dependency resolution**, **context prioritization / assembly**,
  and **loading strategy** (`knowledge-discovery.md`, `knowledge-selection.md`,
  `dependency-resolution.md`, `context-prioritization.md`, `context-assembly.md`, `loading-strategy.md`):
  principles and invariants; the concrete determination over a task and repository is deferred to the
  runtime. The loading tiers (Critical/Required/Optional/Contextual) and the Knowledge Hierarchy are owned
  by `knowledge/`, referenced not recreated.
- **Retrieval boundaries** (`retrieval-boundaries.md`): principles, invariants, and `RetrievalBoundary` +
  `RETRIEVAL_BOUNDARIES` (the five architectural boundaries: determination, truth, governance, layer,
  technology).
- **Retrieval validation** (`retrieval-validation.md`): principles, invariants, and
  `RetrievalValidationDimension` + `RETRIEVAL_VALIDATION_DIMENSIONS` (the five dimensions a result is
  validated against: ownership, authority, dependency-completeness, boundaries, governance-permission);
  the rules are owned by `knowledge/` and `ai/governance/`, applied not restated.

Every exported symbol traces directly to a frozen `ai/retrieval/` document. No search, index, loader, or
runtime-context evaluator (`discover(task)`, `select(candidates)`, `retrieve(task)`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Retrieval depends on the constitution and the
Governance namespace, and consumes the knowledge repository one-directionally (dependency-cruiser
`NAMESPACE_DEPS.retrieval = ['governance']`; `knowledge/` is a document layer, not a package). As a pure
domain model it uses no governance-owned type and imports no package - it references governance rules and
the knowledge repository in prose and never restates or imports them (ADR-0021, import only what you use;
referenced-model non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no loading, execution, execution-context assembly, reasoning, memory, prompt, provider, tool,
agent, evaluation, safety, or operations behavior, no business truth, and no search technology. It
determines the knowledge to load; it never loads or uses it. Loading the determined set and assembling
the execution context are performed by the runtime, which consumes this model.
