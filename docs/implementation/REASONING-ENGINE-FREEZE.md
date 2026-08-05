# Reasoning Engine, Freeze Declaration (Phase 4, Stage 6)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-reasoning-engine` (`apps/reasoning-engine`).
**Scope:** Phase 4, Stage 6: the Runtime's operational reasoning subsystem, the operational realization of the frozen
Reasoning namespace, built on the frozen Phase 2A substrate and the frozen `@openlance/aios-reasoning` model, and
registered through the frozen Phase 3 composition-root seam. Decision: [ADR-0040](adr/0040-reasoning-engine.md)
(Accepted). Design: [docs/implementation/37-reasoning-engine.md](37-reasoning-engine.md).

It is the sixth operational stage. It performs real reasoning work (framing, decomposition, validation, governed
disposition) over provided knowledge, but **invokes no provider, performs no inference, and executes nothing**: it
produces a governed reasoning plan and stops.

## What this stage owns

Operational reasoning: registering the **premises** (retrieved knowledge) a reasoning consumes, and, for a request,
**framing** the task, **decomposing** it into parts under the frozen strategies, **validating** it through the four
frozen conjunctive dimensions, and **producing** a governed `ReasoningPlan` whose terminal stage is `concluded`,
`inconclusive`, or `escalated`, per the frozen `@openlance/aios-reasoning` model. It re-owns nothing the Reasoning
namespace owns; the inference a plan frames is expressed as prompts and executed by providers (owned by their
namespaces) and driven by an agent, the knowledge a reasoning consumes is retrieval's, and the governing rules it
applies are governance's.

## No Ambiguity Gate; the deterministic-structural clarification (ADR-0040)

