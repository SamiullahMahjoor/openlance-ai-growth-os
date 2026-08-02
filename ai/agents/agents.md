---
id: OL-AI-AGENTS-AGENTS
document: ai/agents/agents.md

title: Open Lance AIOS Agents Inventory

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/agents/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/agents/README.md and the AI agents namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's agent concerns. It owns the identity
  and existence of each agent concern, and the agent determinism, repeatability,
  and scalability properties. It owns no agent model, no business truth, and no
  governance rule.
---

# Open Lance AIOS Agents Inventory

This document is the canonical inventory of the AI layer's agent concerns. It owns the identity of the Agents namespace and the list of agent concerns the namespace owns, so that any human or AI agent can determine, from one place, which agent concerns exist and which document owns each. It also owns the namespace-wide properties of determinism, repeatability, and scalability. It is a reference document and follows the inventory pattern, not the Agent Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no agent model, no business truth, and no governance rule. How agent architecture is documented is owned by ai/agents/README.md. Each agent concern is owned by its own document. On any matter of business truth, the knowledge repository governs.

# Purpose

This document exists so that the set of the AI layer's agent concerns has a single canonical list, and so that the agent properties that hold across the whole namespace have one owner. It answers which agent concerns the namespace owns, which document owns each, and why an agent is deterministic, repeatable, and scalable.

# Scope

This inventory lists every agent concern the namespace owns, and states the determinism, repeatability, and scalability of agents. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document. This is the agent ownership and role matrix in its canonical form.

# Agent Role

An agent is an actor of the AI Operating System. It sits at the Specification authority level, below the constitution and the governance mandates, composing the reasoning, retrieval, memory, and prompt namespaces to perform work, orchestrated and executed by the runtime, and bounded by the rules governance sets. An agent consumes truth by reference and owns none of it, and it owns none of the reasoning, retrieval, execution, expression, or persistence it composes.

# Determinism

An agent is a deterministic composition. The same agent definition, under the same governing rules, resolves to the same identity, capabilities, permissions, specialization, and coordination position, with no randomness and no hidden step, because the resolution is a function of the definition and the rules alone, applied through defined capability and permission inheritance. Because an agent composes namespaces that are themselves deterministic, the reasoning, retrieval, memory, and prompt namespaces, the same agent over the same inputs behaves the same way. Agent determinism is the determinism of the actor's definition and composition; the determinism of each composed behavior is owned by that behavior's namespace, and the determinism of the execution that carries the agent is owned by ai/runtime/.

# Repeatability

An agent is repeatable: because it is deterministic and every capability, permission, and inherited part is explicit and traceable, the same definition resolves to the same agent and reproduces the same behavior over the same inputs. Repeatability is the reproducibility of a deterministic, single-owned composition; it is owned here as a property of the namespace, and it never depends on a provider, model, framework, or orchestration system.

# Scalability

Agents scale without redesign. The agent model composes a bounded actor from bounded capabilities, permissions, and a role, and coordinates bounded actors through acyclic topologies, so it applies the same way whether the AI runs one agent or tens of thousands of cooperating agents, and whether it organizes a single agent or a future autonomous organization of many. Because agent architecture is provider-neutral, the same agent model is portable across any provider, runtime, or orchestration system. Growth in the number of agents, roles, capabilities, or coordination relationships is absorbed additively, without changing the agent model.

# The Agent Concerns

The Agents namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Agent Architecture

- Document. ai/agents/agent-architecture.md.
- Owns. The architectural definition of an agent: its identity and the parts it is composed of, and how it composes the operational namespaces.
- Out of scope. The lifecycle of an agent, owned by ai/agents/agent-lifecycle.md; the role model, owned by ai/agents/agent-specialization.md.

## Agent Lifecycle

- Document. ai/agents/agent-lifecycle.md.
- Owns. The phases of an agent, including registration, activation, operation, and retirement, and agent discovery.
- Out of scope. The ordered execution the agent serves, owned by ai/runtime/; the versioning of an agent definition, owned by ai/agents/agent-versioning.md.

## Agent Capabilities

- Document. ai/agents/agent-capabilities.md.
- Owns. The capability model: what an agent can do, and capability inheritance.
- Out of scope. What an agent may do, owned by ai/agents/agent-permissions.md; the namespaces a capability composes, owned by those namespaces.

## Agent Permissions

- Document. ai/agents/agent-permissions.md.
- Owns. The permission model: what an agent may do under least privilege, and permission inheritance.
- Out of scope. The permission philosophy and governance, owned by ai/governance/permission-governance.md; what an agent can do, owned by ai/agents/agent-capabilities.md.

## Agent Coordination

- Document. ai/agents/agent-coordination.md.
- Owns. The coordination model: the agent hierarchy, supervisor and worker and peer topologies, and the coordination topology.
- Out of scope. The message exchange between agents, owned by ai/agents/agent-communication.md; the runtime orchestration and scheduling, owned by ai/runtime/.

## Agent Communication

- Document. ai/agents/agent-communication.md.
- Owns. The communication model: how agents exchange information, and the communication topology.
- Out of scope. The coordination structure that directs agents, owned by ai/agents/agent-coordination.md; any transport or protocol, which is implementation.

## Agent Delegation

- Document. ai/agents/agent-delegation.md.
- Owns. The delegation model: the delegation chain and delegated authority, bounded so delegation is finite.
- Out of scope. The permission philosophy delegation applies, owned by ai/governance/permission-governance.md; the coordination topology, owned by ai/agents/agent-coordination.md.

## Agent Specialization

- Document. ai/agents/agent-specialization.md.
- Owns. The specialization model: agent role ownership, role composition, and specialization.
- Out of scope. The capabilities a role draws on, owned by ai/agents/agent-capabilities.md; the mapping of agent categories to namespaces, owned by ai/architecture/agent-map.md.

## Agent Boundaries

- Document. ai/agents/agent-boundaries.md.
- Owns. What agents never own, where an agent stops, and agent fault isolation.
- Out of scope. The governance rules that bound agents, owned by ai/governance/; the runtime boundaries, owned by ai/runtime/execution-boundaries.md.

## Agent Versioning

- Document. ai/agents/agent-versioning.md.
- Owns. Agent versioning, evolution, change governance consumption, and version compatibility.
- Out of scope. The document amendment workflow, owned by ai/CONTRIBUTING.md; the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Boundaries

This inventory owns the identity and existence of the agent concerns, and the determinism, repeatability, and scalability of agents, only. It owns none of the following.

- How agent architecture is documented: ai/agents/README.md.
- The model of any agent concern: that concern's own document.
- Business truth: the knowledge repository.
- The rules that govern agents: ai/governance/.
- The execution, reasoning, retrieval, expression, and persistence an agent composes: ai/runtime/, ai/reasoning/, ai/retrieval/, ai/prompts/, and ai/memory/.
- The mapping of agent categories to namespaces: ai/architecture/agent-map.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/architecture/ownership-map.md
- ai/architecture/agent-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct agent concern, a new document is added under ai/agents/ following ai/agents/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- Future consumption. When the Tools and Providers namespaces are created, the capabilities an agent composes from them are owned by ai/agents/agent-capabilities.md, additively and without redesign, and this inventory records only that the concern exists.
