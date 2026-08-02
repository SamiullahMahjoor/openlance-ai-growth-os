---
id: OL-KNOW-ARCHITECTURE-README
document: knowledge/architecture/README.md

title: Open Lance Architecture Namespace Guide

version: 1.1
status: Frozen

document_type: normative
authority: Process

owner: Knowledge Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md

used_by:
  - Knowledge Architect
  - Any AI Agent that navigates or loads the repository
  - Any AI Agent that maintains or extends the repository
  - Any contributor to the Architecture namespace

provenance:
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how architecture knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every architecture document under knowledge/architecture/ must
  follow. It owns how the repository documents itself, and owns no rule of
  the constitution and no business knowledge.
---

# Open Lance Architecture Namespace Guide

This document is the guide for the Architecture namespace at knowledge/architecture/. It establishes the constitutional architecture that every architecture document must follow. The Architecture namespace documents the knowledge repository itself: how its knowledge is organized, owned, connected, and consumed. It does not document Open Lance, and it holds no business knowledge.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Architecture namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how architecture knowledge is documented within the repository. It is the single guide for the Architecture namespace, and every architecture document follows it.

The Architecture namespace exists so that any human or AI agent can understand, navigate, load, extend, and maintain the repository from one place, without scanning the whole tree and without guessing where knowledge lives. It provides the maps; the territory is the rest of the repository.

This guide owns no rule of the constitution and no business knowledge. The rules of the repository are owned by knowledge/README.md; the business knowledge is owned by the Company, Product, Processes, Brand, Customers, Competitors, Marketing, and Legal namespaces. Architecture documents reference all of them and restate none of them.

# Scope

This guide governs the Architecture namespace. It defines the standard structure an architecture document uses, the rules for writing one, the boundaries an architecture document must respect, and how the namespace grows.

The namespace owns derived, applied views of the repository: where knowledge is owned, how documents depend on one another, how knowledge should be loaded, how authority is assigned, which agents consume which knowledge, and how the repository evolves. Each view is owned by its own document, created under this guide.

# Architectural Identity

The Architecture namespace is meta-knowledge about the repository, and it is not any of the following.

- Architecture is not the constitution. The rules of the repository, the Metadata Standard, the Knowledge Hierarchy, the Folder Structure, the Document Lifecycle, the Cross-Reference Rules, the Versioning Policy, the AI Loading Strategy, and Governance, are owned by knowledge/README.md. Architecture applies and maps those rules; it never restates or overrides them.
- Architecture is not business knowledge. Company, product, process, brand, customer, competitor, marketing, and legal knowledge is owned by those namespaces. Architecture records where that knowledge lives, never what it is.
- Architecture is not a source of truth for metadata. Each document's own front matter, its owner, depends_on, authority, used_by, and loading_priority, is authoritative. Architecture provides derived, navigational views of that metadata at the namespace level; it never competes with a document's own declaration.
- Architecture is not an automated capability. The generated repository index and role manifests recorded in the Future Architecture Roadmap of knowledge/README.md remain deferred. These documents are manual, derived documentation that serves navigation until, and unless, those capabilities are adopted through the constitution.
- Architecture is not engineering, agent behavior, or a prompt. It does not specify tools, systems, code, agent reasoning, or prompts. It describes only how repository knowledge is organized and consumed.

An architecture document answers only how the repository is structured and consumed. Its knowledge is derived from the constitution and the repository's own metadata, and it remains valid as long as the architecture defined by the constitution holds.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Repository Architecture. How the repository's knowledge is organized, owned, connected, loaded, and evolved. Its rules are owned by knowledge/README.md; its applied maps are owned by this namespace.
- Map. A derived, navigational view of the repository, built from the constitution and the repository's own metadata, that helps an agent find or load knowledge.
- Ownership. Which document owns a given piece of knowledge. The principle of one owner per concept is owned by knowledge/README.md; the applied map is owned by knowledge/architecture/ownership-map.md.
- Dependency. A must-remain-consistent-with relationship between documents, declared in each document's depends_on. The applied graph is owned by knowledge/architecture/dependency-map.md.
- Loading. The selection of documents an agent retrieves for a task. The loading tiers are owned by knowledge/README.md; the applied guidance is owned by knowledge/architecture/loading-map.md.
- Authority. A document's level in the Knowledge Hierarchy, declared in its authority field. The hierarchy is owned by knowledge/README.md; the applied map is owned by knowledge/architecture/authority-map.md.

