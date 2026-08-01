---
id: OL-KNOW-PRODUCT-ROLES
document: knowledge/product/roles.md

title: Open Lance Product Roles

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
  - Any AI Agent that discovers product roles

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/entities.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the roles Open Lance recognizes.
  It defines the capacity in which an entity acts, not identity,
  permissions, relationships, states, behavior, or implementation.
---

# Open Lance Product Roles

This document is the single canonical inventory of the roles that exist within Open Lance. It defines what each role is: the capacity in which an entity acts. It does not define identity, permissions, relationships, states, behavior, or implementation.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Roles in this inventory are technology-neutral and implementation-independent. A role continues to exist even if databases, APIs, or interfaces change. New roles are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns role definitions. It is the single place where a role is defined. No other document may redefine a role, and other documents may only reference roles defined here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, every role Open Lance recognizes, and rely on a single consistent definition of each.

# Product Role Definition

A role is a capacity in which an entity acts. Roles describe responsibility or participation. A role never defines identity. Identity is owned exclusively by knowledge/product/entities.md.

The canonical actor entity is the Participant, defined in knowledge/product/entities.md. A role is a capacity that a participant holds. The same participant may hold more than one role.

# Scope

This document defines roles only. It states, for each role, the capacity it represents and points to the entity that holds it. It does not describe how a role behaves, what it is permitted to do, how it relates to other roles or entities, or what state it is in.

# Role Rules

- A role is not an entity. Entities are defined in knowledge/product/entities.md.
- One entity may hold multiple roles simultaneously.
- A role defines only the capacity in which an entity participates.
- A role never defines identity, permissions, relationships, states, behavior, workflow, configuration, implementation, database structure, API concepts, or business rules. Each of those is owned by another document and is only referenced, never restated.
- A canonical role exists independently of any single relationship. Relationship-scoped participation belongs to knowledge/product/relationships.md.

# Role Groups

Roles are organized into groups for discovery only. Grouping never changes a role's meaning or ownership.

- Marketplace Roles. Capacities in which a participant takes part in the marketplace itself.
- Platform Roles. Capacities in which a participant operates the platform.
- Operational Roles. Relationship-scoped participation in the delivery of work, such as delegation and teamwork. These exist only within a specific relationship and are owned by knowledge/product/relationships.md, not defined as canonical roles here.
- System Roles. Automated or non-human capacities. No system roles are currently defined; this group is named for completeness only.

# Canonical Role Inventory

Each role below states what it is, its purpose, what belongs elsewhere, and the document that holds the entity acting in it. No entry defines identity, permissions, relationships, states, or behavior.

## Marketplace Roles

**Business**
- Definition. The capacity in which a participant takes part as the hiring side of the marketplace.
- Purpose. Distinguishes a participant acting to have work done.
- Out of Scope. Identity, permissions, relationships, states, capabilities, and behavior.
- Related Knowledge. knowledge/product/entities.md.

**Freelancer**
- Definition. The capacity in which a participant takes part as the working side of the marketplace.
- Purpose. Distinguishes a participant acting to perform work.
- Out of Scope. Identity, permissions, relationships, states, capabilities, and behavior.
- Related Knowledge. knowledge/product/entities.md.

## Platform Roles

**Administrator**
- Definition. The capacity in which a participant operates the platform.
- Purpose. Distinguishes a participant acting to run and oversee the marketplace.
- Out of Scope. Identity, permissions, relationships, states, capabilities, and behavior.
- Related Knowledge. knowledge/product/entities.md.

## Relationship-Scoped Participation

Bidder, Team Owner, and Team Member are not canonical roles. Each exists only within a specific relationship, a delegation or a team, rather than as a permanent participation capacity. They are owned by knowledge/product/relationships.md and are referenced, not defined, here.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Identity and entities: knowledge/product/entities.md.
- Permissions and authorization: knowledge/product/permissions.md.
- Relationships between roles or entities: knowledge/product/relationships.md.
- Lifecycle states: knowledge/product/states.md.
- Capabilities: knowledge/product/features.md.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Behavior, workflows, and processes: the process documents under knowledge/processes/.
- Policies: the policy documents in their owning folders.
- Implementation, database structure, and APIs: these live in the codebase, not in the knowledge repository.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It is the sole canonical owner of role definitions. No other repository document may redefine a role; other documents reference roles only.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only roles that exist, and it never defines identity, permissions, relationships, states, behavior, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Companion structural documents. This document references knowledge/product/permissions.md, knowledge/product/relationships.md, and knowledge/product/states.md, which are created over time under knowledge/product/, following knowledge/product/README.md. Until then, the references are intentional forward references.
- Role and entity separation. Business, Freelancer, and Administrator are defined here as roles rather than entities, consistent with knowledge/product/entities.md, so a single Participant may hold more than one of them at once.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/entities.md
- knowledge/company/company.md
