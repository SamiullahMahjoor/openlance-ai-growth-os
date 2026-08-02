---
id: OL-AI-RETRIEVAL-README
document: ai/retrieval/README.md

title: Open Lance AIOS Retrieval Namespace Guide

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
  - Any contributor to the Retrieval namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how knowledge retrieval is documented. It establishes the standard
  structure, derivation rules, invariants, and boundaries every retrieval
  document under ai/retrieval/ must follow. It owns how retrieval is
  documented, and owns no business truth, no governance rule, no runtime
  execution, and no implementation.
---

# Open Lance AIOS Retrieval Namespace Guide

This document is the guide for the Retrieval namespace at ai/retrieval/. The Retrieval namespace owns one thing: the architectural model by which the runtime determines what knowledge must be loaded before an execution. It owns how candidate knowledge is discovered, selected, expanded through its dependencies, prioritized, and assembled into a retrieval result, and how that result is validated before loading. It owns no business truth, no governance rule, no runtime execution, no reasoning, no memory, no prompt, no provider, no tool, no agent, and no implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Retrieval sits at the Specification authority level defined in ai/README.md: its documents define the technology-neutral retrieval model. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and retrieval consumes it one-directionally.

# Purpose

This document owns exactly one thing: how retrieval is documented within the AI layer. It is the single guide for the Retrieval namespace, and every retrieval document follows it.

The Retrieval namespace exists so that, before any execution, the runtime can determine the minimum sufficient, dependency-complete, authority-correct set of knowledge the task requires, drawn only from the canonical knowledge repository, deterministically and at any scale. It defines how that set is determined; it never loads it, never assembles the execution context, and never owns the knowledge itself.

This guide owns no retrieval model itself, no business truth, and no governance rule. The retrieval model is owned by the member documents of this namespace; business truth is owned by the knowledge repository; the rules that bound retrieval are owned by ai/governance/.

# Scope

This guide governs the Retrieval namespace. It defines the standard structure a retrieval document uses, the rules for writing one, the invariants every retrieval document upholds, the boundaries a retrieval document must respect, and how the namespace grows.

The namespace owns the retrieval model of the AI layer: the retrieval lifecycle and workflow, knowledge discovery, knowledge selection, dependency resolution, context prioritization, context assembly, the loading strategy the retrieval applies, retrieval validation, and retrieval boundaries. Each concern is owned by its own document, created under this guide.

# Retrieval Identity

Retrieval is the determination layer of knowledge for the AI layer, and it is not any of the following.

- Retrieval is not the knowledge repository. Business truth, and the ownership, authority, dependencies, loading priorities, metadata, and boundaries of knowledge, are owned by the knowledge repository. Retrieval consumes those to determine what to load; it never owns, restates, or decides truth.
- Retrieval is not governance. The rules that bound retrieval, including which knowledge an execution is permitted, are owned by ai/governance/. Retrieval applies those rules; it never defines them.
- Retrieval is not the runtime. The runtime loads the determined knowledge and assembles the execution context. Retrieval determines the set to load and produces the retrieval result; the loading orchestration is owned by ai/runtime/knowledge-resolution.md and the execution-context assembly by ai/runtime/context-loading.md.
- Retrieval is not reasoning, memory, prompts, providers, tools, agents, evaluation, safety, operations, or architecture. Those are owned by their namespaces. Retrieval produces the knowledge they draw on; it performs none of their work.
- Retrieval is not implementation or technology. It defines the retrieval model, never a search engine, index, embedding, ranking, database, algorithm, protocol, or code.

A retrieval document answers only how one aspect of determining the knowledge set works. Its knowledge is durable, technology-neutral, and independent of any provider, model, search technology, or system, so it remains valid as those change.

# Retrieval Invariants

These invariants are permanent. Every retrieval document upholds them, and no retrieval may violate them.