# Architecture Principles

- Every repository-architecture concern has exactly one canonical document, which owns that concern.
- Architecture derives; it does not restate. The constitution's rules and each document's metadata are referenced by canonical path, never copied.
- Architecture maps the repository at the namespace level. Per-document detail lives in each document's own metadata, which stays authoritative; the maps stay stable as documents are added within existing namespaces.
- Architecture holds no business knowledge. A map records where knowledge lives, never what it is.
- Architecture is implementation-neutral. A map records structure and guidance, not a tool, system, index implementation, or prompt.
- Architecture stays consistent with the constitution. Where a map and the constitution differ, the constitution governs, and the map is corrected.
- Growth is additive only. New maps extend the namespace without changing this guide.

# Architecture Document Standard

Every architecture document under knowledge/architecture/ uses the following standard structure. This section defines the template only. It does not define any actual map. The inventory at knowledge/architecture/architecture.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The repository-architecture concern the document owns.
- Scope. What the document covers, at the namespace level.
- Derivation. The authoritative sources the map is derived from, the constitution and the repository's own metadata, referenced and never restated.
- Map. The derived, navigational view itself.
- Application. How an agent uses the map to navigate, load, extend, or maintain the repository.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the map references.

An architecture document may add a section only when a genuine concern requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

An architecture document records one derived view of the repository, and nothing more.

- An architecture document never restates a constitution rule or a business fact. It references knowledge/README.md, knowledge/CONTRIBUTING.md, and the business namespaces by canonical path.
- An architecture document never competes with a document's own metadata. It provides a derived view and defers to each document's front matter as authoritative.
- An architecture document never specifies a tool, system, index implementation, agent behavior, or prompt.
- Everything an architecture document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concern has exactly one owner. An architecture document owns only its own derived view. It owns none of the following.

- The rules of the repository, the Metadata Standard, Knowledge Hierarchy, Folder Structure, Document Lifecycle, Cross-Reference Rules, Versioning Policy, AI Loading Strategy, Governance, and Future Architecture Roadmap: knowledge/README.md.
- The contribution process, amendment workflow, and approval matrix: knowledge/CONTRIBUTING.md.
- All business knowledge: the Company, Product, Processes, Brand, Customers, Competitors, Marketing, and Legal namespaces.
- Each document's own metadata: that document's front matter.
- Engineering implementation, tools, systems, and any generated index or manifest capability: the codebase and operational systems, and the deferred capabilities in the Future Architecture Roadmap of knowledge/README.md.
- Agent behavior, reasoning, and prompts: the agents and their prompts, which are outside the knowledge repository.

An architecture document references all of the above and owns none of it. It records only a derived, navigational view of the repository.

# Repository Growth

New architecture knowledge is added by creating new architecture documents under knowledge/architecture/, each following the Architecture Document Standard and owning a single concern. The namespace grows only when a genuinely new repository-architecture concern arises. The structure defined by this guide never changes as the namespace grows, existing maps never change identity, and growth is always additive. Because the maps are namespace-level and derived, adding a document within an existing business namespace does not change them.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Architecture namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at knowledge/architecture/architecture.md and every map under this namespace are reference documents and declare the Reference authority level, because they record derived facts about the repository rather than set rules. An architecture document never overrides a normative document, and above all never overrides the constitution it maps.
- Architecture documents follow the standard and rules defined here. An architecture document that conflicts with them, or with the constitution, is corrected to conform.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Architecture documents. The individual architecture documents governed by this guide are created over time under knowledge/architecture/, following this guide and knowledge/CONTRIBUTING.md.
- Deferred capabilities. The generated repository index and role manifests in the Future Architecture Roadmap of knowledge/README.md remain deferred and require a constitutional amendment to adopt. If they are adopted, they would generate or formalize what these maps document manually, and the maps would be reconciled with them at that time.
- Namespace-level grain. The maps are deliberately kept at the namespace level so that adding documents within existing namespaces does not require changing them. If per-document maps are ever wanted, they would be generated by the deferred indexing capability rather than maintained by hand.
