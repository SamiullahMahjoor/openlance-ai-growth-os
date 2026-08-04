# Memory Engine, Freeze Declaration (Phase 4, Stage 3)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-memory-engine` (`apps/memory-engine`).
**Scope:** Phase 4, Stage 3: the Runtime's **foundational** operational memory subsystem, the operational realization of
the frozen Memory namespace, built on the frozen Phase 2A substrate and the frozen `@openlance/aios-memory` model, and
registered through the frozen Phase 3 composition-root seam. Decision: [ADR-0037](adr/0037-memory-engine.md) (Accepted).
Design: [docs/implementation/34-memory-engine.md](34-memory-engine.md).

It is the third operational stage and the first **foundational** one: a service that consumes no other operational
service. It performs real management work (form, recall, remove) but **executes nothing** and **retrieves nothing**.

## What this stage owns

Operational memory management: **forming** (receive, classify, validate, retain), **recalling** (making retained
context available), and **removing** retained records, per the frozen `@openlance/aios-memory` model. It re-owns
nothing the Memory namespace owns; the session and execution lifecycles a memory is scoped against are the runtime's,
knowledge determination is retrieval's, and enforcing retention/removal rules is a future governance engine's.

## The Ambiguity Gate (resolved)

The mandate's consume list included the Prompt Engine, which conflicts with the constitutional layering ("Memory is a
foundational service ... below the operational namespaces that build on it, depending only on ... the Governance
namespace"; a prompt "may reference retained context"). The gate was raised and the approved resolution (ADR-0037,
Decision 2) is: the Memory Engine consumes **no** operational service; the Prompt to Memory integration is a future
prompt-side stage in the constitutionally-correct direction.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`MemoryRecord`, `MemoryRecordInput`, `MemoryRequest`, `MemoryStatistics`, `MemoryDiagnostics`); type-only, excluded from coverage |
| `src/errors.ts` | `MemoryError` (a `BaseError` subtype, `infrastructure`, `MEMORY.*` codes) |
| `src/registry.ts` | `MemoryRegistry` (register / has / get / list / unregister of retained records) |
| `src/factory.ts` | `MemoryFactory` (validates + freezes a `MemoryRecord`; classifies against the frozen sets) |
| `src/lifecycle.ts` | `MemoryLifecycle` (consumes `MEMORY_LIFECYCLE_PHASES` / `lifecyclePhaseAtOrAfter`) |
| `src/validator.ts` | `MemoryValidator` (grounding validation before retention) |
| `src/normalizer.ts` | `MemoryNormalizer` (structural normalization) |
| `src/indexer.ts` | `MemoryIndexer` (deterministic structural index by scope and type) |
| `src/lookup.ts` | `MemoryLookup` (deterministic lookup by id / scope / type) |
| `src/resolver.ts` | `MemoryResolver` (the `recall` step; consumes `retentionAtLeast`) |
| `src/metrics.ts` | `MemoryMetrics` |
| `src/events.ts` | `MemoryEvents`, `MEMORY_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `MemoryConfiguration`, `MemoryEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `MemoryPluginBridge`, `MemoryPlugin` (consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `MemoryManager` (the facade + DI entry; drives `MEMORY_WORKFLOW_STEPS`), `MemoryManagerOptions` |
| `src/module.ts` | `memoryEngineModule`, `MEMORY_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Memory is not retrieval; no RAG; no vendor knowledge

Indexing, lookup, and recall are **deterministic and structural** (by identity, type, scope, retention), never
semantic search, embeddings, vector search, ranking, similarity, or RAG, and they load no external knowledge (that is
`ai/retrieval/`). `recall` makes **retained** context available; it retrieves nothing. The engine holds **no vendor
knowledge**. Both boundaries are enforced structurally by `src/`-scanning guard tests (`no-retrieval.test.ts` and
`no-vendor-knowledge.test.ts`).

## Foundational: no operational-service dependency

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-memory-engine -> {
@openlance/aios-memory, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (memory) and `app -> substrate` (the rest); there is **no**
`app -> app` edge. All legal, no dependency-cruiser rule and no namespace edge changed. The composition root, config,
and logging are test-only devDependencies; the runtime model is referenced conceptually, not a Stage-3 source
dependency.

## Consume, never recreate

Consumes the frozen `@openlance/aios-memory` model (`MEMORY_LIFECYCLE_PHASES`, `MEMORY_WORKFLOW_STEPS`, `MEMORY_TYPES`,
`MEMORY_RETENTION_CLASSES`, and the predicates `lifecyclePhaseAtOrAfter` / `workflowStepAtOrAfter` / `retentionAtLeast`)
and the frozen substrate. It recreates no container, event bus, error taxonomy, or plugin host, and registers through
the frozen composition-root extension seam (ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Immutability

The built `MemoryRecord`, `MemoryStatistics`, `MemoryDiagnostics`, the adopted-ids array, and the module consts are all
`Object.freeze`d; the indexer returns defensive copies of its id lists, and lookup and recall return fresh arrays of
already-frozen records. Both audits verified the freezes empirically.

## Governance

Retention, removal, and change of memory occur within the rules owned by `ai/governance/`; enforcing them is the future
governance enforcement engine's, not this engine's. The Memory Engine is deterministic and fail-closed; it neither
enforces nor bypasses governance and mints or requires no clearance, because forming, recalling, and removing retained
context is foundational data management, not the significant provider execution the ADR-0035 clearance seam gates.
Memory holds runtime state and never business truth; knowledge always prevails.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 35 packages / 37 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 15 executable modules (barrel and the type-only
  `types.ts` excluded per ADR-0015); 27 tests; benchmarks recorded (register, index, lookup, normalize, validate); no
  `.only` / `.skip`.
- Two independent source audits, both CLEAN (no Critical/High/Medium). Audit 1 (constitutional ownership, foundational
  no-operational-dependency, memory-is-not-retrieval, no-second-governance, vendor neutrality, traceability) and Audit 2
  (dependency, immutability, determinism, implementation correctness, coverage honesty, regression). Two Low hygiene
  notes were addressed: the indexer now returns defensive copies of its id lists, and the factory now validates the
  lifecycle `phase` against the frozen `MEMORY_LIFECYCLE_PHASES` (consistent with its type and retention validation).

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase
3 packages, and the frozen Phase 4 Stage 1 (Provider Engine) and Stage 2 (Prompt Engine) unchanged (`git diff HEAD --
ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine .dependency-cruiser.cjs tools/` empty). The change set
is the new `apps/memory-engine/` package, ADR-0037, the design doc, this freeze doc, the ADR index row, the graph
snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Memory Engine's public API, the foundational (no operational-service dependency) boundary, the
memory-is-not-retrieval and no-vendor-knowledge invariants, the consume-not-recreate boundary, the deterministic and
structural indexing / lookup / recall, the fail-closed `Result` contract, the immutable return shapes, and the
dependency edges are settled for Stage 3. Knowledge determination (retrieval), execution, and the enforcement of
retention/removal governance are later stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
memory-engine file without an architecture change process, each still running the full validation pipeline. Any change
to the public API, the memory-is-not-retrieval or no-vendor-knowledge invariant, the foundational boundary, the
consume-not-recreate boundary, the fail-closed contract, or the dependency edges is an architectural modification
requiring a new or superseding ADR, an architecture review, an independent audit, and full validation.

## Do not begin Stage 4

Phase 4 Stage 4 (Retrieval Engine) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
