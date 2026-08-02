---
id: OL-KNOW-ARCHITECTURE-REPOSITORY-EVOLUTION
document: knowledge/architecture/repository-evolution.md

title: Open Lance Repository Evolution Map

version: 1.1
status: Frozen

document_type: reference
authority: Reference

owner: Knowledge Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/architecture/README.md
  - knowledge/architecture/architecture.md

used_by:
  - Knowledge Architect
  - Any AI Agent that navigates or loads the repository
  - Any AI Agent that maintains or extends the repository
  - Any contributor to the Architecture namespace

provenance:
  - Derived from knowledge/README.md and the repository namespace structure

loading_priority: Contextual

summary: >
  The derived map of the repository's namespace structure and how it grows.
  It owns the evolution map only, and defers the growth rules, the Future
  Architecture Roadmap, and the contribution process to their owners.
---

# Open Lance Repository Evolution Map

This document owns the Repository Evolution Map: the current namespace structure of the repository and how it grows. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. The rules of growth and the Future Architecture Roadmap are owned by knowledge/README.md, and the contribution and amendment process is owned by knowledge/CONTRIBUTING.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of the repository's shape and growth. Its purpose is that an agent can see, in one place, which namespaces exist, the pattern each follows, and how the repository extends, without reconstructing it by scanning the tree.

# Scope

This map covers the namespace-level structure of the repository and the additive pattern by which it grows. It does not define the growth rules or the roadmap, which are owned by knowledge/README.md, and it does not define the contribution process, which is owned by knowledge/CONTRIBUTING.md.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The Folder Structure, Future Expansion, and Future Architecture Roadmap: knowledge/README.md.
- The contribution and amendment process: knowledge/CONTRIBUTING.md.
- The namespace guides and inventories that establish the current structure.

# Map

The repository is organized into namespaces, each following one pattern: a namespace guide at the Process authority level, a reference inventory, and the member documents the namespace owns. The current structure is as follows.

- The constitution, knowledge/README.md, and the contribution process, knowledge/CONTRIBUTING.md, govern the whole repository.
- Company, knowledge/company/, owns identity, vision, mission, principles, and legal principles.
- Legal, knowledge/legal/, owns legal policy.
- Product, knowledge/product/, owns the product ontology.
- Processes, knowledge/processes/, owns process execution.
- Brand, knowledge/brand/, owns communication and presentation standards.
- Customers, knowledge/customers/, owns audience knowledge.
- Competitors, knowledge/competitors/, owns competitor knowledge.
- Marketing, knowledge/marketing/, owns go-to-market strategy.
- Architecture, knowledge/architecture/, owns the maps of the repository itself.

The repository grows additively, following the rules owned by knowledge/README.md and the process owned by knowledge/CONTRIBUTING.md. A new document is added within an existing namespace when a new single responsibility arises there; a new namespace is added when a genuinely new area of knowledge arises, as anticipated by the Folder Structure. Folders named in the Folder Structure but not yet built are intentional forward structure. Capabilities in the Future Architecture Roadmap, such as generated indexing and role manifests, remain deferred until adopted through the constitution.

This map records the structure; the rules that govern its growth are owned by knowledge/README.md.

# Application

To understand the repository's shape, an agent reads this map. To add knowledge, a contributor confirms the responsibility is new through knowledge/architecture/ownership-map.md, then follows the growth rules in knowledge/README.md and the process in knowledge/CONTRIBUTING.md, extending the structure this map records rather than changing it.

# Boundaries

This document owns the evolution map only. It owns none of the following.

- The rules of growth, Future Expansion, and the Future Architecture Roadmap: knowledge/README.md.
- The contribution, amendment, and freeze process: knowledge/CONTRIBUTING.md.
- What each namespace owns: knowledge/architecture/ownership-map.md and the namespaces themselves.
- The business knowledge in any namespace: that namespace.
- Any generated index or manifest capability: deferred in the Future Architecture Roadmap of knowledge/README.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/ownership-map.md
- knowledge/company/legal.md
