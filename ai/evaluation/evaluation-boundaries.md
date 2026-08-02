---
id: OL-AI-EVALUATION-EVALUATION-BOUNDARIES
document: ai/evaluation/evaluation-boundaries.md

title: Open Lance AIOS Evaluation Boundaries

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
  Owns what evaluation never owns, and where an evaluation stops. It owns the
  boundaries of evaluation only, and defers the governance and safety rules that
  bound it and the concerns of the surrounding namespaces to their owners.
---

# Open Lance AIOS Evaluation Boundaries

This document owns the architectural boundaries of evaluation. It is an evaluation document at the Specification authority level defined in ai/README.md, and it follows the Evaluation Document Standard in ai/evaluation/README.md. It instantiates the evaluation invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of evaluation only. It never defines the governance and safety rules that bound evaluation, owned by ai/governance/ and ai/safety/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one evaluation concern: what an evaluation never owns, and where an evaluation stops. It exists so that any human or AI agent can determine the limits of evaluation, independent of how those limits are enforced.

# Principles

These are the enduring principles for evaluation boundaries. Each instantiates an evaluation invariant owned by ai/evaluation/README.md.

- Evaluation measures; it does not perform, decide, or change. An evaluation assesses an output and stops there; performing, deciding, and changing behavior belong to other namespaces.
- Evaluation observes one-directionally. Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on it.
- Evaluation owns no subject behavior or quality definition. The behavior evaluated and the definition of its quality are owned by the subject's namespace.
- Evaluation carries no truth of its own. An evaluation references business truth as the ground it measures against and never owns, restates, or becomes it.

# Specification

An evaluation operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/, and the concerns beyond them by their namespaces.

- Behavior boundary. An evaluation assesses an output and never produces or changes it. Reasoning, retrieval, prompts, memory, agents, providers, and tools own the behavior; evaluation observes it and performs none of it.
- Decision boundary. An evaluation result informs a decision but never makes one. The decision, ranking-for-action, or change of behavior drawn from an evaluation is owned by ai/governance/, and any protective response is owned by ai/safety/; evaluation reports and never acts.
- Subject boundary. An evaluation measures a subject's output against the quality the subject's namespace defines, and never redefines that quality or reaches into the subject's behavior. The subject namespaces own their behavior and its quality.
- One-directional boundary. Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on evaluation, so no cycle is possible. Evaluation depends only on the constitution and the governance mandates.
- Truth boundary. An evaluation references business truth as the ground it measures against and never owns, restates, amends, or becomes it, which is owned by the knowledge repository.
- Implementation boundary. An evaluation is a model of assessment, never a metric mechanism, a test harness, a provider, a model, a framework, or code, and this namespace names none.

An evaluation that would cross any of these boundaries does not proceed; a result that would decide or change behavior is withheld, and the matter is referred to ai/governance/. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- An evaluation assesses an output and never produces, changes, or decides.
- Evaluation observes one-directionally, and no subject namespace depends on it.
- An evaluation never redefines a subject's quality or reaches into a subject's behavior.
- An evaluation references business truth as ground and never owns or restates it.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of evaluation only. It owns none of the following, and references each by its canonical owner.

- The governance and safety rules that bound evaluation, and the decisions and protections its results inform: ai/governance/ and ai/safety/.
- The behavior evaluated and the definition of its quality: the subject namespaces, including ai/reasoning/, ai/retrieval/, ai/prompts/, ai/memory/, ai/agents/, ai/providers/, and ai/tools/.
- The runtime that executes the behavior evaluated: ai/runtime/.
- The business truth an evaluation measures against: the knowledge repository.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evaluation/README.md
- ai/evaluation/evaluation.md
- ai/governance/decision-making.md
- ai/safety/README.md
- ai/reasoning/README.md
- ai/runtime/README.md
