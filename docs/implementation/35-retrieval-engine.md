# 35. Retrieval Engine implementation design (Phase 4, Stage 4)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 4).** Built design-first per ADR-0007.
[ADR-0038](adr/0038-retrieval-engine.md) is Accepted. Package: `apps/retrieval-engine` (`@openlance/aios-retrieval-engine`).

## 1. Mandate and scope

Stage 4 builds the **Retrieval Engine**: the Runtime's operational knowledge-determination subsystem, the operational
realization of the frozen Retrieval namespace. It carries out operational retrieval over the frozen workflow (receive
request, **discover**, **select**, **resolve dependencies**, **prioritize**, **assemble**, **validate**, produce
result) over provided candidates, and produces a validated `RetrievalResult`. It **determines and stops**; it never
loads, assembles the execution context, or executes.

Per [ADR-0038](adr/0038-retrieval-engine.md), it consumes only the frozen retrieval model and the substrate, and it is
**foundational**: it depends on no operational service. It follows the ADR-0035 operational discipline (apps/ package,
composition-root seam, no vendor knowledge).

It owns only operational knowledge determination. It does not own reasoning, provider execution, prompt assembly,
memory retention, governance rules, or runtime orchestration.

## 2. The Ambiguity Gate (resolved) and two invariants

- **The mandate's "consume Memory Engine" was a frozen-boundary conflict.** The frozen `retrieval-boundaries` invariant
  states "a retrieval never reaches into ... memory," and discovery draws "only from the canonical knowledge
  repository." Memory is retained runtime state, not canonical knowledge. The gate was raised and the approved
  resolution (ADR-0038, Decision 2) is: the Retrieval Engine consumes **no** operational service; composing retrieved
  knowledge with retained memory belongs to a later orchestration layer.
- **No search technology.** Discovery, selection, prioritization, and validation are deterministic and structural, never
  a search engine, index, embedding, vector search, or semantic ranking (`retrieval-boundaries` `technology`). Enforced
  by a guard test.
- **No vendor knowledge** (ADR-0035 invariant): no vendor client library, model, URL, or auth; enforced by a guard test.

## 3. Component inventory (implemented)

Every component consumes frozen truth and owns only operational determination. Grouped by concern:

**Candidates and lifecycle.**
- **Retrieval types.** `RetrievalCandidate` (a canonical-owner knowledge candidate: id, owner, authority, topics,
  dependsOn, content), `RetrievalRequest` (scope, optional governance-permitted id set), `RetrievalResult` (the
  ordered, dependency-complete, validated candidate set).
- **`RetrievalRegistry`.** Registers, discovers, and looks up candidates by id; deterministic order; no duplicate id
  (fails closed); `unregister`.
- **`RetrievalFactory`.** Validates a candidate input and builds an immutable `RetrievalCandidate`, normalizing its
  content; fails closed on a blank id, blank owner, non-finite/negative authority, or no topics.
- **`RetrievalLifecycle`.** Consumes `RETRIEVAL_LIFECYCLE_PHASES` and `retrievalPhaseAtOrAfter`.
- **`RetrievalNormalizer`.** Normalizes candidate content to a consistent structural form.

**Determination (drives the frozen workflow steps).**
- **`RetrievalPlanner`.** Exposes the frozen `RETRIEVAL_WORKFLOW_STEPS` plan and proves its order (consumes
  `retrievalStepAtOrAfter`).
- **`RetrievalFilter`.** `discover` (candidates whose topics include the scope) and `select` (the governance-permitted
  subset). Deterministic and structural, over provided candidates only.
- **`RetrievalResolver`.** The `resolve-dependencies` step: expands the selected set to include every declared
  dependency, bounded and acyclic (fails closed on an unknown dependency or a dependency cycle).
- **`RetrievalRanker`.** The `prioritize` step: orders the set by authority (governing knowledge first), deterministic,
  with a stable id tiebreak. No semantic ranking.
- **`RetrievalValidator`.** The `validate` step: runs the frozen `RETRIEVAL_VALIDATION_DIMENSIONS` in order (ownership,
  authority, dependency-completeness, boundaries, governance-permission), conjunctive and fail-closed. It applies,
  never restates, the rules.
- **`RetrievalExecutor`.** Orchestrates the frozen workflow (discover, select, resolve, prioritize, assemble, validate,
  produce) over a request and the registry, producing the validated `RetrievalResult` or a refusal. It determines and
  stops; it loads and executes nothing.

**Observability and cross-cutting.**
- **`RetrievalMetrics`, `RetrievalStatistics`, `RetrievalDiagnostics`.** Operational counters (registrations,
  retrievals, successes, failures, validation failures) and a read-only view.
- **`RetrievalEvents`, `RETRIEVAL_EVENT_TYPES`.** Emits framework events (registered, retrieved, failed) via the frozen
  `createEvent` and the injected `EventBus`.
- **`RetrievalConfiguration`, `RetrievalEngineSettings`.** Engine-owned operational settings (`strictPermission`).
- **`RetrievalError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `RETRIEVAL.*` codes.
- **`RetrievalPluginBridge`, `RetrievalPlugin`.** Adopts candidate-carrying plugins into the registry, consuming the
  frozen `PluginManifest` type and validating each candidate through the `RetrievalFactory`.
- **`RetrievalManager`.** The facade and DI entry (`RETRIEVAL_MANAGER`): register a candidate, retrieve for a request,
  remove a candidate, and read statistics and diagnostics; drives the frozen workflow and emits events.
- **`retrievalEngineModule`, `RETRIEVAL_MANAGER`.** The `di` `Module` and token, registered through the frozen
  composition-root seam (ADR-0026).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 4 disposition |
|---|---|---|
| The retrieval model: lifecycle phases, workflow steps, validation dimensions, boundaries, and predicates | `@openlance/aios-retrieval` (Phase 2B) | consume the arrays and predicates; restate none |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Retained memory, knowledge loading, execution, the execution context, governance enforcement, reasoning, prompts, providers | ai/memory, ai/runtime, ai/governance, ai/reasoning, and the prior engines | referenced by boundary; the engine reaches into none of them and depends on no operational service |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-retrieval-engine -> {
@openlance/aios-retrieval, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (retrieval) and `app -> substrate` (the rest); all legal, no rule
and no namespace edge changes. There is **no** `app -> app` edge: the Retrieval Engine is foundational and reaches into
no operational service (in particular, not the Memory Engine). The composition root, config, and logging are test-only
devDependencies; the runtime model is referenced conceptually, not a Stage-4 source dependency.

## 6. What it must not do

Reach into memory (or any operational service), load knowledge, assemble the execution context, execute, reason,
generate prompts, execute providers, evaluate or restate governance rules, perform a search / embedding / vector /
semantic ranking, or name a vendor / import a client library. It determines a validated knowledge set over provided
candidates and stops, and nothing else.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / blank owner / invalid authority / no topics), lifecycle,
  normalizer, planner (the frozen step order), filter (discover, select), resolver (dependency expansion, unknown
  dependency, cycle, shared dependency), ranker (authority order + tiebreak), validator (each frozen dimension and its
  failure), executor (the full workflow plus each refusal), metrics, events, configuration, plugin bridge, and the
  manager. Plus the no-vendor-knowledge and no-search-technology guards.
- **Fail-closed.** The public API never throws; every failure is a `Result` error.
- **Benchmarks (ADR-0022 Rule 5).** Register, retrieve, filter, rank, normalize, and validate, each with a recorded
  baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0038 and this design are the Stage 4 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 5 (and any tools-execution work) is not begun.
