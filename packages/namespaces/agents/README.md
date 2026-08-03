# @openlance/aios-agents

The immutable, technology-neutral **domain model** of the AI layer's agent abstraction.

- **Constitution:** `ai/agents/` (id `OL-AI-AGENTS-README`), the **Specification** authority layer.
- **Category:** Pure Domain Model (ADR-0024, category 1) - it owns the actor model of the AI layer; realized
  at this layer per ADR-0020 as an **immutable, stateless domain model** (no IO). ADR-0024 does not enumerate
  Agents among its examples; its category is declared here per ADR-0024 §42 (no new ADR). **Design:**
  [docs/implementation/18-agents.md](../../../docs/implementation/18-agents.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states agent truth as strongly-typed classifications, immutable definitions and invariants, and one pure
ordering predicate that expresses the agent specification verbatim. An agent is an actor of the AI layer:
this package defines what an agent is, and how an agent is composed, identified, capable, permitted,
specialized, coordinated, communicating, delegating, and evolved, so that work is performed by governed,
bounded, deterministic actors. It **performs no orchestration, no scheduling, and no execution, never reasons,
retrieves, or composes a prompt itself, and defines no orchestration system, framework, protocol, provider,
model, or code** (`ai/agents/README.md`, ADR-0020): an agent composes the operational namespaces under
governance, and the runtime orchestrates and executes it. It owns no runtime, no mutable state, no lifecycle,
no events, no IO, and no services.

### Why a Pure Domain Model with a predicate

ADR-0024 category 1 (Pure Domain Model) "contains domain models, classifications, immutable definitions, and
**pure predicates**" - the same shape as Governance, which also exposes ordering predicates. The agent's one
predicate is the constitution's own **ordering** over the agent-owned lifecycle phases, expressed verbatim as
a pure, total, deterministic predicate. The namespace owns the actor **model** (truth about what an agent is),
not orchestration or execution (owned by ai/runtime/) and not application composition or DI (owned by the
Operations namespace); the orchestration and execution of a concrete agent are the runtime's.

## Public API (single barrel, Engineering Rule 1)

All ten agent concerns from `ai/agents/`, plus the namespace-wide truth, are implemented as an immutable
model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the Agent
Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `agents.md`): `AgentInvariant` + `AGENT_INVARIANTS` (the eight agent invariants
  every concern instantiates); `AgentConcern` + `AGENT_CONCERNS` (the ten concerns). An agent is a
  deterministic, repeatable, scalable composition.
- **Agent architecture** (`agent-architecture.md`): principles, invariants, and `AgentPart` + `AGENT_PARTS`
  (the four parts an agent is composed of: identity, capabilities, permissions, specialization).
- **Agent lifecycle** (`agent-lifecycle.md`): principles, invariants, and `AgentLifecyclePhase` +
  `AGENT_LIFECYCLE_PHASES` (the five ordered phases: registration, discovery, activation, operation,
  retirement), with the pure predicate `agentPhaseAtOrAfter`.
- **Agent boundaries** (`agent-boundaries.md`): principles, invariants, and `AgentBoundary` +
  `AGENT_BOUNDARIES` (the six architectural boundaries: composition, truth, governance, execution,
  fault-isolation, implementation).
- **Agent capabilities, permissions, coordination, communication, delegation, specialization, versioning**
  (`agent-capabilities.md`, `agent-permissions.md`, `agent-coordination.md`, `agent-communication.md`,
  `agent-delegation.md`, `agent-specialization.md`, `agent-versioning.md`): principles and invariants; their
  Specification sections narrate heterogeneous process facets, not closed taxonomies the model refers to by
  identity, so they are definitions only (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). In
  particular, the coordination and communication topologies (supervisor/worker/peer; direct-to-broadcast) are
  described in prose rather than enumerated as a single closed set restated in the invariants, so no topology
  classification is modeled; and the capability, permission, and role-composition inheritance precedence
  (authority, then owner, then specificity/narrower-scope) applies the Authority Hierarchy (`ai/README.md`)
  and ownership map (`ai/architecture/`) and is stated as prose, never recreated as an executable precedence
  (referenced-model non-restatement; ADR-0025).

Every exported symbol traces directly to a frozen `ai/agents/` document. No agent runtime, orchestrator, or
executor (`run(agent)`, `orchestrate(agents)`) is exported; that boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Agents depends on the constitution, Governance, Reasoning,
Retrieval, Memory, Prompts, Tools, and Providers (dependency-cruiser `NAMESPACE_DEPS.agents = ['governance',
'reasoning', 'retrieval', 'memory', 'prompts', 'tools', 'providers']`). As a pure domain model it uses no type
owned by any of them and imports no package - it references those models, the runtime, the Authority
Hierarchy, and the knowledge repository in prose and never restates or imports them (ADR-0021, import only
what you use; referenced-model non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no reasoning, retrieval, memory, prompt, tool, provider, runtime, evaluation, or operations behavior,
no governance rule, and no business truth. It defines what an agent is and how agents relate; orchestrating,
scheduling, and executing an agent, and building the application that wires the namespaces together, are the
runtime's and the Operations namespace's, which consume this model.
