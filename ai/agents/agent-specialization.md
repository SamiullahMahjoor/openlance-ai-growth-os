---
id: OL-AI-AGENTS-AGENT-SPECIALIZATION
document: ai/agents/agent-specialization.md

title: Open Lance AIOS Agent Specialization

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
  Owns the specialization model: agent role ownership, role composition, and
  specialization. It owns the specialization model only, and defers the
  capabilities a role draws on and the mapping of agent categories to namespaces
  to their owners.
---

# Open Lance AIOS Agent Specialization

This document owns the specialization model of agents. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the specialization model only. It never defines the capabilities a role draws on, owned by ai/agents/agent-capabilities.md, and it never defines the mapping of agent categories to namespaces, owned by ai/architecture/agent-map.md.

# Purpose

This document owns one agent concern: how an agent is specialized to a role, who owns a role, and how roles compose. It exists so that any human or AI agent can determine what an agent is specialized to do and how roles combine, without ambiguity, independent of the capabilities the role draws on.

# Principles

These are the enduring principles for agent specialization. Each instantiates an agent invariant owned by ai/agents/README.md.

- An agent is specialized to a role. An agent holds a defined role that determines its purpose as an actor, so its responsibility is explicit.
- A role is single-owned. Each role has one owning definition, so no role is ambiguous and no responsibility is owned by two roles.
- Roles compose without ambiguity. A specialization may compose more than one role, and the composition resolves to a single, unambiguous responsibility.
- Specialization draws capability, not authority. A role determines the capabilities and permissions an agent needs, drawn from ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md, and never redefines them.

# Specification

An agent's specialization is defined in the following way. This document owns the specialization model; the capabilities and permissions a role draws on are owned by ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md, and the mapping of agent categories to namespaces is owned by ai/architecture/agent-map.md.

- Role ownership. A role is a defined responsibility an agent is specialized to, and each role has exactly one owning definition. Single ownership of a role prevents role ambiguity: no responsibility is claimed by two roles, and no agent holds an undefined role.
- Specialization. An agent is specialized by holding a role, which determines its purpose and the capabilities and permissions it draws on. Specialization narrows an agent to its responsibility; it never widens it beyond the role.
- Role composition. A specialization may compose more than one role into a combined responsibility. Composition resolves to a single, unambiguous responsibility: where composed roles overlap, they resolve by the higher-authority role, then the single owner, then the more specific role, mirroring the conflict resolution used across the agent model, so a composed specialization is never ambiguous.
- Specialization and the category map. The mapping of agent categories to the namespaces they consume is a derived map owned by ai/architecture/agent-map.md. This document owns the specialization model of an individual agent; it never restates that map.

Specialization determines what an agent is specialized to do and how roles compose, without ambiguity; the capabilities and permissions the role draws on are owned elsewhere. The specialization model is deterministic and the same at any scale.

# Invariants

- Each role has exactly one owning definition, so no role is ambiguous.
- An agent's specialization narrows it to a defined responsibility and never widens it beyond its role.
- Composed roles resolve to a single, unambiguous responsibility by authority, then owner, then specificity.
- Specialization draws on capabilities and permissions and never redefines them.
- Defining specialization never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the specialization model only. It owns none of the following, and references each by its canonical owner.

- The capabilities a role draws on: ai/agents/agent-capabilities.md.
- The permissions a role draws on: ai/agents/agent-permissions.md.
- The coordination between specialized agents: ai/agents/agent-coordination.md.
- The mapping of agent categories to namespaces: ai/architecture/agent-map.md.
- The business roles and responsibilities of the organization: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- ai/agents/agent-coordination.md
- ai/architecture/agent-map.md
