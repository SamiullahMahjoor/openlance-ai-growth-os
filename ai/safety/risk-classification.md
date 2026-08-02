---
id: OL-AI-SAFETY-RISK-CLASSIFICATION
document: ai/safety/risk-classification.md

title: Open Lance AIOS Risk Classification

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
  - ai/governance/risk-management.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the safety risk model: risk levels, categorization, confidence, escalation
  thresholds, risk boundaries, risk inheritance, and risk compatibility. It owns
  the risk model only, and defers the risk governance and the impact dimensions
  to their owners.
---

# Open Lance AIOS Risk Classification

This document owns the safety risk model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the safety risk model only. It never defines the risk governance, categories, and tolerance, owned by ai/governance/risk-management.md, and it never defines the impact dimensions, owned by ai/safety/impact-assessment.md.

# Purpose

This document owns one safety concern: how the risk of a hazard is classified for protection, into levels and categories, with the confidence in that classification and the thresholds at which it escalates. It exists so that any human or AI agent can determine how much protection an action requires, independent of the risk governance it applies and of how impact is measured.

# Principles

These are the enduring principles for risk classification. Each instantiates a safety invariant owned by ai/safety/README.md.

- Risk is classified, not guessed. Every hazard is classified into a defined risk level by a defined model, never by an arbitrary judgment.
- Classification applies governance, not replaces it. Risk classification applies the risk categories and tolerance owned by ai/governance/risk-management.md, and never redefines them.
- Classification carries its confidence. A risk classification is accompanied by the confidence in it, so a low-confidence classification is treated cautiously under ai/safety/uncertainty-management.md.
- Higher risk raises protection. The higher the classified risk, the stronger the required protection, up to refusal or mandatory human escalation.

# Specification

A hazard's risk is classified in the following way. This document owns the risk model; the risk governance and tolerance are owned by ai/governance/risk-management.md, and the impact dimensions the classification uses are owned by ai/safety/impact-assessment.md.

- Risk levels. Risk is classified into an ordered set of levels, from the lowest risk to the highest, so that every hazard holds one defined level ordered by how much protection it requires. The levels are a protective classification; they apply, and align with, the governed risk categories owned by ai/governance/risk-management.md, and never redefine them.
- Risk categorization. A hazard is assigned a level from the impact assessed under ai/safety/impact-assessment.md and the likelihood it carries. This document owns how a hazard is placed into a level; the dimensions of impact it draws on, including severity, are owned by ai/safety/impact-assessment.md and are never redefined here.
- Risk confidence. Every classification carries the confidence in it, expressed through the uncertainty model owned by ai/safety/uncertainty-management.md. Where confidence is low, the higher, safer level is taken, so uncertainty never lowers protection.
- Risk escalation thresholds. Defined thresholds mark the levels at which a classification requires escalation. A hazard whose level crosses a threshold is escalated through the safety escalation model owned by ai/safety/escalation-model.md, under the escalation triggers owned by ai/governance/escalation.md. This document owns the threshold; it owns neither the routing nor the trigger.
- Risk boundaries. This document owns which risk it classifies and stops at classification; it never enforces a boundary, which is owned by ai/safety/boundary-enforcement.md, and never assesses impact, which is owned by ai/safety/impact-assessment.md.
- Risk inheritance and compatibility. A hazard may inherit a risk level from a related hazard or a compound hazard, through a single, acyclic inheritance that resolves by the higher level, so inherited risk never lowers protection. A change to the risk model preserves compatibility with existing classifications, or is issued as a new version under ai/safety/safety-versioning.md, so a classification is never silently reinterpreted.

Risk classification places a hazard into a level and marks when it must escalate; the governance of risk is owned by ai/governance/risk-management.md, and impact is owned by ai/safety/impact-assessment.md. Classification is deterministic and the same at any scale.

# Invariants

- Every hazard holds exactly one classified risk level, ordered by required protection.
- Risk classification applies the governed risk categories and tolerance and never redefines them.
- Low confidence in a classification raises the level, so uncertainty never lowers protection.
- A hazard whose level crosses a threshold is escalated, and inherited risk never lowers protection.
- Classifying risk never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the safety risk model only. It owns none of the following, and references each by its canonical owner.

- The risk governance, governed risk categories, and risk tolerance: ai/governance/risk-management.md.
- The impact dimensions the classification draws on, including severity and likelihood: ai/safety/impact-assessment.md.
- The confidence model the classification expresses: ai/safety/uncertainty-management.md.
- The routing of an escalation and the governance trigger: ai/safety/escalation-model.md and ai/governance/escalation.md.
- The enforcement of a boundary around a classified risk: ai/safety/boundary-enforcement.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/impact-assessment.md
- ai/safety/uncertainty-management.md
- ai/safety/escalation-model.md
- ai/safety/boundary-enforcement.md
- ai/safety/safety-versioning.md
- ai/governance/risk-management.md
- ai/governance/escalation.md