Unlike Stages 3 to 5, no gate fired: the mandate is aligned with the frozen model (reason only, execute nothing, produce
plans, no illegal `app -> app` edges). ADR-0040 records the one genuine architectural clarification: a "Reasoning Engine"
that deliberately performs **no inference and invokes no provider**, producing a deterministic governed reasoning plan
and deferring the cognition to a later execution stage. A naive engine that called an LLM would violate the frozen
`expression` boundary ("a reasoning is expressed as prompts and executed by providers ... it never constructs a prompt,
selects a model, or acts") and the "no randomness" determinism invariant.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`Premise`, `PremiseInput`, `ReasoningRequest`, `ReasoningPlan`, `ReasoningStatistics`, `ReasoningDiagnostics`, `ReasoningId`); type-only, excluded from coverage |
| `src/errors.ts` | `ReasoningError` (a `BaseError` subtype, `infrastructure`, `REASONING.*` codes) |
| `src/registry.ts` | `ReasoningRegistry` (register / has / get / list / unregister of premises) |
| `src/normalizer.ts` | `ReasoningNormalizer` (structural normalization) |
| `src/factory.ts` | `ReasoningFactory` (validates + freezes a `Premise`; fails closed on blank id, statement, or source) |
| `src/lifecycle.ts` | `ReasoningLifecycle` (consumes `REASONING_LIFECYCLE_PHASES` / `reasoningPhaseAtOrAfter`) |
| `src/decomposer.ts` | `ReasoningDecomposer` (the `decompose` step; structures provided parts or the whole task; fails closed on a blank part) |
| `src/validator.ts` | `ReasoningValidator` (consumes `REASONING_VALIDATION_DIMENSIONS`; determines the governed disposition) |
| `src/planner.ts` | `ReasoningPlanner` (produces the governed plan; consumes `REASONING_WORKFLOW_STEPS` / `reasoningStepAtOrAfter`, `REASONING_STRATEGIES`, `REASONING_STAGES` / `transitionAllowed`) |
| `src/metrics.ts` | `ReasoningMetrics` |
| `src/events.ts` | `ReasoningEvents`, `REASONING_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `ReasoningConfiguration`, `ReasoningEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `ReasoningPluginBridge`, `ReasoningPlugin` (adopts premise-carrying plugins atomically; consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `ReasoningManager` (the facade + DI entry), `ReasoningManagerOptions` |
| `src/module.ts` | `reasoningEngineModule`, `REASONING_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Reasons deterministically and structurally; no provider, no inference, no vendor knowledge

Framing, decomposition, the four validation dimensions, uncertainty classification, and the governed disposition are
**deterministic and structural**. The engine produces a `ReasoningPlan` and **carries out nothing**: it invokes no LLM,
constructs no prompt, selects no model, retrieves nothing, expresses nothing, schedules nothing, and persists nothing
(the inference the plan frames is a later execution stage). It holds **no vendor knowledge** and names no model. Both
boundaries are enforced structurally by `src/`-scanning guard tests: `no-vendor-knowledge.test.ts` (no vendor / client
library / URL / auth token) and `no-cross-boundary.test.ts` (no import of a provider, prompt, tool, memory, retrieval,
agent, governance, or runtime package).

## Governed, grounded, deterministic

The four frozen validation dimensions (assumption identification, grounding, evidence sufficiency, governed validation)
run in order, conjunctive and fail-closed. A reasoning rests only on registered premises and stated assumptions; a
hidden (blank) assumption fails closed, an evidence-insufficient reasoning yields a governed `inconclusive` outcome with
a classified `knowledge` uncertainty, and a denied governance verdict `escalates`, never an invented conclusion
("no conclusion is preferable to an unsound one"). Governance is applied, never defined, and no clearance is minted. The
same task, premises, and rules always produce the same plan.

## No operational-service dependency

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-reasoning-engine -> {
@openlance/aios-reasoning, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (reasoning) and `app -> substrate` (the rest); there is **no** `app
-> app` edge. All legal, no dependency-cruiser rule and no namespace edge changed. The composition root, config, and
logging are test-only devDependencies.

## Consume, never recreate

Consumes the frozen `@openlance/aios-reasoning` model (`REASONING_LIFECYCLE_PHASES`, `REASONING_WORKFLOW_STEPS`,
`REASONING_STAGES`, `REASONING_STRATEGIES`, `REASONING_VALIDATION_DIMENSIONS`, and the predicates
`reasoningPhaseAtOrAfter` / `reasoningStepAtOrAfter` / `transitionAllowed`) and the frozen substrate. It recreates no
container, event bus, error taxonomy, or plugin host, and registers through the frozen composition-root extension seam
(ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Determinism and immutability

Reasoning is deterministic: no `Date`, no randomness; the injected `Clock` stamps only event `occurredAt`, never the
plan. The built `ReasoningPlan` and its `parts`, `premises`, and `assumptions` arrays, the `Premise`, the statistics and
diagnostics views, and the module consts are all `Object.freeze`d; `plan.premises` is a defensive copy independent of
the request; the registry returns fresh arrays; `ReasoningPluginBridge.adopt` is atomic (it validates and
conflict-checks the whole batch before registering any). Both audits verified the freezes and the determinism
empirically.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 38 packages / 40 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 14 executable modules (the barrel and the type-only
  `types.ts` excluded per ADR-0015); 30 tests across 4 files; benchmarks recorded (registration, reasoning,
  decomposition, validation, normalization, workflow order); no `.only` / `.skip`.
- Two independent source audits, both CLEAN. Audit 1 (constitutional: never-invokes-a-provider, produces-a-plan,
  foundational no-operational-dependency, consumes-not-retrieves, applies-not-mints governance, consume-not-recreate,
  vendor neutrality, composition-root seam, ADR traceability and justification) finished CLEAN on the first pass. Audit
  2 (correctness: determinism, immutability, purity, edge cases, coverage honesty, regression) raised four Low items,
  all addressed and re-verified: the redundant grounding branch was collapsed (both frozen dimensions fail closed to the
  same governed absence), the decomposer's whole-task branch now normalizes, and the tests now pin the frozen
  `assumptions` array, the premise-copy independence, the absent-`uncertainty` key, and the insufficiency-outranks-denial
  precedence.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase 3
packages, and the frozen Phase 4 Stages 1-5 (Provider, Prompt, Memory, Retrieval, Tool engines) unchanged (`git diff
HEAD -- ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine apps/memory-engine apps/retrieval-engine
apps/tool-engine .dependency-cruiser.cjs tools/` empty). The change set is the new `apps/reasoning-engine/` package,
ADR-0040, the design doc, this freeze doc, the ADR index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Reasoning Engine's public API, the reasons-not-executes / no-inference / no-provider boundary, the
no-vendor-knowledge invariant, the no-operational-service-dependency boundary, the consume-not-recreate boundary, the
deterministic and structural framing / decomposition / validation / disposition, the governance-applied-not-minted seam,
the fail-closed `Result` contract and the governed-absence outcomes, the immutable return shapes, and the dependency
edges are settled for Stage 6. Executing the inference a plan frames, expressing a reasoning as a prompt, composing
reasoning with retrieval and providers, and enforcing reasoning governance are later stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
reasoning-engine file without an architecture change process, each still running the full validation pipeline. Any
change to the public API, the reasons-not-executes / no-inference boundary, the no-vendor-knowledge invariant, the
no-operational-service-dependency boundary, the consume-not-recreate boundary, the fail-closed contract, or the
dependency edges is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Do not begin Stage 7

Phase 4 Stage 7 is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
