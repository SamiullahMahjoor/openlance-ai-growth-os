---
id: OL-AI-EVALUATION-README
document: ai/evaluation/README.md

title: Open Lance AIOS Evaluation Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/governance/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Evaluation namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how evaluation is documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every evaluation document under
  ai/evaluation/ must follow, and it owns evaluation extensibility and
  neutrality. It owns how evaluation is documented, and owns no reasoning, no
  governance rule, no runtime execution, no subject behavior, and no
  implementation.
---

# Open Lance AIOS Evaluation Namespace Guide

This document is the guide for the Evaluation namespace at ai/evaluation/. The Evaluation namespace owns one thing: the architectural model for evaluating AI behavior. It defines how the output of the AI layer is measured, scored, validated, benchmarked, and compared, so that behavior can be judged, deterministically and neutrally, without ever being performed or changed. It owns no reasoning, no retrieval, no prompt, no memory, no runtime execution, no agent behavior, no provider, no tool, no governance rule, no safety rule, no operations, no evolution of the layer, and no business truth. Evaluation measures behavior; it never performs it.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Evaluation sits at the Specification authority level defined in ai/README.md, observing the outputs of the namespaces it evaluates without those namespaces depending on it. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how evaluation is documented within the AI layer. It is the single guide for the Evaluation namespace, and every evaluation document follows it.

The Evaluation namespace exists so that judging AI behavior is a defined, governed, deterministic, technology-neutral assessment, rather than an ad hoc or opaque opinion. It defines how output is measured and judged; it never reasons, never executes, never decides, and never changes the behavior it assesses. An evaluation result informs the humans and the governance that act on it; it never acts itself.

This guide owns no evaluation model itself, no governance rule, and no business truth. The evaluation model is owned by the member documents of this namespace; the rules that govern the AI are owned by ai/governance/; business truth is owned by the knowledge repository; the quality a subject namespace defines is owned by that namespace.

# Scope

This guide governs the Evaluation namespace. It defines the standard structure an evaluation document uses, the rules for writing one, the invariants every evaluation document upholds, the boundaries an evaluation document must respect, and how the namespace grows. It owns evaluation extensibility, the additive way the evaluation model gains new concerns over time, and evaluation neutrality, the permanent independence of the evaluation model from any provider, model, framework, runtime, or language.

The namespace owns the evaluation model of the AI layer: the evaluation architecture and identity, lifecycle, metrics, scoring, validation, benchmarking, comparison, compatibility, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Evaluation Identity

Evaluation is the assessment layer of the AI layer, and it is not any of the following.

- Evaluation is not the behavior it measures. Reasoning, retrieval, prompts, memory, agents, providers, and tools produce the behavior; evaluation observes and judges the output. Evaluation performs none of their work and owns none of their behavior.
- Evaluation is not the runtime. The runtime executes; evaluation assesses what execution produced. Evaluation never orchestrates, schedules, or executes; those are owned by ai/runtime/.
- Evaluation is not governance. Governance owns the rules and the decisions; evaluation measures and reports. An evaluation result informs a decision but never makes one; decisions are owned by ai/governance/.
- Evaluation is not safety. Safety protects and assesses hazard and risk; evaluation assesses output quality. Neither is the other, and evaluation never refuses, escalates, or degrades; those are owned by ai/safety/.
- Evaluation is not the quality definition of a subject. What makes reasoning, memory, or any behavior good is defined by that subject's namespace; evaluation measures against that definition and never redefines it.
- Evaluation is not knowledge. Business truth is owned by the knowledge repository. Evaluation references it as the ground it measures against and never owns, restates, or becomes it.
- Evaluation is not implementation. It defines the evaluation model, never a metric mechanism, a test harness, a provider, a model, a framework, or code.

An evaluation document answers only how one aspect of evaluation works. Its knowledge is durable, technology-neutral, and independent of any provider, model, framework, runtime, or language, so it remains valid as those change.

