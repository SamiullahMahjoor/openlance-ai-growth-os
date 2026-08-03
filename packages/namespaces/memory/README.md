# @openlance/aios-memory

The immutable, technology-neutral **domain model** of the AI layer's retained-context abstraction.

- **Constitution:** `ai/memory/` (id `OL-AI-MEMORY-README`), the **Specification** authority layer.
- **Category:** Infrastructure Adapter (ADR-0024, category 4, "Memory storage adapters") - it owns the
  retained-context boundary abstraction; realized at this layer per ADR-0020 as an **immutable,
  stateless domain model** (no IO). **Design:** [docs/implementation/12-memory.md](../../../docs/implementation/12-memory.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states memory truth as strongly-typed classifications, immutable definitions and invariants, and
pure deterministic predicates that express the memory specification verbatim. Memory is the
retained-context layer: this package defines how retained context is formed, held, made available, kept
consistent, validated, kept fresh, bounded, and evolved. It **never executes memory, never stores, never
orchestrates, and never defines a store, a database, an index, a cache, an embedding, a vector search, a
persistence technology, or code** (`ai/memory/README.md`, ADR-0020): memory is retained and made
available within the session and execution lifecycles owned by `ai/runtime/`. It holds runtime state and
never business truth, and knowledge always prevails over memory. It owns no runtime, no mutable state, no
lifecycle, no events, no IO, and no services.

### Why a Pure Domain Model for an "Infrastructure Adapter"

ADR-0024 classifies Memory as category 4 (Infrastructure Adapter, "Memory storage adapters"): it owns the
retained-context boundary abstraction. ADR-0020 - foundational to and cited by ADR-0024 - fixes how
*every* technology-neutral constitutional namespace is realized in code: "a set of types, frozen data,
and pure predicates... no IO," while "the category a namespace belongs to is fixed by ADR-0024." The
frozen constitution independently forbids this namespace from storing, executing, or containing code. So
Memory owns the retained-context boundary **as an immutable specification model**; the storage and
IO-bearing adapter are the runtime's/implementation's. Runtime evaluations over a concrete request and a
concrete retained memory (making a memory available, detecting a conflict, applying a change) are deferred
to the runtime, exactly as a governance concern defers its runtime evaluation.

## Public API (single barrel, Engineering Rule 1)

All ten memory concerns from `ai/memory/`, plus the namespace-wide truth, are implemented as an immutable
model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the
Memory Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `memory.md`): `MemoryInvariant` + `MEMORY_INVARIANTS` (the nine memory
  invariants every concern instantiates); `MemoryConcern` + `MEMORY_CONCERNS` (the ten concerns). The
  namespace is deterministic, repeatable, and scalable.
- **Memory lifecycle** (`memory-lifecycle.md`): principles, invariants, and `MemoryLifecyclePhase` +
  `MEMORY_LIFECYCLE_PHASES` (the three ordered phases: formation, retention, removal), with the pure
  predicate `lifecyclePhaseAtOrAfter`.
- **Memory workflow** (`memory-workflow.md`): principles, invariants, and `MemoryWorkflowStep` +
  `MEMORY_WORKFLOW_STEPS` (the seven ordered steps: receive, classify, validate, retain, recall,
  reconcile, evolve-or-remove), with the pure predicate `workflowStepAtOrAfter`.
- **Memory types** (`memory-types.md`): principles, invariants, and `MemoryType` + `MEMORY_TYPES` (the
  six architectural categories: working, session, conversational, episodic, procedural, organizational).
- **Memory retention** (`memory-retention.md`): principles, invariants, and `MemoryRetentionClass` +
  `MEMORY_RETENTION_CLASSES` (the four classes ordered by persistence: temporary, session, long-term,
  permanent), with the pure predicate `retentionAtLeast`.
- **Memory retrieval** (`memory-retrieval.md`): principles and invariants; making a concrete memory
  available is deferred to the runtime.
- **Memory consistency** (`memory-consistency.md`): principles and invariants; detecting a concrete
  conflict is deferred to the runtime.
- **Memory validation** (`memory-validation.md`): principles and invariants; the governance validation
  rules are owned by `ai/governance/constitutional-validation.md`, referenced not restated.
- **Memory quality** (`memory-quality.md`): principles, invariants, and `MemoryQualityProperty` +
  `MEMORY_QUALITY_PROPERTIES` (freshness, completeness, traceability).
- **Memory boundaries** (`memory-boundaries.md`): principles, invariants, and `MemoryBoundary` +
  `MEMORY_BOUNDARIES` (the six architectural boundaries: truth, knowledge, reasoning, execution,
  governance, implementation).
- **Memory evolution** (`memory-evolution.md`): principles and invariants; memory does not learn, train,
  or optimize itself.

Every exported symbol traces directly to a frozen `ai/memory/` document. No store, index, search, or
runtime-context evaluator (`recall(request)`, `store(memory)`, `detectConflict(...)`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Memory depends on the constitution and the Governance
namespace, and on no other namespace (dependency-cruiser `NAMESPACE_DEPS.memory = ['governance']`). As a
pure domain model it uses no governance-owned type - it references governance rules in prose and never
restates or imports them (ADR-0021, import only what you use; referenced-model non-restatement) - so it
imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no execution, orchestration, knowledge retrieval, reasoning, prompt, provider, tool, agent,
evaluation, or operations behavior, no business truth, and no store or persistence technology. It offers
retained context; it does not store or use it. Retaining and making memory available at runtime are
performed by the runtime, which consumes this model.
