---
id: OL-AI-EVALUATION-EVALUATION-LIFECYCLE
document: ai/evaluation/evaluation-lifecycle.md

title: Open Lance AIOS Evaluation Lifecycle

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
  Owns the phases of an evaluation, from framing to a validated result. It owns
  the evaluation lifecycle only, and defers the measurement and scoring within
  the phases and the versioning of a definition to their owners.
---

# Open Lance AIOS Evaluation Lifecycle

This document owns the phases of an evaluation. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the evaluation lifecycle only. It never defines the measurement and scoring within the phases, owned by ai/evaluation/evaluation-metrics.md and ai/evaluation/evaluation-scoring.md, and it never defines the versioning of an evaluation definition, owned by ai/evaluation/evaluation-versioning.md.

# Purpose

This document owns one evaluation concern: the phases an evaluation passes through, from framing what is assessed to a validated result. It exists so that any human or AI agent can determine the shape of an evaluation's life, independent of how any phase is carried out.

# Principles

These are the enduring principles for the evaluation lifecycle. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- An evaluation has a defined beginning and end. It begins with framing and ends with a validated result; it never runs unbounded.
- Framing precedes measurement. What is assessed, by which metrics and against which benchmark, is established before the output is measured.
- Validation precedes acceptance. An evaluation result is validated before it is accepted, and an invalid evaluation yields no accepted result.
- An evaluation ends in a result, not an action. An evaluation terminates in a measured, validated result that informs others; it never acts on the result itself.

# Specification

An evaluation passes through the following ordered phases. This document owns the phases; the measurement and scoring within them are owned by ai/evaluation/evaluation-metrics.md and ai/evaluation/evaluation-scoring.md, and the change of an evaluation definition over time is owned by ai/evaluation/evaluation-versioning.md.

- Framing. The evaluation is framed on the subject output to assess, the metrics to measure under ai/evaluation/evaluation-metrics.md, and, where used, the benchmark to measure against under ai/evaluation/evaluation-benchmarking.md. Framing establishes what is being assessed and against what.
- Measurement. The subject output is measured against the framed metrics under ai/evaluation/evaluation-metrics.md, producing the measured values the rest of the evaluation rests on. Measurement observes the output; it never changes it.
- Scoring. The measured values are combined into a score under ai/evaluation/evaluation-scoring.md, and, where a comparison is called for, compared under ai/evaluation/evaluation-comparison.md. This phase derives the assessment from the measurements.
- Validation. The evaluation and its result are validated under ai/evaluation/evaluation-validation.md, for grounding and conformance, before the result is accepted. An evaluation that fails validation yields no accepted result.
- Result. The validated result is produced and reported to whoever acts on it. The result informs a decision owned by ai/governance/ or a protection owned by ai/safety/; this phase produces the assessment and never acts on it.

Each phase completes before the next begins, except where validation returns the evaluation for correction. The lifecycle is the same regardless of any provider, model, or technology, and it is the same for one evaluation or many thousands.

# Invariants

- An evaluation holds exactly one lifecycle, from one framing to one validated result.
- Framing precedes Measurement, which precedes Scoring, which precedes Validation.
- An evaluation result is validated before it is accepted, and an invalid evaluation yields no accepted result.
- An evaluation terminates in a result that informs others and never acts on the result itself.
- A lifecycle transition never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the evaluation lifecycle only. It owns none of the following, and references each by its canonical owner.

- The measurement, scoring, and comparison within the phases: ai/evaluation/evaluation-metrics.md, ai/evaluation/evaluation-scoring.md, and ai/evaluation/evaluation-comparison.md.
- The benchmark a framing selects: ai/evaluation/evaluation-benchmarking.md.
- The validation that gates the result: ai/evaluation/evaluation-validation.md.
- The decision or protection the result informs: ai/governance/ and ai/safety/.
- The versioning of an evaluation definition over time: ai/evaluation/evaluation-versioning.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-comparison.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-validation.md
- ai/evaluation/evaluation-versioning.md
