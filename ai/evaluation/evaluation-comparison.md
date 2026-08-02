---
id: OL-AI-EVALUATION-EVALUATION-COMPARISON
document: ai/evaluation/evaluation-comparison.md

title: Open Lance AIOS Evaluation Comparison

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
  Owns the comparison model and comparison methodology: how outputs or scores are
  compared. It owns comparison only, and defers the benchmark a comparison may use
  and the scoring it compares to their owners.
---

# Open Lance AIOS Evaluation Comparison

This document owns the evaluation comparison model. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns comparison only. It never defines the benchmark a comparison may use, owned by ai/evaluation/evaluation-benchmarking.md, and it never defines the scoring it compares, owned by ai/evaluation/evaluation-scoring.md.

# Purpose

This document owns one evaluation concern: how outputs or their scores are compared, against each other or against a benchmark, and the methodology that makes a comparison fair. It exists so that any human or AI agent can determine how a comparison is made, like for like, independent of how a score is derived and of how a benchmark is defined.

# Principles

These are the enduring principles for evaluation comparison. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- Comparison is like for like. Outputs are compared only on the same metrics and under the same conditions, so a comparison is fair and never compares unlike things.
- Comparison is deterministic. The same outputs and scores under the same methodology yield the same comparison, with no randomness.
- Comparison reports; it does not decide. A comparison reports how outputs relate; the decision drawn from it is owned by ai/governance/.
- Comparison rests on measured scores. A comparison compares the scores derived under ai/evaluation/evaluation-scoring.md, or the measurements under ai/evaluation/evaluation-metrics.md, and never a judgment outside them.

# Specification

Outputs are compared in the following way. This document owns the comparison model and methodology; the benchmark a comparison may use is owned by ai/evaluation/evaluation-benchmarking.md, and the scores it compares are owned by ai/evaluation/evaluation-scoring.md.

- The comparison model. A comparison relates two or more outputs, or an output and a benchmark, by their measurements and scores, so that their relative standing is established. This document owns how a comparison is structured; it never owns the scores or the benchmark it uses.
- Comparison methodology. A comparison is made like for like: outputs are compared on the same metrics owned by ai/evaluation/evaluation-metrics.md, under the same conditions, and against the same reference where a benchmark is used. A comparison that would compare unlike outputs or unlike metrics is not made, so a comparison is always fair.
- Comparison against a benchmark. An output may be compared against the fixed reference owned by ai/evaluation/evaluation-benchmarking.md, recording the benchmark version compared against, so that a comparison against a benchmark is stable and reproducible.
- Comparison, not decision. A comparison ends at the relative standing of the outputs. Any decision, ranking-for-action, or selection drawn from a comparison is owned by ai/governance/; a comparison reports and never decides.

Comparison relates outputs and scores fairly and deterministically; the scores and the benchmark it uses are owned elsewhere. Comparison is the same at any scale.

# Invariants

- Outputs are compared only on the same metrics and under the same conditions, so a comparison is fair.
- The same outputs and scores under the same methodology yield the same comparison.
- A comparison against a benchmark records the benchmark version compared against.
- A comparison reports relative standing and never decides, ranks for action, or changes behavior.
- Comparing outputs never reasons, executes, decides, measures, scores, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns comparison only. It owns none of the following, and references each by its canonical owner.

- The scores a comparison compares: ai/evaluation/evaluation-scoring.md.
- The metrics a comparison compares on: ai/evaluation/evaluation-metrics.md.
- The benchmark a comparison may use: ai/evaluation/evaluation-benchmarking.md.
- The decision or selection drawn from a comparison: ai/governance/.
- The validation of a comparison: ai/evaluation/evaluation-validation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-validation.md
