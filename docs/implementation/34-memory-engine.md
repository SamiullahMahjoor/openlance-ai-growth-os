# 34. Memory Engine implementation design (Phase 4, Stage 3)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 3).** Built design-first per ADR-0007.
[ADR-0037](adr/0037-memory-engine.md) is Accepted. Package: `apps/memory-engine` (`@openlance/aios-memory-engine`).

## 1. Mandate and scope

Stage 3 builds the **Memory Engine**: the Runtime's foundational operational memory subsystem, the operational
realization of the frozen Memory namespace. It carries out operational memory management: **forming** (receive,
classify, validate, retain), **recalling** (making retained context available), and **removing** retained records, per
the frozen `@openlance/aios-memory` model.

Per [ADR-0037](adr/0037-memory-engine.md), it consumes only the frozen memory model and the substrate, and it is
**foundational**: it depends on no operational service (not the Prompt Engine, not the Provider Engine). It follows the
ADR-0035 operational discipline (apps/ package, composition-root seam, no vendor knowledge).

It owns only operational memory management. It does not own reasoning, retrieval / knowledge determination, execution,
governance rules, the session and execution lifecycles, prompts, providers, tools, or agents.

## 2. The Ambiguity Gate (resolved) and two invariants

- **The mandate's "consume Prompt Engine" was a dependency-direction conflict.** The constitution places Memory *below*
  Prompts ("Memory is a foundational service ... below the operational namespaces that build on it, depending only on
  ... the Governance namespace"; a prompt "may reference retained context"). The gate was raised and the approved
  resolution (ADR-0037, Decision 2) is: the Memory Engine consumes **no** operational service; the Prompt to Memory
  integration is a future prompt-side stage in the correct direction.
- **No retrieval / RAG (memory is not retrieval).** Indexing, lookup, and recall are deterministic and structural (by
  identity, type, scope, retention), never semantic search, embeddings, vector search, ranking, similarity, or RAG.
  Enforced by a guard test.
- **No vendor knowledge** (ADR-0035 invariant): no vendor client library, model, URL, or auth; enforced by a guard
  test.

## 3. Component inventory (implemented)

Every component consumes frozen truth and owns only operational management. Grouped by concern:

**Records and lifecycle.**
- **Memory types.** `MemoryRecord` (a retained-context record: id, frozen `MemoryType`, frozen `MemoryRetentionClass`,
  scope, content, `MemoryLifecyclePhase`), `MemoryRecordInput`, `MemoryRequest` (a recall request: scope, optional type,
  optional minimum retention).
- **`MemoryRegistry`.** Registers, discovers, and looks up retained records by id; deterministic order; no duplicate id
  (fails closed); `unregister` (removal).
- **`MemoryFactory`.** Validates a record input and builds an immutable `MemoryRecord`, filling the default phase
  (`retention`); fails closed on a blank id, an invalid `MemoryType`, an invalid `MemoryRetentionClass`, or a blank
  scope (all validated against the frozen sets).
- **`MemoryLifecycle`.** Consumes `MEMORY_LIFECYCLE_PHASES` and `lifecyclePhaseAtOrAfter`; a record is recallable while
  it is retained and not removed.

**Preparation and management (drives the frozen workflow steps).**
- **`MemoryValidator`.** Validates grounding at the `validate` step (content is grounded, not empty), gated by the
  `strictGrounding` setting; fail-closed. It applies, never restates, governance.
- **`MemoryNormalizer`.** Normalizes a record's content to a consistent structural form (structure only).
- **`MemoryIndexer`.** Maintains a deterministic structural index over retained records, by scope and by type
  (`index` / `deindex` / `idsForScope` / `idsForType`). No semantic or vector index.
- **`MemoryLookup`.** Deterministic lookup of retained records by id, scope, or type (via the indexer and registry),
  in registration order.
- **`MemoryResolver`.** The `recall` operation: given a `MemoryRequest`, deterministically resolves the recallable
  records for a scope, filtered by type, lifecycle recallability, and `retentionAtLeast` (consuming the frozen
  retention ordering). It makes retained context available; it retrieves no external knowledge.

**Observability and cross-cutting.**
- **`MemoryMetrics`, `MemoryStatistics`, `MemoryDiagnostics`.** Operational counters (formations, recalls, removals,
  failures, validation failures) and a read-only view.
- **`MemoryEvents`, `MEMORY_EVENT_TYPES`.** Emits framework events (formed, recalled, removed, failed) via the frozen
  `createEvent` and `EVENT_BUS`.
- **`MemoryConfiguration`, `MemoryEngineSettings`.** Engine-owned operational settings (`strictGrounding`).
- **`MemoryError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `MEMORY.*` codes.
- **`MemoryPluginBridge`, `MemoryPlugin`.** Adopts record-carrying plugins into the registry and index, consuming the
  frozen `PluginManifest` type and validating each record through the `MemoryFactory`.
- **`MemoryManager`.** The facade and DI entry (`MEMORY_MANAGER`): form a record, recall records for a request, remove a
  record, and read statistics and diagnostics; drives the frozen `MEMORY_WORKFLOW_STEPS` order (consuming
  `workflowStepAtOrAfter`) and emits events.
- **`memoryEngineModule`, `MEMORY_MANAGER`.** The `di` `Module` and token, registered through the frozen
  composition-root seam (ADR-0026).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 3 disposition |
|---|---|---|
| The memory model: lifecycle phases, workflow steps, types, retention classes, and their predicates | `@openlance/aios-memory` (Phase 2B) | consume the arrays and predicates; restate none |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Knowledge determination and loading (retrieval), execution, the session/execution lifecycles, governance enforcement, reasoning, prompts, providers | ai/retrieval, ai/runtime, ai/governance, ai/reasoning, and the Prompt/Provider engines | referenced by boundary; the engine performs none of them and depends on no operational service |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-memory-engine -> {
@openlance/aios-memory, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (memory) and `app -> substrate` (the rest); all legal, no rule and
no namespace edge changes. There is **no** `app -> app` edge: the Memory Engine is foundational and consumes no
operational service. The composition root, config, and logging are test-only devDependencies; the runtime model is
referenced conceptually (memory is scoped against runtime lifecycles), not a Stage-3 source dependency.

## 6. What it must not do

Reason, determine or load external knowledge, perform retrieval / RAG / semantic search / embeddings / ranking,
execute providers or prompts, run reasoning, orchestrate or schedule, execute agents or tools, run or restate governance
rules, or name a vendor / import a client library. It forms, indexes, recalls, and removes retained records, and
nothing else.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / invalid type / invalid retention / blank scope),
  lifecycle (recallability via the frozen predicate), validator (grounding, strict / non-strict), normalizer, indexer
  (index / deindex / by-scope / by-type), lookup, resolver (scope, type, recallability, minimum retention via
  `retentionAtLeast`), metrics, events, configuration, plugin bridge, and the manager (form / recall / remove).
  Plus the no-vendor-knowledge and no-retrieval guards.
- **Fail-closed.** The public API never throws; every failure is a `Result` error.
- **Benchmarks (ADR-0022 Rule 5).** Registration, lookup, indexing, normalization, and validation, each with a recorded
  baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0037 and this design are the Stage 3 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 4 (Retrieval Engine) is not begun.
