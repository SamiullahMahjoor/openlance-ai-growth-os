---
id: OL-AI-AGENTS-AGENT-DELEGATION
document: ai/agents/agent-delegation.md

title: Open Lance AIOS Agent Delegation

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

loading_priority: Contextual

summary: >
  Owns the delegation model: the delegation chain and delegated authority,
  bounded so delegation is finite. It owns the delegation model only, and defers
  the permission philosophy and the coordination topology to their owners.
---

# Open Lance AIOS Agent Delegation

This document owns the delegation model of agents. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the delegation model only. It never defines the permission philosophy delegation applies, owned by ai/governance/permission-governance.md, and it never defines the coordination topology, owned by ai/agents/agent-coordination.md.

# Purpose

This document owns one agent concern: how one agent delegates authority to another, the chain such delegation forms, and how that chain is bounded so it is always finite. It exists so that any human or AI agent can determine how authority is passed between agents, without unbounded or infinite delegation, independent of the coordination structure.

# Principles

These are the enduring principles for agent delegation. Each instantiates an agent invariant owned by ai/agents/README.md.

- Delegation passes authority within authority. An agent delegates only authority it holds, and never more, applying the delegated authority owned by ai/governance/permission-governance.md.
- Delegation narrows or preserves; it never widens. A delegated permission is at most what the delegator holds, so authority never grows down a delegation chain.
- The delegation chain is bounded and acyclic. Delegation forms a finite, acyclic chain, so no infinite delegation and no delegation cycle are possible.
- Delegation is revocable and accountable. A delegation is traceable to its delegator, and the delegator remains accountable for the authority it passed.

# Specification

Agent delegation is defined in the following way. This document owns the delegation model; the permission philosophy and delegated authority are owned by ai/governance/permission-governance.md and applied here, and the coordination topology is owned by ai/agents/agent-coordination.md.

- Delegated authority. An agent may delegate a permission it holds to another agent, conferring authority the recipient did not otherwise hold. An agent delegates only within its own permissions under ai/agents/agent-permissions.md, so no agent can confer more than it holds, and no agent obtains authority by delegation that its delegator lacked.
- The delegation chain. Delegation may pass from one agent to another and onward, forming a delegation chain. Each link narrows or preserves the authority passed, so authority never widens along the chain.
- Bounded and acyclic delegation. A delegation chain is finite and acyclic: an agent never delegates to an agent that already holds authority earlier in the same chain, and the chain has a bounded depth, so infinite delegation and delegation cycles are impossible. A delegation that would exceed the bound or close a cycle is refused or escalated under ai/governance/escalation.md.
- Accountability. Every delegation is traceable to the delegator, and the delegator remains accountable for the authority it passed, consistent with the human accountability owned by ai/governance/human-oversight.md. Revoking or expiring a delegation withdraws the delegated authority.

Delegation defines how authority passes between agents, finitely and within authority; the permission philosophy is owned by ai/governance/permission-governance.md, and the coordination structure is owned by ai/agents/agent-coordination.md. The delegation model is deterministic and the same at any scale.

# Invariants

- An agent delegates only authority it holds, and a delegated permission never exceeds the delegator's.
- Authority never widens along a delegation chain.
- A delegation chain is finite and acyclic, so infinite delegation and delegation cycles are impossible.
- Every delegation is traceable to its delegator, who remains accountable for it.
- Delegating authority never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the delegation model only. It owns none of the following, and references each by its canonical owner.

- The permission philosophy, least privilege, and delegated authority: ai/governance/permission-governance.md.
- The permissions an agent holds and may delegate: ai/agents/agent-permissions.md.
- The coordination topology among delegating agents: ai/agents/agent-coordination.md.
- The human accountability a delegator remains subject to: ai/governance/human-oversight.md.
- The refusal or escalation of an out-of-bound or cyclic delegation: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-permissions.md
- ai/agents/agent-coordination.md
- ai/governance/permission-governance.md
- ai/governance/human-oversight.md
- ai/governance/escalation.md
