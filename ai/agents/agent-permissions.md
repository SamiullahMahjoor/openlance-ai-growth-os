---
id: OL-AI-AGENTS-AGENT-PERMISSIONS
document: ai/agents/agent-permissions.md

title: Open Lance AIOS Agent Permissions

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
  - ai/governance/permission-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the permission model: what an agent may do under least privilege, and
  permission inheritance. It owns the agent permission model only, and defers the
  permission philosophy and governance and what an agent can do to their owners.
---

# Open Lance AIOS Agent Permissions

This document owns the permission model of an agent. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the agent permission model only. It never defines the permission philosophy and governance, owned by ai/governance/permission-governance.md, and it never defines what an agent can do, owned by ai/agents/agent-capabilities.md. It defines an agent's permissions, which ai/governance/permission-governance.md places under the Agents namespace.

# Purpose

This document owns one agent concern: what an agent may do, expressed as permissions under least privilege, and how permissions are inherited. It exists so that any human or AI agent can determine the authority an agent holds, independent of what it is able to do and of the permission rules it applies.

# Principles

These are the enduring principles for agent permissions. Each instantiates an agent invariant owned by ai/agents/README.md.

- A permission is authority, not ability. A permission is what an agent may do; what it can do is owned by ai/agents/agent-capabilities.md.
- Least privilege is the default. An agent holds the minimum permissions its role requires and no more, applying the least privilege owned by ai/governance/permission-governance.md.
- An agent never escalates its own permissions. An agent cannot grant itself authority; a permission is granted by delegated authority under ai/agents/agent-delegation.md and never assumed.
- Permission inheritance is single and acyclic. A permission inherited from a role or a base agent resolves through a single, acyclic inheritance, so permissions never conflict or cycle.

# Specification

An agent's permissions are defined in the following way. This document owns the agent permission model, which ai/governance/permission-governance.md assigns to the Agents namespace; the permission philosophy, least privilege, and authority boundaries are owned by ai/governance/permission-governance.md and applied here.

- The permission model. A permission is an agent's granted authority to exercise a capability in a defined scope. An agent may act only where it both holds the capability under ai/agents/agent-capabilities.md and holds the permission defined here. A capability without a permission is not exercised.
- Least privilege. An agent holds the minimum permissions its specialization requires, and no more, applying the least privilege owned by ai/governance/permission-governance.md. Unused authority is not granted.
- No self-escalation. An agent never widens its own permissions. Authority is conferred by delegation under ai/agents/agent-delegation.md within the delegator's own authority, so no agent obtains more than was delegated, and any attempt to exceed granted authority is refused or escalated under ai/governance/escalation.md.
- Permission inheritance. An agent may inherit permissions from its specialization under ai/agents/agent-specialization.md or from a base agent, through a single, acyclic inheritance. Where inherited permissions overlap, they resolve by the higher-authority grant, then the single owner, then the narrower scope, so permissions never conflict; the narrower, least-privilege grant is preferred, and an unresolvable conflict is escalated rather than guessed.

Permissions define what an agent may do; what it can do is owned by ai/agents/agent-capabilities.md, and the permission philosophy is owned by ai/governance/permission-governance.md. The permission model is deterministic and the same at any scale.

# Invariants

- A permission is granted authority under least privilege, distinct from a capability.
- An agent acts only where it holds both the capability and the permission.
- An agent never escalates its own permissions, and any attempt to exceed granted authority is refused or escalated.
- Permission inheritance is single and acyclic, and overlapping permissions resolve by authority, then owner, then narrower scope.
- Defining permissions never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the agent permission model only. It owns none of the following, and references each by its canonical owner.

- The permission philosophy, least privilege, delegated authority, permission ownership, and authority boundaries: ai/governance/permission-governance.md.
- What an agent can do, and capability inheritance: ai/agents/agent-capabilities.md.
- The delegation by which authority is conferred: ai/agents/agent-delegation.md.
- The specialization permissions may be inherited from: ai/agents/agent-specialization.md.
- The refusal or escalation of an over-authority action: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-delegation.md
- ai/agents/agent-specialization.md
- ai/governance/permission-governance.md
- ai/governance/escalation.md
