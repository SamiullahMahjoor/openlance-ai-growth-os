---
id: OL-KNOW-ARCHITECTURE-DEPENDENCY-MAP
document: knowledge/architecture/dependency-map.md

title: Open Lance Repository Dependency Map

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
  - Derived from knowledge/README.md and the depends_on metadata across the repository

loading_priority: Contextual

summary: >
  The derived map of how the namespaces depend on one another. It owns the
  dependency map only, and defers each document's own depends_on and the
  Knowledge Hierarchy to their owners.
---

# Open Lance Repository Dependency Map

This document owns the Dependency Map for the repository: how the namespaces depend on one another. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. Each document's own depends_on is authoritative, and the Knowledge Hierarchy the dependencies respect is owned by knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of dependencies between namespaces. Its purpose is that an agent can see, in one place, what a namespace consumes and what would be affected if it changed, without tracing every document's front matter by hand.

# Scope

This map covers dependencies at the namespace level, the direction in which namespaces depend on one another. It does not restate any individual document's depends_on, which stays authoritative in each document's front matter, and it does not define the depends_on field or the hierarchy, which are owned by knowledge/README.md.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The depends_on metadata field and the Knowledge Hierarchy: knowledge/README.md.
- Each document's own depends_on declaration, aggregated to the namespace level.

# Map

Dependencies flow from the more operational namespaces toward the more foundational ones, and never in reverse, so the graph has no cycles. At the namespace level:

- The constitution, knowledge/README.md, and the contribution process, knowledge/CONTRIBUTING.md, depend on nothing. Every namespace derives from them.
- The Company namespace is the foundation of business knowledge. Within it, knowledge/company/company.md depends on nothing, and the vision, mission, principles, and legal documents depend on the higher company documents.
- The Product namespace depends on the constitution and the Company namespace.
- The Legal namespace depends on the constitution and the Company namespace, whose legal principles its policies instantiate, and references the Product namespace for the roles its policies assign.
- The Processes namespace depends on the constitution and the Product namespace, whose workflows and roles its processes carry out.
- The Brand namespace depends on the constitution and the Company namespace, whose identity and principles it expresses.
- The Customers namespace depends on the constitution, the Company namespace, and the Product namespace it references.
- The Competitors namespace depends on the constitution and the Company namespace.
- The Marketing namespace depends on the constitution and consumes the Company, Product, Customers, Competitors, and Brand namespaces. It is the most dependent namespace and owns no fact of its own.
- The Architecture namespace depends on the constitution and references every namespace as data, while owning none of them.

For any document, its authoritative dependencies are its own depends_on, not this map.

# Application

To assess the impact of changing a document, an agent reads upward from it, from more foundational to more operational, using this map to find which namespaces consume it, then confirms with each affected document's own depends_on. To load a document consistently, an agent also loads the higher-authority documents it depends on, per knowledge/README.md.

# Boundaries

This document owns the dependency map only. It owns none of the following.

- The depends_on field and the Knowledge Hierarchy: knowledge/README.md.
- Each document's own depends_on: that document's front matter.
- Which namespace owns what: knowledge/architecture/ownership-map.md.
- What to load for a task: knowledge/architecture/loading-map.md.
- The amendment impact-assessment process: knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/ownership-map.md
- knowledge/architecture/authority-map.md
