---
id: OL-AI-PROMPTS-README
document: ai/prompts/README.md

title: Open Lance AIOS Prompts Namespace Guide

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
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how prompts are documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every prompt document under
  ai/prompts/ must follow, and it owns prompt extensibility and provider
  neutrality. It owns how prompt architecture is documented, and owns no
  business truth, no governance rule, no reasoning, no retrieval, no runtime
  execution, and no prompt content.
---

# Open Lance AIOS Prompts Namespace Guide

This document is the guide for the Prompts namespace at ai/prompts/. The Prompts namespace owns one thing: the architectural model of prompts. It defines how a prompt is layered, composed, assembled, structured, validated, inherited, versioned, and consumed, so that reasoning can be expressed as a governed, transient instruction. It owns no business truth, no governance rule, no reasoning, no retrieval, no memory, no runtime execution, no provider, no model, no tool, no agent, and no implementation, template language, or prompt content.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Prompts sit at the Specification authority level defined in ai/README.md, expressing the reasoning the runtime carries, composing the context the retrieval determines, and consumed by the providers that execute them. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds or restates it.

# Purpose

This document owns exactly one thing: how prompt architecture is documented within the AI layer. It is the single guide for the Prompts namespace, and every prompt document follows it.

The Prompts namespace exists so that a prompt is a defined, governed, deterministic, technology-neutral, transient instruction, rather than an opaque or hand-written artifact. It defines how prompts are structured and composed; it never writes a prompt, never determines the knowledge a prompt points to, never reasons, and never owns the rules it obeys. Prompt content is an operational output produced at runtime, never constitutional knowledge, and this namespace never contains a prompt.

This guide owns no prompt model itself, no business truth, and no governance rule. The prompt model is owned by the member documents of this namespace; business truth is owned by the knowledge repository; the rules that govern prompts are owned by ai/governance/.

# Scope

This guide governs the Prompts namespace. It defines the standard structure a prompt document uses, the rules for writing one, the invariants every prompt document upholds, the boundaries a prompt document must respect, and how the namespace grows. It owns prompt extensibility, the additive way the prompt model gains new concerns over time, and prompt provider neutrality, the permanent independence of prompt architecture from any provider, model, framework, runtime, or language.

The namespace owns the prompt model of the AI layer: the prompt layering model, lifecycle, composition, assembly, templates, context separation, validation, inheritance, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Prompt Identity

Prompts are the expression layer of the AI layer, and they are not any of the following.

- Prompts are not the runtime. The runtime orchestrates execution, assembles the execution context, and carries and executes the prompt; Prompts define how the prompt is built from that context. Prompts never orchestrate, schedule, or execute; those are owned by ai/runtime/.
- Prompts are not reasoning. Reasoning transforms retrieved knowledge into governed conclusions; a prompt expresses that intent as an instruction. Prompts never reason, conclude, or decide; those are owned by ai/reasoning/.
- Prompts are not retrieval. Retrieval determines which knowledge to load; a prompt references and points to that knowledge as context. Prompts never discover, select, or load knowledge; those are owned by ai/retrieval/.
- Prompts are not memory. Memory retains context across turns and sessions; a prompt may reference retained context as a context source. Prompts never retain or persist; that is owned by ai/memory/.
- Prompts are not knowledge. Business truth is owned by the knowledge repository. A prompt points to knowledge and never embeds, restates, stores, or becomes it, and prompt content is never promoted into the knowledge repository.
- Prompts are not governance. The rules that govern composition, validation, and change are owned by ai/governance/. Prompts conform to those rules; they never define them.
- Prompts are not providers, models, tools, or agents. Providers execute prompts, tools act, and agents apply prompts. Prompts define the transient instruction; they perform none of their work.
- Prompts are not implementation. They define the prompt model, never a template language, a syntax, a format, a provider, a model, a framework, or code, and never any prompt text.

A prompt document answers only how one aspect of prompt architecture works. Its knowledge is durable, technology-neutral, and independent of any provider, model, framework, runtime, or language, so it remains valid as those change.

# Prompt Invariants

These invariants are permanent. Every prompt document upholds them, and no prompt may violate them.

