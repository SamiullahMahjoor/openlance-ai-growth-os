---
id: OL-AI-ARCHITECTURE-OWNERSHIP-MAP
document: ai/architecture/ownership-map.md

title: Open Lance AIOS Ownership Map

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

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the AI layer namespace structure

loading_priority: Contextual

summary: >
  The derived map of which namespace owns each operational concern in the AI
  layer, and of the one-directional boundary by which the layer consumes the
  knowledge repository. It owns the ownership map only, and points to owners
  without restating the behavior they own or the one-owner rule owned by the
  constitution.
---

# Open Lance AIOS Ownership Map

This document owns the Ownership Map for the AI layer: which namespace owns each operational concern. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. The rule that every concern has exactly one owner is owned by ai/README.md, and the behavior each owner holds is owned by that owner. This map points; it does not restate. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of ownership. Its purpose is that any agent can find, in one place, which namespace owns a given operational concern, and go straight to the owner rather than search, and can see the boundary between what the AI layer owns and what it consumes from the knowledge repository.

# Scope

This map covers ownership at the namespace level for every operational concern in the AI layer, and the one-directional cross-layer boundary. It does not list every document, it does not state any behavior, and it does not restate what any owner holds. Each document's own front matter remains the authoritative record of what it owns. This map records ownership only; runtime execution never changes an ownership assignment recorded here.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The one-owner rule, the AI Boundary, the Knowledge Boundary, and the Folder Structure: ai/README.md.
- Each namespace's own guide and inventory, once created, which establish what that namespace owns.

# Map

Each operational concern in the AI layer is owned by exactly one namespace. The concern itself is owned there; this map only names where.

- Constitution. The identity, boundaries, standards, hierarchy, principles, and contribution and amendment process of the AI layer: the constitution at the root, ai/README.md and ai/CONTRIBUTING.md.
- Governance. Constitutional validation, ownership and authority enforcement, knowledge-consumption rules, human governance, audit, and traceability: the Governance namespace, ai/governance/.
- Runtime. Orchestration, scheduling, the event model, transient execution state, the task lifecycle, and workflow execution: the Runtime namespace, ai/runtime/.
- Orchestration. The coordination of execution across a task: the Runtime namespace, ai/runtime/.
- Workflows. The execution of multi-step work: the Runtime namespace, ai/runtime/.
- Context. Getting the right knowledge into context, and assembling it: the Retrieval namespace, ai/retrieval/.
- Reasoning. Reasoning governance, planning, decision making, verification, clarification, and confidence: the Reasoning namespace, ai/reasoning/.
- Prompts. The governance and composition of prompts as transient instructions: the Prompts namespace, ai/prompts/.
- Memory. Runtime memory behavior across its scopes, and its lifecycle: the Memory namespace, ai/memory/.
- Agents. Agent definitions, archetypes, lifecycle, coordination, communication, and handoffs: the Agents namespace, ai/agents/.
- Permissions. Agent permissions and capabilities: the Agents namespace, ai/agents/.
- Models. The model-neutral abstraction, model capability, and model selection: the Providers namespace, ai/providers/.
- Providers. The provider-neutral abstraction, provider routing, fallbacks, and limits: the Providers namespace, ai/providers/.
- Tools. Tool registration, selection, execution, and tool governance and security: the Tools namespace, ai/tools/.
- Evaluation. Quality, testing, grounding, and self-review: the Evaluation namespace, ai/evaluation/.
- Safety. Security posture, privacy enforcement, isolation, human review, and risk: the Safety namespace, ai/safety/.
- Operations. Deployment, observability, configuration, and runtime-artifact versioning: the Operations namespace, ai/operations/.
- Evolution. The structural integration of the AI layer with the knowledge repository, migration, and compatibility: the Evolution namespace, ai/evolution/.
- Architecture. The derived maps of the AI layer itself: the Architecture namespace, ai/architecture/.

Every operational concern above has exactly one owning namespace, and no concern is owned twice. For any document, the authoritative statement of what it owns is its own front matter and content, not this map.

# Cross-Layer Ownership Boundary

The AI layer owns behavior; the knowledge repository owns business truth. This boundary is absolute and one-directional, as owned by the Knowledge Boundary in ai/README.md.

- The AI layer never owns any business concern. Company, product, pricing, policy, brand, marketing, legal, customer, competitor, and process knowledge are owned exclusively by the knowledge repository and are consumed by reference, never restated.
- The AI layer references the knowledge repository; the knowledge repository never references the AI layer. Ownership assignments here never depend on the knowledge repository being aware of the AI layer.
- Runtime state, memory, and outputs are never promoted into the knowledge repository. No AI namespace becomes an owner of business truth by executing.

# Application

An agent that needs an operational concern consults this map to find the owning namespace, then loads and reads the owner directly. A contributor deciding where new behavior belongs consults this map to confirm no owner already exists before creating a document, following ai/CONTRIBUTING.md. An agent that needs a business fact consults the knowledge repository's ownership map at knowledge/architecture/ownership-map.md, never this one.

# Boundaries

This document owns the ownership map only. It owns none of the following.

- The one-owner rule, the AI Boundary, the Knowledge Boundary, and the Folder Structure: ai/README.md.
- The behavior each owner holds: the owning namespaces themselves.
- Each document's own declaration of what it owns: that document's front matter and content.
- How namespaces depend on one another: ai/architecture/dependency-map.md.
- What authority each namespace holds: ai/architecture/authority-map.md.
- The ownership of any business knowledge: knowledge/architecture/ownership-map.md and the knowledge repository.
- Runtime execution and implementation: the runtime and its systems.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/dependency-map.md
- knowledge/architecture/ownership-map.md
