---
id: ADR-0037
title: The Memory Engine is the Runtime's foundational operational memory subsystem; it consumes only the frozen memory model and the substrate, indexes and recalls retained records deterministically (never retrieval), and depends on no operational service
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0037: The Memory Engine is the Runtime's foundational operational memory subsystem; it consumes only the frozen memory model and the substrate, indexes and recalls retained records deterministically (never retrieval), and depends on no operational service

## Status

**Accepted** (Phase 4, Stage 3). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, ADR-0035, and ADR-0036.

## Context

Phase 4 builds the operational layer as `apps/`-layer services that register through the frozen composition-root seam
(ADR-0026) and consume frozen models, re-owning none (ADR-0035: Provider Engine; ADR-0036: Prompt Engine). Stage 3 is
the Memory Engine. A full source reading (the `ai/memory/` guide and the frozen `@openlance/aios-memory` concern models
for lifecycle, workflow, types, and retention; `ai/retrieval/README.md`; `ai/runtime/README.md`; the Stage 1 and Stage
2 engines and ADR-0035/ADR-0036) fixes the facts this ADR honors:

- **Memory owns the retained-context model, and is a foundational service below the operational namespaces.**
  `ai/memory/README.md`: the namespace "owns one thing: the architectural model of how the AI Operating System
  remembers"; it "never executes it"; and, decisively, **"Memory is a foundational service of the AI layer, sitting
  below the operational namespaces that build on it, depending only on the constitution and the Governance namespace."**
  The frozen `@openlance/aios-memory` exports only types, ordered arrays (`MEMORY_LIFECYCLE_PHASES`,
  `MEMORY_WORKFLOW_STEPS`, `MEMORY_TYPES`, `MEMORY_RETENTION_CLASSES`), and pure predicates
  (`lifecyclePhaseAtOrAfter`, `workflowStepAtOrAfter`, `retentionAtLeast`); it performs no execution, storage, or IO
  (ADR-0020). There is no operational store or index in the frozen model to duplicate.
- **Memory is not retrieval.** `ai/memory/README.md`: "Memory is not retrieval ... Memory never discovers, selects, or
  loads knowledge; those are owned by ai/retrieval/," and memory "never [defines] a store, a database, an index, a
  cache, an embedding, a vector search." `ai/retrieval/README.md` confirms retrieval owns discovery/selection/ranking
  over the knowledge repository. So the operational engine's indexing, lookup, and recall are **deterministic
  structural management of retained records** (by identity, type, scope, retention), never semantic search,
  embeddings, vector search, ranking, or RAG.
- **Memory recall makes retained context available, it does not execute.** The frozen `recall` workflow step: "the
  relevant and fresh memory is made available to reasoning, without replacing the retrieved knowledge that always
  prevails over it." Memory holds runtime state, never business truth; knowledge always prevails.

## Decision

1. **Stage 3 is a new `apps/`-layer package, `@openlance/aios-memory-engine`, the operational realization of the frozen
   Memory namespace.** It carries out operational memory management: forming (receive, classify, validate, retain),
   recalling (making retained context available), and removing retained records, driving the frozen
   `MEMORY_LIFECYCLE_PHASES`, `MEMORY_WORKFLOW_STEPS`, `MEMORY_TYPES`, and `MEMORY_RETENTION_CLASSES` and their ordering
   predicates. It follows the ADR-0035 operational-layer pattern (`apps/*`, composition-root seam, no vendor knowledge).

2. **It is foundational: it depends on no operational service.** It consumes only the frozen
   `@openlance/aios-memory` model and the substrate (`di`, `events`, `errors`, `plugins`, `kernel`). It does **not**
   consume the Prompt Engine or the Provider Engine. This honors "Memory is a foundational service ... below the
   operational namespaces that build on it, depending only on the constitution and the Governance namespace." The
   integration by which a prompt references retained memory context is the constitutionally-correct **Prompt to Memory**
   direction, owned by a future prompt-side stage, and is not built here; building a Memory to Prompt dependency would
   invert the layering and risk a cycle.

3. **Indexing, lookup, and recall are deterministic and structural, never retrieval.** The `MemoryIndexer`,
   `MemoryLookup`, and `MemoryResolver` operate only over the engine's own retained records, keyed by identity, type,
   scope, and retention class, in deterministic order. They perform no semantic search, embedding, vector search,
   ranking, similarity, or RAG, and load no external knowledge (that is `ai/retrieval/`). The boundary is enforced
   structurally by a guard test that fails the build on any retrieval-technique token in `src/`.

4. **No vendor knowledge (the ADR-0035 invariant carries forward).** The engine holds no vendor client library, model,
   API URL, or authentication; enforced by a source-scanning guard test.

5. **Governance is applied by the runtime, not by this engine.** Retention, removal, and change of memory occur within
   the rules owned by `ai/governance/`; enforcing those rules is the future governance enforcement engine's, not this
   engine's. The Memory Engine is deterministic and fail-closed; it neither enforces nor bypasses governance and mints
   or requires no clearance, because forming, recalling, and removing retained context is foundational data management,
   not the significant provider execution that the ADR-0035 clearance seam gates. Memory holds runtime state and never
   business truth; knowledge always prevails.

6. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/34-memory-engine.md` are the Stage 3 design
   artifacts.

## Rationale

Naming the operational realization of the Memory namespace is what the constitution anticipates and what ADR-0035
generalized. Alternatives considered and rejected: consuming the Prompt Engine as the mandate literally listed (would
invert the constitutional layering, since Memory is foundational and below Prompts, and risk a Prompt to Memory cycle);
semantic or RAG indexing (retrieval's domain, forbidden by the memory boundary); a memory governance clearance (an
unwarranted second governance model, since memory data management is not the significant execution ADR-0035 gates); and
re-owning the memory model (would duplicate the frozen model).

## Consequences

- The `apps/` layer gains a third operational service, and its first **foundational** one: a service that consumes no
  other operational service. Its `src` edge set is `{ memory, di, events, errors, plugins, kernel }` (six).
- The Prompt to Memory integration (a prompt referencing retained memory context) is deferred to a future prompt-side
  stage, in the constitutionally-correct direction.
- The engine remains non-executing and non-retrieving; a later governance enforcement engine governs its
  retention/removal, and a later retrieval engine owns knowledge determination.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/memory/README.md` and the frozen
`ai/memory/memory-lifecycle.md`, `memory-workflow.md`, `memory-types.md`, and `memory-retention.md` (the memory model,
phases, steps, types, and retention classes), `ai/retrieval/README.md` (retrieval owns knowledge determination;
memory is not retrieval), `ai/runtime/README.md` (the runtime owns the session and execution lifecycles a memory is
scoped against), `ai/governance/` (owns the rules that govern retention and removal), and ADR-0020 ("Governance
provides truth. Runtime performs enforcement").

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer), ADR-0026 (the composition-root seam), ADR-0005
(frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024 (the namespace model,
dependency policy, and purity categories). Consumes the frozen Phase 2B `@openlance/aios-memory` model. Relates to
ADR-0036 (the Prompt Engine, whose future Prompt to Memory integration is the correct direction).
