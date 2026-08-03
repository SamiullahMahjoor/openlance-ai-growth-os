# Memory Namespace, Freeze Declaration

**Status:** FROZEN (all ten memory concerns implemented, validated, and independently audited).
**Package:** `@openlance/aios-memory` (`packages/namespaces/memory`).
**Scope:** the Memory namespace Pure Domain Model, the third namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance and Providers namespaces, and the frozen `ai/` and
`knowledge/` constitution.

The Memory namespace is **immutable**. It states the retained-context model of the AI layer and owns none
of the truth, rules, retrieval, reasoning, execution, or expression around it; it never executes memory,
never stores, and never defines a database, an index, a cache, an embedding, a vector search, a
persistence technology, or code. Memory is retained and made available at runtime by the runtime, which
consumes this model. Memory holds runtime state and never business truth, and knowledge always prevails
over memory.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/memory/<file>.md` document. Each
models the two normative sections of the Memory Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed set, that classification.

| Module | Concern | Specification classification |
|---|---|---|
| `namespace.ts` | namespace-wide | `MEMORY_INVARIANTS` (9), `MEMORY_CONCERNS` (10) |
| `memory-lifecycle.ts` | Memory Lifecycle | `MEMORY_LIFECYCLE_PHASES` (3, ordered) + predicate |
| `memory-workflow.ts` | Memory Workflow | `MEMORY_WORKFLOW_STEPS` (7, ordered) + predicate |
| `memory-types.ts` | Memory Types | `MEMORY_TYPES` (6) |
| `memory-retention.ts` | Memory Retention | `MEMORY_RETENTION_CLASSES` (4, ordered) + predicate |
| `memory-retrieval.ts` | Memory Retrieval | none (evaluation deferred to runtime) |
| `memory-consistency.ts` | Memory Consistency | none (evaluation deferred to runtime) |
| `memory-validation.ts` | Memory Validation | none (evaluation deferred to runtime) |
| `memory-quality.ts` | Memory Quality | `MEMORY_QUALITY_PROPERTIES` (3) |
| `memory-boundaries.ts` | Memory Boundaries | `MEMORY_BOUNDARIES` (6) |
| `memory-evolution.ts` | Memory Evolution | none (evaluation deferred to runtime) |

The ten concerns match the ten concerns in the inventory `ai/memory/memory.md` exactly.

## Category and purity

ADR-0024 classifies Memory as category 4 (Infrastructure Adapter, "Memory storage adapters"): it owns the
retained-context boundary abstraction. Per ADR-0020 (foundational to and cited by ADR-0024), that
ownership is realized at this layer as an **immutable, stateless domain model** with no IO; the
constitution independently forbids the namespace from storing, executing, or containing code. The store
and IO-bearing adapter are the runtime's. See `docs/implementation/12-memory.md` section 2.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **28 exported types** and **59
  exported runtime values** (56 frozen catalogs and description records + 3 predicates).
- The only executable logic is the three pure, total, deterministic ordering predicates
  `lifecyclePhaseAtOrAfter`, `workflowStepAtOrAfter`, and `retentionAtLeast`, over the memory-owned
  lifecycle-phase, workflow-step, and retention-class classifications. The other concerns are immutable
  definitions; runtime evaluation over a concrete request or retained memory is deferred.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). Every exported catalog is
  `Object.freeze`d. The namespace imports nothing: its dependency edges are `[]` (it references the
  constitution and the Governance mandates but uses no governance-owned type; ADR-0021).
- 100% coverage on all executable code; full validation green end to end; two independent audits CLEAN.

## What "frozen" means

The namespace's concerns, identities, classifications, orderings, invariants, public API, ownership, and
constitutional traceability are settled. Every runtime evaluation the concerns imply (making a memory
available, detecting and resolving a conflict, applying a change; retaining and recalling memory at
runtime) is deferred to the runtime and the operational namespaces, which consume this model and do not
modify it.

## Allowed changes (no architecture review required)

Only these categories may change a frozen memory file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**,
**dependency updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a
description that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, ordering, invariant, or description; the introduction of a predicate or the reproduction
of a referenced model owned by another owner; a change of purity category (ADR-0024); the dependency
graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional
guard). This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Retrieval, Safety, Reasoning, Prompts, Tools, Agents), the Runtime, and the
operational layers consume this model and do not modify it. Agents and Reasoning draw prior context from
Memory; the Runtime hands state to it and draws context from it. They may not modify any frozen memory
file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
