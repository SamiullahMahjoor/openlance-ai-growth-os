---
id: OL-AI-EVALUATION-EVALUATION-VERSIONING
document: ai/evaluation/evaluation-versioning.md

title: Open Lance AIOS Evaluation Versioning

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
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Evaluation namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns evaluation versioning, evolution, migration, and deprecation. It owns
  evaluation versioning only, and defers the compatibility a version preserves
  and the document amendment workflow to their owners.
---

# Open Lance AIOS Evaluation Versioning

This document owns how an evaluation definition is versioned and evolves. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns evaluation versioning only. It never defines the compatibility a version preserves, owned by ai/evaluation/evaluation-compatibility.md, and it never defines the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Purpose

This document owns one evaluation concern: how an evaluation definition, its metrics, and its benchmarks are versioned, evolve, migrate, and are deprecated over time, so that evaluations stay comparable and no result is silently reinterpreted. It exists so that any human or AI agent can determine how an evaluation changes safely, independent of what compatibility means.

# Principles

These are the enduring principles for evaluation versioning. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- An evaluation definition is versioned. An evaluation, a metric, a scoring model, and a benchmark carry a version, so a change is identified and traceable.
- Change is governed. An evaluation definition evolves only under the change rules owned by ai/governance/, never arbitrarily.
- Comparability is preserved or migrated. A change that keeps results comparable is absorbed; a change that breaks comparability is versioned and migrated, so no result is silently reinterpreted.
- Results record their version. Every result records the evaluation and benchmark version it was produced under, so results are never confused across versions.

# Specification

An evaluation definition is versioned and evolves in the following way. This document owns evaluation versioning; the compatibility a version preserves is owned by ai/evaluation/evaluation-compatibility.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Version rules. An evaluation definition, a metric under ai/evaluation/evaluation-metrics.md, a scoring model under ai/evaluation/evaluation-scoring.md, and a benchmark under ai/evaluation/evaluation-benchmarking.md carry a version that identifies it, so a change is explicit and traceable, and a result records the version it was produced under.
- Evaluation evolution. An evaluation definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the evaluation model grows and new metrics and benchmarks are absorbed without redesign. Evolution never changes the behavior evaluated and never rewrites business truth.
- Migration. A change that breaks comparability, judged under ai/evaluation/evaluation-compatibility.md, is issued as a new version and migrated deliberately: consumers of results are moved to it in a controlled way, and old results are not compared with new as if alike.
- Deprecation. A superseded evaluation definition, metric, or benchmark is deprecated rather than abruptly removed, and it remains available for interpreting results produced under it until each consumer is migrated, so deprecation never invalidates a past result silently.

Versioning keeps an evaluation definition identified, governed, and comparable as it evolves; the compatibility relation and the amendment workflow are owned elsewhere. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- An evaluation, metric, scoring model, and benchmark each carry a version, so a change is explicit and traceable.
- An evaluation definition evolves only under the governed change rules.
- A change that breaks comparability is versioned and migrated, never applied silently.
- Every result records the evaluation and benchmark version it was produced under.
- Versioning an evaluation never reasons, executes, decides, measures, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns evaluation versioning only. It owns none of the following, and references each by its canonical owner.

- The compatibility relation a version preserves: ai/evaluation/evaluation-compatibility.md.
- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The document amendment workflow: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The metrics, scoring, and benchmarks a version tracks: ai/evaluation/evaluation-metrics.md, ai/evaluation/evaluation-scoring.md, and ai/evaluation/evaluation-benchmarking.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-compatibility.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-benchmarking.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
