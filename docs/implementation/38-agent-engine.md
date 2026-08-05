# 38. Agent Engine implementation design (Phase 4, Stage 7)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 7).** Built design-first per ADR-0007.
[ADR-0041](adr/0041-agent-engine.md) is Accepted. Package: `apps/agent-engine` (`@openlance/aios-agent-engine`).

## 1. Mandate and scope

Stage 7 builds the **Agent Engine**: the Runtime's operational agent subsystem and the **first orchestration engine**,
the operational realization of the frozen Agents namespace. It registers agent definitions (identity, capabilities,
permissions, specialization), and, for a request, it **composes** the agent's steps over the six operational engines,
**validates** them against the agent's capabilities and permissions, **coordinates** any multi-agent topology (directed
and acyclic), and produces an immutable `AgentExecutionPlan`. It **composes and stops**; it never executes, orchestrates,
schedules, combines results, or selects a provider.

Per [ADR-0041](adr/0041-agent-engine.md), it is the **composition owner**: it consumes the six foundational engines
(Provider, Prompt, Memory, Retrieval, Tool, Reasoning) and re-owns none, the first orchestration engine composing
multiple foundational engines through `app -> app` edges (the single-direction `prompt-engine -> provider-engine` edge
of ADR-0036 preceded it). It follows the ADR-0035 operational discipline (apps/ package, composition-root seam, no vendor
knowledge).

It owns only operational agent composition. It does not execute providers, prompts, tools, workflows, or the runtime,
schedule execution, mint or bypass governance, perform inference, retrieve knowledge, manage memory, network, or select
a provider or model.

## 2. No Ambiguity Gate; the two clarifications

- **No gate fired.** The mandate is aligned with the frozen model: an agent composes the six operational namespaces and
  owns none, and never orchestrates, schedules, or executes (`agent-boundaries` `composition` and `execution`). The
  `app -> app` edges are legal: `.dependency-cruiser.cjs` and `scripts/arch-regression.mjs` restrict only substrate and
  namespace edges, and `NAMESPACE_DEPS.agents` records the six-engine composition.
- **Composition owner, `app -> app` edges (ADR-0041, Decision 2).** The Agent Engine consumes each engine's public
  request contract to type the plan's steps, recreates none, and keeps each engine independently replaceable.
- **Composes a static plan; never executes or combines (ADR-0041, Decision 3).** ADR-0035: "Runtime sequences and
  combines their results." The Agent Engine produces a blueprint; it invokes no engine and combines no results. The
  runtime executes.
- **Never selects a provider or model; no vendor knowledge** (ADR-0035 invariant, `agent-boundaries` `execution`). A
  provider step carries a provider-neutral `ProviderNeed`. Both are enforced by guard tests.

## 3. Component inventory (implemented)

Every component consumes frozen truth and owns only operational composition. Grouped by concern:

**Agents and lifecycle.**
- **Agent types.** `AgentDefinition` (id, `capabilities`, `permissions`, `specialization`), `AgentCapability` (the six
  operational namespaces an agent composes: reasoning, retrieval, memory, prompt, tool, provider), `AgentStep` (a typed
  step, a discriminated union over the six engines' request contracts), `AgentLink` (a directed supervisor -> worker
  coordination edge), `AgentRequest` (the agent, the task, the steps, and any coordination), `AgentExecutionPlan` (the
  agent, task, validated steps, validated coordination, `validated: true`).
- **`AgentRegistry`.** Registers, looks up, and lists agents by id; deterministic order; no duplicate id (fails closed);
  `unregister`.
- **`AgentFactory`.** Validates an agent input and builds an immutable `AgentDefinition`, normalizing its specialization;
  fails closed on a blank id, no capabilities, an invalid capability, a permission that exceeds the capabilities (least
  privilege), or a blank specialization.
- **`AgentLifecycle`.** Consumes `AGENT_LIFECYCLE_PHASES` and `agentPhaseAtOrAfter`.
- **`AgentNormalizer`.** Normalizes a task or specialization to a consistent structural form.

