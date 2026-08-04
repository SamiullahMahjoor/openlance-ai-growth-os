# @openlance/aios-memory-engine

The AIOS **Memory Engine** (Phase 4, Stage 3): the Runtime's **foundational** operational memory subsystem, the
operational realization of the frozen Memory namespace. It carries out operational memory management: **forming**
(receive, classify, validate, retain), **recalling** (making retained context available), and **removing** retained
records, per the frozen `@openlance/aios-memory` model.

- **Layer:** `app` (`apps/*`), the third Phase 4 operational service and the first **foundational** one.
- **Design:** [docs/implementation/34-memory-engine.md](../../docs/implementation/34-memory-engine.md).
  **Decision:** [ADR-0037](../../docs/implementation/adr/0037-memory-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-memory` model. It **consumes, never recreates**: the memory
model (lifecycle phases, workflow steps, types, retention classes, and their ordering predicates). It is **foundational**
and depends on **no operational service** (not the Prompt Engine, not the Provider Engine): "Memory is a foundational
service ... below the operational namespaces that build on it, depending only on ... the Governance namespace." A
prompt referencing retained memory context is the constitutionally-correct **Prompt to Memory** direction, owned by a
future prompt-side stage.

## Memory is not retrieval; no RAG

Indexing, lookup, and recall are **deterministic and structural** (by identity, type, scope, retention class), never
semantic search, embeddings, vector search, ranking, similarity, or RAG, and they load no external knowledge (that is
`ai/retrieval/`). `recall` makes **retained** context available to reasoning; it retrieves nothing. Enforced by a
`src/`-scanning guard test.

## No vendor knowledge (ADR-0037)

The engine holds **no vendor knowledge** (no vendor client library, model, API URL, or auth); enforced by a
`src/`-scanning guard test. It executes nothing and holds runtime state only; knowledge always prevails over memory.

## Public API (single barrel, Engineering Rule 1)

- `MemoryManager` (and `memoryEngineModule`, `MEMORY_MANAGER`): the engine facade and its DI module, registered through
  the frozen composition root's extension seam (ADR-0026).
- `MemoryRegistry`, `MemoryFactory`, `MemoryLifecycle`, `MemoryValidator`, `MemoryNormalizer`, `MemoryIndexer`,
  `MemoryLookup`, `MemoryResolver`, `MemoryMetrics`, `MemoryEvents`, `MemoryConfiguration`, `MemoryPluginBridge`: the
  operational components.
- `MemoryRecord`, `MemoryRecordInput`, `MemoryRequest`, `MemoryStatistics`, `MemoryDiagnostics`, `MemoryEngineSettings`,
  `MemoryPlugin`, `MemoryId`, `MemoryScope`: the read-only types.
- `MemoryError`: a `BaseError` subtype (`infrastructure`) with `MEMORY.*` codes; failures ride the `Result` channel.

## Dependency direction

`@openlance/aios-memory-engine -> { @openlance/aios-memory, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges, recorded in
`dependency-graph.snapshot.json`). `app -> namespace` (memory) and `app -> substrate` (the rest); **no** `app -> app`
edge (foundational). All legal, no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies.

## Non-responsibilities

No reasoning, retrieval / knowledge determination, RAG / semantic search / embeddings / ranking, provider or prompt
execution, orchestration, scheduling, agent or tool execution, governance-rule enforcement, session/execution lifecycle
ownership, or vendor client library. It forms, indexes, recalls, and removes retained records, and nothing else.
