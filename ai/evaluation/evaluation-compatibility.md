---
id: OL-AI-EVALUATION-EVALUATION-COMPATIBILITY
document: ai/evaluation/evaluation-compatibility.md

title: Open Lance AIOS Evaluation Compatibility

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
  Owns the compatibility model: whether an evaluation is compatible with a
  subject, and whether an evaluation version is compatible with a consumer. It
  owns compatibility only, and defers the evolution and version rules and the
  metrics it rests on to their owners.
---

# Open Lance AIOS Evaluation Compatibility

This document owns the evaluation compatibility model. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the compatibility model only. It never defines the evolution and version rules, owned by ai/evaluation/evaluation-versioning.md, and it never defines the metrics compatibility rests on, owned by ai/evaluation/evaluation-metrics.md.

# Purpose

This document owns one evaluation concern: what it means for an evaluation to be compatible, both whether an evaluation is applicable to a subject and whether an evaluation version is compatible with a consumer of its results. It exists so that any human or AI agent can determine whether an evaluation fits, independent of how it evolves and of the metrics it uses.

# Principles

These are the enduring principles for evaluation compatibility. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- Compatibility is a defined relation. An evaluation is compatible with a subject, or a version with a consumer, by a defined relation, never by assumption.
- Compatibility rests on metrics and subject. An evaluation is compatible with a subject when its metrics apply to that subject's output, drawn from ai/evaluation/evaluation-metrics.md.
- Compatibility keeps results comparable. Results from compatible evaluations and versions are comparable; an incompatible change breaks comparability and is versioned.
- Incompatibility is explicit. An incompatible evaluation or version is identified as such, so an inapplicable evaluation is never applied and a broken version is never assumed compatible.

# Specification

Compatibility is determined in the following way. This document owns the compatibility relation; the evolution and version rules are owned by ai/evaluation/evaluation-versioning.md, and the metrics compatibility rests on are owned by ai/evaluation/evaluation-metrics.md.

- Subject compatibility. An evaluation is compatible with a subject when the metrics it measures, owned by ai/evaluation/evaluation-metrics.md, apply to that subject's output. An evaluation whose metrics do not apply to a subject is incompatible with it and is not used to judge it, so an output is never judged by an inapplicable evaluation.
- Version compatibility. An evaluation version, or a benchmark version under ai/evaluation/evaluation-benchmarking.md, is compatible with a consumer of its results when the consumer's expectations still hold against that version, so that results remain comparable. A change that keeps them holding is compatible; a change that breaks them is incompatible and is versioned and migrated under ai/evaluation/evaluation-versioning.md.
- Comparability. Because compatibility keeps results comparable, results from compatible evaluations and versions can be compared under ai/evaluation/evaluation-comparison.md, while results across incompatible versions are not compared as if alike.
- Explicit incompatibility. An incompatible evaluation or version is identified as incompatible, so it is not applied to a subject it does not fit and no consumer relies on a version it is not compatible with.

Compatibility defines whether an evaluation fits a subject and whether a version fits a consumer; the evolution that preserves it and the metrics it rests on are owned elsewhere. Compatibility is deterministic and the same at any scale.

# Invariants

- An evaluation is compatible with a subject only when its metrics apply to that subject's output.
- A version is compatible with a consumer only when the consumer's expectations still hold against it.
- Results from compatible evaluations and versions are comparable; results across incompatible versions are not compared as alike.
- An incompatible evaluation or version is identified as such and never used as if compatible.
- Determining compatibility never reasons, executes, decides, measures, scores, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the compatibility model only. It owns none of the following, and references each by its canonical owner.

- The evolution, version rules, migration, and deprecation a version undergoes: ai/evaluation/evaluation-versioning.md.
- The metrics compatibility rests on: ai/evaluation/evaluation-metrics.md.
- The benchmark whose version compatibility matters: ai/evaluation/evaluation-benchmarking.md.
- The comparison of compatible results: ai/evaluation/evaluation-comparison.md.
- The behavior of the subject an evaluation is compatible with: the subject namespaces.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-versioning.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-comparison.md
