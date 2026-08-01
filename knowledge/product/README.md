---
id: OL-KNOW-PRODUCT-README
document: knowledge/product/README.md

title: Open Lance Product Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: Founder
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-01

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md

used_by:
  - Product Manager
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Customer Support Agent
  - Any AI Agent that loads product knowledge

provenance:
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines the purpose, scope, ownership, boundaries, organization, and
  loading strategy of the Product knowledge namespace. Every document
  inside knowledge/product/ follows this guide.
---

# Open Lance Product Namespace Guide

This document is the guide for the Product knowledge namespace at knowledge/product/. It defines why the namespace exists, what belongs in it, how its documents are owned and organized, and how they reference the rest of the repository. Every document inside knowledge/product/ follows this guide.

This document does not describe any product capability, pricing, subscription, escrow behavior, wallet, contract, or workflow. It organizes the namespace; it does not populate it.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Product namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

The Product namespace exists to hold, in one organized place, the durable knowledge of what Open Lance offers as a product and marketplace. It gives every human and AI contributor a single, consistent source for product facts, so that product knowledge is not scattered, duplicated, or invented.

The namespace is descriptive. It records what the product is, as reference knowledge, so that decisions made under the company's higher-authority documents can rely on accurate product facts rather than on assumption.

# Scope

The following kinds of knowledge belong in this namespace. They are named here as categories only. This guide does not describe or define any of them.

- Product capabilities and marketplace mechanics.
- Pricing, subscriptions, and payment concepts.
- Escrow, wallet, and contract concepts.
- Reviews, categories, search, matching, and notification concepts.
- Any other durable product knowledge, and future product documentation of the same kind.

A document belongs here when its single responsibility is a fact about what Open Lance offers, or about how the product and marketplace work as experienced by participants.

# Out of Scope

This namespace does not own the following. Each is owned elsewhere and is referenced, never restated, by product documents.

- Company identity and philosophy: knowledge/company/company.md.
- Vision: knowledge/company/vision.md.
- Mission: knowledge/company/mission.md.
- Principles: knowledge/company/principles.md.
- Legal constraints: knowledge/company/legal.md.
- Policies: the policy documents in their owning folders.
- Processes and operational guidance: the process documents under knowledge/processes/.
- Marketing and campaigns: the documents under knowledge/marketing/.
- Brand: the documents under knowledge/brand/.
- Business strategy: the documents that own strategy.
- AI agents and their definitions: the documents that own agent definitions.
- Implementation and technical architecture: these live in the codebase, not in the knowledge repository.

# Namespace Structure

Product knowledge is organized by product concept, not by feature list and not by implementation.

- One concept, one document. Each product concept has exactly one owning document with a single responsibility.
- Group by concept, not by mechanism. Related concepts may be grouped for organization, but grouping never changes ownership or authority.
- Small and focused. The namespace grows by adding concept documents, not by enlarging existing ones.
- Found by ownership. A document is located by the concept it owns, and it links to related concepts rather than absorbing them.

This structure is described in terms of concepts and ownership rather than folders, so it stays correct however the namespace is physically arranged.

# Ownership Rules

- Every product concept has exactly one owning document. That document is the single source of truth for the concept.
- Documents may reference other documents. They may never duplicate them.
- If it is unclear which document should own a concept, or whether a concept already has an owner, the contributor halts and escalates rather than creating a competing or duplicate document.
- A new document is created only when a concept has no existing owner, consistent with the contribution process in knowledge/CONTRIBUTING.md.

# Cross Reference Rules

Product documents connect to the rest of the repository by reference, using canonical repository paths, and never by copying content. This applies the Cross-Reference Rules of knowledge/README.md to the Product namespace.

- Company documents. When a product document depends on identity, vision, mission, principles, or legal constraints, it references the owning document in knowledge/company/ rather than restating it.
- Policies and processes. Product documents reference the policies and processes that apply to them. They do not define policy or process themselves.
- Brand, market, and business. When product knowledge touches brand, market, or business context, it references the owning document in the relevant namespace.
- Always reference, never duplicate. If two documents would state the same fact, only the owning document states it and the other references it.

# Loading Strategy

Agents load only the product knowledge their responsibility requires, following the loading tiers defined in the AI Loading Strategy of knowledge/README.md.

- An agent responsible for a single product concept loads that concept's document.
- An agent that needs broader product context loads the relevant subset of concept documents.
- Loading the entire namespace at once is the exception, not the default, and is reserved for responsibilities that genuinely span all product knowledge.
- An agent entering the Product namespace loads this guide first, to learn how the namespace is organized and where a concept is owned, before loading concept documents.

This strategy is expressed in terms of responsibility rather than named agents or counts, so it remains correct as agents and documents change.

# Future Expansion

The namespace grows by adding new concept documents under the same rules, never by changing this guide's architecture.

- A new product concept becomes a new single-responsibility document with a canonical owner.
- New documents follow the ownership, cross-reference, and loading rules above, and the contribution and metadata standards in knowledge/README.md and knowledge/CONTRIBUTING.md.
- Grouping may be reorganized as the namespace grows, provided ownership and authority are preserved.
- This guide does not name or predict specific future documents. It defines only the architectural rules by which they are added.

# Repository Evolution Notes

These notes record optional future improvements. They are informational only, are never blockers, and require no action now.

- Shared namespace-guide pattern. If other namespaces adopt the same organizational guide, a shared structure for namespace guides could be defined once in the repository constitution and referenced by each namespace, so the pattern is maintained in one place.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/company.md
- knowledge/company/vision.md
- knowledge/company/mission.md
- knowledge/company/principles.md
- knowledge/company/legal.md

# Document Governance

- This document governs only the organization and documentation standards of the Product namespace at knowledge/product/. It has no authority over any other namespace, and no authority over the content precedence of any document.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- Product documents must follow the organization and documentation standards defined here. A product document that conflicts with them is corrected to conform, which does not change that document's own authority over its content.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
