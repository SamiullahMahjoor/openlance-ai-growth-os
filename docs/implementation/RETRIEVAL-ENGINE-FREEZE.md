# Retrieval Engine, Freeze Declaration (Phase 4, Stage 4)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-retrieval-engine` (`apps/retrieval-engine`).
**Scope:** Phase 4, Stage 4: the Runtime's operational retrieval subsystem, the operational realization of the frozen
Retrieval namespace, built on the frozen Phase 2A substrate and the frozen `@openlance/aios-retrieval` model, and
registered through the frozen Phase 3 composition-root seam. Decision: [ADR-0038](adr/0038-retrieval-engine.md)
(Accepted). Design: [docs/implementation/35-retrieval-engine.md](35-retrieval-engine.md).

It is the fourth operational stage. It performs real knowledge determination (discover, select, resolve dependencies,
prioritize, assemble, validate, produce a result) over provided canonical candidates, but **loads nothing and executes
nothing**: it determines **what** knowledge applies and stops.

## What this stage owns

Operational knowledge determination: **discovering** candidates for a scope, **selecting** the governance-permitted
subset, **resolving** declared dependencies to a complete set, **prioritizing** by authority, **validating** the set
against the frozen dimensions, and **producing** a validated result, per the frozen `@openlance/aios-retrieval` model.
It re-owns nothing the Retrieval namespace owns; it declares the canonical knowledge (that is `knowledge/`), reasons
(that is `ai/reasoning/`), builds prompts (that is `ai/prompts/`), executes providers (that is `ai/providers/`), or
enforces governance (that is a future governance engine's).

## The Ambiguity Gate (resolved)

The mandate's consume list included the Memory Engine, which conflicts with a frozen boundary: the retrieval
`layer` boundary states "a retrieval never reaches into ... memory ...", and knowledge discovery is "only from the
canonical knowledge repository." The gate was raised and the approved resolution (ADR-0038, Decision 2) is: the
Retrieval Engine consumes **no** operational service and, specifically, has **no** dependency on the Memory Engine.
Runtime memory is not a canonical knowledge repository and cannot become an implicit retrieval source. Any future
composition of retrieved knowledge with retained memory belongs to a later orchestration layer (Prompt / Execution),
never inside Retrieval.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`RetrievalCandidate`, `RetrievalCandidateInput`, `RetrievalRequest`, `RetrievalResult`, `RetrievalStatistics`, `RetrievalDiagnostics`, `RetrievalId`); type-only, excluded from coverage |
| `src/errors.ts` | `RetrievalError` (a `BaseError` subtype, `infrastructure`, `RETRIEVAL.*` codes) |
| `src/registry.ts` | `RetrievalRegistry` (register / has / get / list / unregister of candidate references) |
| `src/normalizer.ts` | `RetrievalNormalizer` (structural content normalization) |
| `src/factory.ts` | `RetrievalFactory` (validates + freezes a `RetrievalCandidate`; fails closed on blank id / owner, invalid authority, no topics, or empty content) |
| `src/lifecycle.ts` | `RetrievalLifecycle` (consumes `RETRIEVAL_LIFECYCLE_PHASES` / `retrievalPhaseAtOrAfter`) |
| `src/planner.ts` | `RetrievalPlanner` (consumes `RETRIEVAL_WORKFLOW_STEPS` / `retrievalStepAtOrAfter`) |
| `src/filter.ts` | `RetrievalFilter` (the `discover` and `select` steps, structural) |
| `src/resolver.ts` | `RetrievalResolver` (the `resolve-dependencies` step; bounded, acyclic, deduplicating) |
| `src/ranker.ts` | `RetrievalRanker` (the `prioritize` step; authority order with an environment-independent id tiebreak) |
| `src/validator.ts` | `RetrievalValidator`, `VALIDATION_ERROR_CODES` (consumes `RETRIEVAL_VALIDATION_DIMENSIONS`) |
| `src/executor.ts` | `RetrievalExecutor` (drives the frozen workflow, fail-closed) |
| `src/metrics.ts` | `RetrievalMetrics` |
| `src/events.ts` | `RetrievalEvents`, `RETRIEVAL_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `RetrievalConfiguration`, `RetrievalEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `RetrievalPluginBridge`, `RetrievalPlugin` (consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `RetrievalManager` (the facade + DI entry), `RetrievalManagerOptions` |
| `src/module.ts` | `retrievalEngineModule`, `RETRIEVAL_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Retrieval determines, it does not load or execute; no search technology; no vendor knowledge

Discovery, selection, dependency resolution, prioritization, and validation are **deterministic and structural** (by
topic membership, declared owner permission, declared dependencies, authority, and content presence), never a search
engine, embedding, vector search, semantic ranking, similarity, or any algorithmic search technology. The engine
determines **what** canonical knowledge applies over **provided** candidate references and **loads nothing and executes
nothing**. It holds **no vendor knowledge** (no vendor name, client library, endpoint, or credential). Both boundaries
are enforced structurally by `src/`-scanning guard tests (`no-search-technology.test.ts` and
`no-vendor-knowledge.test.ts`), each of which enumerates every source file and fails on any forbidden token.

## No operational-service dependency

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-retrieval-engine -> {
@openlance/aios-retrieval, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (retrieval) and `app -> substrate` (the rest); there is **no**
`app -> app` edge, and specifically no edge to the Memory, Prompt, or Provider engine. All legal, no dependency-cruiser
rule and no namespace edge changed. The composition root, config, and logging are test-only devDependencies.

## Consume, never recreate

Consumes the frozen `@openlance/aios-retrieval` model (`RETRIEVAL_LIFECYCLE_PHASES`, `RETRIEVAL_WORKFLOW_STEPS`,
`RETRIEVAL_VALIDATION_DIMENSIONS`, and the predicates `retrievalPhaseAtOrAfter` / `retrievalStepAtOrAfter`) and the
frozen substrate. It recreates no container, event bus, error taxonomy, or plugin host, and registers through the
frozen composition-root extension seam (ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Determinism and immutability

Ordering is total and environment-independent: the ranker breaks authority ties by comparing ids by code point (not by
locale collation), so the same candidate set always produces the same order on any host. The built `RetrievalResult`
and its `candidates` array, the `RetrievalCandidate` and its `topics` / `dependsOn` arrays, the statistics and
diagnostics views, and the module consts are all `Object.freeze`d; the registry and lookups return fresh arrays of
already-frozen records; the ranker copies its input rather than sorting in place. Both audits verified the freezes and
the determinism empirically.

## Governance

Selection applies the caller-supplied permission set and the validator's `governance-permission` dimension; the engine
**applies** governance checks, it does not **define** the rules (those are `ai/governance/`), and it enforces no rule of
its own. It is deterministic and fail-closed; it mints or requires no clearance, because determining which canonical
knowledge applies is not the significant provider execution the ADR-0035 clearance seam gates. Knowledge is canonical
truth; the engine surfaces it and never overrides it.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 36 packages / 38 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 17 executable modules (the barrel and the
  type-only `types.ts` excluded per ADR-0015); 31 tests across 4 files; benchmarks recorded (register, retrieve, filter,
  rank, normalize, validate); no `.only` / `.skip`.
- Two independent source audits, both CLEAN. Audit 1 (constitutional: ownership, the resolved memory-boundary gate,
  consume-not-recreate, no-search-technology, vendor neutrality, composition-root seam, ADR traceability) finished CLEAN
  on the first pass. Audit 2 (correctness: determinism, edge cases, coverage honesty, error propagation, immutability,
  regression) raised two Medium and one Low, all fixed and re-verified CLEAN: the ranker tiebreak now compares ids by
  code point (was locale-dependent), the result `candidates` array is now frozen (shallow-freeze gap closed), and the
  factory now rejects empty-once-normalized content at registration (`RETRIEVAL.BLANK_CONTENT`).

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase
3 packages, and the frozen Phase 4 Stage 1 (Provider Engine), Stage 2 (Prompt Engine), and Stage 3 (Memory Engine)
unchanged (`git diff HEAD -- ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine apps/memory-engine
.dependency-cruiser.cjs tools/` empty). The change set is the new `apps/retrieval-engine/` package, ADR-0038, the design
doc, this freeze doc, the ADR index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Retrieval Engine's public API, the determines-not-loads-or-executes boundary, the no-search-technology and
no-vendor-knowledge invariants, the no-operational-service-dependency (and specifically no-memory) boundary, the
consume-not-recreate boundary, the deterministic and structural discover / select / resolve / prioritize / validate,
the fail-closed `Result` contract, the immutable return shapes, and the dependency edges are settled for Stage 4.
Reasoning, prompt building, provider execution, memory composition, and the enforcement of retrieval governance are
later stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
retrieval-engine file without an architecture change process, each still running the full validation pipeline. Any
change to the public API, the determines-not-loads-or-executes boundary, the no-search-technology or no-vendor-knowledge
invariant, the no-operational-service-dependency boundary, the consume-not-recreate boundary, the fail-closed contract,
or the dependency edges is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Do not begin Stage 5

Phase 4 Stage 5 (and any tools execution) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
