---
id: OL-KNOW-PRODUCT-RELATIONSHIPS
document: knowledge/product/relationships.md

title: Open Lance Product Relationships

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: Product Manager
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/product/README.md
  - knowledge/product/entities.md
  - knowledge/product/roles.md
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
  - Any AI Agent that discovers product relationships

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/entities.md, knowledge/product/roles.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the relationships Open Lance
  recognizes between its entities and roles. It defines only what
  connections exist, not behavior, sequence, permissions, states, or
  implementation.
---

# Open Lance Product Relationships

This document is the single canonical inventory of the relationships that exist within Open Lance. It defines what each relationship is: a connection between entities. It does not define entities, roles, permissions, states, behavior, workflow, or implementation.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Relationships in this inventory are technology-neutral and implementation-independent. A relationship continues to exist even if databases, APIs, or interfaces change. New relationships are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns relationship definitions. It is the single place where a relationship between entities is defined. No other document may redefine a relationship, and other documents may only reference relationships defined here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, how the entities of Open Lance are connected, and rely on a single consistent definition of each connection.

# Product Relationship Definition

A relationship is a timeless connection between entities. It answers only how two or more entities are connected.

A relationship is not an entity, a role, a permission, a workflow, or a state. Entities are defined in knowledge/product/entities.md. Roles are defined in knowledge/product/roles.md. A relationship exists independently of implementation and connects entities that may hold roles.

# Relationship Rules

- A relationship connects entities. The connected entities may hold roles, which are defined in knowledge/product/roles.md.
- A relationship never defines entities, roles, permissions, states, workflow, or implementation. Each of those is owned by another document and is only referenced, never restated.
- A relationship states only that a connection exists. It does not describe behavior, sequence, cardinality detail, or authorization.
- Each relationship has exactly one canonical definition, which lives in this document.
- Other documents reference relationships. They never redefine them.

# Relationship Taxonomy

Relationships are organized into groups for discovery only. Grouping never changes a relationship's meaning or ownership.

- Marketplace Relationships. Connections that place participants and work into the marketplace.
- Commercial Relationships. Connections that structure an agreed engagement and its parts.
- Team Relationships. Connections created within a team or a delegation.
- Communication Relationships. Connections that carry communication.
- Financial Relationships. Connections between money and the work or membership it relates to.
- Trust Relationships. Connections that record reputation or conflict about work.
- Governance Relationships. Connections through which the platform is overseen.

# Canonical Relationships

Each relationship below states what it connects, which entities take part, its scope as a definition, what belongs elsewhere, and the documents that own the connected entities and roles. No entry describes behavior, sequence, permissions, or states.

## Marketplace Relationships

**Hiring**
- Definition. The connection between a participant in the business role and a participant in the freelancer role for work.
- Participants. A Participant in the Business role and a Participant in the Freelancer role.
- Scope. The existence of the hiring relationship, the direct connection between the two parties. It is a distinct connection from Contract Origin, which connects a Contract with its Proposal, so the two do not duplicate each other.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Job Ownership**
- Definition. The connection between a participant in the business role and a Job.
- Participants. A Participant in the Business role and a Job.
- Scope. The existence of the job-ownership relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Service Offering**
- Definition. The connection between a participant in the freelancer role and a Drop-In.
- Participants. A Participant in the Freelancer role and a Drop-In.
- Scope. The existence of the service-offering relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Proposal Ownership**
- Definition. The connection between a participant in the freelancer role and a Proposal.
- Participants. A Participant in the Freelancer role and a Proposal.
- Scope. The existence of the proposal-ownership relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Proposal Target**
- Definition. The connection between a Proposal and the Job it addresses.
- Participants. A Proposal and a Job.
- Scope. The existence of the proposal-target relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Category Classification**
- Definition. The connection between a Job and a Category.
- Participants. A Job and a Category.
- Scope. The existence of the category-classification relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Profile Ownership**
- Definition. The connection between a Participant and a Profile.
- Participants. A Participant and a Profile.
- Scope. The existence of the profile-ownership relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Commercial Relationships

**Contract Origin**
- Definition. The connection between a Contract and the Proposal it derives from.
- Participants. A Contract and a Proposal.
- Scope. The existence of the contract-origin relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Contract Composition**
- Definition. The connection between a Contract and a Milestone within it.
- Participants. A Contract and a Milestone.
- Scope. The existence of the contract-composition relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Deliverable Association**
- Definition. The connection between a Deliverable and a Milestone.
- Participants. A Deliverable and a Milestone.
- Scope. The existence of the deliverable-association relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Team Relationships

