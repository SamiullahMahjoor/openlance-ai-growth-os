---
id: OL-AI-MEMORY-README
document: ai/memory/README.md

title: Open Lance AIOS Memory Namespace Guide

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
  - Any contributor to the Memory namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how memory is documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every memory document under
  ai/memory/ must follow, and it owns memory extensibility. It owns how memory
  is documented, and owns no business truth, no governance rule, no retrieval,
  no reasoning, no prompt, and no implementation.
---

# Open Lance AIOS Memory Namespace Guide

This document is the guide for the Memory namespace at ai/memory/. The Memory namespace owns one thing: the architectural model of how the AI Operating System remembers. It defines how retained context is formed, held, made available, kept consistent, and removed, so that reasoning has the context it needs without inventing it. It owns no business truth, no governance rule, no retrieval, no reasoning, no prompt, no provider, no model, no tool, no agent, and no implementation, storage, or persistence technology.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Memory is a foundational service of the AI layer, sitting below the operational namespaces that build on it, depending only on the constitution and the Governance namespace. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

# Purpose

This document owns exactly one thing: how memory is documented within the AI layer. It is the single guide for the Memory namespace, and every memory document follows it.

The Memory namespace exists so that retained context is a defined, governed, deterministic, technology-neutral resource, rather than an opaque or unbounded store. It defines how memory works; it never executes it, never determines the knowledge that reasoning reasons over, never expresses itself as a prompt, and never owns the rules it obeys.

This guide owns no memory model itself, no business truth, and no governance rule. The memory model is owned by the member documents of this namespace; business truth is owned by the knowledge repository; the rules that govern memory are owned by ai/governance/.

# Scope

This guide governs the Memory namespace. It defines the standard structure a memory document uses, the rules for writing one, the invariants every memory document upholds, the boundaries a memory document must respect, and how the namespace grows. It owns memory extensibility: the additive way the memory model gains new concerns over time.

The namespace owns the memory model of the AI layer: the memory lifecycle, workflow, types, retention, availability to reasoning, consistency, validation, quality, boundaries, and evolution. Each concern is owned by its own document, created under this guide.

# Memory Identity

Memory is the retained-context layer of the AI layer, and it is not any of the following.

- Memory is not the runtime. The runtime executes and owns the session and execution lifecycles; memory defines the retained context those executions draw on and hand back. Memory never orchestrates, schedules, or executes; those are owned by ai/runtime/.
- Memory is not retrieval. Retrieval determines which knowledge to load into context; memory holds retained context across turns, sessions, and time and makes it available. Memory never discovers, selects, or loads knowledge; those are owned by ai/retrieval/.
- Memory is not knowledge. Business truth is owned by the knowledge repository. Memory retains runtime state and never owns, restates, replaces, or becomes business truth, and knowledge always prevails over memory.
- Memory is not reasoning. Reasoning transforms retrieved knowledge into conclusions and draws on the retained context memory offers; memory provides that context and never reasons, concludes, or decides, which are owned by ai/reasoning/.
- Memory is not governance. The rules that govern retention, removal, and change are owned by ai/governance/. Memory operates within those rules; it never defines them.
- Memory is not prompts, providers, models, tools, or agents. Prompts express, providers execute prompts, tools act, and agents apply. Memory offers retained context; it performs none of their work.
- Memory is not implementation. It defines the memory model, never a store, a database, an index, a cache, an embedding, a vector search, a persistence technology, an algorithm, or code.

A memory document answers only how one aspect of memory works. Its knowledge is durable, technology-neutral, and independent of any provider, model, or store, so it remains valid as those change.

# Memory Invariants

These invariants are permanent. Every memory document upholds them, and no memory may violate them.

- Memory is deterministic. The same retained memory, the same request, the same retrieved knowledge, and the same governing rules make the same remembered context available, and there is no randomness and no hidden step.
- Memory holds runtime state, never business truth. Memory retains context; it never owns, restates, or becomes the truth owned by the knowledge repository.
- Memory never invents. Memory retains and provides what was actually formed; it never fabricates a fact or a memory.
- Memory never replaces knowledge. Knowledge always prevails over memory, and persistent memory never overrides a canonical knowledge source.
- Memory is scoped and lifecycled. Every memory has a defined type, retention class, and purpose, and nothing persists beyond that purpose.
- Memory is never promoted to truth. Nothing in memory is automatically promoted into the knowledge repository; a change to business truth is a human-governed knowledge contribution, never a memory side effect.
- Memory is consistent. Memory holds no unsurfaced contradiction, and where memory conflicts with knowledge, knowledge prevails.
- Memory is governed. Retention, removal, replacement, and change of memory occur within the rules owned by ai/governance/.
- Memory is repeatable and scalable. The same memory reproduces the same remembered context, and the model holds for one memory or millions.

# Memory Document Standard

Every memory document under ai/memory/ uses the following standard structure. This section defines the template only. It defines no actual model. The inventory at ai/memory/memory.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The memory concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the memory invariants.
- Specification. The technology-neutral memory model itself: the lifecycle, workflow, types, retention, availability, consistency, validation, quality, boundaries, or evolution the document owns.
- Invariants. The memory invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A memory document may add a section only when a genuine memory concern requires it, following ai/CONTRIBUTING.md, and never to move business truth, a governance rule, retrieval, reasoning, or runtime execution into this namespace.

# Documentation Rules

A memory document records one aspect of the memory model, and nothing more.

- A memory document never restates business truth, a governance rule, a retrieval model, a reasoning model, a runtime behavior, or a prompt. It references the knowledge repository, ai/governance/, ai/retrieval/, ai/reasoning/, ai/runtime/, and the Prompts namespace by canonical path.
- A memory document never specifies a store, a database, an index, a cache, an embedding, a vector search, a persistence technology, an algorithm, or code.
- A memory document defines the memory model, never how memory is stored, executed, expressed, or implemented.
- Everything a memory document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Memory owns the retained-context model. The runtime executes and owns the session and execution lifecycles. Retrieval determines knowledge. Reasoning reasons. Governance owns rules. The knowledge repository owns truth. Prompts express. Providers execute prompts. Agents apply. A memory document owns only its own aspect of the memory model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern retention, removal, change, permission, and escalation: ai/governance/.
- Business truth: the knowledge repository.
- The determination and loading of knowledge: ai/retrieval/ and ai/runtime/.
- Execution, orchestration, the session and execution lifecycles, and the execution context: ai/runtime/.
- Reasoning, prompts, providers, models, tools, and agents: their namespaces.
- The maps of the AI layer: ai/architecture/.

A memory document references all of the above and owns none of it. It records only the durable, technology-neutral memory model.

# Loading Guidance

Memory is loaded at the Contextual tier defined in ai/README.md, when a task spans turns or sessions and therefore draws on retained context, and it is elevated to the Required tier for planning tasks that rest on prior context, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation, whenever the namespace is loaded; the member documents are loaded when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New memory knowledge is added by creating new memory documents under ai/memory/, each following the Memory Document Standard and owning a single concern. The namespace grows only when a genuinely new memory concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This memory extensibility lets the memory model gain new types, retention classes, or concerns over decades without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Memory namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/memory/memory.md declares the Reference authority level. Every memory-model member document declares the Specification authority level.
- Memory documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A memory document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- ai/retrieval/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Memory documents. The memory-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Memory is a foundational service that other namespaces build on: the runtime hands retained state to it and draws context from it, reasoning draws prior context from it, and agents draw prior context from it. It owns retained context only, and never the layers around it.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