- A prompt is a transient instruction, never a source of truth. A prompt is composed for an execution and is never stored, canonical, or authoritative content.
- A prompt points to knowledge; it never embeds or restates it. A prompt references business truth by its canonical owner and never copies, caches, or paraphrases it.
- A prompt is composed deterministically. The same intent, the same referenced context, the same governing rules, and the same base prompts and templates compose the same prompt, and there is no randomness and no hidden step.
- A prompt is governed and validated. Every prompt conforms to the governing rules and passes validation before it is expressed, and a prompt that cannot is not expressed.
- A prompt is provider-neutral. Prompt architecture is independent of any provider, model, framework, runtime, or language, and expresses nothing that binds it to one.
- Prompt content is operational output, never constitutional knowledge. A prompt is a produced instruction; nothing in a prompt is automatically promoted into the knowledge repository.
- Prompt architecture is single-owned. Each prompt concern has exactly one owning document, and no prompt concern is owned twice.
- Prompt architecture is repeatable and scalable. The same inputs reproduce the same prompt, and the model holds for one prompt or tens of thousands.

# Prompt Document Standard

Every prompt document under ai/prompts/ uses the following standard structure. This section defines the template only. It defines no actual prompt model. The inventory at ai/prompts/prompts.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The prompt concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the prompt invariants.
- Specification. The technology-neutral prompt model itself: the layering, lifecycle, composition, assembly, templates, context separation, validation, inheritance, boundaries, or versioning the document owns.
- Invariants. The prompt invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A prompt document may add a section only when a genuine prompt concern requires it, following ai/CONTRIBUTING.md, and never to move business truth, a governance rule, reasoning, retrieval, or runtime execution into this namespace, and never to hold a prompt.

# Documentation Rules

A prompt document records one aspect of the prompt model, and nothing more.

- A prompt document never restates business truth, a governance rule, a retrieval model, a reasoning model, a runtime behavior, or a memory model. It references the knowledge repository, ai/governance/, ai/retrieval/, ai/reasoning/, ai/runtime/, and ai/memory/ by canonical path.
- A prompt document never specifies a template language, a syntax, a format, a provider, a model, a framework, or code, and never contains prompt text or an example prompt.
- A prompt document defines the prompt model, never how a prompt is executed, rendered, or implemented.
- Everything a prompt document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Prompts own the expression model. The runtime executes and assembles the execution context. Reasoning reasons. Retrieval determines knowledge. Memory retains context. Governance owns rules. The knowledge repository owns truth. Providers execute prompts. Agents apply prompts. A prompt document owns only its own aspect of the prompt model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern composition, validation, change, and permission: ai/governance/.
- Business truth: the knowledge repository.
- The determination of knowledge and the assembly of the execution context: ai/retrieval/ and ai/runtime/.
- Execution, orchestration, and the carrying and executing of a prompt: ai/runtime/ and the Providers namespace.
- Reasoning, memory, providers, models, tools, and agents: their namespaces.
- The maps of the AI layer: ai/architecture/.

A prompt document references all of the above and owns none of it. It records only the durable, technology-neutral prompt model, and never a prompt.

# Loading Guidance

Prompts are loaded at the Contextual tier defined in ai/README.md, when a task composes an instruction, and the composition and governance-conformance documents are elevated to the Required tier for instruction-composing tasks, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation, whenever the namespace is loaded; the member documents are loaded when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New prompt knowledge is added by creating new prompt documents under ai/prompts/, each following the Prompt Document Standard and owning a single concern. The namespace grows only when a genuinely new prompt concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This prompt extensibility lets the prompt model gain new layers, templates, or concerns over decades, and scale to tens of thousands of prompts, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Prompts namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/prompts/prompts.md declares the Reference authority level. Every prompt-model member document declares the Specification authority level.
- Prompt documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A prompt document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/retrieval/README.md
- ai/reasoning/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Prompt documents. The prompt-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Prompts express the governed conclusions reasoning produces, compose the context retrieval determines and the runtime assembles, conform to the rules governance sets, and are executed by the providers that consume them. Prompts own the expression model only, and never the layers around it.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
