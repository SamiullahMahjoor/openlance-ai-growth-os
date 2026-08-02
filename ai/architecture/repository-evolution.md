---
id: OL-AI-ARCHITECTURE-REPOSITORY-EVOLUTION
document: ai/architecture/repository-evolution.md

title: Open Lance AIOS Repository Evolution Map

version: 1.12
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

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the AI layer namespace structure

loading_priority: Contextual

summary: >
  The derived map of the AI layer's namespace structure, its namespace
  maturity, and how it grows and scales. It owns the evolution map only, and
  defers the growth rules, the Future Architecture Roadmap, and the
  contribution process to their owners.
---

# Open Lance AIOS Repository Evolution Map

This document owns the Repository Evolution Map for the AI layer: the current namespace structure, the maturity of each namespace, and how the layer grows and scales. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. The rules of growth and the Future Architecture Roadmap are owned by ai/README.md, and the contribution and amendment process is owned by ai/CONTRIBUTING.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of the AI layer's shape, maturity, and growth. Its purpose is that an agent can see, in one place, which namespaces exist, the pattern each follows, how mature each is, and how the layer extends and scales, without reconstructing it by scanning the tree.

# Scope

This map covers the namespace-level structure of the AI layer, the maturity classification of each namespace, and the additive pattern by which the layer grows and scales. It does not define the growth rules or the roadmap, which are owned by ai/README.md, and it does not define the contribution process, which is owned by ai/CONTRIBUTING.md. Maturity is an architectural classification only; it never changes a document's authority.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The Folder Structure, Future Expansion, and Future Architecture Roadmap: ai/README.md.
- The contribution and amendment process: ai/CONTRIBUTING.md.
- The namespace guides and inventories that establish the current structure, as each is created.

# Map

The AI layer is organized into namespaces, each following one pattern: a namespace guide at the Process authority level, a reference inventory, and the member documents the namespace owns. The current structure, from foundational to operational, is as follows.

- The constitution, ai/README.md and ai/CONTRIBUTING.md, governs the whole AI layer.
- Governance, ai/governance/, owns the constraints every action must satisfy.
- Runtime, ai/runtime/, owns orchestration, scheduling, events, state, the task lifecycle, and workflow execution.
- Retrieval, ai/retrieval/, owns getting knowledge into context.
- Reasoning, ai/reasoning/, owns how the AI reasons.
- Prompts, ai/prompts/, owns prompt governance and composition.
- Memory, ai/memory/, owns runtime memory behavior.
- Agents, ai/agents/, owns agent definitions.
- Evaluation, ai/evaluation/, owns judging output.
- Providers, ai/providers/, owns the provider- and model-neutral abstraction.
- Tools, ai/tools/, owns the tool system.
- Safety, ai/safety/, owns runtime safety.
- Operations, ai/operations/, owns running the layer.
- Evolution, ai/evolution/, owns the layer's structural integration with the knowledge repository.
- Architecture, ai/architecture/, owns the derived maps of the AI layer itself.

The AI layer grows additively, following the rules owned by ai/README.md and the process owned by ai/CONTRIBUTING.md. A new document is added within an existing namespace when a new single responsibility arises there; a new namespace is added when a genuinely new area of behavior arises, as anticipated by the Folder Structure. Namespaces named in the Folder Structure but not yet built are intentional forward structure. Capabilities in the Future Architecture Roadmap remain deferred until adopted through the constitution.

# Namespace Maturity

Each namespace carries an architectural maturity classification. Maturity describes build state only. It never changes a document's authority, its ownership, or any rule the constitution sets, and it is not a lifecycle status of a document. A document's own status field remains its authoritative lifecycle state.

- Planned. The namespace is named in the Folder Structure as forward architecture, and its documents are not yet created.
- Active. The namespace is being built. Some of its documents exist and may be Draft or Frozen, and the namespace is not yet complete.
- Complete. Every document the namespace owns exists and is Frozen, and the namespace covers its responsibility fully.

The current maturity of the AI layer is as follows. The constitution is Complete. The Architecture namespace, ai/architecture/, the Governance namespace, ai/governance/, the Runtime namespace, ai/runtime/, the Retrieval namespace, ai/retrieval/, the Reasoning namespace, ai/reasoning/, the Memory namespace, ai/memory/, the Prompts namespace, ai/prompts/, the Agents namespace, ai/agents/, the Safety namespace, ai/safety/, the Providers namespace, ai/providers/, the Tools namespace, ai/tools/, the Evaluation namespace, ai/evaluation/, the Operations namespace, ai/operations/, and the Evolution namespace, ai/evolution/, are Complete. Every namespace of the AI layer is now Complete. As each namespace is built, its maturity moves from Planned to Active to Complete, and this map is amended to record the change. Maturity changes are additive records; they never alter authority or ownership.

# Scalability

The AI layer is designed to scale without being redesigned. Growth is always additive and follows the same rules, so the layer expands from a handful of documents and agents to thousands of each without changing its architecture.

- Many documents. Strict one-responsibility modularity and canonical paths let the layer grow by adding small documents and folders rather than enlarging existing ones. The maps stay namespace-level, so adding documents within a namespace does not change them.
- Thousands of agents. Metadata such as used_by and loading tiers, together with the agent and loading maps, lets any number of agents discover and load exactly the namespaces they need, without coordination with one another. Adding an agent category is additive and changes no existing document.
- Many providers, models, and runtimes. Provider-, model-, and technology-neutral documents tie nothing to a specific intelligence or runtime, so scaling across many of each requires no change to behavior.
- Many namespaces. New single-responsibility namespaces are absorbed under the same structure as new folders, classified through the maturity model, without redesign.

The hierarchy, standards, boundary, maps, and growth rules remain constant as the layer scales. If a proposed change would require altering these rather than adding within them, it is a change to the constitution and is reviewed as such, not worked around.

# Application

To understand the layer's shape and maturity, an agent reads this map. To add behavior, a contributor confirms the responsibility is new through ai/architecture/ownership-map.md, then follows the growth rules in ai/README.md and the process in ai/CONTRIBUTING.md, extending the structure this map records rather than changing it, and updates the maturity of the affected namespace here.

# Boundaries

This document owns the evolution map only. It owns none of the following.

- The rules of growth, Future Expansion, and the Future Architecture Roadmap: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- What each namespace owns: ai/architecture/ownership-map.md and the namespaces themselves.
- The authority of any namespace: ai/architecture/authority-map.md.
- The behavior in any namespace: that namespace.
- The evolution of the knowledge repository: knowledge/architecture/repository-evolution.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/ownership-map.md
- ai/architecture/authority-map.md
