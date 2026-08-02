---
id: OL-AI-AGENTS-AGENT-VERSIONING
document: ai/agents/agent-versioning.md

title: Open Lance AIOS Agent Versioning

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
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns agent versioning, evolution, change governance consumption, and version
  compatibility. It owns agent versioning only, and defers the document amendment
  workflow and the repository evolution map to their owners.
---

# Open Lance AIOS Agent Versioning

This document owns how an agent definition is versioned and evolves. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns agent versioning only. It never defines the document amendment workflow, owned by ai/CONTRIBUTING.md, and it never defines the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Purpose

This document owns one agent concern: how an agent definition is versioned, how it evolves over time under governed change, and how versions remain compatible with the agents and roles that depend on them. It exists so that any human or AI agent can determine how an agent definition changes without breaking the agents that depend on it, independent of how the change is carried out.

# Principles

These are the enduring principles for agent versioning. Each instantiates an agent invariant owned by ai/agents/README.md.

- An agent definition is versioned. An agent, role, capability set, or permission set carries a version, so a change is identified and traceable.
- Change is governed. An agent definition evolves only under the change rules owned by ai/governance/, never arbitrarily and never by an agent changing itself outside its authority.
- Compatibility is preserved or versioned. A change a dependent agent or role can still rely on preserves compatibility; a change it cannot is a new version, so a dependent agent is never silently broken.
- Versioning governs definitions, not truth. Versioning applies to agent architecture, never to business truth, which is versioned by the knowledge repository.

# Specification

An agent definition is versioned and evolves in the following way. This document owns agent versioning; the permission to change is owned by ai/governance/change-governance.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Agent versioning. An agent definition, a role, a capability set, or a permission set carries a version that identifies it, so a change to it is explicit and traceable, and the agents and roles that depend on it can be determined through the inheritance and specialization owned by ai/agents/agent-capabilities.md, ai/agents/agent-permissions.md, and ai/agents/agent-specialization.md.
- Agent evolution. An agent definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the agent model grows without redesign and without a running agent altering its own definition beyond its authority. Evolution never rewrites business truth.
- Version compatibility. A change is compatible when an agent or role that depends on the changed definition still resolves correctly against it; such a change preserves the version's compatibility. A change a dependent cannot absorb is issued as a new version, and the dependent is migrated to it deliberately, never broken silently. This prevents version incompatibility across a multi-agent system.
- Change governance and conflict. What change is permitted, reviewed, and approved is owned by ai/governance/change-governance.md, which this document applies and never restates. A change that would conflict with a higher-authority definition resolves by the authority-then-owner-then-specificity precedence used across the agent model.

Versioning keeps agent definitions identified, governed, and compatible as they evolve; the versioning of a document in this namespace, and of the repository, are owned by ai/CONTRIBUTING.md and ai/architecture/repository-evolution.md. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- An agent definition carries a version, so a change to it is explicit and traceable.
- An agent definition evolves only under the governed change rules, and never by an agent changing itself beyond its authority.
- A change a dependent agent or role cannot absorb is a new version, so no dependent is broken silently.
- Versioning applies to agent architecture, never to business truth.
- Versioning an agent never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns agent versioning only. It owns none of the following, and references each by its canonical owner.

- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The amendment workflow for a document in this namespace: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The capability, permission, and specialization definitions a version tracks: ai/agents/agent-capabilities.md, ai/agents/agent-permissions.md, and ai/agents/agent-specialization.md.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- ai/agents/agent-specialization.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
