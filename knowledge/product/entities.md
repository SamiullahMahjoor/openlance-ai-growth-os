---
id: OL-KNOW-PRODUCT-ENTITIES
document: knowledge/product/entities.md

title: Open Lance Product Entities

version: 0.1
status: Draft

document_type: reference
authority: Reference

owner: Product Manager
reviewed_by: Pending

last_updated: 2026-08-02

depends_on:
  - knowledge/product/README.md
  - knowledge/product/features.md
  - knowledge/company/company.md

used_by:
  - Product Manager
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Customer Support Agent
  - Any AI Agent that discovers product entities

provenance:
  - Derived from knowledge/company/company.md and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the business entities Open Lance
  recognizes. It defines what each entity is, not its attributes,
  relationships, states, behavior, or implementation.
---

# Open Lance Product Entities

This document is the single canonical inventory of the business entities that exist within Open Lance. It defines what each entity is and points to the document that owns its detail. It records what entities exist, not their attributes, relationships, states, behavior, or implementation.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Entities in this inventory are technology-neutral and implementation-independent. An entity continues to exist even if databases, APIs, or interfaces change. Changes in implementation do not change this inventory.

New entities are added by extending this inventory. The structure of this document does not change as Open Lance grows; only entries are added.

# Ontology Rules

Each concept in the repository has one home.

- Entities define what something is.
- Relationships define how entities connect.
- Roles define responsibilities.
- States define lifecycle.
- Permissions define authority.
- Workflows define behavior.

This document defines entities only. An entity never defines a relationship, a role, a state, a permission, or a workflow. Those concepts are owned by their respective documents and are only referenced from here, never restated.

An entity represents identity. A role represents the capacity in which an entity acts. One entity may hold multiple roles simultaneously. Roles never redefine entities, and entities never define roles.

Business, Freelancer, and Administrator are roles, not entities, and are defined in knowledge/product/roles.md.

# Purpose

This document owns entity definitions. It is the single place where a business entity is defined. No other document may redefine an entity, and other documents may only reference entities defined here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, every business entity Open Lance recognizes, and rely on a single consistent definition of each.

# Product Definition

Open Lance is a two-sided freelance marketplace. Its product definition is owned by knowledge/product/features.md and is not restated here.

Within Open Lance, an entity is a distinct business thing that the marketplace recognizes and refers to, such as a participant, a job, or a payment. An entity has one clear business meaning and exists independently of any database, interface, or implementation. This document is the canonical catalog of those entities.

# Definitions

These definitions are repository-wide and timeless. Each names the document that owns the concept.

- Entity. A distinct business thing the product recognizes. Owned by this document, knowledge/product/entities.md.
- Relationship. A defined connection between entities. Owned by knowledge/product/relationships.md.
- Attribute. A property that describes an entity. Owned by the entity's own detail document, not by this inventory.
- Role. A capacity in which a participant acts. Owned by knowledge/product/roles.md.
- State. A condition an entity can be in over its lifecycle. Owned by knowledge/product/states.md.
- Capability. Something the product can do. Owned by knowledge/product/features.md.

# Canonical Entities

Each entity below states what it is, its business purpose, its scope as a definition, what belongs elsewhere, and the document that owns its detail. No entry defines attributes, relationships, states, behavior, or ownership rules.

## Identity

**Participant**
- Description. An actor within Open Lance. It is the canonical entity for a marketplace actor and implies no role.
- Business Purpose. Represents the identity of a marketplace actor, independent of any role it holds.
- Scope. The definition and existence of the participant entity.
- Out of Scope. Roles, attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/accounts.md.

**Team**
- Description. A group of participants that work together.
- Business Purpose. Lets a participant take on more work with others.
- Scope. The definition and existence of the team entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/teams.md.

**Profile**
- Description. A presented identity within the marketplace.
- Business Purpose. Lets participants present who they are.
- Scope. The definition and existence of the profile entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/profiles.md.

## Work

**Job**
- Description. A unit of work to be done.
- Business Purpose. Represents demand for work.
- Scope. The definition and existence of the job entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/jobs.md.

**Drop-In**
- Description. A productized, fixed-scope service offering.
- Business Purpose. Lets work be offered as a ready-made service.
- Scope. The definition and existence of the drop-in entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/drop-ins.md.

**Proposal**
- Description. An offer to perform work.
- Business Purpose. Lets participants pursue work.
- Scope. The definition and existence of the proposal entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/proposals.md.

**Contract**
- Description. An agreement to perform work under agreed terms.
- Business Purpose. Represents a committed engagement.
- Scope. The definition and existence of the contract entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/contracts.md.

**Milestone**
- Description. A distinct portion of work.
- Business Purpose. Lets work and payment be divided into steps.
- Scope. The definition and existence of the milestone entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/contracts.md.