**Team Membership**
- Definition. The connection between a Team and a Participant that belongs to it.
- Participants. A Team and a Participant.
- Scope. The existence of the team-membership relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Delegation**
- Definition. The connection between a participant that acts as a delegate and the participant on whose behalf it acts.
- Participants. A delegate Participant and another Participant.
- Scope. The existence of the delegation relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

## Communication Relationships

**Conversation Participation**
- Definition. The connection between a Conversation and a Participant in it.
- Participants. A Conversation and a Participant.
- Scope. The existence of the conversation-participation relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Message Membership**
- Definition. The connection between a Message and the Conversation it belongs to.
- Participants. A Message and a Conversation.
- Scope. The existence of the message-membership relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Notification Reference**
- Definition. The connection between a Notification and the entity it concerns.
- Participants. A Notification and another entity.
- Scope. The existence of the notification-reference relationship. It is intentionally generic and may connect to any entity, so new entity types require no change here.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Financial Relationships

**Escrow Coverage**
- Definition. The connection between an Escrow and the Contract it applies to.
- Participants. An Escrow and a Contract.
- Scope. The existence of the escrow-coverage relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Payment Settlement**
- Definition. The connection between a Payment and the Contract it applies to.
- Participants. A Payment and a Contract.
- Scope. The existence of the payment-settlement relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Wallet Ledger**
- Definition. The connection between a Wallet and a Transaction recorded in it.
- Participants. A Wallet and a Transaction.
- Scope. The existence of the wallet-ledger relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Membership Holding**
- Definition. The connection between a Participant and a Subscription.
- Participants. A Participant and a Subscription.
- Scope. The existence of the membership-holding relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Trust Relationships

**Review Association**
- Definition. The connection between a Review and the Contract it concerns.
- Participants. A Review and a Contract.
- Scope. The existence of the review-association relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Dispute Association**
- Definition. The connection between a Dispute and the Contract it concerns.
- Participants. A Dispute and a Contract.
- Scope. The existence of the dispute-association relationship.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Governance Relationships

**Administration**
- Definition. The connection between a participant in the administrator role and another entity within the platform.
- Participants. A Participant in the Administrator role and another entity.
- Scope. The existence of the administration relationship. It is intentionally generic and may connect to any entity, so new entity types require no change here.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Moderation Association**
- Definition. The connection between a Moderation Case and the entity it concerns.
- Participants. A Moderation Case and another entity.
- Scope. The existence of the moderation-association relationship. It is intentionally generic and may connect to any entity, so new entity types require no change here.
- Out of Scope. Behavior, sequence, permissions, states, and implementation.
- Related Knowledge. knowledge/product/entities.md.

# Relationship Boundaries

Each ontology concept has exactly one owner. This document owns connections only.

- Entities own identity: knowledge/product/entities.md.
- Roles own participation capacity: knowledge/product/roles.md.
- Relationships own connections: this document.
- Permissions own authorization: knowledge/product/permissions.md.
- States own lifecycle: knowledge/product/states.md.
- Processes own workflow: the process documents under knowledge/processes/.
- Policies own rules: the policy documents in their owning folders.
- Capabilities own functionality: knowledge/product/features.md.

A relationship owns none of the above. It states only that a connection exists.

# AI Guidance

An AI contributor uses this document to discover how entities are connected, and follows the referenced documents for the connected entities and roles.

- Never infer a relationship that is not defined here. A connection that is not listed does not exist for the purposes of the repository.
- Never invent a relationship to fill a gap. Missing connections are flagged for confirmation, not assumed.
- Never redefine a relationship, or define anything owned elsewhere, such as an entity, role, permission, state, or workflow.
- When it is unclear whether a relationship exists, or which entities it connects, halt and escalate rather than guessing, following knowledge/CONTRIBUTING.md.

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Companion structural documents. This document references knowledge/product/permissions.md and knowledge/product/states.md, which are created over time under knowledge/product/, following knowledge/product/README.md. Until then, the references are intentional forward references.
- Relationship detail. This inventory records that a connection exists. If cardinality or directional detail is ever needed, it would be added under each relationship without changing this document's structure, through the amendment process.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/company/company.md