- Retrieval consumes; it never owns. Retrieval reads the knowledge repository and never owns, writes, or amends any business truth.
- Cross-layer retrieval is one-directional. Retrieval consumes the knowledge repository; the knowledge repository never consumes retrieval.
- Retrieval determines; the runtime loads. Retrieval produces the set to load and the retrieval result; the runtime loads it and assembles the execution context.
- Retrieval is authority-aware and ownership-aware. Every piece is drawn from its single canonical owner, and higher-authority knowledge is included with the lower-authority knowledge it governs.
- Retrieval is dependency-complete. The retrieved set includes the declared dependencies of every piece in it, so no source is loaded without the sources it depends on.
- Retrieval is minimal. Retrieval determines the least knowledge sufficient for the task, plus the higher-authority and dependency sources that govern it, and no more.
- Retrieval is validated before loading. The retrieval result is validated for authority, ownership, dependency completeness, boundaries, and governance permission before it is handed to the runtime.
- Retrieval is deterministic. The same task against the same repository state determines the same knowledge set.
- Retrieval scales without redesign. The model determines the set identically whether the repository holds ten documents or millions.

# Retrieval Document Standard

Every retrieval document under ai/retrieval/ uses the following standard structure. This section defines the template only. It defines no actual model. The inventory at ai/retrieval/retrieval.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The retrieval concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the retrieval invariants.
- Specification. The technology-neutral retrieval model itself: the lifecycle, workflow, discovery, selection, resolution, prioritization, assembly, strategy, validation, or boundaries the document owns.
- Invariants. The retrieval invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A retrieval document may add a section only when a genuine retrieval concern requires it, following ai/CONTRIBUTING.md, and never to move business truth, a governance rule, or runtime execution into this namespace.

# Documentation Rules

A retrieval document records one aspect of the retrieval model, and nothing more.

- A retrieval document never restates business truth, a governance rule, a runtime behavior, or an architecture map. It references the knowledge repository, ai/governance/, ai/runtime/, and ai/architecture/ by canonical path.
- A retrieval document never specifies a search engine, index, embedding, ranking, database, algorithm, provider, model, framework, protocol, or code.
- A retrieval document never loads knowledge, assembles the execution context, or executes; it determines what is to be loaded.
- Everything a retrieval document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Retrieval determines the knowledge set. The knowledge repository owns truth. Governance owns rules. The runtime loads and assembles the execution context. A retrieval document owns only its own aspect of determination. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern retrieval: ai/governance/.
- Business truth and its ownership, authority, dependencies, loading priorities, metadata, and boundaries: the knowledge repository.
- The loading of the determined knowledge and the assembly of the execution context: ai/runtime/knowledge-resolution.md and ai/runtime/context-loading.md.
- The maps of the AI layer: ai/architecture/.
- Reasoning, memory, prompts, providers, tools, agents, evaluation, safety, and operations: their namespaces.

A retrieval document references all of the above and owns none of it. It records only the durable, technology-neutral retrieval model.

# Loading Guidance

Retrieval is loaded at the Required tier defined in ai/README.md, because most acting tasks retrieve knowledge, and the core determination documents are loaded whenever retrieval runs. This guide and the inventory are loaded at the Required tier for navigation, and the lifecycle framing and boundaries at the Contextual tier. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New retrieval knowledge is added by creating new retrieval documents under ai/retrieval/, each following the Retrieval Document Standard and owning a single concern. The namespace grows only when a genuinely new retrieval concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Retrieval namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/retrieval/retrieval.md declares the Reference authority level. Every retrieval-model member document declares the Specification authority level.
- Retrieval documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A retrieval document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- knowledge/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Retrieval documents. The retrieval-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Relationship to the runtime. The runtime consumes the retrieval result: ai/runtime/knowledge-resolution.md loads what retrieval determines, and ai/runtime/context-loading.md assembles the execution context from it. Retrieval owns determination; the runtime owns loading and assembly. The two are complementary and never overlap.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
