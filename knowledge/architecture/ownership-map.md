---
id: OL-KNOW-ARCHITECTURE-OWNERSHIP-MAP
document: knowledge/architecture/ownership-map.md

title: Open Lance Repository Ownership Map

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
  - Derived from knowledge/README.md and the repository namespace guides

loading_priority: Contextual

summary: >
  The derived map of which namespace and document own each kind of
  knowledge in the repository. It owns the ownership map only, and points
  to owners without restating the knowledge they own or the one-owner rule
  owned by the constitution.
---

# Open Lance Repository Ownership Map

This document owns the Ownership Map for the repository: where each kind of knowledge lives. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. The rule that every concept has exactly one owner is owned by knowledge/README.md, and the knowledge each owner holds is owned by that owner. This map points; it does not restate. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of ownership. Its purpose is that any agent can find, in one place, which namespace and document own a given kind of knowledge, and go straight to the owner rather than search.

# Scope

This map covers ownership at the namespace level, and at the concept level for the frozen Product and Brand ontologies where concept-to-document navigation is most useful. It does not list every document, and it does not restate what any owner holds. Each document's own front matter remains the authoritative record of what it owns.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The principle that every concept has exactly one canonical owner, and the Folder Structure: knowledge/README.md.
- Each namespace's own guide and inventory, which establish what that namespace owns.

# Map

Knowledge in the repository is owned as follows. Each entry names where a kind of knowledge lives; the knowledge itself is owned there.

- Repository rules and architecture: the constitution, knowledge/README.md.
- The contribution and amendment process: knowledge/CONTRIBUTING.md.
- Company identity, vision, mission, principles, and legal principles: the Company namespace, knowledge/company/.
- Legal policy: the Legal namespace, knowledge/legal/.
- Product knowledge, owned within the Product namespace, knowledge/product/: features, entities, relationships, roles, workflows, states, permissions, business rules, and pricing, each owned by its own document within that namespace.
- Process execution: the Processes namespace, knowledge/processes/, one document per process.
- Brand standards, owned within the Brand namespace, knowledge/brand/, as: voice, tone, vocabulary, naming, and messaging for verbal identity, and logo, color, typography, and imagery for visual identity, each by its own document.
- Customer segment knowledge: the Customers namespace, knowledge/customers/.
- Competitor knowledge: the Competitors namespace, knowledge/competitors/.
- Marketing strategy: the Marketing namespace, knowledge/marketing/.
- Repository maps: the Architecture namespace, knowledge/architecture/.
- Engineering implementation, code, produced assets, and commercial values: the codebase and operational systems, outside the knowledge repository.

For any document, the authoritative statement of what it owns is its own front matter and content, not this map.

# Application

An agent that needs a kind of knowledge consults this map to find the owning namespace and document, then loads and reads the owner directly. A contributor deciding where new knowledge belongs consults this map to confirm no owner already exists before creating a document, following knowledge/CONTRIBUTING.md.

# Boundaries

This document owns the ownership map only. It owns none of the following.

- The one-owner-per-concept rule and the Folder Structure: knowledge/README.md.
- The knowledge each owner holds: the owning namespaces themselves.
- Each document's own declaration of what it owns: that document's front matter and content.
- How documents depend on one another: knowledge/architecture/dependency-map.md.
- What to load for a task: knowledge/architecture/loading-map.md.
- Implementation and produced assets: the codebase and operational systems.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/dependency-map.md
- knowledge/architecture/loading-map.md
