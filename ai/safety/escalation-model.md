---
id: OL-AI-SAFETY-ESCALATION-MODEL
document: ai/safety/escalation-model.md

title: Open Lance AIOS Safety Escalation Model

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
  - ai/governance/escalation.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the safety escalation model: escalation routing, priority, hierarchy, and
  compatibility. It owns the escalation model only, and defers the escalation
  triggers and human-review conditions to ai/governance/escalation.md.
---

# Open Lance AIOS Safety Escalation Model

This document owns the safety escalation model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the safety escalation model only. It never defines the escalation triggers and human-review conditions, owned by ai/governance/escalation.md, which it applies and never restates.

# Purpose

This document owns one safety concern: how a safety matter, once it must be escalated, is routed, prioritized, and carried to the right authority, without infinite or circular escalation. It exists so that any human or AI agent can determine how protection reaches a decision-maker, independent of the conditions that trigger the escalation.

# Principles

These are the enduring principles for safety escalation. Each instantiates a safety invariant owned by ai/safety/README.md.

- Escalation applies triggers; it never defines them. Whether a matter must be escalated is owned by ai/governance/escalation.md; this document owns how it is then carried.
- Escalation is bounded and acyclic. Every escalation reaches an authority in a finite number of steps, so no infinite or circular escalation is possible.
- Higher risk escalates with higher priority. A matter of greater risk is escalated more urgently, so the most serious matters reach an authority first.
- Escalation reaches accountable humans. For matters reserved to humans, escalation routes to an accountable human, deferring the human role to ai/governance/human-oversight.md.

# Specification

A safety matter is escalated in the following way. This document owns the routing, priority, hierarchy, and compatibility of an escalation; whether a matter must be escalated is owned by ai/governance/escalation.md.

- Escalation routing. A matter that must be escalated, because a risk threshold is crossed under ai/safety/risk-classification.md, an uncertainty cannot be resolved under ai/safety/uncertainty-management.md, or a governed condition requires it under ai/governance/escalation.md, is routed to the authority able to decide it. Routing determines where a matter goes; it never determines whether it must go, which is a governed trigger.
- Escalation priority. Each escalation carries a priority set by the risk classified under ai/safety/risk-classification.md, so a higher-risk matter is escalated more urgently. Priority orders escalations; it never lowers protection.
- Escalation hierarchy. Escalation follows a defined, acyclic hierarchy of authorities, from an agent to a supervising authority to an accountable human, so that each escalation ascends toward greater authority and terminates at one able to decide. A matter reserved to a human ascends to a human under ai/governance/human-oversight.md.
- Bounded escalation. An escalation reaches a deciding authority in a finite number of steps, and a matter is never escalated back to an authority already in its path, so infinite escalation and escalation cycles are impossible. An escalation that could not otherwise terminate reaches the highest human authority rather than loop.
- Escalation compatibility. A change to the escalation model preserves compatibility with existing routing and hierarchy, or is issued as a new version under ai/safety/safety-versioning.md, so an escalation path is never silently broken.

Safety escalation carries a matter to the right authority, bounded and prioritized; whether a matter must be escalated is owned by ai/governance/escalation.md. Escalation is deterministic and the same at any scale.

# Invariants

- Escalation applies the governed triggers and never defines them.
- Every escalation reaches a deciding authority in a finite number of steps, with no cycle.
- A higher-risk matter is escalated with higher priority, and priority never lowers protection.
- A matter reserved to a human ascends to an accountable human.
- Routing an escalation never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the safety escalation model only. It owns none of the following, and references each by its canonical owner.

- The escalation triggers, mandatory human-review conditions, and handling of deadlock: ai/governance/escalation.md.
- The human authority an escalation reaches: ai/governance/human-oversight.md.
- The risk thresholds that prompt an escalation: ai/safety/risk-classification.md.
- The uncertainty that prompts an escalation: ai/safety/uncertainty-management.md.
- The refusal that may accompany an escalation: ai/safety/refusal-model.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/risk-classification.md
- ai/safety/uncertainty-management.md
- ai/safety/refusal-model.md
- ai/safety/safety-versioning.md
- ai/governance/escalation.md
- ai/governance/human-oversight.md