**Deliverable**
- Description. A produced unit of work.
- Business Purpose. Represents the output of work.
- Scope. The definition and existence of the deliverable entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/deliverables.md.

## Financial

**Escrow**
- Description. Funds held for work.
- Business Purpose. Protects funds committed to work.
- Scope. The definition and existence of the escrow entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/escrow.md.

**Wallet**
- Description. A place where funds are held.
- Business Purpose. Holds available funds.
- Scope. The definition and existence of the wallet entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/wallet.md.

**Payment**
- Description. The business event of transferring value for work.
- Business Purpose. Represents value exchanged for work.
- Scope. The definition and existence of the payment entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/payments.md.

**Transaction**
- Description. A recorded financial event.
- Business Purpose. Provides a record of financial activity.
- Scope. The definition and existence of the transaction entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/payments.md.

**Subscription**
- Description. A recurring membership.
- Business Purpose. Represents ongoing membership.
- Scope. The definition and existence of the subscription entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/subscriptions.md.

**Bid Pack**
- Description. A purchasable quantity of proposal credits.
- Business Purpose. Lets participants obtain the means to propose.
- Scope. The definition and existence of the bid-pack entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/subscriptions.md.

## Communication

**Conversation**
- Description. A thread of communication.
- Business Purpose. Organizes communication.
- Scope. The definition and existence of the conversation entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/messaging.md.

**Message**
- Description. A single unit of communication.
- Business Purpose. Carries communication.
- Scope. The definition and existence of the message entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/messaging.md.

**Notification**
- Description. A signal about a relevant event.
- Business Purpose. Keeps participants informed.
- Scope. The definition and existence of the notification entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/notifications.md.

## Trust

**Review**
- Description. Recorded feedback on work.
- Business Purpose. Represents reputation earned through work.
- Scope. The definition and existence of the review entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/reviews.md.

**Dispute**
- Description. A disagreement over work or payment.
- Business Purpose. Represents a conflict to be resolved.
- Scope. The definition and existence of the dispute entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/disputes.md.

## Platform

**Category**
- Description. A classification of work and talent.
- Business Purpose. Organizes the marketplace by field of work.
- Scope. The definition and existence of the category entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/categories.md.

## Administration

**Moderation Case**
- Description. A recorded matter of oversight.
- Business Purpose. Represents an item of oversight.
- Scope. The definition and existence of the moderation-case entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/moderation.md.

**Analytics Record**
- Description. A recorded measurement of marketplace activity.
- Business Purpose. Provides a basis for understanding activity.
- Scope. The definition and existence of the analytics-record entity.
- Out of Scope. Attributes, relationships, lifecycle states, and behavior.
- Related Knowledge. knowledge/product/analytics.md.

# Entity Rules

Every entity in this document satisfies all of the following.

- It has one clear business meaning.
- It exists independently of implementation.
- It remains valid if databases, APIs, or interfaces change.
- It has exactly one canonical owning document, which is this document for its definition.

Each entity has exactly one canonical definition, and that definition lives in this document. No other document may redefine an entity. Other documents may reference entities only.

# Document Boundary

This document defines entities. It does not define anything else about them.

- knowledge/product/relationships.md defines relationships between entities.
- knowledge/product/roles.md defines participant roles.
- knowledge/product/states.md defines lifecycle states.
- knowledge/product/permissions.md defines authorization.
- Capability documents in knowledge/product/ reference entities rather than redefining them.

An entity is defined once, here. Every other document references it and never restates its definition.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Relationships between entities: knowledge/product/relationships.md.
- Participant roles: knowledge/product/roles.md.
- Lifecycle states: knowledge/product/states.md.
- Authorization and permissions: knowledge/product/permissions.md.
- Attributes and fields of any entity: the entity's own detail document.
- Behavior, workflows, and processes: the process documents under knowledge/processes/.
- Database models, APIs, and technical architecture: these live in the codebase, not in the knowledge repository.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Roadmap and future or requested entities: this document lists only entities that exist.
- Marketing language and positioning: the documents under knowledge/marketing/.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/features.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record optional future improvements. They are informational only, are never blockers, and require no action now.

- Companion structural documents. This document references knowledge/product/relationships.md, knowledge/product/roles.md, knowledge/product/states.md, and knowledge/product/permissions.md, which are created over time under knowledge/product/, following knowledge/product/README.md. Until then, the references are intentional forward references.
- Entity index generation. As the number of entities grows, this inventory would benefit from the repository indexing capability already deferred in the Future Architecture Roadmap of knowledge/README.md, so that entities and their detail documents can be cross-checked automatically.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It owns the definition of every business entity. No other document may redefine an entity; other documents may only reference the entities defined here.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only entities that exist, and it never defines attributes, relationships, states, behavior, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
