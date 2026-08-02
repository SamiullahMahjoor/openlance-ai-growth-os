---
id: OL-AI-ARCHITECTURE-AGENT-MAP
document: ai/architecture/agent-map.md

title: Open Lance AIOS Agent Map

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
  - ai/architecture/loading-map.md

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the used_by metadata across the AI layer

loading_priority: Contextual

summary: >
  The derived map of which AI agent categories consume which namespaces. It
  owns the agent map only, at the level of categories rather than individual
  agents, and defers each namespace's own used_by to its front matter, agent
  behavior to the agents themselves, and business-knowledge consumption to
  the knowledge repository.
---

# Open Lance AIOS Agent Map

This document owns the Agent Map for the AI layer: which agent categories consume which namespaces. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. It maps categories, never individual agents. Each namespace's own used_by is authoritative, how an agent behaves once it has its knowledge is owned by the agent, not by this repository, and which business knowledge a category consumes is owned by knowledge/architecture/agent-map.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map from agent category to the namespaces it consumes. Its purpose is that a category of agent, or a person configuring one, can see which parts of the AI layer that category draws on, without reconstructing it from every namespace's used_by.

# Scope

This map covers the mapping from agent categories to AI namespaces, derived from the used_by declarations across the layer. It maps categories only, not named agents. It does not restate any namespace's used_by, which stays authoritative, and it does not define agent behavior, reasoning, or prompts, which live with the agents outside every knowledge document. The business knowledge each category consumes is not owned here; it is owned by knowledge/architecture/agent-map.md.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The used_by metadata field: ai/README.md.
- Each namespace's own used_by declaration, grouped by agent category.
- The task-based loading guidance: ai/architecture/loading-map.md.

# Map

Every agent category draws first on the foundational documents that shape all behavior: the constitution, ai/README.md, and the Governance namespace, ai/governance/. Beyond that, categories consume the AI layer as follows. Categories are named by the kind of work an agent does, not by any individual agent.

- Planning agents consume the Reasoning namespace for planning and decision making, the Retrieval namespace for the knowledge a plan depends on, and the Memory namespace for prior context.
- Execution agents consume the Runtime namespace for orchestration, the Agents namespace for coordination and handoffs, the Tools namespace for acting through tools, and the Providers namespace for the model in use.
- Evaluation agents consume the Evaluation namespace for quality and grounding, and the Reasoning namespace for verification.
- Governance agents consume the Governance namespace for the mandates and human governance, and the Safety namespace for risk.
- Business-domain agents, such as support, marketing, sales, engineering, and compliance categories, consume the acting namespaces they need, typically Runtime, Reasoning, Retrieval, Prompts, Memory, Providers, Agents, and Tools, and differ from one another mainly in which business knowledge they consume. That business-knowledge consumption is owned by knowledge/architecture/agent-map.md, not here.
- Architecture and maintenance agents consume the Architecture namespace and the Evolution namespace, together with the constitution, to navigate, extend, and maintain the layer.

For any namespace, the authoritative record of which categories consume it is its own used_by, not this map. Which knowledge a category consumes is owned by the knowledge repository. Which namespaces a task needs is owned by ai/architecture/loading-map.md.

# Cross-Layer Consumption

An agent category consumes both AI behavior and business knowledge. These two consumptions are owned separately and one-directionally.

- This map owns the AI side: which AI namespaces a category consumes.
- The business side, which knowledge namespaces a category consumes, is owned by knowledge/architecture/agent-map.md.
- The AI layer consumes the knowledge repository; the knowledge repository never consumes the AI layer. The two agent maps are read together, never merged, and neither owns the other's content.

# Application

An agent of a given category uses this map, together with the appearances of its category in namespaces' used_by, to know its AI-layer knowledge set, and uses ai/architecture/loading-map.md to narrow that set to a specific task. For the business knowledge the category needs, it uses knowledge/architecture/agent-map.md. A person configuring an agent uses both maps to see which namespaces the category should reach.

# Boundaries

This document owns the agent map only. It owns none of the following.

- The used_by field: ai/README.md.
- Each namespace's own used_by: that namespace's front matter.
- What to load for a task: ai/architecture/loading-map.md.
- Agent behavior, reasoning, and prompts: the agents themselves and the operational namespaces, executed outside every knowledge document.
- The definition of any agent, archetype, permission, or capability: the Agents namespace, ai/agents/.
- Which business knowledge a category consumes: knowledge/architecture/agent-map.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/loading-map.md
- ai/architecture/ownership-map.md
- knowledge/architecture/agent-map.md
