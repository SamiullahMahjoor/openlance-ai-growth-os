---
id: OL-AI-EVALUATION-EVALUATION-ARCHITECTURE
document: ai/evaluation/evaluation-architecture.md

title: Open Lance AIOS Evaluation Architecture

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
  Owns the architectural definition of an evaluation: its identity and the parts
  it is composed of. It owns the evaluation structural model only, and defers the
  phases, the scoring model, and the behavior it evaluates to their owners.
---

# Open Lance AIOS Evaluation Architecture

This document owns the architectural definition of an evaluation. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the evaluation structural model only, including evaluation identity. It never defines the phases of an evaluation, owned by ai/evaluation/evaluation-lifecycle.md, and it never defines the scoring model, owned by ai/evaluation/evaluation-scoring.md.

# Purpose

This document owns one evaluation concern: what an evaluation is structurally, its identity and the parts it is composed of, as an assessment of an output. It exists so that any human or AI agent can determine the anatomy of an evaluation, independent of how it is carried out or what behavior produced the output.

# Principles

These are the enduring principles for evaluation architecture. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- An evaluation is an assessment, not a behavior. An evaluation is the architectural means by which an output is judged; it never produces the output and never changes it.
- An evaluation has a distinct identity. Every evaluation is uniquely identified, so it can be defined, validated, versioned, and its result attributed as one evaluation.
- An evaluation is composed of defined parts. An evaluation is composed of its identity, the subject output it assesses, the metrics it measures, and the benchmark it measures against, each owned by its named document.
- An evaluation's structure is deterministic. The same evaluation definition over the same output resolves to the same assessment, with no randomness.

# Specification

An evaluation is defined structurally in the following way. This document owns the structural model; the phases of an evaluation are owned by ai/evaluation/evaluation-lifecycle.md, and the scoring model is owned by ai/evaluation/evaluation-scoring.md.

- Evaluation identity. An evaluation has a distinct, stable identity that uniquely identifies it as an assessment, so that it can be defined, validated, versioned, and its result recorded as one evaluation. Identity distinguishes one evaluation from another and is never shared.
- Evaluation parts. An evaluation is composed of its identity, the subject output it assesses, the metrics it measures under ai/evaluation/evaluation-metrics.md, and, where used, the benchmark it measures against under ai/evaluation/evaluation-benchmarking.md. Each part is owned by its named document; this document owns that an evaluation is composed of them.
- The subject of an evaluation. An evaluation assesses the output of a subject namespace, and never the behavior that produced it. The subject and its behavior are owned by the subject's namespace, and the definition of the subject's quality is owned there; this document owns the evaluation that measures against that definition, never the definition itself.
- Governed and informing only. An evaluation is defined and validated within the rules owned by ai/governance/, and its result informs a decision owned by ai/governance/ or a protection owned by ai/safety/, never a decision of its own. This document defines what an evaluation is; it never performs, decides, or executes.

An evaluation is therefore a uniquely identified assessment composed of a subject output, defined metrics, and, where used, a benchmark, that measures against a quality defined elsewhere. The structural model is the same regardless of any provider, model, or technology, and it is the same for one evaluation or many thousands.

# Invariants

- Every evaluation has a distinct, stable identity that is never shared.
- An evaluation is composed of its identity, subject output, metrics, and, where used, a benchmark, each owned by its named document.
- An evaluation assesses an output and never the behavior that produced it, nor the definition of that behavior's quality.
- The same evaluation definition over the same output resolves to the same assessment, with no randomness.
- Defining an evaluation's structure never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the evaluation structural model only. It owns none of the following, and references each by its canonical owner.

- The phases of an evaluation: ai/evaluation/evaluation-lifecycle.md.
- The metrics, benchmark, and scoring that compose and complete an evaluation: ai/evaluation/evaluation-metrics.md, ai/evaluation/evaluation-benchmarking.md, and ai/evaluation/evaluation-scoring.md.
- The behavior evaluated and the definition of its quality: the subject namespaces.
- The decision or protection an evaluation result informs: ai/governance/ and ai/safety/.
- The execution and business truth around an evaluation: ai/runtime/ and the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/evaluation/evaluation-lifecycle.md
- ai/evaluation/evaluation-metrics.md
- ai/evaluation/evaluation-benchmarking.md
- ai/evaluation/evaluation-scoring.md
