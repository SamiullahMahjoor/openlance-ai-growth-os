---
id: OL-AI-ARCHITECTURE-DEPENDENCY-MAP
document: ai/architecture/dependency-map.md

title: Open Lance AIOS Dependency Map

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/architecture/README.md
  - ai/architecture/architecture.md
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the depends_on metadata across the AI layer

loading_priority: Contextual

summary: >
  The derived map of how the AI namespaces depend on one another, and of the
  one-directional dependency by which the AI layer consumes the knowledge
  repository. It owns the dependency map only, and defers each document's own
  depends_on and the Authority Hierarchy to their owners.
---

# Open Lance AIOS Dependency Map

This document owns the Dependency Map for the AI layer: how the namespaces depend on one another, and how the AI layer depends on the knowledge repository. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. Each document's own depends_on is authoritative, and the Authority Hierarchy the dependencies respect is owned by ai/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of dependencies. Its purpose is that an agent can see, in one place, what a namespace consumes and what would be affected if it changed, and can see that the AI layer depends on the knowledge repository and never the reverse, without tracing every document's front matter by hand.

# Scope

This map covers dependencies at the namespace level, the direction in which namespaces depend on one another, and the single cross-layer dependency from the AI layer to the knowledge repository. It does not restate any individual document's depends_on, which stays authoritative, and it does not define the depends_on field or the hierarchy, which are owned by ai/README.md.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The depends_on metadata field, the Authority Hierarchy, and the Knowledge Boundary: ai/README.md.
- Each document's own depends_on declaration, aggregated to the namespace level.

# Map

Dependencies flow from the more operational namespaces toward the more foundational ones, and never in reverse, so the graph has no cycles. At the namespace level, arranged from foundational to operational:

- The constitution, ai/README.md and ai/CONTRIBUTING.md, is the foundation of the AI layer. It depends on nothing within the AI layer, and every namespace derives from it. The constitution consumes the knowledge repository as described in the cross-layer dependency below.
- The Governance namespace depends on the constitution. Its mandates bind every namespace below it.
- The Providers, Memory, Retrieval, and Safety namespaces depend on the constitution and the Governance namespace. They are the foundational services other namespaces build on. Retrieval and Safety additionally consume the knowledge repository, as described below.
- The Reasoning, Prompts, and Tools namespaces depend on the constitution, the Governance namespace, and the foundational services they use: Reasoning and Prompts on Retrieval, and Tools on Safety.
- The Agents namespace depends on the constitution, the Governance namespace, and the Reasoning, Retrieval, Memory, Prompts, Tools, and Providers namespaces it composes.
- The Runtime namespace depends on the constitution, the Governance namespace, and the Agents, Reasoning, and Retrieval namespaces it orchestrates. It is among the most dependent namespaces and owns no foundational service of its own.
- The Evaluation namespace depends on the constitution and the Governance namespace, and observes the outputs of the namespaces it evaluates without those namespaces depending on it.
- The Operations namespace depends on the constitution, the Governance namespace, and the Runtime namespace it operates.
- The Evolution namespace depends on the constitution and describes the layer's structural integration with the knowledge repository.
- The Architecture namespace depends on the constitution and references every namespace as data, while owning none of them.

For any document, its authoritative dependencies are its own depends_on, not this map.

# Cross-Layer Dependency

The AI layer depends on the knowledge repository. This dependency is one-directional and is the only cross-layer dependency the architecture permits.

- The AI layer consumes the knowledge repository at knowledge/, treating it as the single source of business truth, and references it by canonical path.
- The knowledge repository never depends on, references, or is aware of the AI layer. No knowledge document declares a dependency into ai/.
- Because dependencies flow only from ai/ to knowledge/, the two layers can never form a cycle, and the knowledge repository can be loaded, reviewed, and frozen without any reference to the AI layer.
- This cross-layer dependency is a consumption relationship. It never grants the AI layer the ability to change, amend, or override any business truth; changes to business truth follow knowledge/CONTRIBUTING.md under human governance.

# Application

To assess the impact of changing a document, an agent reads upward from it, from more foundational to more operational, using this map to find which namespaces consume it, then confirms with each affected document's own depends_on. To load a document consistently, an agent also loads the higher-authority documents it depends on, per ai/README.md, and any knowledge it consumes from the canonical owner.

# Boundaries

This document owns the dependency map only. It owns none of the following.

- The depends_on field, the Authority Hierarchy, and the Knowledge Boundary: ai/README.md.
- Each document's own depends_on: that document's front matter.
- Which namespace owns what: ai/architecture/ownership-map.md.
- What to load for a task: ai/architecture/loading-map.md.
- The dependency structure of the knowledge repository: knowledge/architecture/dependency-map.md.
- Runtime execution and implementation: the runtime and its systems.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/ownership-map.md
- ai/architecture/authority-map.md
- knowledge/README.md
