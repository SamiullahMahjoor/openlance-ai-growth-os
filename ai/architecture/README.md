---
id: OL-AI-ARCHITECTURE-README
document: ai/architecture/README.md

title: Open Lance AIOS Architecture Namespace Guide

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

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how AI architecture knowledge is documented. It establishes the
  standard structure, derivation rules, and boundaries every architecture
  document under ai/architecture/ must follow. It owns how the AI layer
  documents itself, and owns no AI behavior, no business knowledge, and no
  runtime implementation.
---

# Open Lance AIOS Architecture Namespace Guide

This document is the guide for the Architecture namespace at ai/architecture/. It establishes the architecture that every architecture document must follow. The Architecture namespace documents the AI Operating System itself: how its behavior is owned, connected, classified, loaded, and evolved. It does not define AI behavior, and it holds no business knowledge and no runtime implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and applies them to the Architecture namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs both layers.

# Purpose

This document owns exactly one thing: how AI architecture knowledge is documented within the AI layer. It is the single guide for the Architecture namespace, and every architecture document follows it.

The Architecture namespace exists so that any human or AI agent can understand, navigate, load, extend, and maintain the AI layer from one place, without scanning the whole tree and without guessing where behavior lives. It provides the maps; the territory is the rest of the AI layer and the knowledge it consumes.

This guide owns no AI behavior, no business knowledge, and no runtime implementation. Behavior is owned by the operational namespaces defined in ai/README.md; business truth is owned by the knowledge repository; implementation lives outside every knowledge document, in the runtime and its systems.

# Scope

This guide governs the Architecture namespace. It defines the standard structure an architecture document uses, the rules for writing one, the boundaries an architecture document must respect, and how the namespace grows.

The namespace owns derived, applied views of the AI layer: where behavior is owned, how namespaces depend on one another, how the layer consumes the knowledge repository, how behavior should be loaded, how authority is assigned, which agent categories consume which namespaces, and how the layer evolves. Each view is owned by its own document, created under this guide.

# Architectural Identity

The Architecture namespace is meta-knowledge about the AI layer, and it is not any of the following.

- Architecture is not the constitution. The rules of the AI layer, the Authority Hierarchy, the Metadata Standard, the Document Lifecycle, the Cross-Reference Rules, the Versioning Policy, the AI Loading Strategy, the boundary, and the principles are owned by ai/README.md. Architecture applies and maps those rules; it never restates or overrides them.
- Architecture is not AI behavior. Reasoning, planning, decision making, loading, orchestration, agents, memory, prompts, tools, providers, evaluation, safety, and governance are owned by the operational namespaces. Architecture records where that behavior lives, never what it does.
- Architecture is not runtime execution. The runtime executes behavior; this namespace documents where behavior is owned. Documenting the runtime is not executing it, and executing the runtime never makes any namespace an architectural owner. A future runtime namespace owns runtime execution; it never owns a map.
- Architecture is not business knowledge. Company, product, pricing, policy, brand, marketing, legal, customer, competitor, and process knowledge are owned by the knowledge repository. Architecture records where the AI layer consumes that knowledge, never what it is.
- Architecture is not a source of truth for metadata. Each document's own front matter, its owner, depends_on, authority, used_by, and loading_priority, is authoritative. Architecture provides derived, navigational views of that metadata at the namespace level; it never competes with a document's own declaration.
- Architecture is not implementation. It records structure and guidance, never a provider, model, framework, language, runtime, protocol, interface, or code.

An architecture document answers only how the AI layer is structured and consumed. Its knowledge is derived from the constitution and the layer's own metadata, and it remains valid as long as the architecture defined by the constitution holds.

# Definitions

These definitions are layer-wide and timeless. Each references the document that owns the concept where one applies.

- AI Layer. The AI Operating System located at ai/, which owns AI behavior and consumes business truth from the knowledge repository.
- Map. A derived, navigational view of the AI layer, built from the constitution and the layer's own metadata, that helps an agent find, load, classify, or extend behavior.
- Namespace. A folder under ai/ with a single responsibility, defined in the Folder Structure owned by ai/README.md.
- Cross-Layer Consumption. The one-directional relationship in which the AI layer references and consumes the knowledge repository, and the knowledge repository never references the AI layer.
- Namespace Maturity. An architectural classification of a namespace as Planned, Active, or Complete, owned by ai/architecture/repository-evolution.md. Maturity describes build state only and never changes a document's authority.

# Architectural Invariants

These invariants are permanent. Every architecture document upholds them, and no growth of the AI layer weakens them.

