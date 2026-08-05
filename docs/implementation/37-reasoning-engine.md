# 37. Reasoning Engine implementation design (Phase 4, Stage 6)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 6).** Built design-first per ADR-0007.
[ADR-0040](adr/0040-reasoning-engine.md) is Accepted. Package: `apps/reasoning-engine` (`@openlance/aios-reasoning-engine`).

## 1. Mandate and scope

Stage 6 builds the **Reasoning Engine**: the Runtime's operational reasoning subsystem, the operational realization of
the frozen Reasoning namespace. It carries out operational reasoning over the frozen model: it registers the retrieved
knowledge (premises) a reasoning consumes, and, for a request, **frames** the task, **decomposes** it into parts under
the frozen strategies, **validates** it through the frozen conjunctive dimensions, and **produces** a governed reasoning
plan whose terminal stage is `concluded`, `inconclusive`, or `escalated`. It **reasons and stops**; it invokes no
provider, performs no inference, and executes nothing.

Per [ADR-0040](adr/0040-reasoning-engine.md), it consumes only the frozen reasoning model and the substrate, and it is
**foundational**: it depends on no operational service. It follows the ADR-0035 operational discipline (apps/ package,
composition-root seam, no vendor knowledge).

It owns only operational reasoning. It does not execute providers, prompts, tools, retrieval, or memory, orchestrate
agents, mint or bypass governance, retrieve, express, schedule, persist, or perform runtime execution.

## 2. No Ambiguity Gate; the deterministic-structural clarification

- **No gate fired.** Unlike Stages 3 to 5, the mandate is aligned with the frozen model (reason only, execute nothing,
  produce plans, no illegal `app -> app` edges). The Reasoning namespace is category-2 Pure Algorithms; it consumes
  retrieved knowledge and governing rules as **provided input** and references retrieval/governance/prompts/providers/
  agents in prose only.
