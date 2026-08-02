---
id: OL-AI-AGENTS-AGENT-BOUNDARIES
document: ai/agents/agent-boundaries.md

title: Open Lance AIOS Agent Boundaries

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/agents/README.md
  - ai/agents/agents.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns what agents never own, where an agent stops, and agent fault isolation. It
  owns the boundaries of agents only, and defers the governance rules that bound
  them and the concerns of the surrounding namespaces to their owners.
---

# Open Lance AIOS Agent Boundaries

This document owns the architectural boundaries of agents. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of agents only. It never defines the governance rules that bound agents, owned by ai/governance/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one agent concern: what an agent never owns, where an agent stops, and how an agent's fault is isolated to it. It exists so that any human or AI agent can determine the limits of an agent, independent of how those limits are enforced.

# Principles

These are the enduring principles for agent boundaries. Each instantiates an agent invariant owned by ai/agents/README.md.

- An agent composes; it does not own. An agent composes the operational namespaces and owns none of them, and it never owns business truth.
- An agent acts within its bounds. An agent acts only within its capabilities, permissions, and autonomy bounds, and escalates rather than exceed them.
- An agent does not execute itself. An agent is orchestrated and executed by the runtime; it never orchestrates, schedules, or executes.
- An agent's fault is isolated. A failing agent is bounded so that its failure does not corrupt another agent or the shared layers.

# Specification

An agent operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/, and the concerns beyond them by their namespaces.

- Composition boundary. An agent composes reasoning, retrieval, memory, and prompts, and, in future, tools and providers, and owns none of them. It never performs the internal work of a composed namespace, which each namespace owns.
- Truth boundary. An agent consumes business truth by reference and never owns, restates, amends, or becomes it, which is owned by the knowledge repository.
- Governance boundary. An agent acts within its capabilities under ai/agents/agent-capabilities.md, its permissions under ai/agents/agent-permissions.md, and the autonomy bounds owned by ai/governance/autonomy-boundaries.md. It never escalates its own authority and escalates rather than exceed its bounds, under ai/governance/escalation.md.
- Execution boundary. An agent is orchestrated, scheduled, and executed by ai/runtime/. An agent never orchestrates, schedules, or executes, and it never selects a provider or model, which is owned by the Providers namespace.
- Fault isolation boundary. An agent's failure is bounded to the agent. A failing agent never corrupts another agent, the shared namespaces, or business truth; its fault is contained, and its work is escalated or retired under governance rather than propagated.
- Implementation boundary. An agent is a model of an actor, never an orchestration system, a framework, a protocol, a provider, a model, or code.

An action that would cross any of these boundaries does not proceed; it is refused or escalated under ai/governance/escalation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- An agent composes the operational namespaces and owns none of them, and never owns business truth.
- An agent acts only within its capabilities, permissions, and autonomy bounds, and never escalates its own authority.
- An agent never orchestrates, schedules, executes, or selects a provider or model.
- A failing agent's fault is bounded to it and never corrupts another agent or the shared layers.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of agents only. It owns none of the following, and references each by its canonical owner.

- The governance rules, autonomy bounds, and escalation that bound agents: ai/governance/autonomy-boundaries.md and ai/governance/escalation.md.
- The runtime boundaries of an execution: ai/runtime/execution-boundaries.md.
- The capabilities and permissions an agent is bounded by: ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md.
- The concerns of the composed namespaces: ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/, and, in future, the Tools and Providers namespaces.
- Any mechanism that enforces a boundary or isolates a fault: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- ai/runtime/execution-boundaries.md
- ai/governance/autonomy-boundaries.md
- ai/governance/escalation.md
