---
id: OL-AI-AGENTS-AGENT-COORDINATION
document: ai/agents/agent-coordination.md

title: Open Lance AIOS Agent Coordination

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
  Owns the coordination model: the agent hierarchy, supervisor and worker and
  peer topologies, and the coordination topology. It owns the coordination model
  only, and defers the message exchange and the runtime orchestration to their
  owners.
---

# Open Lance AIOS Agent Coordination

This document owns the coordination model of agents. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the coordination model only. It never defines the message exchange between agents, owned by ai/agents/agent-communication.md, and it never defines the runtime orchestration and scheduling, owned by ai/runtime/.

# Purpose

This document owns one agent concern: how multiple agents coordinate, the structure of who directs whom, and the topology their coordination forms. It exists so that any human or AI agent can determine how agents are organized to work together, without cycles, independent of how they exchange messages or how their work is scheduled.

# Principles

These are the enduring principles for agent coordination. Each instantiates an agent invariant owned by ai/agents/README.md.

- Coordination is structure, not execution. Coordination defines how agents relate and direct one another; the scheduling and execution of their work is owned by ai/runtime/.
- The coordination topology is acyclic. Agents coordinate through a directed, acyclic topology, so no circular coordination is possible.
- Direction follows authority. In a hierarchy, a supervising agent directs a working agent only within the authority it holds, never beyond it.
- Peers coordinate without a cycle. Peer agents coordinate as equals through a topology that remains acyclic, so mutual direction never forms a loop.

# Specification

Agent coordination is defined in the following way. This document owns the coordination model and topology; the message exchange that carries coordination is owned by ai/agents/agent-communication.md, and the orchestration and scheduling of the work is owned by ai/runtime/.

- The coordination model. Coordination is the structure by which agents work together toward a shared outcome. It defines which agents direct which, and how work is distributed among them, as a relationship between actors, never as an execution.
- Supervisor and worker topology. A supervising agent may direct one or more working agents, forming a hierarchy from supervisor to worker. Direction flows downward within the supervisor's authority, and a working agent never directs its supervisor, so the hierarchy is acyclic.
- Peer topology. Agents may coordinate as peers, without a supervising agent, through a topology in which coordination relationships remain directed and acyclic, so peer coordination never forms a cycle.
- Acyclic coordination. Across hierarchical and peer topologies, the coordination relationships form a directed acyclic structure. A coordination that would close a cycle is not formed; it is refused or escalated under ai/governance/escalation.md. This prevents circular coordination and, with the bounded delegation owned by ai/agents/agent-delegation.md, keeps multi-agent structures finite.

Coordination defines how agents are organized to work together, acyclically; the messages they exchange are owned by ai/agents/agent-communication.md, and the orchestration and execution of the work are owned by ai/runtime/. The coordination model is deterministic and the same for a few agents or tens of thousands, and it scales to future autonomous organizations without redesign.

# Invariants

- Coordination defines the structure of who directs whom, never the execution of the work.
- The coordination topology is directed and acyclic, so no circular coordination is possible.
- A supervising agent directs a working agent only within the authority it holds.
- A coordination that would form a cycle is refused or escalated, never established.
- Defining coordination never executes, orchestrates, schedules, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the coordination model only. It owns none of the following, and references each by its canonical owner.

- The message exchange that carries coordination: ai/agents/agent-communication.md.
- The delegation of authority among coordinating agents: ai/agents/agent-delegation.md.
- The runtime orchestration, scheduling, and execution of the coordinated work: ai/runtime/.
- The permissions a supervising agent directs within: ai/agents/agent-permissions.md.
- The refusal or escalation of a cyclic coordination: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-communication.md
- ai/agents/agent-delegation.md
- ai/agents/agent-permissions.md
- ai/runtime/README.md
- ai/governance/escalation.md
