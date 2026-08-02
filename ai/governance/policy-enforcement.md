---
id: OL-AI-GOVERNANCE-POLICY-ENFORCEMENT
document: ai/governance/policy-enforcement.md

title: Open Lance AIOS Policy Enforcement Governance

version: 1.0
status: Frozen

document_type: normative
authority: Mandate

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/governance/README.md
  - ai/governance/governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - All human governors
  - Any contributor to the Governance namespace

provenance:
  - Executive Decision

loading_priority: Critical

summary: >
  Owns how AI policies are enforced, policy precedence, policy conflict
  resolution, and exception governance. It owns the governance of policy
  application only, and never the operational policies of each namespace nor
  the runtime that applies them.
---

# Open Lance AIOS Policy Enforcement Governance

This document owns how AI policies are enforced across the layer. It is a governance document at the Mandate authority level defined in ai/README.md, and it follows the Governance Document Standard in ai/governance/README.md. It instantiates the constitution's principles of constitutional operation and determinism, and it never restates or weakens them. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the governance of policy application only. It never defines the operational policies of any namespace, which those namespaces own, and it never defines the runtime that applies a policy, which is operational.

# Purpose

This document owns one governance concern: the rules by which AI policies are enforced, take precedence, and are resolved when they conflict, and how exceptions are governed. It exists so that any human or AI agent can determine which rule prevails and how, independent of how a policy is applied.

# Principles

These are the enduring governance principles for policy enforcement. Each instantiates a constitutional principle owned by ai/README.md.

- Policies precede runtime. A policy is defined and governed before it is applied, never discovered at execution time.
- Precedence follows authority. When policies conflict, the higher authority in the AI Authority Hierarchy prevails.
- Enforcement is consistent. The same policy applied to the same governed situation yields the same governed outcome.
- Exceptions are governed, not improvised. A deviation from a policy is a governed, accountable decision, never an agent's convenience.

# Mandates

These mandates are absolute.

- Enforced, not advisory. A policy that governs an action is enforced before the action proceeds; a governing policy is never treated as optional.
- Precedence by authority. When two policies conflict, the one at the higher authority level owned by ai/README.md prevails, and the lower conforms. A mandate always prevails over a policy, and a policy over a specification.
- Business truth prevails on business matters. Where an AI policy and a business rule owned by the knowledge repository bear on the same matter, the business truth governs, and the AI policy conforms to it, consumed by reference.
- Unresolved conflict escalates. A policy conflict that cannot be resolved by authority with confidence is escalated under ai/governance/escalation.md, never resolved by guessing.
- Governed exceptions only. An exception to a policy is permitted only through an accountable, governed decision under ai/governance/human-oversight.md and ai/governance/change-governance.md. An agent never grants itself an exception.
- No silent override. No policy, agent, or runtime silently overrides a higher policy or a mandate. Authority cannot be bypassed.

# Responsibilities

These responsibilities are assigned by role. The human roles are owned by ai/governance/human-oversight.md and referenced here, not defined.

- The acting agent is responsible for enforcing the governing policy, resolving conflicts by authority, and escalating a conflict it cannot resolve.
- Accountable humans are responsible for granting exceptions and for governing changes to policy.
- This namespace is responsible for the rules of enforcement and precedence; each operational namespace is responsible for its own policies within these rules.

# Boundaries

This document owns the governance of policy application only. It owns none of the following, and references each by its canonical owner.

- The operational policies of any namespace: those namespaces.
- The Authority Hierarchy that precedence draws on: ai/README.md.
- The runtime that applies or checks a policy: the operational namespaces and the runtime.
- The escalation of an unresolved conflict: ai/governance/escalation.md.
- The governed change or exception of a policy over time: ai/governance/change-governance.md and ai/governance/human-oversight.md.
- Any business rule that governs a business matter: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/governance/governance.md
- ai/governance/escalation.md
- ai/governance/human-oversight.md
- ai/governance/change-governance.md
