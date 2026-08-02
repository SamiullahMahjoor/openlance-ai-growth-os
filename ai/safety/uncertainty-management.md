---
id: OL-AI-SAFETY-UNCERTAINTY-MANAGEMENT
document: ai/safety/uncertainty-management.md

title: Open Lance AIOS Uncertainty Management

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
  Owns the safety uncertainty model: confidence, unknowns, ambiguity, incomplete
  knowledge, conflict detection, safe handling, and escalation under uncertainty.
  It owns the safety uncertainty model only, and defers the classification of
  uncertainty in reasoning and the escalation triggers to their owners.
---

# Open Lance AIOS Uncertainty Management

This document owns the safety uncertainty model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the safety uncertainty model only. It never defines the classification of uncertainty in reasoning, owned by ai/reasoning/uncertainty-handling.md, and it never defines the escalation triggers, owned by ai/governance/escalation.md.

# Purpose

This document owns one safety concern: how uncertainty is managed as a safety signal, so that what is unknown, ambiguous, or in conflict is surfaced and handled safely rather than hidden. It exists so that any human or AI agent can determine how the AI stays safe when it does not know enough, independent of how uncertainty is reasoned about or what triggers an escalation.

# Principles

These are the enduring principles for safety uncertainty. Each instantiates a safety invariant owned by ai/safety/README.md.

- Uncertainty is surfaced, never hidden. What is unknown, ambiguous, or in conflict is made explicit, so protection is never removed by a false confidence.
- Uncertainty lowers confidence, and low confidence raises protection. The less certain the AI is, the more it protects, up to refusal or escalation.
- Incompleteness is treated as risk. Missing knowledge is treated as a hazard, not assumed away, deferring the truth itself to the knowledge repository.
- Unresolved uncertainty escalates. Uncertainty that cannot be safely resolved is escalated rather than acted through.

# Specification

Uncertainty is managed in the following way. This document owns the safety uncertainty model; the classification of uncertainty within reasoning is owned by ai/reasoning/uncertainty-handling.md, and whether uncertainty must be escalated is owned by ai/governance/escalation.md.

- Confidence. Every safety judgment carries a confidence, so that a low-confidence judgment is treated cautiously. Confidence is the safety layer's measure of how sure a protection is, and it is the confidence that risk classification and impact assessment express under ai/safety/risk-classification.md and ai/safety/impact-assessment.md.
- Unknowns and incomplete knowledge. What the AI does not know that bears on safety is surfaced as an unknown, and missing knowledge is treated as a hazard under ai/safety/hazard-identification.md rather than assumed. The business truth itself is owned by the knowledge repository.
- Ambiguity. Where a situation admits more than one safe interpretation, the ambiguity is surfaced, and the safest interpretation is taken until it is resolved.
- Conflict detection. Where two safety signals, rules, or classifications conflict, the conflict is detected and made explicit, and it is resolved by the higher-authority rule owned by ai/governance/ and the principle of least harm owned by ai/safety/safety-principles.md, or escalated when it cannot be resolved. This prevents conflicting safety rules from being applied silently.
- Safe handling. Under uncertainty, the AI takes the safer course: it raises the risk level under ai/safety/risk-classification.md, refuses under ai/safety/refusal-model.md, degrades under ai/safety/safe-degradation.md, or escalates, and never proceeds as if certain.
- Escalation under uncertainty. Uncertainty that cannot be safely resolved is escalated through ai/safety/escalation-model.md, under the triggers owned by ai/governance/escalation.md.

Uncertainty management keeps the AI safe when it does not know enough, by surfacing and safely handling what is uncertain; the reasoning classification of uncertainty and the escalation triggers are owned elsewhere. Handling is deterministic: the same uncertainty and context yield the same safe response.

# Invariants

- Uncertainty that bears on safety is surfaced and never hidden.
- Lower confidence raises protection, so uncertainty never lowers it.
- Incomplete knowledge is treated as a hazard, not assumed away.
- A detected conflict is resolved by higher authority and least harm, or escalated, never applied silently.
- Managing uncertainty never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the safety uncertainty model only. It owns none of the following, and references each by its canonical owner.

- The classification of uncertainty within reasoning: ai/reasoning/uncertainty-handling.md.
- The escalation triggers and human-review conditions: ai/governance/escalation.md.
- The risk level raised under uncertainty: ai/safety/risk-classification.md.
- The refusal or degradation taken under uncertainty: ai/safety/refusal-model.md and ai/safety/safe-degradation.md.
- The business truth that is missing or in question: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/safety-principles.md
- ai/safety/risk-classification.md
- ai/safety/hazard-identification.md
- ai/safety/refusal-model.md
- ai/safety/safe-degradation.md
- ai/safety/escalation-model.md
- ai/reasoning/uncertainty-handling.md
- ai/governance/escalation.md
