---
id: OL-AI-EVALUATION-EVALUATION-METRICS
document: ai/evaluation/evaluation-metrics.md

title: Open Lance AIOS Evaluation Metrics

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
  Owns the measurement model: what is measured, including quality and grounding
  dimensions. It owns the measurement model only, and defers how a score is
  derived and the quality definition of a subject to their owners.
---

# Open Lance AIOS Evaluation Metrics

This document owns the evaluation measurement model. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the measurement model only. It never defines how a score is derived from metrics, owned by ai/evaluation/evaluation-scoring.md, and it never defines the quality of a subject, owned by that subject's namespace.

# Purpose

This document owns one evaluation concern: what is measured when an output is evaluated, expressed as metrics, so that assessment rests on defined measurements rather than opinion. It exists so that any human or AI agent can determine what an evaluation measures, independent of how those measurements are scored and of how the subject defines its own quality.

# Principles

These are the enduring principles for evaluation metrics. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- A metric is a defined measurement. Every metric names a defined quantity or quality of an output, so what is measured is explicit, never vague.
- A metric measures against a definition it does not own. A metric measures a subject's quality against the definition owned by the subject's namespace, and never redefines it.
- Metrics are neutral. A metric is defined in technology-neutral terms, so it means the same thing across subjects and evaluations.
- Measurement observes; it never changes. Measuring an output observes it and never alters the output or the behavior that produced it.

# Specification

An output is measured in the following way. This document owns the measurement model; how a score is derived from metrics is owned by ai/evaluation/evaluation-scoring.md, and the quality a metric measures against is owned by the subject's namespace.

- The measurement model. A metric is a defined measurement of an output, describing one quantity or quality of it. An evaluation measures an output against a set of metrics, and this document owns what a metric is and how measurement is defined, never how the measured values are combined into a score.
- Quality dimensions. Metrics measure the quality of an output against the quality a subject namespace defines, such as the completeness and traceability of reasoning owned by ai/reasoning/reasoning-quality.md, or the freshness and completeness of memory owned by ai/memory/memory-quality.md. This document owns the measurement; the definition of the quality measured is owned by the subject namespace and never restated here.
- Grounding dimension. A metric measures whether an output is grounded, that is, whether it rests on the business truth owned by the knowledge repository and the retrieved knowledge that supports it, rather than on invented content. Grounding is measured here; the truth it is measured against is owned by the knowledge repository.
- Neutral and observing. Metrics are defined independently of any provider, model, or technology, and measuring an output observes it without changing it or the behavior that produced it, which is owned by the subject's namespace.

Metrics define what is measured; how the measured values become a score is owned by ai/evaluation/evaluation-scoring.md, and the quality measured against is owned by the subject's namespace. Measurement is deterministic and the same at any scale.

# Invariants

- Every metric names a defined measurement of an output, never a vague impression.
- A metric measures against a quality definition owned by the subject's namespace and never redefines it.
- Metrics are described in technology-neutral terms.
- Measuring an output observes it and never changes it or the behavior that produced it.
- Defining or applying a metric never reasons, executes, decides, scores, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the measurement model only. It owns none of the following, and references each by its canonical owner.

- How a score is derived from metrics: ai/evaluation/evaluation-scoring.md.
- The quality definition a metric measures against: the subject namespaces, including ai/reasoning/reasoning-quality.md and ai/memory/memory-quality.md.
- The business truth grounding is measured against: the knowledge repository.
- The benchmark a metric may be measured against: ai/evaluation/evaluation-benchmarking.md.
- The validation of a measurement: ai/evaluation/evaluation-validation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-validation.md
- ai/reasoning/reasoning-quality.md
- ai/memory/memory-quality.md
