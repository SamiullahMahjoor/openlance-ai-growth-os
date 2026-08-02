---
id: OL-AI-AGENTS-AGENT-CAPABILITIES
document: ai/agents/agent-capabilities.md

title: Open Lance AIOS Agent Capabilities

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

loading_priority: Required

summary: >
  Owns the capability model: what an agent can do, and capability inheritance. It
  owns the capability model only, and defers what an agent may do and the
  internal work of a composed namespace to their owners.
---

# Open Lance AIOS Agent Capabilities

This document owns the capability model of an agent. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the capability model only. It never defines what an agent may do, owned by ai/agents/agent-permissions.md, and it never defines the internal work of a composed namespace, owned by that namespace.

# Purpose

This document owns one agent concern: what an agent can do, expressed as capabilities, and how capabilities are inherited. It exists so that any human or AI agent can determine the abilities an agent holds, independent of whether it is permitted to use them and of how any ability is carried out.

# Principles

These are the enduring principles for agent capabilities. Each instantiates an agent invariant owned by ai/agents/README.md.

- A capability is an ability, not a permission. A capability is what an agent can do; whether it may do it is owned by ai/agents/agent-permissions.md.
- A capability composes a namespace; it never owns it. A capability is an agent's ability to use an operational namespace, and it performs none of that namespace's internal work.
- Capabilities are explicit and bounded. An agent holds a defined set of capabilities, and it can do nothing outside them.
- Capability inheritance is single and acyclic. A capability inherited from a role or a base agent resolves through a single, acyclic inheritance, so capabilities never conflict or cycle.

# Specification

An agent's capabilities are defined in the following way. This document owns the capability model; what an agent may do is owned by ai/agents/agent-permissions.md, and the internal work of a composed namespace is owned by that namespace.

- The capability model. A capability is an agent's defined ability to use an operational namespace or to perform a class of action: to reason through ai/reasoning/, to retrieve knowledge through ai/retrieval/, to draw retained context through ai/memory/, to express instructions through ai/prompts/, and, in future, to act through the Tools namespace and to execute through the Providers namespace. A capability names the ability; it never performs the work, which the composed namespace owns.
- Bounded ability. An agent holds a defined, explicit set of capabilities and can do nothing outside it. A capability the agent does not hold is not available to it, regardless of permission.
- Capability inheritance. An agent may inherit capabilities from its specialization under ai/agents/agent-specialization.md or from a base agent, through a single, acyclic inheritance. Where inherited capabilities overlap, they resolve by the higher-authority definition, then the single owner, then the more specific, so capabilities never conflict; an unresolvable capability conflict is escalated under ai/governance/escalation.md rather than guessed.
- Capability against permission. A capability is necessary but not sufficient to act: an agent acts only where it both holds the capability and is permitted under ai/agents/agent-permissions.md. This separation keeps ability distinct from authority.

Capabilities define what an agent can do; whether it may is owned by ai/agents/agent-permissions.md, and how each ability is carried out is owned by the composed namespace. The capability model is deterministic and the same at any scale.

# Invariants

- A capability names an agent's ability to use a namespace or perform a class of action, and never performs that work.
- An agent can do nothing outside its defined set of capabilities.
- Capability inheritance is single and acyclic, and overlapping capabilities resolve by authority, then owner, then specificity.
- An agent acts only where it both holds the capability and is permitted, so ability never implies authority.
- Defining capabilities never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the capability model only. It owns none of the following, and references each by its canonical owner.

- What an agent may do, and permission inheritance: ai/agents/agent-permissions.md.
- The internal work of a composed namespace: ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/, and, in future, the Tools and Providers namespaces.
- The specialization a capability may be inherited from: ai/agents/agent-specialization.md.
- The delegation of a capability to another agent: ai/agents/agent-delegation.md.
- The escalation of an unresolvable capability conflict: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-permissions.md
- ai/agents/agent-specialization.md
- ai/agents/agent-delegation.md
- ai/governance/escalation.md