- Architecture never owns operational behavior. It documents where behavior lives; it never defines it.
- Maps are always derived. Every map is derived from the constitution and the layer's own metadata, never authored as an independent source of truth.
- Every operational concern has exactly one owning namespace. No concern is unowned, and none has two owners.
- Runtime behavior never changes architectural ownership. What the runtime does at execution time never alters which namespace owns a concern.
- The AI layer never owns business truth. Architecture documents consume knowledge structure by reference and never restate it.
- Cross-layer references are one-directional. Architecture may reference the knowledge repository; the knowledge repository never references the AI layer.

# Architecture Principles

- Every architecture concern has exactly one canonical document, which owns that concern.
- Architecture derives; it does not restate. The constitution's rules and each document's metadata are referenced by canonical path, never copied.
- Architecture maps the AI layer at the namespace level. Per-document detail lives in each document's own metadata, which stays authoritative; the maps stay stable as documents are added within existing namespaces.
- Architecture holds no behavior and no business knowledge. A map records where a concern lives, never what it does or what is true.
- Architecture is implementation- and technology-neutral. A map records structure and guidance, not a provider, model, framework, runtime, or code.
- Architecture stays consistent with the constitution and the knowledge boundary. Where a map and a higher-authority document differ, the higher-authority document governs, and the map is corrected.
- Growth is additive only. New maps extend the namespace without changing this guide.

# Architecture Document Standard

Every architecture document under ai/architecture/ uses the following standard structure. This section defines the template only. It defines no actual map. The inventory at ai/architecture/architecture.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The architecture concern the document owns.
- Scope. What the document covers, at the namespace level.
- Derivation. The authoritative sources the map is derived from, the constitution and the layer's own metadata, referenced and never restated.
- Map. The derived, navigational view itself.
- Application. How an agent uses the map to navigate, load, classify, extend, or maintain the AI layer.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the map references, within ai/ and, for consumption, into knowledge/.

An architecture document may add a section only when a genuine concern requires it, following ai/CONTRIBUTING.md, and never to move behavior or business knowledge into this namespace.

# Documentation Rules

An architecture document records one derived view of the AI layer, and nothing more.

- An architecture document never restates a constitution rule, an AI behavior, or a business fact. It references ai/README.md, ai/CONTRIBUTING.md, the operational namespaces, and the knowledge repository by canonical path.
- An architecture document never competes with a document's own metadata. It provides a derived view and defers to each document's front matter as authoritative.
- An architecture document never specifies a provider, model, framework, language, runtime, protocol, interface, or code.
- Everything an architecture document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. An architecture document owns only its own derived view. It owns none of the following.

- The rules of the AI layer, the Authority Hierarchy, Metadata Standard, Document Lifecycle, Cross-Reference Rules, Versioning Policy, AI Loading Strategy, boundary, principles, and Future Architecture Roadmap: ai/README.md.
- The contribution, review, amendment, and certification process: ai/CONTRIBUTING.md.
- All AI behavior: the operational namespaces named in ai/README.md.
- All business knowledge: the knowledge repository.
- Runtime execution and implementation: the runtime and its systems, outside every knowledge document.
- Each document's own metadata: that document's front matter.

An architecture document references all of the above and owns none of it. It records only a derived, navigational view of the AI layer.

# Repository Growth

New architecture knowledge is added by creating new architecture documents under ai/architecture/, each following the Architecture Document Standard and owning a single concern. The namespace grows only when a genuinely new architecture concern arises. The structure defined by this guide never changes as the namespace grows, existing maps never change identity, and growth is always additive. Because the maps are namespace-level and derived, adding a document within an existing operational namespace does not change them.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Architecture namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/architecture/architecture.md and every map under this namespace are reference documents and declare the Reference authority level, because they record derived facts about the AI layer rather than set behavior. An architecture document never overrides a normative document, and never overrides the constitution it maps.
- Architecture documents follow the standard and rules defined here. An architecture document that conflicts with them, or with the constitution, is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- knowledge/architecture/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Architecture documents. The individual architecture documents governed by this guide are created together with this guide, following it and ai/CONTRIBUTING.md.
- Parallel to the knowledge architecture. This namespace mirrors the Architecture namespace of the knowledge repository at knowledge/architecture/, applied to the AI layer. The two are independent: this namespace maps the AI layer and consumes the knowledge architecture by reference, never the reverse.
- Deferred capabilities. Generated indexing, an AI knowledge graph, AI repository health checks, and role and capability manifests remain deferred in the Future Architecture Roadmap of ai/README.md. If adopted, they would generate or formalize what these maps document manually, and the maps would be reconciled with them at that time.
