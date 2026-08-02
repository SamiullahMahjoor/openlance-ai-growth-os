---
id: OL-KNOW-ARCHITECTURE-LOADING-MAP
document: knowledge/architecture/loading-map.md

title: Open Lance Repository Loading Map

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
  - knowledge/architecture/architecture.md
  - knowledge/architecture/ownership-map.md

used_by:
  - Knowledge Architect
  - Any AI Agent that navigates or loads the repository
  - Any AI Agent that maintains or extends the repository
  - Any contributor to the Architecture namespace

provenance:
  - Derived from knowledge/README.md and the loading_priority metadata across the repository

loading_priority: Required

summary: >
  The derived guidance for what knowledge to load for a given task, so
  agents retrieve the least they need. It owns the loading map only, and
  defers the loading tiers to the constitution and each document's own
  loading_priority to its front matter.
---

# Open Lance Repository Loading Map

This document owns the Loading Map for the repository: what knowledge to load for a given task. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in knowledge/architecture/README.md. Its identity in the inventory is owned by knowledge/architecture/architecture.md; this document owns the map only. The loading tiers it applies are owned by the AI Loading Strategy in knowledge/README.md, and each document's own loading_priority is authoritative. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived guidance for loading. Its purpose is that an agent retrieves the smallest set of knowledge a task requires, together with the higher-authority documents that govern it, rather than loading the whole repository or guessing.

# Scope

This map covers loading guidance at the namespace level, mapped to common tasks. It applies the loading tiers owned by knowledge/README.md; it does not define them, and it does not override any document's own loading_priority. It names namespaces and, where useful, the key document within a namespace.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The AI Loading Strategy and its tiers, Critical, Required, Optional, and Contextual: knowledge/README.md.
- Each document's own loading_priority declaration.
- Where each kind of knowledge lives: knowledge/architecture/ownership-map.md.

# Map

Two rules from knowledge/README.md frame all loading, and this map applies them.

- Load from the top of the Knowledge Hierarchy downward. The foundational Company documents, which shape all reasoning, are loaded before strategic work; a task then loads the documents required for its domain, and contextual documents only when its situation triggers them.
- A task loads what it requires and the higher-authority documents that govern it, and nothing more.

The following names the knowledge a common task requires. Within each, load the named namespace's guide and inventory to navigate, then the specific documents.

- Blog writing. Required: Brand, knowledge/brand/, for voice, tone, vocabulary, and messaging; Marketing, knowledge/marketing/content-strategy.md and knowledge/marketing/messaging-framework.md. Contextual: Customers for the audience, and Company or Product for the facts a post asserts.
- Search work. Required: Marketing, knowledge/marketing/seo.md and knowledge/marketing/content-strategy.md; Company, knowledge/company/company.md, for the brand and its name. Contextual: Customers for audience language.
- Landing pages. Required: Brand, knowledge/brand/; Marketing, knowledge/marketing/positioning.md, knowledge/marketing/value-propositions.md, and knowledge/marketing/messaging-framework.md; Product for the facts the page states. Contextual: Customers for the audience, Competitors when the page compares.
- Customer support. Required: Product, knowledge/product/, for capabilities, states, and business rules; Processes, knowledge/processes/, for how work runs; Brand, knowledge/brand/voice.md and knowledge/brand/tone.md, for how to speak. Contextual: Company for mission-level framing.
- Sales. Required: Product for capabilities and pricing; Marketing, knowledge/marketing/value-propositions.md and knowledge/marketing/differentiators.md; Customers for the audience. Contextual: Competitors for alternatives.
- Feature design. Required: Product, knowledge/product/, the full ontology; Processes for execution; Company, knowledge/company/principles.md, for the principles that constrain it. Contextual: Customers for the need served.
- Bug fixing. Required: Product and Processes for the domain context of the affected behavior. The fix itself is engineering and lives in the codebase, not in this repository.
- Product planning. Required: Company, knowledge/company/, for mission, vision, and principles; Product and Processes for the current model; Customers for needs. Contextual: Competitors and Marketing.
- Marketing. Required: Marketing, knowledge/marketing/, the full namespace; Brand for standards; Customers for the audience; Company for the mission. Contextual: Competitors and Product.
- Competitor analysis. Required: Competitors, knowledge/competitors/; Marketing, knowledge/marketing/differentiators.md; Company, knowledge/company/company.md. Contextual: Product.
- Repository maintenance. Required: the constitution, knowledge/README.md and knowledge/CONTRIBUTING.md; the Architecture namespace, knowledge/architecture/. Contextual: the specific namespace being maintained.

# Application

An agent given a task loads the Required knowledge above and the higher-authority documents that govern it, and adds Contextual knowledge only when the situation calls for it. When a task is not listed, the agent identifies the kind of knowledge it needs through knowledge/architecture/ownership-map.md, then applies the two framing rules from knowledge/README.md.

# Boundaries

This document owns the loading map only. It owns none of the following.

- The AI Loading Strategy and its tiers: knowledge/README.md.
- Each document's own loading_priority: that document's front matter.
- Which namespace owns what: knowledge/architecture/ownership-map.md.
- Which agent role consumes what: knowledge/architecture/agent-map.md.
- How an agent reasons once knowledge is loaded: the agents and their prompts, outside the knowledge repository.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/architecture/README.md
- knowledge/architecture/architecture.md
- knowledge/architecture/ownership-map.md
- knowledge/architecture/agent-map.md
