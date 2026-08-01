---
id: OL-KNOW-PRODUCT-STATES
document: knowledge/product/states.md

title: Open Lance Product States

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
  - knowledge/product/workflows.md
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
  - Any AI Agent that discovers product states

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/entities.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the business states Open Lance
  recognizes. It records only that each state exists, not workflow
  behavior, sequence, permissions, business rules, or implementation.
---

# Open Lance Product States

This document is the single canonical inventory of the business states that exist within Open Lance. It records only that each state exists and which objects may occupy it. It does not describe workflow behavior, sequence, logic, permissions, business rules, or implementation, which are owned elsewhere.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

States in this inventory are technology-neutral and implementation-independent. A business state remains the same business state even if databases, interfaces, storage, or execution change completely. New states are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence of business states. It is the single place where the presence of a state is recorded. No other document may add a state to the inventory, and other documents may only reference states recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which business conditions Open Lance recognizes, and rely on a single consistent definition of each.

# Product State Definition

A state is a meaningful business condition that an entity, workflow, or business object may occupy.

This document records only that a state exists and which objects it applies to. It does not describe how a state is entered or left, what is permitted while in a state, or what rules govern a state. Those are owned by other documents.

A state represents only a condition. It never represents behavior, a permission, a workflow, a business rule, or an implementation, and changing implementation never changes a state's identity.

# Architectural Identity

A state is its own kind of concept and is not any of the following.

- State is not an Entity. Entities are owned by knowledge/product/entities.md.
- State is not a Workflow. Workflows are owned by knowledge/product/workflows.md.
- State is not a Feature. Features are owned by knowledge/product/features.md.
- State is not a Relationship. Relationships are owned by knowledge/product/relationships.md.
- State is not a Permission. Permissions are owned by knowledge/product/permissions.md.
- State is not a Business Rule. Business rules are owned by knowledge/product/business-rules.md.
- State is not a Policy. Policies are owned by the policy documents in their owning folders.
- State is not a technical status. Technical status lives in the codebase, not in the knowledge repository.

A state's identity is independent of implementation, technology, automation, interface, storage, and execution. A business state remains the same business state even if implementation changes completely.

# Definitions

These definitions are repository-wide and timeless.

- State. A meaningful business condition that an entity, workflow, or business object may occupy.
- Business State. The aggregate condition of a business activity at a point in time, reflected in the individual states of the objects involved. A State is the condition of a single object; a Business State is the combined condition across the objects that make up a business activity.
- Transition. The change from one state to another.
- Lifecycle. The full set of states that an entity or object may occupy over its existence.

# State Principles

- A state describes a condition, never behavior. What happens in or around a state is owned elsewhere.
- A state is independent of implementation. It exists at the level of business meaning, not technology.
- A state does not imply permissions. What is allowed while in a state is owned by knowledge/product/permissions.md.
- A state does not imply workflow order. The sequence in which states are entered is owned by knowledge/product/workflows.md and the process documents under knowledge/processes/.
- A state does not own business rules. The conditions that govern a state are owned by knowledge/product/business-rules.md.
- A state may be shared across many entities, workflows, and objects. When the same condition applies to more than one object, the same state name is used, its meaning stays the same, and only the object it applies to differs. Shared names are preferred over duplicate state definitions, which prevents ontology drift.
- Each state has exactly one canonical definition, which lives in this document. No other document may redefine a state, and other documents may reference states only. Transitions between states belong to knowledge/product/business-rules.md, and the order in which states are entered belongs to knowledge/product/workflows.md and the process documents under knowledge/processes/.

# State Boundaries

Each ontology concept has exactly one owner. This document owns the existence of states only.

- Entities: knowledge/product/entities.md.
- Relationships: knowledge/product/relationships.md.
- Features: knowledge/product/features.md.
- Workflow inventory: knowledge/product/workflows.md.
- Workflow behavior and sequencing: the process documents under knowledge/processes/.
- Permissions: knowledge/product/permissions.md.
- Business rules: knowledge/product/business-rules.md.
- Policies: the policy documents in their owning folders.

A state owns none of the above. It records only that a business condition exists.

# State Inventory

Each state below states what it is, which objects may occupy it, its scope as an inventory entry, what belongs elsewhere, and the document that owns the objects it applies to. No entry describes workflow behavior, sequence, permissions, business rules, or implementation.

## General Lifecycle States

**Active**
- Name. Active.
- Description. The condition of being currently in effect.
- Applies To. Contract, Subscription, Participant.
- Scope. The existence of the active state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Paused**
- Name. Paused.
- Description. The condition of being temporarily halted while remaining in effect.
- Applies To. Contract.
- Scope. The existence of the paused state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Completed**
- Name. Completed.
- Description. The condition of having finished as agreed.
- Applies To. Contract, Milestone.
- Scope. The existence of the completed state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Cancelled**
- Name. Cancelled.
- Description. The condition of having ended before natural completion.
- Applies To. Contract, Subscription.
- Scope. The existence of the cancelled state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Expired**
- Name. Expired.
- Description. The condition of having ended by the passage of time.
- Applies To. Job, Subscription.
- Scope. The existence of the expired state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Work States

