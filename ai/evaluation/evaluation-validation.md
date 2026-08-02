---
id: OL-AI-EVALUATION-EVALUATION-VALIDATION
document: ai/evaluation/evaluation-validation.md

title: Open Lance AIOS Evaluation Validation

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
  - ai/evaluation/README.md
  - ai/evaluation/evaluation.md
  - ai/governance/constitutional-validation.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Evaluation namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the validation model and validation ordering: how an evaluation is
  validated before its result is accepted. It owns evaluation validation only,
  and defers the governance validation rules and the measurement it validates to
  their owners.
---

# Open Lance AIOS Evaluation Validation

This document owns how an evaluation is validated. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns evaluation validation only. It never defines a governance validation rule, owned by ai/governance/constitutional-validation.md, and it never defines the measurement it validates, owned by ai/evaluation/evaluation-metrics.md.

# Purpose

This document owns one evaluation concern: how an evaluation and its result are validated, and in what order, before the result is accepted, so that only a grounded, well-formed, conformant evaluation is relied on. It exists so that any human or AI agent can determine whether an evaluation result is fit to accept, independent of what is measured and of the rules it applies.

# Principles

These are the enduring principles for evaluation validation. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- Validation precedes acceptance. An evaluation result is validated before it is accepted, and a result that fails validation is not accepted.
- Validation is ordered. The checks are applied in a fixed order, so the same evaluation is validated the same way.
- Grounding is required. An evaluation is validated to rest on defined metrics and, where used, a benchmark, and to measure against the truth the knowledge repository owns, never on invented ground.
- Failure is inert. An evaluation that fails validation yields no accepted result and informs no decision; it is corrected or discarded.

# Specification

An evaluation is validated in the following ordered checks. This document owns what is validated and in what order; the governance rules it applies are owned by ai/governance/, and the measurement it validates is owned by ai/evaluation/evaluation-metrics.md.

- Well-formedness validation. The evaluation is validated to be well formed: it has a defined subject output, defined metrics under ai/evaluation/evaluation-metrics.md, and, where a comparison is made, a defined benchmark under ai/evaluation/evaluation-benchmarking.md. An evaluation missing a defined part does not proceed. This check is first, so a malformed evaluation is rejected early.
- Grounding validation. The evaluation is validated to be grounded: its measurements rest on the defined metrics and the truth owned by the knowledge repository, not on invented ground, so a result is never accepted from an ungrounded evaluation.
- Scoring validation. The score is validated to be derived from the measured metrics under ai/evaluation/evaluation-scoring.md, so that a score is traceable to its measurements and not assigned by opinion.
- Constitutional validation. The evaluation conforms to the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates.

The checks are applied in this order, from well-formedness to constitutional conformance, and an evaluation that fails any check yields no accepted result; it is corrected under ai/evaluation/evaluation-lifecycle.md or discarded. Evaluation validation confirms that a result is fit to accept; the decision the result informs is owned by ai/governance/. Validation is deterministic and the same at any scale.

# Invariants

- An evaluation result is validated before it is accepted, and a result that fails validation is not accepted.
- The checks are applied in a fixed order, well-formedness first.
- An evaluation is validated to be grounded and to have a score traceable to its metrics.
- Validation defines what is checked and in what order, never the governance rule, which is owned by ai/governance/.
- Validating an evaluation never reasons, executes, decides, measures, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns evaluation validation only. It owns none of the following, and references each by its canonical owner.

- The governance validation rules: ai/governance/constitutional-validation.md.
- The measurement and scoring a validation checks: ai/evaluation/evaluation-metrics.md and ai/evaluation/evaluation-scoring.md.
- The benchmark a validation checks against: ai/evaluation/evaluation-benchmarking.md.
- The correction of a failed evaluation within its lifecycle: ai/evaluation/evaluation-lifecycle.md.
- The business truth grounding is validated against: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-lifecycle.md
- ai/governance/constitutional-validation.md
