---
id: OL-AI-REASONING-README
document: ai/reasoning/README.md

title: Open Lance AIOS Reasoning Namespace Guide

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
  - Any contributor to the Reasoning namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how reasoning is documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every reasoning document under
  ai/reasoning/ must follow. It owns how reasoning is documented, and owns no
  business truth, no governance rule, no runtime execution, no prompt, and no
  implementation.
---

# Open Lance AIOS Reasoning Namespace Guide

This document is the guide for the Reasoning namespace at ai/reasoning/. The Reasoning namespace owns one thing: the architectural model of how an AI reasons. It defines how retrieved knowledge is transformed, under governing rules, into governed conclusions. It owns no business truth, no governance rule, no runtime execution, no retrieval, no memory, no prompt, no provider, no model, no tool, no agent, and no implementation, algorithm, chain of thought, or hidden reasoning.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Reasoning sits at the Specification authority level defined in ai/README.md, between the runtime that executes it and the prompts that express it, consuming the retrieval that determines its knowledge. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how reasoning is documented within the AI layer. It is the single guide for the Reasoning namespace, and every reasoning document follows it.

The Reasoning namespace exists so that reasoning is a defined, governed, deterministic, technology-neutral transformation of retrieved knowledge into governed conclusions, rather than an opaque or emergent behavior. It defines how reasoning works; it never executes it, never determines the knowledge it reasons over, never expresses itself as a prompt, and never owns the rules it obeys.

This guide owns no reasoning model itself, no business truth, and no governance rule. The reasoning model is owned by the member documents of this namespace; business truth is owned by the knowledge repository; the rules that govern reasoning are owned by ai/governance/.

# Scope

This guide governs the Reasoning namespace. It defines the standard structure a reasoning document uses, the rules for writing one, the invariants every reasoning document upholds, the boundaries a reasoning document must respect, and how the namespace grows.

The namespace owns the reasoning model of the AI layer: the reasoning lifecycle, workflow, and stages, the architectural categories of reasoning, reasoning validation, internal consistency, uncertainty classification, conclusion formation, reasoning quality, and reasoning boundaries. Each concern is owned by its own document, created under this guide.

# Reasoning Identity

Reasoning is the cognitive layer of the AI layer, and it is not any of the following.

- Reasoning is not the runtime. The runtime executes; reasoning defines how the AI reasons during that execution. Reasoning never orchestrates, loads, schedules, or executes; those are owned by ai/runtime/.
- Reasoning is not retrieval. Retrieval determines the knowledge to load; reasoning transforms that retrieved knowledge into conclusions. Reasoning never discovers, selects, or loads knowledge; those are owned by ai/retrieval/.
- Reasoning is not knowledge. Business truth is owned by the knowledge repository. Reasoning reasons over retrieved truth and never owns, restates, or alters it.
- Reasoning is not governance. The rules that govern reasoning, decisions, escalation, risk, and permission are owned by ai/governance/. Reasoning applies those rules and produces governed conclusions; it never defines them.
- Reasoning is not prompts, memory, providers, models, tools, or agents. Prompts express reasoning, providers execute prompts, memory offers context, and agents apply reasoning. Reasoning defines the cognitive model; it performs none of their work.
- Reasoning is not implementation. It defines the reasoning model, never an algorithm, a chain of thought, a hidden reasoning process, a provider, a model, a framework, a protocol, or code.

A reasoning document answers only how one aspect of reasoning works. Its knowledge is durable, technology-neutral, and independent of any provider, model, or method, so it remains valid as those change.

# Reasoning Invariants

These invariants are permanent. Every reasoning document upholds them, and no reasoning may violate them.

- Reasoning is deterministic. The same task, the same retrieved knowledge, and the same governing rules produce the same reasoning outcome. There is no randomness.
- Reasoning is explicit, never hidden. Every step of reasoning is defined and traceable to its inputs; no conclusion rests on hidden reasoning.
- Reasoning consumes; it never owns. Reasoning consumes retrieved knowledge and governing rules and owns neither the truth nor the rules.
- Reasoning is governed. Every conclusion is formed within the governing rules owned by ai/governance/, and reasoning escalates rather than conclude outside them.
- Reasoning is internally consistent. Reasoning contains no contradiction, and it never produces conflicting conclusions from the same inputs.
- Reasoning is grounded. A conclusion rests only on the retrieved knowledge and stated assumptions, never on invented facts.
- Reasoning is sufficient before it concludes. A conclusion is formed only when the reasoning and its evidence are sufficient; otherwise reasoning yields uncertainty or no conclusion.
- Reasoning is repeatable and scalable. The same reasoning reproduces the same outcome, and the model holds for one conclusion or millions.

# Reasoning Document Standard

Every reasoning document under ai/reasoning/ uses the following standard structure. This section defines the template only. It defines no actual model. The inventory at ai/reasoning/reasoning.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The reasoning concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the reasoning invariants.
- Specification. The technology-neutral reasoning model itself: the lifecycle, workflow, stages, categories, validation, consistency, uncertainty, conclusion formation, quality, or boundaries the document owns.
- Invariants. The reasoning invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A reasoning document may add a section only when a genuine reasoning concern requires it, following ai/CONTRIBUTING.md, and never to move business truth, a governance rule, retrieval, or runtime execution into this namespace.

# Documentation Rules

A reasoning document records one aspect of the reasoning model, and nothing more.

- A reasoning document never restates business truth, a governance rule, a retrieval model, a runtime behavior, or a prompt. It references the knowledge repository, ai/governance/, ai/retrieval/, ai/runtime/, and the Prompts namespace by canonical path.
- A reasoning document never specifies an algorithm, a chain of thought, a hidden reasoning process, a provider, a model, a framework, a protocol, or code.
- A reasoning document defines the reasoning model, never how reasoning is executed, expressed, or implemented.
- Everything a reasoning document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Reasoning owns the cognitive model. The runtime executes. Retrieval determines knowledge. Governance owns rules. The knowledge repository owns truth. Prompts express reasoning. Providers execute prompts. Memory offers context. Agents apply reasoning. A reasoning document owns only its own aspect of the reasoning model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern reasoning, decisions, escalation, risk, and permission: ai/governance/.
- Business truth: the knowledge repository.
- The determination and loading of knowledge: ai/retrieval/ and ai/runtime/.
- Execution, orchestration, and the execution context: ai/runtime/.
- Prompts, memory, providers, models, tools, and agents: their namespaces.
- The maps of the AI layer: ai/architecture/.

A reasoning document references all of the above and owns none of it. It records only the durable, technology-neutral reasoning model.

# Loading Guidance

Reasoning is loaded at the Required tier defined in ai/README.md, because most acting tasks reason. The core reasoning documents are loaded whenever reasoning runs; the lifecycle framing, quality, and boundaries are loaded at the Contextual tier. This guide and the inventory are loaded at the Required tier for navigation. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New reasoning knowledge is added by creating new reasoning documents under ai/reasoning/, each following the Reasoning Document Standard and owning a single concern. The namespace grows only when a genuinely new reasoning concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This additive extensibility lets the reasoning model gain new categories or concerns over decades without redesign.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Reasoning namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/reasoning/reasoning.md declares the Reference authority level. Every reasoning-model member document declares the Specification authority level.
- Reasoning documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A reasoning document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/retrieval/README.md
- ai/runtime/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Reasoning documents. The reasoning-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Reasoning consumes the retrieval result and the governing rules, and produces governed conclusions that the runtime carries and the prompts express. It owns cognition only, and never the layers around it.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
