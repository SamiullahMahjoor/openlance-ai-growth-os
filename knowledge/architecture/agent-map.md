---
id: OL-KNOW-ARCHITECTURE-AGENT-MAP
document: knowledge/architecture/agent-map.md

title: Open Lance Repository Agent Map

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
  - knowledge/architecture/loading-map.md

used_by:
  - Knowledge Architect
  - Any AI Agent that navigates or loads the repository
  - Any AI Agent that maintains or extends the repository
  - Any contributor to the Architecture namespace

provenance:
  - Derived from knowledge/README.md and the used_by metadata across the repository

loading_priority: Contextual

summary: >
  The derived map of which knowledge each agent role consumes. It owns the
  agent map only, and defers each document's own used_by to its front
  matter and agent behavior to the agents themselves.
---

# Open Lance Repository Agent Map

This document owns the Agent Map for the repository: which knowledge each agent role consumes. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. Each document's own used_by is authoritative, and how an agent behaves once it has knowledge is owned by the agent, not by this repository. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map from agent role to the knowledge it consumes. Its purpose is that an agent of a given role, or a person configuring one, can see which parts of the repository that role draws on.

# Scope

This map covers the mapping from role families to namespaces, derived from the used_by declarations across the repository. It does not restate any document's used_by, which stays authoritative, and it does not define agent behavior, reasoning, or prompts, which live with the agents outside this repository. It is the manual, namespace-level counterpart to the role manifests deferred in the Future Architecture Roadmap of knowledge/README.md.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The used_by metadata field: knowledge/README.md.
- Each document's own used_by declaration, grouped by role family.
- The task-based loading guidance: knowledge/architecture/loading-map.md.

# Map

Every agent draws first on the foundational Company documents that shape all reasoning. Beyond that, role families consume the repository as follows.

- Marketing and growth agents, such as the CMO Agent, Content Marketing Director, AI Copywriter, SEO Director, Social Media Manager, Employer Acquisition Specialist, and Freelancer Growth Specialist, consume the Marketing, Brand, Customers, and Competitors namespaces, and the Company and Product namespaces for the facts they present.
- Product and support agents, such as the Product Manager and Customer Support Agent, consume the Product and Processes namespaces, and the Company namespace for framing.
- Partnership and community agents, such as the Partnership Manager and Community Manager, consume the Company, Brand, and Customers namespaces.
- Agents whose work is legally relevant, such as support, product, partnership, community, and marketing agents, consume the Legal namespace for the legal policies that bound that work.
- The Knowledge Architect, who stewards the repository, consumes the constitution and the Architecture namespace, and every namespace when reviewing, extending, or amending it.
- Every AI agent consumes the foundational Company documents, which are loaded before any strategic work.

For any document, the authoritative record of which roles consume it is its own used_by, not this map. Which knowledge a role needs for a specific task is owned by knowledge/architecture/loading-map.md.

# Application

An agent of a given role uses this map, together with the appearances of its role in documents' used_by, to know its knowledge set, and uses knowledge/architecture/loading-map.md to narrow that set to a specific task. A person configuring an agent uses this map to see which namespaces the role should be able to reach.

# Boundaries

This document owns the agent map only. It owns none of the following.

- The used_by field: knowledge/README.md.
- Each document's own used_by: that document's front matter.
- What to load for a task: knowledge/architecture/loading-map.md.
- Agent behavior, reasoning, and prompts: the agents themselves, outside the knowledge repository.
- The role-manifest capability: deferred in the Future Architecture Roadmap of knowledge/README.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/loading-map.md
- knowledge/architecture/ownership-map.md
