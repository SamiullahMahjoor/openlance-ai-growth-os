---
id: OL-AI-EVALUATION-EVALUATION
document: ai/evaluation/evaluation.md

title: Open Lance AIOS Evaluation Inventory

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/evaluation/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Evaluation namespace

provenance:
  - Derived from ai/evaluation/README.md and the AI evaluation namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's evaluation concerns. It owns the
  identity and existence of each evaluation concern, and the evaluation
  determinism and scalability properties. It owns no evaluation model, no
  governance rule, no subject behavior, and no business truth.
---

# Open Lance AIOS Evaluation Inventory

This document is the canonical inventory of the AI layer's evaluation concerns. It owns the identity of the Evaluation namespace and the list of evaluation concerns the namespace owns, so that any human or AI agent can determine, from one place, which evaluation concerns exist and which document owns each. It also owns the namespace-wide properties of determinism and scalability. It is a reference document and follows the inventory pattern, not the Evaluation Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no evaluation model, no governance rule, no subject behavior, and no business truth. How evaluation is documented is owned by ai/evaluation/README.md. Each evaluation concern is owned by its own document. On any matter of business truth, the knowledge repository governs.

# Purpose

This document exists so that the set of the AI layer's evaluation concerns has a single canonical list, and so that the evaluation properties that hold across the whole namespace have one owner. It answers which evaluation concerns the namespace owns, which document owns each, and why evaluation is deterministic and scalable.

# Scope

This inventory lists every evaluation concern the namespace owns, and states the determinism and scalability of evaluation. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document.

# Evaluation Role

Evaluation is the assessment layer of the AI Operating System. It is at the Specification authority level, below the constitution and the governance mandates, and it observes the outputs of the namespaces it evaluates, one-directionally, without those namespaces depending on it. Evaluation measures, scores, validates, benchmarks, and compares AI behavior, and owns none of the behavior it measures, none of its quality definition, and none of the decisions its results inform.

# Determinism

Evaluation is deterministic: the same output, the same metrics, the same benchmark, and the same governing rules produce the same measurement, the same score, and the same comparison, with no randomness and no hidden step. This holds because an evaluation is a function of fixed inputs alone, the given output under assessment, the defined metrics and benchmark, and the rules owned by ai/governance/, applied through defined measurement, scoring, and comparison. The behavior that produced the output is owned by its subject namespace and may itself vary; this namespace makes no determinism claim about that behavior, only about the assessment of a given output, which is always the same for the same inputs.

# Scalability

Evaluation scales without redesign. The evaluation model measures, scores, validates, benchmarks, and compares a bounded output against defined metrics and benchmarks, so it applies the same way whether the layer judges one output or many thousands, across one subject namespace or all of them. Because the model is technology-neutral, adding a new metric, benchmark, or subject changes no existing evaluation, and growth in the number of evaluations, metrics, or benchmarks is absorbed additively, without changing the evaluation model.

# Repository Ownership

The Evaluation namespace owns the assessment model of the AI layer and nothing else. It owns the evaluation concerns listed below, each in exactly one document. It owns no governance rule, which is owned by ai/governance/; no safety rule, which is owned by ai/safety/; no behavior of a subject, which is owned by that subject's namespace; and no business truth, which is owned by the knowledge repository. Evaluation observes the subject namespaces; it depends only on the constitution and the governance mandates, and no subject depends on it.

# The Evaluation Concerns

The Evaluation namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Evaluation Architecture

- Document. ai/evaluation/evaluation-architecture.md.
- Owns. The architectural definition of an evaluation: its identity and the parts it is composed of.
- Out of scope. The phases of an evaluation, owned by ai/evaluation/evaluation-lifecycle.md; the scoring model, owned by ai/evaluation/evaluation-scoring.md.

## Evaluation Lifecycle

- Document. ai/evaluation/evaluation-lifecycle.md.
- Owns. The phases of an evaluation, from framing to a validated result.
- Out of scope. The measurement and scoring within the phases, owned by ai/evaluation/evaluation-metrics.md and ai/evaluation/evaluation-scoring.md; the versioning of an evaluation definition, owned by ai/evaluation/evaluation-versioning.md.

## Evaluation Metrics

- Document. ai/evaluation/evaluation-metrics.md.
- Owns. The measurement model: what is measured, including quality and grounding dimensions.
- Out of scope. How a score is derived from metrics, owned by ai/evaluation/evaluation-scoring.md; the quality definition of a subject, owned by that subject's namespace.

## Evaluation Scoring

- Document. ai/evaluation/evaluation-scoring.md.
- Owns. The scoring model and the score calculation architecture: how a score is derived from metrics.
- Out of scope. What is measured, owned by ai/evaluation/evaluation-metrics.md; the comparison of scores, owned by ai/evaluation/evaluation-comparison.md.

## Evaluation Validation

- Document. ai/evaluation/evaluation-validation.md.
- Owns. The validation model and validation ordering: how an evaluation is validated before its result is accepted.
- Out of scope. The governance validation rules, owned by ai/governance/constitutional-validation.md; the measurement it validates, owned by ai/evaluation/evaluation-metrics.md.

## Evaluation Benchmarking

- Document. ai/evaluation/evaluation-benchmarking.md.
- Owns. The benchmark definition and benchmark architecture: the fixed reference standards an evaluation measures against.
- Out of scope. The comparison methodology, owned by ai/evaluation/evaluation-comparison.md; the metrics a benchmark uses, owned by ai/evaluation/evaluation-metrics.md.

## Evaluation Comparison

- Document. ai/evaluation/evaluation-comparison.md.
- Owns. The comparison model and comparison methodology: how outputs or scores are compared.
- Out of scope. The benchmark a comparison may use, owned by ai/evaluation/evaluation-benchmarking.md; the scoring it compares, owned by ai/evaluation/evaluation-scoring.md.

## Evaluation Compatibility

- Document. ai/evaluation/evaluation-compatibility.md.
- Owns. The compatibility model: whether an evaluation is compatible with a subject, and whether an evaluation version is compatible with a consumer.
- Out of scope. The evolution and version rules, owned by ai/evaluation/evaluation-versioning.md; the metrics compatibility rests on, owned by ai/evaluation/evaluation-metrics.md.

## Evaluation Boundaries

- Document. ai/evaluation/evaluation-boundaries.md.
- Owns. What evaluation never owns, and where an evaluation stops.
- Out of scope. The governance and safety rules that bound evaluation, owned by ai/governance/ and ai/safety/; the behavior it measures, owned by the subject namespaces.

## Evaluation Versioning

- Document. ai/evaluation/evaluation-versioning.md.
- Owns. Evaluation versioning, evolution, migration, and deprecation.
- Out of scope. The compatibility a version preserves, owned by ai/evaluation/evaluation-compatibility.md; the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Boundaries

This inventory owns the identity and existence of the evaluation concerns, and the determinism and scalability of evaluation, only. It owns none of the following.

- How evaluation is documented: ai/evaluation/README.md.
- The model of any evaluation concern: that concern's own document.
- The rules that govern the AI, and the protective architecture: ai/governance/ and ai/safety/.
- Business truth: the knowledge repository.
- The behavior evaluated and its quality definition: the subject namespaces.
- The maps of the AI layer: ai/architecture/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/architecture/ownership-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct evaluation concern, a new document is added under ai/evaluation/ following ai/evaluation/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- Absorbing metrics and benchmarks. New metrics, benchmarks, and comparison methods are absorbed additively under the member documents, without redesign, and this inventory records only that the concern exists.
