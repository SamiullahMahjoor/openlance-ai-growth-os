---
id: OL-AI-GOVERNANCE-PERMISSION-GOVERNANCE
document: ai/governance/permission-governance.md

title: Open Lance AIOS Permission Governance

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
  Owns the permission philosophy, least privilege, delegated authority,
  permission ownership, and authority boundaries. It owns the governance of
  permissions only, and never the definition of any agent's permissions,
  owned by the Agents namespace, nor any runtime permission check.
---

# Open Lance AIOS Permission Governance

This document owns how permissions are governed in the AI layer. It is a governance document at the Mandate authority level defined in ai/README.md, and it follows the Governance Document Standard in ai/governance/README.md. It instantiates the constitution's principle of bounded autonomy, and it never restates or weakens it. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the governance of permissions only. It never defines the permissions or capabilities of any specific agent, which are owned by the Agents namespace, and it never defines a runtime permission check, which is operational.

# Purpose

This document owns one governance concern: the rules that bound what authority an agent may hold and exercise. It exists so that any human or AI agent can determine the rules a permission must satisfy, independent of how permissions are defined or checked.

# Principles

These are the enduring governance principles for permissions. Each instantiates a constitutional principle owned by ai/README.md.

- Least privilege. An agent holds the minimum authority its role requires, and no more.
- Permission is granted, never assumed. An agent acts only on authority it has been granted, and never on authority it has not.
- Authority is delegated, never invented. Delegated authority flows from an accountable human and never exceeds the authority of the delegator.
- Permission is bounded. No permission grants authority above the granting authority, and no permission crosses the AI boundary or the cross-layer boundary.
- Permission is accountable. Every grant of authority traces to an accountable human owner.

# Mandates

These mandates are absolute.

- Minimum necessary. An agent is granted only the authority its role genuinely requires, and unused authority is not granted.
- Explicit grant. An agent exercises only authority explicitly granted to it. Absence of a grant is a denial, not a default permission.
- Bounded delegation. Delegated authority never exceeds the authority of the delegator, and a delegate may not delegate authority it does not hold.
- No escalation of privilege. No permission, delegation, or runtime action raises an agent's authority above what an accountable human granted. Authority cannot be bypassed.
- Boundary-respecting. No permission grants the ability to own or write business truth, to change ownership of a concern, or to act outside the AI boundary owned by ai/README.md.
- Accountable ownership. Every grant of authority has an accountable human owner, under ai/governance/human-oversight.md, and is changed only through governed change under ai/governance/change-governance.md.
- Revocable. Any grant of authority can be withdrawn by an accountable human at any time, and the agent complies.

# Responsibilities

These responsibilities are assigned by role. The human roles are owned by ai/governance/human-oversight.md and referenced here, not defined.

- Accountable humans are responsible for granting, bounding, and revoking authority, and for owning every grant.
- Agents are responsible for exercising only granted authority, for never escalating their own privilege, and for escalating rather than acting without a grant.
- This namespace is responsible for the rules that bound permissions; the Agents namespace is responsible for defining specific permissions and capabilities within those rules.

# Boundaries

This document owns the governance of permissions only. It owns none of the following, and references each by its canonical owner.

- The definition of any agent's permissions and capabilities: the Agents namespace, ai/agents/.
- The runtime that checks or enforces a permission at execution: the operational namespaces and the runtime.
- The Authority Hierarchy that permissions operate within: ai/README.md.
- The human accountability behind a grant: ai/governance/human-oversight.md.
- The governed change of a grant over time: ai/governance/change-governance.md.
- The autonomy that permissions help bound: ai/governance/autonomy-boundaries.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/governance/governance.md
- ai/governance/human-oversight.md
- ai/governance/autonomy-boundaries.md
- ai/governance/change-governance.md
