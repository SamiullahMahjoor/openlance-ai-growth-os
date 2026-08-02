---
id: OL-AI-SAFETY-IMPACT-ASSESSMENT
document: ai/safety/impact-assessment.md

title: Open Lance AIOS Impact Assessment

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
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the impact model: severity, likelihood, reversibility, propagation, scope,
  and human, organizational, and long-term impact. It owns the impact dimensions
  only, and defers the classification of risk from impact and the real-world
  consequences to their owners.
---

# Open Lance AIOS Impact Assessment

This document owns the impact model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the impact dimensions only. It never defines the classification of risk from impact, owned by ai/safety/risk-classification.md, and it never defines the real-world consequences that give impact meaning, owned by the knowledge repository.

# Purpose

This document owns one safety concern: how the potential impact of an action or a hazard is assessed, along the dimensions that describe how much harm it could do. It exists so that any human or AI agent can determine the magnitude and reach of a potential harm, independent of how that harm is classified into a risk level.

# Principles

These are the enduring principles for impact assessment. Each instantiates a safety invariant owned by ai/safety/README.md.

- Impact is assessed along defined dimensions. A potential harm is described by defined dimensions, so its magnitude and reach are explicit, never vague.
- Impact references truth; it never defines it. The real-world consequences that make an impact matter are owned by the knowledge repository; this document references them.
- Irreversible and far-reaching impact weighs heaviest. The less reversible and the wider an impact, the graver it is, so protection accounts for what cannot be undone.
- Impact assessment informs, but does not classify. This document measures impact; the risk level drawn from it is owned by ai/safety/risk-classification.md.

# Specification

The impact of an action or hazard is assessed along the following dimensions. This document owns the dimensions; the risk classified from them is owned by ai/safety/risk-classification.md, and the real-world consequences that give them meaning are owned by the knowledge repository.

- Severity. How grave the harm would be if it occurred. Severity is the depth of a potential harm, and it is the dimension the risk model draws on under ai/safety/risk-classification.md.
- Likelihood. How likely the harm is to occur. Likelihood is the chance of a potential harm, expressed with the confidence owned by ai/safety/uncertainty-management.md.
- Reversibility. Whether the harm can be undone, and at what cost. An irreversible impact weighs heavier than a reversible one.
- Propagation. How far the harm would spread if it occurred, from a single action to many, informing the containment owned by ai/safety/boundary-enforcement.md.
- Scope. How much of the AI, the organization, or the world a harm would reach, from a narrow to a broad scope.
- Human impact. The effect on the people an action affects, whose definition is owned by the knowledge repository and referenced, never restated, here.
- Organizational impact. The effect on the operating organization, whose definition is owned by the knowledge repository and referenced here.
- Long-term impact. The effect that persists beyond the immediate action, so that lasting harm is weighed alongside immediate harm.

Impact assessment describes how much harm an action could do and how far it could reach; the risk level drawn from it is owned by ai/safety/risk-classification.md, and the consequences that give it meaning are owned by the knowledge repository. Assessment is deterministic and the same at any scale.

# Invariants

- A potential harm is described along the defined impact dimensions, never left vague.
- An irreversible or far-reaching impact weighs heavier than a reversible or narrow one.
- Impact assessment references the real-world consequences owned by the knowledge repository and never restates them.
- Impact assessment measures impact and never classifies risk or enforces a boundary.
- Assessing impact never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the impact dimensions only. It owns none of the following, and references each by its canonical owner.

- The classification of risk from impact: ai/safety/risk-classification.md.
- The confidence and likelihood uncertainty of an impact: ai/safety/uncertainty-management.md.
- The containment of a propagating harm: ai/safety/boundary-enforcement.md.
- The real-world, human, organizational, legal, and safety consequences that define impact: the knowledge repository.
- The risk governance that weighs consequence: ai/governance/risk-management.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/risk-classification.md
- ai/safety/uncertainty-management.md
- ai/safety/boundary-enforcement.md
- ai/governance/risk-management.md
- knowledge/README.md
