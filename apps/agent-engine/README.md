# @openlance/aios-agent-engine

The AIOS **Agent Engine** (Phase 4, Stage 7): the Runtime's operational agent subsystem and the **first orchestration
engine**, the operational realization of the frozen Agents namespace. As the **composition owner** it composes an
agent's steps over the six foundational engines' public request contracts (**register**, **compose**, **validate**,
**coordinate**, **plan**), per the frozen `@openlance/aios-agents` model, and produces an immutable `AgentExecutionPlan`.
It **composes and stops**; it never executes, orchestrates, schedules, combines results, or selects a provider.

- **Layer:** `app` (`apps/*`), the seventh Phase 4 operational service and the **first orchestration** one.
- **Design:** [docs/implementation/38-agent-engine.md](../../docs/implementation/38-agent-engine.md).
  **Decision:** [ADR-0041](../../docs/implementation/adr/0041-agent-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-agents` model, and the composition owner of the six
foundational engines. It **consumes, never recreates**: the agent model (lifecycle phases and their predicate) and each
engine's public request contract. Every consumed engine remains independently replaceable.

## The composition owner: legal app -> app edges (ADR-0041)

Unlike the six foundational engines (each with no `app -> app` edge), the Agent Engine depends on all six of them,
because the frozen `agent-boundaries` `composition` boundary and `NAMESPACE_DEPS.agents` make the agent the composition
owner: "An agent composes reasoning, retrieval, memory, and prompts, and, in future, tools and providers, and owns none
of them." These `app -> app` edges are the first in the repository and are legal (no dependency-cruiser rule and no
architectural-regression scenario forbids an `apps/` edge; the graph stays acyclic because the six engines depend on no
app), and each engine is imported only through its public barrel.

## Composes a static plan; never executes (ADR-0041)

Per the frozen `agent-boundaries` `execution` boundary, "an agent never orchestrates, schedules, or executes, and it
never selects a provider or model," and ADR-0035's "Runtime sequences and combines their results." So the Agent Engine
produces an immutable `AgentExecutionPlan` (a blueprint of typed steps and an acyclic coordination) and stops: it invokes
no engine, combines no results, opens no network, and mints no clearance. A provider step carries a provider-neutral
`ProviderNeed`; selection and execution are the runtime's, a later stage. The engine holds **no vendor knowledge**. Both
boundaries are enforced structurally by `src/`-scanning guard tests (`no-vendor-knowledge.test.ts` and
`no-execution.test.ts`).

## Governed, deterministic

An agent acts only within its **capabilities** (what it can do) and its **permissions** (what it may do, least
privilege), and its coordination is directed and acyclic. A step outside the agent's capabilities or permissions, or a
coordination that would form a cycle, is refused. Governance is applied, never defined or minted. The same agent,
request, and rules always produce the same plan.

## Public API (single barrel, Engineering Rule 1)

- `AgentManager` (and `agentEngineModule`, `AGENT_MANAGER`): the engine facade and its DI module, registered through the
  frozen composition root's extension seam (ADR-0026).
- `AgentRegistry`, `AgentFactory`, `AgentLifecycle`, `AgentNormalizer`, `AgentComposer`, `AgentValidator`,
  `AgentCoordinator`, `AgentPlanner`, `AgentMetrics`, `AgentEvents`, `AgentConfiguration`, `AgentPluginBridge`: the
  operational components.
- `AgentDefinition`, `AgentDefinitionInput`, `AgentCapability`, `AgentStep`, `AgentLink`, `AgentRequest`,
  `AgentExecutionPlan`, `AgentStatistics`, `AgentDiagnostics`, `AgentSettings`, `AgentPlugin`, `AgentId`: the read-only
  types.
- `AgentError`: a `BaseError` subtype (`infrastructure`) with `AGENT.*` codes; failures ride the `Result` channel.

## Dependency direction

`@openlance/aios-agent-engine -> { @openlance/aios-agents, @openlance/aios-provider-engine, @openlance/aios-prompt-engine,
@openlance/aios-memory-engine, @openlance/aios-retrieval-engine, @openlance/aios-tool-engine,
@openlance/aios-reasoning-engine, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins,
@openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges, recorded in `dependency-graph.snapshot.json`). `app
-> namespace` (agents), `app -> app` (the six engines), and `app -> substrate` (the rest). All legal, acyclic, no rule
and no namespace edge changes. The composition root, config, and logging are test-only devDependencies.

## Non-responsibilities

No execution, orchestration, scheduling, result-combination, engine invocation, provider or model selection, inference,
retrieval, memory management, networking, governance minting / bypass / definition, persistence, or vendor client
library. It composes an immutable agent execution plan over the six engines' contracts, and nothing else.
