---
id: OL-AI-SAFETY-BOUNDARY-ENFORCEMENT
document: ai/safety/boundary-enforcement.md

title: Open Lance AIOS Boundary Enforcement

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
  - ai/safety/README.md
  - ai/safety/safety.md
  - ai/governance/policy-enforcement.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the boundary enforcement model: constraint, policy, permission, and
  execution boundary application, cross-layer boundary protection, isolation, and
  containment. It owns the enforcement model only, and defers the boundaries
  themselves and their run-time enforcement to their owners.
---

# Open Lance AIOS Boundary Enforcement

This document owns the boundary enforcement model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundary enforcement model only. It never defines the boundaries themselves, owned by ai/governance/, ai/agents/, and ai/runtime/, and it never performs run-time enforcement, owned by ai/runtime/.

# Purpose

This document owns one safety concern: how the boundaries the AI already owns are applied protectively, so that an action is contained within them and a hazard does not spread across layers. It exists so that any human or AI agent can determine how protection holds an action within its limits, independent of where those limits are defined or how they are enforced at run time.

# Principles

These are the enduring principles for boundary enforcement. Each instantiates a safety invariant owned by ai/safety/README.md.

- Enforcement applies boundaries; it never defines them. The boundaries are owned by governance, agents, and the runtime; this document applies them protectively.
- A boundary holds by default. An action proceeds only within its boundaries, and an attempt to cross one is contained, refused, or escalated, never allowed by default.
- Protection is layered and cross-cutting. Boundaries are applied at every layer an action touches, so a hazard contained at one layer is not free at another.
- Containment limits spread. A hazard is isolated and contained so that its harm does not propagate beyond its boundary.

# Specification

Boundaries are enforced in the following way. This document owns how a boundary is applied protectively; the boundary itself is owned by its namespace, and the run-time that carries the enforcement is owned by ai/runtime/.

- Constraint enforcement. A defined constraint on an action is applied, so the action proceeds only within it. This document owns the protective application of a constraint; the constraint as a rule is owned by ai/governance/policy-enforcement.md.
- Policy boundary application. A policy boundary owned by ai/governance/policy-enforcement.md is applied to an action, so the action stays within policy. This document applies the boundary; it never defines the policy or its precedence.
- Permission boundary application. A permission boundary is applied, so an action never exceeds the authority an agent holds under ai/agents/agent-permissions.md and the permission rules owned by ai/governance/permission-governance.md. This document applies the boundary; it never defines the permission.
- Execution boundary application. An execution boundary owned by ai/runtime/execution-boundaries.md is applied, so an action never exceeds what execution permits. This document applies the boundary; the run-time that enforces it is owned by ai/runtime/.
- Cross-layer boundary protection. Boundaries are applied across every layer an action touches, so protection at one layer is not undone at another and a hazard cannot leak from one namespace into another. This upholds the cross-layer boundary owned by ai/README.md.
- Isolation and containment. A hazard is isolated so it cannot reach beyond its boundary, and its harm is contained so it does not propagate, drawing on the propagation assessed by ai/safety/impact-assessment.md. An agent's own fault isolation is owned by ai/agents/agent-boundaries.md; this document owns the protective isolation and containment of a hazard across the layer.

Boundary enforcement holds an action within the boundaries the AI owns and contains a hazard; the boundaries themselves and their run-time enforcement are owned elsewhere. Enforcement is deterministic and the same at any scale.

# Invariants

- Enforcement applies the boundaries owned by governance, agents, and the runtime, and never defines them.
- An action proceeds only within its boundaries; an attempt to cross one is contained, refused, or escalated.
- Boundaries are applied across every layer an action touches, so a hazard cannot leak between namespaces.
- A hazard is isolated and contained so its harm does not propagate beyond its boundary.
- Applying a boundary never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundary enforcement model only. It owns none of the following, and references each by its canonical owner.

- The policy boundaries and their precedence: ai/governance/policy-enforcement.md.
- The permission boundaries: ai/agents/agent-permissions.md and ai/governance/permission-governance.md.
- The execution boundaries and their run-time enforcement: ai/runtime/execution-boundaries.md and ai/runtime/.
- The AI boundary and the cross-layer boundary: ai/README.md.
- An agent's own fault isolation: ai/agents/agent-boundaries.md.
- The refusal or escalation of an attempted crossing: ai/safety/refusal-model.md and ai/safety/escalation-model.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/impact-assessment.md
- ai/safety/refusal-model.md
- ai/safety/escalation-model.md
- ai/governance/policy-enforcement.md
- ai/governance/permission-governance.md
- ai/agents/agent-permissions.md
- ai/agents/agent-boundaries.md
- ai/runtime/execution-boundaries.md
