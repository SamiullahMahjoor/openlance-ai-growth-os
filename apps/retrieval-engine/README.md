# @openlance/aios-retrieval-engine

The AIOS **Retrieval Engine** (Phase 4, Stage 4): the Runtime's operational knowledge-determination subsystem, the
operational realization of the frozen Retrieval namespace. It determines the minimum sufficient, dependency-complete,
authority-correct knowledge set a task requires, over provided candidates (**discover**, **select**, **resolve
dependencies**, **prioritize**, **assemble**, **validate**, produce result), per the frozen `@openlance/aios-retrieval`
model, and produces a validated `RetrievalResult`. It **determines and stops**; it never loads.

- **Layer:** `app` (`apps/*`), the fourth Phase 4 operational service and the second **foundational** one.
- **Design:** [docs/implementation/35-retrieval-engine.md](../../docs/implementation/35-retrieval-engine.md).
  **Decision:** [ADR-0038](../../docs/implementation/adr/0038-retrieval-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-retrieval` model. It **consumes, never recreates**: the
retrieval model (lifecycle phases, workflow steps, validation dimensions, boundaries, and their predicates). It is
**foundational** and depends on **no operational service**.

## Never reaches into memory; determines over canonical candidates

Per the frozen `retrieval-boundaries` invariant, "a retrieval never reaches into ... memory," and discovery draws "only
from the canonical knowledge repository." So the Retrieval Engine has **no** Memory Engine dependency; its candidates
are provided in the `RetrievalRequest` (or registered as canonical-owner records). Composing retrieved knowledge with
retained memory belongs to a later orchestration layer, in the constitutionally-correct direction.

## No search technology; no vendor knowledge (ADR-0038)

Discovery, selection, dependency resolution, prioritization, and validation are **deterministic and structural** (by
topic, ownership, authority, and declared dependencies), never a search engine, index, embedding, vector search, or
semantic ranking. The engine holds **no vendor knowledge**. Both boundaries are enforced structurally by `src/`-scanning
guard tests (`no-search-technology.test.ts` and `no-vendor-knowledge.test.ts`). It produces a validated result and
stops; loading and execution are the runtime's.

## Public API (single barrel, Engineering Rule 1)

- `RetrievalManager` (and `retrievalEngineModule`, `RETRIEVAL_MANAGER`): the engine facade and its DI module, registered
  through the frozen composition root's extension seam (ADR-0026).
- `RetrievalRegistry`, `RetrievalFactory`, `RetrievalLifecycle`, `RetrievalNormalizer`, `RetrievalPlanner`,
  `RetrievalFilter`, `RetrievalResolver`, `RetrievalRanker`, `RetrievalValidator`, `RetrievalExecutor`,
  `RetrievalMetrics`, `RetrievalEvents`, `RetrievalConfiguration`, `RetrievalPluginBridge`: the operational components.
- `RetrievalCandidate`, `RetrievalRequest`, `RetrievalResult`, `RetrievalStatistics`, `RetrievalDiagnostics`,
  `RetrievalEngineSettings`, `RetrievalPlugin`, `RetrievalId`: the read-only types.
- `RetrievalError`: a `BaseError` subtype (`infrastructure`) with `RETRIEVAL.*` codes; failures ride the `Result`
  channel.

## Dependency direction

`@openlance/aios-retrieval-engine -> { @openlance/aios-retrieval, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges, recorded in
`dependency-graph.snapshot.json`). `app -> namespace` (retrieval) and `app -> substrate` (the rest); **no** `app -> app`
edge (foundational). All legal, no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies.

## Non-responsibilities

No reaching into memory or any operational service, knowledge loading, execution-context assembly, execution, reasoning,
prompt assembly, provider execution, governance-rule enforcement, runtime orchestration, search / embedding / semantic
ranking, or vendor client library. It determines a validated knowledge set over provided candidates, and nothing else.
