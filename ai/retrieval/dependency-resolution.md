---
id: OL-AI-RETRIEVAL-DEPENDENCY-RESOLUTION
document: ai/retrieval/dependency-resolution.md

title: Open Lance AIOS Dependency Resolution

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/retrieval/README.md
  - ai/retrieval/retrieval.md
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Retrieval namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns how the selected knowledge is expanded to include its declared
  dependencies, so the retrieved set is dependency-complete. It owns
  dependency expansion only, and defers the dependencies themselves, declared
  by each knowledge document, to the knowledge repository.
---

# Open Lance AIOS Dependency Resolution

This document owns how the selected knowledge is expanded to include its dependencies. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns dependency expansion only. It never owns the dependencies themselves, which are declared by each knowledge document's depends_on and mapped by knowledge/architecture/dependency-map.md, and it never selects the base set, which is owned by ai/retrieval/knowledge-selection.md.

# Purpose

This document owns one retrieval concern: how the selected knowledge is expanded so the retrieved set includes everything it depends on. It exists so that any human or AI agent can determine how the set is made dependency-complete, independent of any implementation.

# Principles

These are the enduring principles for dependency resolution. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- The retrieved set is dependency-complete. No selected source is retrieved without the sources it declares it depends on.
- Dependencies are declared, not inferred. Expansion follows the dependencies each document declares, and never invents a dependency the repository does not record.
- Expansion is transitive and terminating. A dependency's own dependencies are included, and because the knowledge dependency graph is acyclic, expansion always terminates.
- Expansion preserves authority. A dependency is included together with the authority it holds, so a governing dependency is present with the source it governs.

# Specification

For the set selected under ai/retrieval/knowledge-selection.md, resolution expands the set to include every declared dependency. This document owns the expansion; the dependencies themselves are owned by the knowledge repository.

- Read declared dependencies. For each selected document, its declared dependencies are read from its own depends_on and from the namespace-level graph in knowledge/architecture/dependency-map.md.
- Include transitively. Each dependency is added to the set, and its own declared dependencies are added in turn, until no undischarged dependency remains.
- Terminate on the acyclic graph. Because the knowledge dependency graph is acyclic, transitive expansion reaches a complete set in finite steps and never loops.
- Add, never duplicate. A dependency already present is not added again, so the dependency-complete set contains each canonical owner exactly once.

Resolution yields the dependency-complete set, which is then prioritized under ai/retrieval/context-prioritization.md and assembled under ai/retrieval/context-assembly.md. Expansion is deterministic and the same at any repository scale, because it follows the fixed, declared dependency graph.

# Invariants

- Every source in the retrieved set has all of its declared dependencies in the set.
- Expansion follows only declared dependencies and never invents one.
- Expansion always terminates, because the dependency graph is acyclic.
- Each canonical owner appears in the set exactly once.
- Resolving dependencies never loads knowledge, never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns dependency expansion only. It owns none of the following, and references each by its canonical owner.

- The dependencies themselves: each knowledge document's depends_on and knowledge/architecture/dependency-map.md.
- The selection of the base set: ai/retrieval/knowledge-selection.md.
- The prioritization and assembly of the expanded set: ai/retrieval/context-prioritization.md and ai/retrieval/context-assembly.md.
- The dependency structure of the AI layer: ai/architecture/dependency-map.md.
- Any graph, index, or traversal mechanism: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/knowledge-selection.md
- ai/retrieval/context-prioritization.md
- knowledge/README.md
- knowledge/architecture/dependency-map.md
