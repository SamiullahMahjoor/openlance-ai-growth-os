---
id: OL-AI-EVALUATION-EVALUATION-BENCHMARKING
document: ai/evaluation/evaluation-benchmarking.md

title: Open Lance AIOS Evaluation Benchmarking

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
  Owns the benchmark definition and benchmark architecture: the fixed reference
  standards an evaluation measures against. It owns benchmarking only, and defers
  the comparison methodology and the metrics a benchmark uses to their owners.
---

# Open Lance AIOS Evaluation Benchmarking

This document owns the benchmark model. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns benchmarking only. It never defines the comparison methodology, owned by ai/evaluation/evaluation-comparison.md, and it never defines the metrics a benchmark uses, owned by ai/evaluation/evaluation-metrics.md.

# Purpose

This document owns one evaluation concern: how a benchmark is defined, a fixed reference standard an output is measured against, and the architecture of a benchmark. It exists so that any human or AI agent can determine what a benchmark is and how it is defined, independent of how outputs are compared against it and of the metrics it uses.

# Principles

These are the enduring principles for benchmarking. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- A benchmark is a fixed reference standard. A benchmark is a defined, stable standard an output is measured against, so evaluations share a common reference.
- A benchmark is defined, not performed. A benchmark defines what good measures against; it never produces an output and never changes one.
- A benchmark is versioned and stable. A benchmark is stable so that results against it are comparable over time, and it changes only through governed versioning.
- A benchmark uses metrics it does not own. A benchmark is expressed in the metrics owned by ai/evaluation/evaluation-metrics.md, and never redefines them.

# Specification

A benchmark is defined in the following way. This document owns the benchmark definition and architecture; the comparison of outputs against a benchmark is owned by ai/evaluation/evaluation-comparison.md, and the metrics a benchmark uses are owned by ai/evaluation/evaluation-metrics.md.

- Benchmark definition. A benchmark is a fixed reference standard, defined in terms of the metrics owned by ai/evaluation/evaluation-metrics.md and the level each metric should reach, so that an output can be measured against a common, stable reference. This document owns what a benchmark is and how it is defined; it never owns the metrics themselves.
- Benchmark architecture. The architecture defines how a benchmark is composed: the metrics it includes, the reference level for each, and the scope of outputs it applies to, as a technology-neutral structure. It defines that a benchmark is a stable, composed reference, not a test harness or an implementation.
- Stability and versioning. A benchmark is stable so that results against it are comparable over time. A change to a benchmark is a governed version under ai/evaluation/evaluation-versioning.md, and a result records the benchmark version it was measured against, so a benchmark never drifts silently and old and new results are not confused.
- Reference, not comparison or measurement. A benchmark provides the reference standard; measuring an output is owned by ai/evaluation/evaluation-metrics.md, and comparing an output against the benchmark is owned by ai/evaluation/evaluation-comparison.md. Benchmarking defines the standard, never the act of measuring or comparing.

Benchmarking defines the fixed reference an output is measured against; the metrics it uses and the comparison against it are owned elsewhere. Benchmarking is deterministic and the same at any scale.

# Invariants

- A benchmark is a fixed, stable reference standard defined in the metrics owned by ai/evaluation/evaluation-metrics.md.
- A benchmark defines what good measures against and never produces or changes an output.
- A benchmark changes only through governed versioning, and a result records the benchmark version it used.
- A benchmark uses metrics it does not own and never redefines them.
- Defining a benchmark never reasons, executes, decides, measures, compares, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns benchmarking only. It owns none of the following, and references each by its canonical owner.

- The comparison of outputs against a benchmark: ai/evaluation/evaluation-comparison.md.
- The metrics a benchmark is expressed in: ai/evaluation/evaluation-metrics.md.
- The scoring of an output against a benchmark: ai/evaluation/evaluation-scoring.md.
- The versioning of a benchmark: ai/evaluation/evaluation-versioning.md.
- The business truth a benchmark may reference as ground: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-comparison.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-scoring.md
- ai/evaluation/evaluation-versioning.md
