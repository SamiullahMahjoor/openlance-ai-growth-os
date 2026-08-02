---
id: OL-AI-EVALUATION-EVALUATION-SCORING
document: ai/evaluation/evaluation-scoring.md

title: Open Lance AIOS Evaluation Scoring

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Evaluation namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the scoring model and the score calculation architecture: how a score is
  derived from metrics. It owns the scoring model only, and defers what is
  measured and the comparison of scores to their owners.
---

# Open Lance AIOS Evaluation Scoring

This document owns the evaluation scoring model. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the scoring model only. It never defines what is measured, owned by ai/evaluation/evaluation-metrics.md, and it never defines the comparison of scores, owned by ai/evaluation/evaluation-comparison.md.

# Purpose

This document owns one evaluation concern: how a score is derived from measured metrics, the score calculation architecture, so that an assessment is a defined, reproducible result rather than a subjective judgment. It exists so that any human or AI agent can determine how measurements become a score, independent of what is measured and of how scores are compared.

# Principles

These are the enduring principles for evaluation scoring. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- A score is derived, not invented. A score is derived from measured metrics by a defined calculation, never assigned by opinion.
- Scoring is deterministic. The same measured metrics under the same scoring model yield the same score, with no randomness.
- Scoring is transparent. The way a score is derived from its metrics is explicit and traceable, so a score can be followed back to the measurements it rests on.
- A score assesses; it does not decide. A score reports how an output measures; the decision drawn from it is owned by ai/governance/.

# Specification

A score is derived in the following way. This document owns the scoring model and its calculation architecture; what is measured is owned by ai/evaluation/evaluation-metrics.md, and the comparison of scores is owned by ai/evaluation/evaluation-comparison.md.

- The scoring model. A score is a defined derivation from the metrics measured under ai/evaluation/evaluation-metrics.md, combining them into an assessment of the output. This document owns how metrics are combined into a score; it never owns what the metrics measure.
- Score calculation architecture. The architecture defines how measured metrics are combined, weighted, and aggregated into a score, as a structure, not a formula bound to any technology. It defines that a score is calculated from metrics by a defined, technology-neutral architecture, so the same metrics always yield the same score.
- Traceable derivation. A score is traceable to the metrics it is derived from, so that a score can be followed back to its measurements and never rests on a hidden judgment.
- Scoring, not comparison or decision. Scoring ends at a score for one output. Comparing scores across outputs or against a benchmark is owned by ai/evaluation/evaluation-comparison.md, and any decision drawn from a score is owned by ai/governance/; scoring makes no decision.

Scoring derives a score from measured metrics deterministically and traceably; what is measured and how scores are compared are owned elsewhere. Scoring is the same at any scale.

# Invariants

- A score is derived from measured metrics by a defined calculation, never assigned by opinion.
- The same measured metrics under the same scoring model yield the same score.
- A score is traceable to the metrics it is derived from.
- A score assesses an output and never decides, changes behavior, or compares across outputs.
- Deriving a score never reasons, executes, decides, measures, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the scoring model only. It owns none of the following, and references each by its canonical owner.

- What is measured, and the measurement model: ai/evaluation/evaluation-metrics.md.
- The comparison of scores across outputs or against a benchmark: ai/evaluation/evaluation-comparison.md.
- The benchmark a score may be measured against: ai/evaluation/evaluation-benchmarking.md.
- The validation of a score: ai/evaluation/evaluation-validation.md.
- The decision drawn from a score: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-comparison.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-validation.md
