---
id: OL-AI-AGENTS-AGENT-COMMUNICATION
document: ai/agents/agent-communication.md

title: Open Lance AIOS Agent Communication

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
  Owns the communication model: how agents exchange information, and the
  communication topology. It owns the communication model only, and defers the
  coordination structure and any transport or protocol to their owners.
---

# Open Lance AIOS Agent Communication

This document owns the communication model of agents. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the communication model only. It never defines the coordination structure that directs agents, owned by ai/agents/agent-coordination.md, and it never defines any transport, channel, or protocol, which are implementation.

# Purpose

This document owns one agent concern: how agents exchange information, and the topology their communication forms. It exists so that any human or AI agent can determine how agents communicate, without ambiguity, independent of the coordination structure and of any transport that carries a message.

# Principles

These are the enduring principles for agent communication. Each instantiates an agent invariant owned by ai/agents/README.md.

- Communication is information exchange, not control. Communication carries information between agents; the structure of who directs whom is owned by ai/agents/agent-coordination.md.
- Communication is unambiguous. Every exchange has a defined sender and recipient identified by agent identity, so no message is ambiguous as to its parties.
- Communication is bounded and governed. An agent communicates only within its permissions, and information exchanged points to knowledge rather than restating business truth.
- Communication carries no truth of its own. A message references knowledge by its canonical owner; it never becomes or amends business truth.

# Specification

Agent communication is defined in the following way. This document owns the communication model and topology; the coordination structure is owned by ai/agents/agent-coordination.md, and any transport or protocol that carries a message is implementation.

- The communication model. Communication is the exchange of information between agents, from a defined sender to a defined recipient, each identified by the agent identity owned by ai/agents/agent-architecture.md. The model defines that agents exchange information and how the exchange is structured, never the content of any message and never a transport.
- Unambiguous addressing. Every exchange names its sender and recipient by identity, so no message is ambiguous as to who sent it or who is to receive it. An exchange whose parties are not both identified is not made.
- Communication topology. Agents communicate through a defined topology, from direct exchange between two agents to broadcast among many, that determines which agents may exchange information. The topology is defined and bounded; it never contradicts the coordination topology owned by ai/agents/agent-coordination.md.
- Governed and grounded exchange. An agent communicates only within its permissions under ai/agents/agent-permissions.md, and information it exchanges points to knowledge by its canonical owner rather than restating it, so communication carries no business truth of its own.

Communication defines how agents exchange information, unambiguously; the coordination structure is owned by ai/agents/agent-coordination.md, and any transport or protocol is implementation. The communication model is deterministic and the same at any scale.

# Invariants

- Every exchange has a defined sender and recipient, each identified by agent identity.
- An exchange whose parties are not both identified is not made.
- An agent communicates only within its permissions, and a message points to knowledge rather than restating business truth.
- The communication topology never contradicts the coordination topology.
- Defining communication never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the communication model only. It owns none of the following, and references each by its canonical owner.

- The coordination structure that directs agents: ai/agents/agent-coordination.md.
- The agent identity that names the parties: ai/agents/agent-architecture.md.
- The permissions an agent communicates within: ai/agents/agent-permissions.md.
- Any transport, channel, message format, or protocol: implementation, outside every knowledge document.
- Business truth a message references: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-coordination.md
- ai/agents/agent-architecture.md
- ai/agents/agent-permissions.md