**Composition (the composition owner's work).**
- **`AgentComposer`.** Composes the agent's steps: every step's capability must be one the agent holds (`capabilities`),
  and the plan must be non-empty and within the bounded step count; fails closed on an empty plan or an uncapable step.
- **`AgentValidator`.** Applies governance: every step's capability must be one the agent is permitted to use
  (`permissions`, least privilege); fails closed on a not-permitted step. It applies, never defines, the rule.
- **`AgentCoordinator`.** Validates a multi-agent coordination topology: every referenced agent is registered, no agent
  coordinates itself, and the directed topology is acyclic; fails closed on an unknown agent, self-coordination, or a
  coordination cycle.
- **`AgentPlanner`.** Produces the immutable `AgentExecutionPlan`: it looks up the agent, normalizes the task, bounds and
  composes the steps, validates them, coordinates the topology, and assembles the plan. It composes and stops; it invokes
  no engine and combines no results.

**Observability and cross-cutting.**
- **`AgentMetrics`, `AgentStatistics`, `AgentDiagnostics`.** Operational counters (registrations, plans, successes,
  failures) and a read-only view.
- **`AgentEvents`, `AGENT_EVENT_TYPES`.** Emits framework events (registered, planned, failed) via the frozen
  `createEvent` and the injected `EventBus`.
- **`AgentConfiguration`, `AgentSettings`.** Engine-owned operational settings (`maxSteps`, the bounded composition
  limit).
- **`AgentError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `AGENT.*` codes.
- **`AgentPluginBridge`, `AgentPlugin`.** Adopts agent-carrying plugins into the registry atomically, consuming the
  frozen `PluginManifest` type and validating each agent through the `AgentFactory`.
- **`AgentManager`.** The facade and DI entry (`AGENT_MANAGER`): register an agent, plan a request into an execution
  plan, remove an agent, and read statistics and diagnostics; drives the frozen model and emits events.
- **`agentEngineModule`, `AGENT_MANAGER`.** The `di` `Module` and token, registered through the frozen composition-root
  seam (ADR-0026).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 7 disposition |
|---|---|---|
| The agent model: lifecycle phases, parts, capabilities/permissions/coordination principles, and the phase predicate | `@openlance/aios-agents` (Phase 2B) | consume `AGENT_LIFECYCLE_PHASES` / `agentPhaseAtOrAfter`; restate none |
| The six operational realizations: reasoning, retrieval, memory, prompt, tool, provider | the six Phase 4 engines (ADR-0035 to ADR-0040) | consume each public request contract (type-level); recreate none; each stays independently replaceable |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Execution, orchestration, scheduling, result-combination, provider selection, clearance minting, governance rules | ai/runtime, ai/providers, ai/governance, and later stages | referenced by boundary; the engine performs none of them |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-agent-engine -> {
@openlance/aios-agents, @openlance/aios-provider-engine, @openlance/aios-prompt-engine, @openlance/aios-memory-engine,
@openlance/aios-retrieval-engine, @openlance/aios-tool-engine, @openlance/aios-reasoning-engine, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (twelve). `app ->
namespace` (agents), **`app -> app` (the six engines, constitutional because the Agent Engine owns composition; the
Prompt Engine's single `prompt-engine -> provider-engine` edge of ADR-0036 preceded them)**, and `app -> substrate` (the
rest). All legal: no dependency-cruiser rule and no architectural-regression scenario forbids an `apps/` edge, the graph
stays acyclic (none of the six engines depends on the agent-engine),
and every engine is imported only through its public barrel. The composition root, config, and logging are test-only
devDependencies.

## 6. What it must not do

Execute or orchestrate or schedule, sequence or combine the engines' results, invoke a provider / prompt / tool /
retrieval / memory / runtime, select a provider or model, perform inference, retrieve or load knowledge, manage memory,
network, mint or bypass or define governance, persist, or name a vendor / import a client library. It composes an
immutable agent execution plan over the six engines' contracts and stops, and nothing else.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / no capabilities / invalid capability / permission exceeds
  capability / blank specialization), lifecycle, normalizer, composer (empty plan, uncapable step, bounded step count),
  validator (not-permitted step), coordinator (acyclic topology, unknown agent, self-coordination, cycle), planner (the
  full plan and each refusal), metrics, events, configuration, plugin bridge, and the manager. Plus the
  no-vendor-knowledge and no-execution guards.
- **Fail-closed.** The public API never throws; every failure is a `Result` error.
- **Benchmarks (ADR-0022 Rule 5).** Registration, planning, composition, validation, normalization, and execution-plan
  generation, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0041 and this design are the Stage 7 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 8 (the Runtime Execution Engine, which executes
the plans this engine composes) is not begun.