- **Reasons deterministically and structurally; no provider, no inference (ADR-0040, Decision 2).** A "Reasoning Engine"
  that called an LLM would violate the frozen `expression` boundary ("a reasoning is expressed as prompts and executed
  by providers ... it never constructs a prompt, selects a model, or acts") and the determinism invariant. The engine
  performs the deterministic structural part the model owns and produces a plan; the inference is a later stage.
- **Produces a plan and stops** (`transformation` boundary): it loads nothing, retrieves nothing, expresses nothing,
  schedules nothing, persists nothing, and mints no clearance.
- **No vendor knowledge** (ADR-0035 invariant): no vendor client library, model, URL, or auth; enforced by a guard test.

## 3. Component inventory (implemented)

Every component consumes frozen truth and owns only operational reasoning. Grouped by concern:

**Premises and lifecycle.**
- **Reasoning types.** `Premise` (a registered piece of retrieved knowledge: id, statement, source), `ReasoningRequest`
  (the task, the chosen `strategy`, the registered `premises` to ground on, provided `parts` to decompose, stated
  `assumptions`, and a governance `permitted` verdict), `ReasoningPlan` (the governed outcome: task, strategy, parts,
  premises, assumptions, terminal `stage`, classified `uncertainty` when inconclusive, `validated: true`).
- **`ReasoningRegistry`.** Registers, looks up, and lists premises by id; deterministic order; no duplicate id (fails
  closed); `unregister`.
- **`ReasoningFactory`.** Validates a premise input and builds an immutable `Premise`, normalizing its statement; fails
  closed on a blank id, a blank statement, or a blank source.
- **`ReasoningLifecycle`.** Consumes `REASONING_LIFECYCLE_PHASES` and `reasoningPhaseAtOrAfter`.
- **`ReasoningNormalizer`.** Normalizes a statement, task, part, or assumption to a consistent structural form.

**Reasoning (drives the frozen workflow, stages, strategies, and validation).**
- **`ReasoningDecomposer`.** The `decompose` step: structures the provided sub-problems into parts (or the whole task as
  one part), under the decomposition strategy; fails closed on a blank part.
- **`ReasoningValidator`.** Runs the frozen `REASONING_VALIDATION_DIMENSIONS` in order (assumption identification,
  grounding, evidence sufficiency, governed validation) and determines the governed disposition: a hidden (blank)
  assumption fails closed; an ungrounded or evidence-insufficient reasoning yields `inconclusive` with a classified
  `knowledge` uncertainty; a denied governance verdict yields `escalated`; otherwise `concluded`. It applies, never
  restates, the governance rule.
- **`ReasoningPlanner`.** Produces the governed reasoning plan: it frames and decomposes, validates, and determines the
  terminal stage, driving the frozen workflow; it consumes `REASONING_WORKFLOW_STEPS` / `reasoningStepAtOrAfter`, the
  frozen `REASONING_STRATEGIES`, and the `REASONING_STAGES` state machine via `transitionAllowed`. It reasons and stops.

**Observability and cross-cutting.**
- **`ReasoningMetrics`, `ReasoningStatistics`, `ReasoningDiagnostics`.** Operational counters (registrations, reasonings,
  concluded, inconclusive, escalated, failures) and a read-only view.
- **`ReasoningEvents`, `REASONING_EVENT_TYPES`.** Emits framework events (registered, reasoned, failed) via the frozen
  `createEvent` and the injected `EventBus`.
- **`ReasoningConfiguration`, `ReasoningEngineSettings`.** Engine-owned operational settings (`strictGovernance`).
- **`ReasoningError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `REASONING.*` codes.
- **`ReasoningPluginBridge`, `ReasoningPlugin`.** Adopts premise-carrying plugins into the registry atomically,
  consuming the frozen `PluginManifest` type and validating each premise through the `ReasoningFactory`.
- **`ReasoningManager`.** The facade and DI entry (`REASONING_MANAGER`): register a premise, reason a request, remove a
  premise, and read statistics and diagnostics; drives the frozen model and emits events.
- **`reasoningEngineModule`, `REASONING_MANAGER`.** The `di` `Module` and token, registered through the frozen
  composition-root seam (ADR-0026).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 6 disposition |
|---|---|---|
| The reasoning model: lifecycle phases, workflow steps, stages and transitions, strategies, validation dimensions, uncertainty kinds, and predicates | `@openlance/aios-reasoning` (Phase 2B) | consume the arrays and predicates (`reasoningPhaseAtOrAfter`, `reasoningStepAtOrAfter`, `transitionAllowed`); restate none |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Provider/prompt execution, tool preparation, knowledge retrieval, retained memory, governance rules and clearance, expression, runtime scheduling, and the inference of a reasoning | ai/providers, ai/prompts, ai/tools, ai/retrieval, ai/memory, ai/governance, ai/runtime, ai/agents, and the prior engines | referenced by boundary; the engine reaches into none of them and depends on no operational service |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-reasoning-engine -> {
@openlance/aios-reasoning, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (reasoning) and `app -> substrate` (the rest); all legal, no rule
and no namespace edge changes. There is **no** `app -> app` edge: the Reasoning Engine is foundational and reaches into
no operational service. The composition root, config, and logging are test-only devDependencies.

## 6. What it must not do

Invoke a provider or perform inference, execute a prompt, tool, retrieval, or memory, orchestrate an agent, retrieve or
load knowledge, express a conclusion as a prompt, mint or bypass governance, schedule, persist, perform runtime
execution, or name a vendor / import a client library. It reasons deterministically and structurally over provided
knowledge, produces a governed reasoning plan, and stops, and nothing else.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / statement / source), lifecycle, normalizer, decomposer
  (provided parts, whole-task, blank part), validator (each frozen dimension and disposition: hidden assumption,
  ungrounded, insufficient, escalated, concluded), planner (blank task, invalid strategy, unknown premise, the workflow
  order, the stage-machine terminal, the full plan), metrics, events, configuration, plugin bridge, and the manager.
  Plus the no-vendor-knowledge and no-cross-boundary guards.
- **Fail-closed.** The public API never throws; every failure is a `Result` error, and an insufficient or ungoverned
  reasoning yields a governed absence (a valid `inconclusive` or `escalated` plan), never an invented conclusion.
- **Benchmarks (ADR-0022 Rule 5).** Registration, reasoning, decomposition, validation, normalization, and the workflow
  order, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0040 and this design are the Stage 6 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 7 is not begun.
