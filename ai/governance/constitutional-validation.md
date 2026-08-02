---
id: OL-AI-GOVERNANCE-CONSTITUTIONAL-VALIDATION
document: ai/governance/constitutional-validation.md

title: Open Lance AIOS Constitutional Validation Governance

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
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - All human governors
  - Any contributor to the Governance namespace

provenance:
  - Executive Decision

loading_priority: Critical

summary: >
  Owns how every significant AI action is validated against the AI
  constitution, the knowledge constitution, the governance rules, the
  authority hierarchy, ownership, and boundaries before it proceeds. It owns
  the validation mandate only, and never the runtime that performs it.
---

# Open Lance AIOS Constitutional Validation Governance

This document owns how every significant AI action is validated before it proceeds. It is a governance document at the Mandate authority level defined in ai/README.md, and it follows the Governance Document Standard in ai/governance/README.md. It instantiates the constitution's principles of constitutional operation and subordination to knowledge, and it never restates or weakens them. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the validation mandate only. It never defines the runtime that performs validation, and it never restates the rules it validates against, which are owned by the constitutions and the architecture.

# Purpose

This document owns one governance concern: that every significant action passes validation against the governing rules before it is taken. It exists so that any human or AI agent can determine what an action is validated against and that validation precedes execution, independent of how validation is carried out.

# Principles

These are the enduring governance principles for validation. Each instantiates a constitutional principle owned by ai/README.md.

- Governance precedes execution. Validation happens before a significant action, never after it.
- Nothing bypasses validation. Every path to a significant action passes through validation; no namespace, agent, or runtime may skip it.
- Validation is against canonical sources. An action is validated against the constitutions, the governance rules, the authority hierarchy, ownership, and boundaries as they are owned, never against a restated copy.
- Failure is safe. An action that fails validation is refused or escalated, never taken anyway.

# Mandates

These mandates are absolute. Every significant AI action satisfies all of them before it proceeds.

- Validated against the AI constitution. The action conforms to ai/README.md, including the boundary, the principles, and the Authority Hierarchy.
- Validated against the knowledge constitution. Where the action relies on business truth, it conforms to knowledge/README.md and consumes that truth from its canonical owner, never redefining it.
- Validated against governance. The action conforms to the mandates owned by this namespace, including permissions, autonomy boundaries, and policy precedence.
- Validated against authority. The action is within the authority of the agent taking it, as owned by ai/README.md and classified by ai/architecture/authority-map.md.
- Validated against ownership. The action reads and writes only what its owner permits, and never changes which namespace owns a concern, as classified by ai/architecture/ownership-map.md.
- Validated against boundaries. The action stays within the AI boundary and the cross-layer boundary; it never writes business truth and never promotes runtime state into the knowledge repository.
- Ordered before execution. Validation completes before the action is taken. An action that has not been validated is not a permitted action.
- Reviewable. The outcome of validation for a significant action is reviewable by an accountable human. This document requires reviewability; it defines no logging or recording system.

# Responsibilities

These responsibilities are assigned by role. The governance roles are owned by ai/governance/human-oversight.md and are referenced here, not defined.

- The acting agent is responsible for ensuring a significant action is validated before it is taken, and for refusing or escalating an action that fails validation.
- This namespace is responsible for what an action is validated against; the operational namespaces and the runtime are responsible for performing validation as execution.
- An accountable human is responsible for reviewing validation outcomes on significant or high-risk actions, under ai/governance/human-oversight.md.

# Boundaries

This document owns the validation mandate only. It owns none of the following, and references each by its canonical owner.

- The Authority Hierarchy, boundary, and principles validated against: ai/README.md.
- The knowledge constitution and business truth validated against: knowledge/README.md and the knowledge repository.
- The authority and ownership classifications used in validation: ai/architecture/authority-map.md and ai/architecture/ownership-map.md.
- The runtime that performs validation, and any validation algorithm or mechanism: the operational namespaces and the runtime.
- The escalation of a failed validation: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/governance/governance.md
- ai/governance/escalation.md
- ai/architecture/authority-map.md
- ai/architecture/ownership-map.md
- knowledge/README.md
