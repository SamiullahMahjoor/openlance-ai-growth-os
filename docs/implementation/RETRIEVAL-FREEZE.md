# Retrieval Namespace, Freeze Declaration

**Status:** FROZEN (all ten retrieval concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-retrieval` (`packages/namespaces/retrieval`).
**Scope:** the Retrieval namespace Pure Domain Model, the fourth namespace of Phase 2B, built on top of
the immutable Phase 2A substrate, the frozen Governance, Providers, and Memory namespaces, and the frozen
`ai/` and `knowledge/` constitution.

The Retrieval namespace is **immutable**. It states the knowledge-determination model of the AI layer and
owns none of the truth, rules, loading, or execution around it; it never loads knowledge, never assembles
the execution context, never executes, and never defines a search engine, index, embedding, ranking,
database, algorithm, or code. Retrieval determines the set to load and produces the retrieval result; the
runtime loads it and assembles the execution context. Retrieval consumes the knowledge repository
one-directionally and never owns, writes, or amends business truth.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/retrieval/<file>.md` document. Each
models the two normative sections of the Retrieval Document Standard (Principles, Invariants) and, where
the Specification enumerates a genuine closed set, that classification.

| Module | Concern | Specification classification |
|---|---|---|
| `namespace.ts` | namespace-wide | `RETRIEVAL_INVARIANTS` (9), `RETRIEVAL_CONCERNS` (10) |
| `retrieval-lifecycle.ts` | Retrieval Lifecycle | `RETRIEVAL_LIFECYCLE_PHASES` (5, ordered) + predicate |
| `retrieval-workflow.ts` | Retrieval Workflow | `RETRIEVAL_WORKFLOW_STEPS` (8, ordered) + predicate |
| `knowledge-discovery.ts` | Knowledge Discovery | none (determination deferred to runtime) |
| `knowledge-selection.ts` | Knowledge Selection | none (determination deferred to runtime) |
| `dependency-resolution.ts` | Dependency Resolution | none (determination deferred to runtime) |
| `context-prioritization.ts` | Context Prioritization | none (determination deferred to runtime) |
| `context-assembly.ts` | Context Assembly | none (determination deferred to runtime) |
| `loading-strategy.ts` | Loading Strategy | none (determination deferred to runtime) |
| `retrieval-boundaries.ts` | Retrieval Boundaries | `RETRIEVAL_BOUNDARIES` (5) |
| `retrieval-validation.ts` | Retrieval Validation | `RETRIEVAL_VALIDATION_DIMENSIONS` (5) |

The ten concerns match the ten concerns in the inventory `ai/retrieval/retrieval.md` exactly.

## Category and purity

ADR-0024 does not enumerate Retrieval among its examples; per ADR-0024 §42 its category is declared here
(no new ADR). Retrieval is a foundational service that consumes the knowledge repository (grouped with
Providers and Memory in dependency-map §68), so it is category 4 (Infrastructure Adapter): the AI layer's
determination boundary to the knowledge repository. Per ADR-0020 (foundational to and cited by ADR-0024),
that ownership is realized at this layer as an **immutable, stateless domain model** with no IO; the
constitution independently forbids the namespace from searching, loading, or containing code. The
determination-execution over a real task and repository is the runtime's. See
`docs/implementation/13-retrieval.md` section 2.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **26 exported types** and **54
  exported runtime values** (52 frozen catalogs and description records + 2 predicates).
- The only executable logic is the two pure, total, deterministic ordering predicates
  `retrievalPhaseAtOrAfter` and `retrievalStepAtOrAfter`, over the retrieval-owned lifecycle-phase and
  workflow-step classifications. The other concerns are immutable definitions; runtime evaluation over a
  concrete task or repository state is deferred.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). Every exported catalog is
  `Object.freeze`d. The namespace imports nothing: its dependency edges are `[]` (it references the
  constitution, the Governance mandates, and the knowledge repository but uses no governance-owned type
  and imports no package; ADR-0021).
- 100% coverage on all executable code; full validation green end to end; two independent audits CLEAN.

## What "frozen" means

The namespace's concerns, identities, classifications, orderings, invariants, public API, ownership, and
constitutional traceability are settled. Every runtime evaluation the concerns imply (discovering,
selecting, resolving, prioritizing, assembling, and validating a concrete result; loading it) is deferred
to the runtime and the operational namespaces, which consume this model and do not modify it. The loading
tiers, the Knowledge Hierarchy, and the knowledge ownership/authority/dependency maps are owned by
`knowledge/`; the permission and validation rules by `ai/governance/`; all are referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen retrieval file without an architecture change process, each
still running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**,
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

The next namespaces (Safety, Reasoning, Prompts, Tools, Agents), the Runtime, and the operational layers
consume this model and do not modify it. Reasoning and Prompts depend on Retrieval; the Runtime loads what
Retrieval determines. They may not modify any frozen retrieval file except under the allowed-changes
policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