# Evaluation Invariants

These invariants are permanent. Every evaluation document upholds them, and no evaluation may violate them.

- Evaluation measures; it never performs. Evaluation assesses behavior and never reasons, executes, decides, or changes it.
- Evaluation observes one-directionally. Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on it.
- Evaluation is deterministic. The same output, the same metrics, the same benchmark, and the same rules yield the same measurement, score, and comparison, with no randomness.
- Evaluation is grounded and validated. An evaluation is validated before its result is accepted, and it measures only what is defined, against the ground the knowledge repository owns.
- An evaluation result informs; it never decides. A decision, a refusal, or a change of behavior drawn from an evaluation is owned by ai/governance/ and ai/safety/, not by evaluation.
- Evaluation owns no subject behavior or subject quality definition. The behavior evaluated and the definition of its quality are owned by the subject's namespace.
- Evaluation is single-owned, technology-neutral, and scalable. Each evaluation concern has exactly one owning document, and the model holds for one evaluation or many thousands.

# Evaluation Document Standard

Every evaluation document under ai/evaluation/ uses the following standard structure. This section defines the template only. It defines no actual evaluation model. The inventory at ai/evaluation/evaluation.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The evaluation concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the evaluation invariants.
- Specification. The technology-neutral evaluation model itself: the architecture, lifecycle, metrics, scoring, validation, benchmarking, comparison, compatibility, boundaries, or versioning the document owns.
- Invariants. The evaluation invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

An evaluation document may add a section only when a genuine evaluation concern requires it, following ai/CONTRIBUTING.md, and never to move reasoning, a governance rule, a subject's behavior, or business truth into this namespace.

# Documentation Rules

An evaluation document records one aspect of the evaluation model, and nothing more.

- An evaluation document never restates reasoning, a governance rule, a safety rule, a subject's behavior, a subject's quality definition, or business truth. It references ai/reasoning/, ai/governance/, ai/safety/, the subject namespaces, and the knowledge repository by canonical path.
- An evaluation document never names a provider, a model, a framework, a language, a runtime, a protocol, or an interface, and never contains code.
- An evaluation document defines the evaluation model, never how an evaluation is implemented or executed, and never the behavior it evaluates.
- Everything an evaluation document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Evaluation owns assessment. Reasoning reasons. Retrieval determines knowledge. Prompts express. Memory retains context. Agents act. Providers abstract intelligence. Tools interact externally. The runtime executes. Governance owns rules and decisions. Safety protects. Operations runs the layer. The knowledge repository owns truth. An evaluation document owns only its own aspect of the evaluation model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The mandates, decisions, and change governance: ai/governance/.
- The protective architecture: ai/safety/.
- Business truth: the knowledge repository.
- The behavior evaluated, and its quality definition: the subject namespaces.
- Execution, orchestration, and run-time: ai/runtime/.
- The maps of the AI layer: ai/architecture/.

An evaluation document references all of the above and owns none of it. It records only the durable, technology-neutral evaluation model.

# Loading Guidance

Evaluation is loaded at the Contextual tier defined in ai/README.md, when a task judges output, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation; the member documents are loaded when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New evaluation knowledge is added by creating new evaluation documents under ai/evaluation/, each following the Evaluation Document Standard and owning a single concern. The namespace grows only when a genuinely new evaluation concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This evaluation extensibility lets the evaluation model gain new metrics, benchmarks, or comparison concerns over decades, and scale across many thousands of evaluations, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Evaluation namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/evaluation/evaluation.md declares the Reference authority level. Every evaluation-model member document declares the Specification authority level.
- Evaluation documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. An evaluation document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/reasoning/README.md
- ai/safety/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Evaluation documents. The evaluation-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Evaluation observes the outputs of the namespaces it evaluates and judges them, one-directionally, without those namespaces depending on it. It owns the assessment model only, and never the behavior it measures nor the decision that acts on its result.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
