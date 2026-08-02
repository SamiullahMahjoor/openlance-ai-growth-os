---
id: OL-KNOW-ARCHITECTURE-ARCHITECTURE
document: knowledge/architecture/architecture.md

title: Open Lance Architecture Map Inventory

version: 1.0
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

used_by:
  - Knowledge Architect
  - Any AI Agent that navigates or loads the repository
  - Any AI Agent that maintains or extends the repository
  - Any contributor to the Architecture namespace

provenance:
  - Derived from knowledge/architecture/README.md and the repository structure

loading_priority: Required

summary: >
  The single canonical inventory of the architecture maps that document the
  repository. It records only that each map exists and its identity, not
  the map's content, and not any constitution rule or business fact, which
  are owned elsewhere.
---

# Open Lance Architecture Map Inventory

This document is the single canonical inventory of the maps that document the repository's architecture. It records only that each map exists and what its identity is. It does not state any map's content, and it does not restate any constitution rule or any business fact. Those are owned elsewhere and are only referenced here.

This is a reference document within the Architecture namespace. It follows the namespace guide in knowledge/architecture/README.md, the repository constitution in knowledge/README.md, and the contribution process in knowledge/CONTRIBUTING.md, and it does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

The maps in this inventory are derived from the constitution and the repository's own metadata. A map continues to exist as the repository grows; because the maps are namespace-level, adding documents within existing namespaces does not change the inventory. New maps are added by extending this inventory.

# Purpose

This document owns the existence and identity of the architecture maps. It is the single place where the presence of a map is recorded. No other document may add a map to the inventory, and other documents may only reference the maps recorded here.

Its purpose is discovery: any human or AI contributor can find, in one place, which maps document the repository, and then follow a canonical reference to the map that answers a given question about the repository.

# Scope

This inventory lists every architecture map the repository maintains. Each map is represented exactly once and has exactly one canonical entry. Each entry records identity only; it does not state the map, which is owned by that map's own document.

# Every Map Entry

Every map in this inventory uses the same thin structure. The structure records identity only.

- Name. The canonical name of the map.
- Description. A single identity statement of the question the map answers about the repository.
- Out of Scope. What this entry does not record, deferred to its owner.
- Related Knowledge. The canonical repository path to the document that owns the map.

An entry contains no map content, no constitution rule, and no business fact. It records identity only.

# Definitions

These definitions are repository-wide and timeless. Each defers ownership where the concept is owned elsewhere.

- Architecture Map. The concept of a map is defined in knowledge/architecture/README.md. This inventory owns only the existence and identity of each map, not the definition of the term and not any map's content.
- Map Group. A named grouping of maps used to organize this inventory. A group is an organizational convenience only; it carries no map content and grants no authority.

# Architectural Identity

This inventory reinforces, and does not replace, the identity boundaries defined in knowledge/architecture/README.md.

A map entry represents only the identity of an architecture map. It never represents the map's content, owned by the map's own document, nor any constitution rule, owned by knowledge/README.md, nor any business fact, owned by the business namespaces, nor any implementation. A map identity remains unchanged as the repository grows.

# Ownership

- Each architecture map has exactly one canonical entry, which lives in this document.
- No other document may add a map to the inventory or redefine a map's existence or identity.
- Other documents reference the maps recorded here and never restate them.
- The content of each map is owned by that map's own document under knowledge/architecture/.
- The rules the maps are derived from are owned by knowledge/README.md, and the business knowledge they point to is owned by its namespace.

# Reuse

Existing maps are reused. A duplicate map is never created. When a contributor needs a map that already exists, they reference the existing identity recorded here rather than creating a new one. Before adding a map, a contributor confirms that no existing entry already records it, following the contribution process in knowledge/CONTRIBUTING.md.

# Repository Growth

New maps are added by extending this inventory. Each new map is a new entry under the appropriate group, using the same thin structure, and it points to the document that owns it. A map is added only when a genuinely new repository-architecture concern arises. The structure of this document does not change as the number of maps grows, existing map identities never change, and growth is always additive.

# Architecture Map Inventory

Each map below states the question it answers about the repository at the level of identity, its scope as an inventory entry, and the document that owns it. No entry states the map itself.

## Structural Maps

**Ownership Map**
- Name. Ownership Map.
- Description. The map of which namespace and document own each kind of knowledge in the repository.
- Out of Scope. The map content, owned by knowledge/architecture/ownership-map.md, and the knowledge it points to.
- Related Knowledge. knowledge/architecture/ownership-map.md.

**Dependency Map**
- Name. Dependency Map.
- Description. The map of how the namespaces depend on one another.
- Out of Scope. The map content, owned by knowledge/architecture/dependency-map.md, and each document's own depends_on.
- Related Knowledge. knowledge/architecture/dependency-map.md.

**Authority Map**
- Name. Authority Map.
- Description. The map of which authority level each namespace and document occupies.
- Out of Scope. The map content, owned by knowledge/architecture/authority-map.md, and the Knowledge Hierarchy owned by knowledge/README.md.
- Related Knowledge. knowledge/architecture/authority-map.md.

## Consumption Maps

**Loading Map**
- Name. Loading Map.
- Description. The map of what knowledge to load for a given task.
- Out of Scope. The map content, owned by knowledge/architecture/loading-map.md, and the loading tiers owned by knowledge/README.md.
- Related Knowledge. knowledge/architecture/loading-map.md.

**Agent Map**
- Name. Agent Map.
- Description. The map of which knowledge each agent role consumes.
- Out of Scope. The map content, owned by knowledge/architecture/agent-map.md, and each document's own used_by, and agent behavior.
- Related Knowledge. knowledge/architecture/agent-map.md.

## Evolution Maps

**Repository Evolution**
- Name. Repository Evolution.
- Description. The map of the repository's namespace structure and how it grows.
- Out of Scope. The map content, owned by knowledge/architecture/repository-evolution.md, and the growth rules owned by knowledge/README.md.
- Related Knowledge. knowledge/architecture/repository-evolution.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now and describe no defect.

- Owning map documents. Each entry references a document under knowledge/architecture/ that owns the map. Those documents are created alongside this inventory, following knowledge/architecture/README.md and knowledge/CONTRIBUTING.md.
- New maps. If a genuinely new repository-architecture concern arises, for example a versioning-state map once documents begin to be amended, it is added here as a new entry under the appropriate group and given its own document, without changing this document's structure.
- Grouping. Maps are grouped by concern as an organizational convenience and never as a ranking.
