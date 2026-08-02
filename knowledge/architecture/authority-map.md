---
id: OL-KNOW-ARCHITECTURE-AUTHORITY-MAP
document: knowledge/architecture/authority-map.md

title: Open Lance Repository Authority Map

version: 1.2
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
  - Derived from knowledge/README.md and the authority metadata across the repository

loading_priority: Contextual

summary: >
  The derived map of which authority level each namespace and document
  occupies. It owns the authority map only, and defers the Knowledge
  Hierarchy and conflict resolution to the constitution.
---

# Open Lance Repository Authority Map

This document owns the Authority Map for the repository: which authority level each namespace and document occupies. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. The Knowledge Hierarchy that defines the levels, and the rule that conflicts are resolved by authority, are owned by knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of authority assignments. Its purpose is that an agent can see, in one place, where each namespace and document sits in the Knowledge Hierarchy, so that precedence in a conflict is clear.

# Scope

This map covers authority at the namespace level, and the pattern of authority within each namespace. It does not define the Knowledge Hierarchy or the conflict-resolution rule, which are owned by knowledge/README.md, and it does not override any document's own authority declaration, which stays authoritative.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The Knowledge Hierarchy, the authority field, and the rule that conflicts are resolved by declared authority: knowledge/README.md.
- Each document's own authority declaration.

# Map

Authority is assigned by each document's authority field, not by its folder. The pattern across the repository is as follows.

- The constitution, knowledge/README.md, and the contribution process, knowledge/CONTRIBUTING.md, are normative at the Process authority level and govern structure and process above the business namespaces.
- The Company namespace holds the highest business-knowledge authority levels: knowledge/company/company.md at Company, knowledge/company/vision.md at Vision, knowledge/company/mission.md at Mission, knowledge/company/principles.md at Principles, and knowledge/company/legal.md at Legal.
- Every namespace guide, the README of Product, Processes, Brand, Customers, Competitors, Marketing, Legal, and Architecture, is normative at the Process authority level and governs its namespace.
- Every inventory, and every reference document, declares the Reference authority level and carries no precedence over normative documents. The Product, Customers, and Competitors member documents are reference documents, apart from the Product pricing policy.
- Normative standing decisions declare the Policy authority level: the Brand standard documents, the Marketing strategy documents, the Legal policy documents, and the Product pricing policy.
- Process execution documents in the Processes namespace declare the Process authority level.

When two documents conflict, the higher authority in the Knowledge Hierarchy prevails, as owned by knowledge/README.md. This map records the assignments; the constitution owns the resolution rule.

# Application

To resolve a conflict or judge precedence, an agent consults this map to see each document's authority level, then applies the conflict-resolution rule owned by knowledge/README.md. A contributor placing a new document consults this map for the pattern its namespace follows.

# Boundaries

This document owns the authority map only. It owns none of the following.

- The Knowledge Hierarchy, the authority levels, and the conflict-resolution rule: knowledge/README.md.
- Each document's own authority declaration: that document's front matter.
- How namespaces depend on one another: knowledge/architecture/dependency-map.md.
- The approval authority for freezing and amendment: knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/dependency-map.md
- knowledge/architecture/ownership-map.md
