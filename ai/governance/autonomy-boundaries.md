---
id: OL-AI-GOVERNANCE-AUTONOMY-BOUNDARIES
document: ai/governance/autonomy-boundaries.md

title: Open Lance AIOS Autonomy Boundaries Governance

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
  Owns what autonomous AI may do, must not do, must escalate, and must
  refuse, and the governance autonomy levels. It owns the governance bounds
  of autonomy only, and never the runtime that enforces them.
---

# Open Lance AIOS Autonomy Boundaries Governance

This document owns the bounds of autonomous AI action. It is a governance document at the Mandate authority level defined in ai/README.md, and it follows the Governance Document Standard in ai/governance/README.md. It instantiates the constitution's principles of bounded autonomy, human governance, and safe failure, and it never restates or weakens them. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the governance bounds of autonomy only. It never defines the runtime that enforces a bound, which is operational, and it never defines a workflow, a score, or a mechanism.

# Purpose

This document owns one governance concern: exactly what autonomous AI may do, must not do, must escalate, and must refuse. It exists so that any human or AI agent can determine, before acting, whether an action is within bounds.

# Principles

These are the enduring governance principles for autonomy. Each instantiates a constitutional principle owned by ai/README.md.

- Autonomy is bounded and granted. An agent acts autonomously only within bounds granted to it, never beyond them.
- More autonomy requires more governance. Greater operational autonomy carries greater oversight, not less.
- Safe failure. When an action is uncertain, unsupported, or outside bounds, the agent refuses or escalates, never invents.
- Bounds hold under scale. The same bounds govern one agent and many thousands identically, without redesign.

# Governance Autonomy Levels

Autonomy is described by governance levels of increasing operational independence. These levels are a governance classification only. This document states the governance expectation at each level; it defines no runtime capability, mechanism, or implementation.

- Assisted. The agent proposes and a human acts or approves. Every significant action requires human approval before it proceeds.
- Supervised. The agent acts within narrow bounds, and significant actions are surfaced for human review before or promptly after they proceed, under ai/governance/escalation.md.
- Bounded. The agent acts autonomously within granted authority and low-to-moderate trust levels, escalating anything higher, as owned by ai/governance/risk-management.md.
- Governed. The agent acts autonomously across a broader scope under standing governance, with High and Critical actions still escalated or approved by a human.

An agent's autonomy level is granted through permission governance under ai/governance/permission-governance.md and changed only through ai/governance/change-governance.md. No agent raises its own autonomy level.

# Mandates

These mandates are absolute. They define the four bounds of autonomous action.

- May do. An agent may act autonomously only within its granted authority, its granted autonomy level, and the trust levels those permit, and only after the action passes constitutional validation under ai/governance/constitutional-validation.md.
- Must not do. An agent must not exceed its authority or autonomy level, must not own or write business truth, must not change the ownership of a concern, must not escalate its own privilege or autonomy, and must not take a Critical action autonomously.
- Must escalate. An agent must escalate whenever an action meets an escalation condition owned by ai/governance/escalation.md, in particular when the action would exceed the agent's authority or its granted autonomy level. The full set of escalation conditions is owned there and is not restated here.
- Must refuse. An agent must refuse an action that is unlawful, that violates a mandate, that no accountable human will own, or that cannot be validated, and it refuses rather than invent a rule, a fact, or an outcome to proceed.

Refusal and escalation are always permitted actions and are never overridden by a goal.

# Responsibilities

These responsibilities are assigned by role. The human roles are owned by ai/governance/human-oversight.md and referenced here, not defined.

- The acting agent is responsible for staying within its granted bounds, escalating what it must, and refusing what it must.
- Accountable humans are responsible for granting autonomy levels, for approving actions above the bounds, and for changing bounds through governed change.
- This namespace is responsible for the bounds of autonomy; the operational namespaces and the runtime are responsible for acting within them.

# Boundaries

This document owns the governance bounds of autonomy only. It owns none of the following, and references each by its canonical owner.

- The runtime that enforces a bound at execution: the operational namespaces and the runtime.
- The permissions and authority levels autonomy rests on: ai/governance/permission-governance.md and ai/README.md.
- The risk and trust levels that gate autonomy: ai/governance/risk-management.md.
- The escalation an out-of-bounds action requires: ai/governance/escalation.md.
- The validation that precedes an autonomous action: ai/governance/constitutional-validation.md.
- The governed change of an autonomy level over time: ai/governance/change-governance.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/governance/governance.md
- ai/governance/permission-governance.md
- ai/governance/risk-management.md
- ai/governance/escalation.md
- ai/governance/constitutional-validation.md
- ai/governance/change-governance.md
