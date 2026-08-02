---
id: OL-AI-REASONING-REASONING-QUALITY
document: ai/reasoning/reasoning-quality.md

title: Open Lance AIOS Reasoning Quality

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
  - ai/reasoning/README.md
  - ai/reasoning/reasoning.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Reasoning namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the quality principles of reasoning: reasoning completeness and
  reasoning traceability. It owns the quality principles only, and defers
  governance traceability as a mandate and the evaluation of output to their
  owners.
---

# Open Lance AIOS Reasoning Quality

This document owns the quality principles of reasoning. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the quality principles of reasoning only. It never owns governance traceability as a mandate, owned by ai/governance/, and it never owns the evaluation of output, owned by the Evaluation namespace.

# Purpose

This document owns one reasoning concern: the principles that define high-quality reasoning, specifically its completeness and its traceability. It exists so that any human or AI agent can determine what makes a reasoning complete and traceable, independent of how quality is measured or evaluated.

# Principles

These are the enduring quality principles of reasoning. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- Reasoning is complete. A reasoning addresses what the task requires and leaves no necessary consideration unexamined before it concludes.
- Reasoning is traceable. Every step of a reasoning is explicit and can be followed from the retrieved knowledge and stated assumptions to the conclusion, so no conclusion rests on hidden reasoning.
- Reasoning is sound in form. A reasoning proceeds by defined categories, validated grounding, and internal consistency, so its quality is a property of its structure, not of an opinion about it.
- Quality is a property, not a score. Completeness and traceability are architectural properties of a reasoning, never a numeric quality value.

# Specification

Reasoning quality is defined by the following properties. This document owns these properties; the measurement or evaluation of reasoning is owned by the Evaluation namespace, and the governance requirement of traceability is owned by ai/governance/.

- Reasoning completeness. A reasoning is complete when it has addressed every part the task requires, applied the categories of reasoning its parts call for, surfaced its assumptions, resolved or classified its uncertainties, and reached a sufficient basis for a conclusion or a governed absence of one. An incomplete reasoning does not conclude.
- Reasoning traceability. A reasoning is traceable when each of its steps is explicit and connected to the retrieved knowledge or a stated assumption, and to the steps before and after it, so that the whole reasoning can be followed from basis to conclusion. Traceability is the architectural counterpart, within reasoning, of the auditability owned by ai/governance/; this document owns the reasoning property, and governance owns the mandate.
- Quality without a score. Completeness and traceability are structural properties that hold or do not; this document defines them and never assigns a numeric quality, confidence, or grade, which are implementation or evaluation.

Quality holds deterministically: the same reasoning has the same completeness and traceability. The properties are the same at any scale and independent of any provider, model, or method.

# Invariants

- A reasoning concludes only when it is complete.
- Every step of a reasoning is explicit and traceable; no conclusion rests on hidden reasoning.
- Completeness and traceability are structural properties, never numeric scores.
- Assessing quality never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the quality principles of reasoning only. It owns none of the following, and references each by its canonical owner.

- Governance traceability and auditability as a mandate: ai/governance/.
- The measurement, scoring, testing, or evaluation of reasoning or output: the Evaluation namespace, once created.
- The grounding and sufficiency that completeness rests on: ai/reasoning/reasoning-validation.md.
- The internal consistency that quality rests on: ai/reasoning/reasoning-consistency.md.
- Any numeric quality, confidence, or grade: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-validation.md
- ai/reasoning/reasoning-consistency.md
- ai/governance/README.md