**Open**
- Name. Open.
- Description. The condition of a job being available and receiving proposals.
- Applies To. Job.
- Scope. The existence of the open state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Closed**
- Name. Closed.
- Description. The condition of a job no longer receiving proposals.
- Applies To. Job.
- Scope. The existence of the closed state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Submitted**
- Name. Submitted.
- Description. The condition of having been put forward for review.
- Applies To. Proposal, Deliverable.
- Scope. The existence of the submitted state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Accepted**
- Name. Accepted.
- Description. The condition of a proposal having been agreed to.
- Applies To. Proposal.
- Scope. The existence of the accepted state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Declined**
- Name. Declined.
- Description. The condition of a proposal having been turned down.
- Applies To. Proposal.
- Scope. The existence of the declined state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Approved**
- Name. Approved.
- Description. The condition of submitted work having been accepted.
- Applies To. Deliverable, Milestone.
- Scope. The existence of the approved state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Financial States

**Funded**
- Name. Funded.
- Description. The condition of a milestone having money committed for its work.
- Applies To. Milestone.
- Scope. The existence of the funded state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Held**
- Name. Held.
- Description. The condition of funds being kept in escrow.
- Applies To. Escrow.
- Scope. The existence of the held state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Released**
- Name. Released.
- Description. The condition of funds having been paid out from escrow.
- Applies To. Escrow.
- Scope. The existence of the released state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Refunded**
- Name. Refunded.
- Description. The condition of funds having been returned from escrow.
- Applies To. Escrow.
- Scope. The existence of the refunded state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Pending**
- Name. Pending.
- Description. The condition of a payment awaiting completion.
- Applies To. Payment.
- Scope. The existence of the pending state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Paid**
- Name. Paid.
- Description. The condition of a payment having completed.
- Applies To. Payment.
- Scope. The existence of the paid state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Trust and Safety States

**Unverified**
- Name. Unverified.
- Description. The condition of a participant not having completed verification.
- Applies To. Participant.
- Scope. The existence of the unverified state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Verified**
- Name. Verified.
- Description. The condition of a participant having completed verification.
- Applies To. Participant.
- Scope. The existence of the verified state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Suspended**
- Name. Suspended.
- Description. The condition of a participant being temporarily prevented from taking part.
- Applies To. Participant.
- Scope. The existence of the suspended state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Banned**
- Name. Banned.
- Description. The condition of a participant being permanently prevented from taking part.
- Applies To. Participant.
- Scope. The existence of the banned state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**In Mediation**
- Name. In Mediation.
- Description. The condition of a dispute being mediated.
- Applies To. Dispute.
- Scope. The existence of the in-mediation state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Under Review**
- Name. Under Review.
- Description. The condition of a flagged matter being reviewed.
- Applies To. Moderation Case.
- Scope. The existence of the under-review state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Resolved**
- Name. Resolved.
- Description. The condition of a dispute or flagged matter having reached an outcome.
- Applies To. Dispute, Moderation Case.
- Scope. The existence of the resolved state.
- Out of Scope. Workflow behavior, sequence, permissions, business rules, and implementation.
- Related Knowledge. knowledge/product/entities.md.

# Repository Growth

New states are added by extending this inventory. Each new state is a new entry under the appropriate group, using the same six-field template. The structure of this document never changes as Open Lance grows, no existing entry is enlarged to accommodate a new one, and growth is always additive. Existing state identities remain stable as the inventory grows.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It owns the existence of every business state. Workflow behavior, sequencing, permissions, and business rules are owned by other documents, not here.
- No other document may add a state to the inventory or redefine a state's existence; other documents reference states only.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only states that exist, and it never defines workflow behavior, sequencing, permissions, business rules, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Workflow behavior, sequencing, and logic: the process documents under knowledge/processes/.
- Workflow inventory: knowledge/product/workflows.md.
- Permissions and authorization: knowledge/product/permissions.md.
- Business rules: knowledge/product/business-rules.md.
- Policies: the policy documents in their owning folders.
- Entities: knowledge/product/entities.md.
- Relationships: knowledge/product/relationships.md.
- Features and capabilities: knowledge/product/features.md.
- Roles: knowledge/product/roles.md.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Implementation, automation, storage, databases, interfaces, and APIs: these live in the codebase, not in the knowledge repository.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/entities.md
- knowledge/product/workflows.md
- knowledge/product/relationships.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Companion structural documents. This document references knowledge/product/permissions.md and knowledge/product/business-rules.md, and the process documents under knowledge/processes/, which are created over time following knowledge/product/README.md and knowledge/CONTRIBUTING.md. Until then, the references are intentional forward references.
- Valid transitions. This inventory records that a state exists. Which transitions between states are permitted is a business rule, owned by knowledge/product/business-rules.md, and the order in which states are entered is owned by knowledge/product/workflows.md and the process documents under knowledge/processes/. If that detail is ever recorded, it is added to those documents without changing this inventory.
