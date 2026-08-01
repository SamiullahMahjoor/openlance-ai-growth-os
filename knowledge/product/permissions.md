---
id: OL-KNOW-PRODUCT-PERMISSIONS
document: knowledge/product/permissions.md

title: Open Lance Product Permissions

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
  - Any AI Agent that discovers product permissions

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/features.md, knowledge/product/entities.md, knowledge/product/roles.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the permissions Open Lance
  recognizes. It records only the existence and identity of each
  permission, not who holds it, how it is evaluated, or how it is built.
---

# Open Lance Product Permissions

This document is the single canonical inventory of the permissions that exist within Open Lance. It records only the existence and identity of each permission: the authorization to perform a business action. It does not record who holds a permission, how it is granted or evaluated, what conditions govern it, or how it is implemented.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Permissions in this inventory are technology-neutral and implementation-independent. A permission remains the same permission even if authorization models, databases, interfaces, or code change completely. New permissions are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of permissions. It is the single place where a permission is defined. No other document may add a permission to the inventory, and other documents may only reference permissions recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which authorizations Open Lance recognizes, and rely on a single consistent identity for each.

# Scope

This document defines permissions only. For each permission it records its name, the business action it authorizes, and the object the action concerns. It does not record who is granted the permission, the conditions under which it applies, how it is evaluated, or how it is enforced. Those are owned by other documents and by the codebase.

# Product Permission Definition

A permission is authorization to perform a business action.

A permission is not a capability, a workflow, a relationship, a role, a policy, a state, or a feature. It records only that an authorization exists. Who holds it, whether the action succeeds, and how it is enforced are owned elsewhere.

A permission represents only authorization. It never represents a capability, a workflow, a state, a business rule, a policy, or an implementation, and changing implementation never changes a permission's identity.

A permission answers only what action may be authorized. It does not answer who is authorized, when, why, under what conditions, or how authorization is evaluated. Those are owned by other documents.

# Definitions

These definitions are repository-wide and timeless.

- Permission. Authorization to perform a business action.
- Authorization. The recognized right to perform a business action, independent of whether the action ultimately succeeds.
- Business Action. A meaningful action that a participant may be authorized to perform.
- Permission Group. A logical grouping of permissions used for discovery only. Grouping never changes a permission's meaning or ownership.

# Permission Principles

- A permission grants authorization only. It records that an action is authorized, nothing more.
- A permission never guarantees success. Whether an authorized action succeeds is governed elsewhere.
- A permission never implies ownership of the object it concerns.
- A permission never defines a workflow. Sequences of actions are owned by knowledge/product/workflows.md and the process documents under knowledge/processes/.
- A permission never defines business rules. The conditions that govern a permission are owned by knowledge/product/business-rules.md.
- A permission's identity is independent of implementation. It exists at the level of business meaning, not technology.
- Permissions may be reused across many roles, entities, and workflows. When the same authorization applies in more than one place, the same permission is referenced rather than a new one defined. Reuse is preferred over duplicate definitions, which prevents ontology drift.
- A permission's meaning never changes once defined.
- Each permission has exactly one canonical definition, which lives in this document. No other document may redefine a permission; other documents reference permissions only. Permission assignment, permission evaluation, and authorization logic belong elsewhere, to future authorization documents and the codebase, never to this inventory.
- Growth is additive only. New permissions extend the inventory without changing the structure of this document.

# Permission Boundaries

Each ontology concept has exactly one owner. This document owns the existence and identity of permissions only.

- Roles: knowledge/product/roles.md.
- Entities: knowledge/product/entities.md.
- Features: knowledge/product/features.md.
- Relationships: knowledge/product/relationships.md.
- States: knowledge/product/states.md.
- Workflow inventory: knowledge/product/workflows.md.
- Workflow behavior and sequencing: the process documents under knowledge/processes/.
- Business rules and conditions: knowledge/product/business-rules.md.
- Policies: the policy documents in their owning folders.
- Implementation and access-control mechanisms: these live in the codebase, not in the knowledge repository.

A permission owns none of the above. It records only that an authorization exists.

# Architectural Identity

A permission is its own kind of concept.

- Permission represents authorization only.
- Permission is not implementation. Implementation lives in the codebase.
- Permission is not a workflow. Workflows are owned by knowledge/product/workflows.md.
- Permission is not a policy. Policies are owned by the policy documents in their owning folders.
- Permission is not a business rule. Business rules are owned by knowledge/product/business-rules.md.
- Permission is not a state. States are owned by knowledge/product/states.md.
- Permission is not a role. Roles are owned by knowledge/product/roles.md.
- Permission is not a feature. Features are owned by knowledge/product/features.md.

A permission's identity never changes because implementation changes. The assignment of permissions to roles, the evaluation of authorization, and any access-control model are owned by future authorization documents and, at the implementation level, by the codebase, never by this inventory.

# Permission Inventory

Each permission below states its name, the business action it authorizes, the object the action concerns, what belongs elsewhere, and the documents that own the connected concepts. No entry records who holds it, the conditions under which it applies, how it is evaluated, or how it is implemented.

## Account Permissions

**Manage Account**
- Name. Manage Account.
- Description. Authorization to manage an account.
- Applies To. Participant.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Close Account**
- Name. Close Account.
- Description. Authorization to close an account.
- Applies To. Participant.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

## Job Permissions

**Post Job**
- Name. Post Job.
- Description. Authorization to post a job.
- Applies To. Job.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Manage Job**
- Name. Manage Job.
- Description. Authorization to manage a posted job.
- Applies To. Job.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Proposal Permissions

**Submit Proposal**
- Name. Submit Proposal.
- Description. Authorization to submit a proposal.
- Applies To. Proposal.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Review Proposals**
- Name. Review Proposals.
- Description. Authorization to review received proposals.
- Applies To. Proposal.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Contract Permissions

**Send Offer**
- Name. Send Offer.
- Description. Authorization to send an offer of engagement.
- Applies To. Contract.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Submit Work**
- Name. Submit Work.
- Description. Authorization to submit work for approval.
- Applies To. Deliverable.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Approve Work**
- Name. Approve Work.
- Description. Authorization to approve submitted work.
- Applies To. Deliverable, Milestone.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Escrow Permissions

**Fund Escrow**
- Name. Fund Escrow.
- Description. Authorization to fund escrow for work.
- Applies To. Escrow.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Release Escrow**
- Name. Release Escrow.
- Description. Authorization to release funds from escrow.
- Applies To. Escrow.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Wallet Permissions

**View Wallet**
- Name. View Wallet.
- Description. Authorization to view a wallet.
- Applies To. Wallet.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

**Withdraw Funds**
- Name. Withdraw Funds.
- Description. Authorization to withdraw funds.
- Applies To. Wallet.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Payment Permissions

**Make Payment**
- Name. Make Payment.
- Description. Authorization to make a payment.
- Applies To. Payment.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Membership Permissions

**Manage Subscription**
- Name. Manage Subscription.
- Description. Authorization to manage a subscription.
- Applies To. Subscription.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Communication Permissions

**Send Message**
- Name. Send Message.
- Description. Authorization to send a message.
- Applies To. Message, Conversation.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Review Permissions

**Submit Review**
- Name. Submit Review.
- Description. Authorization to submit a review.
- Applies To. Review.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Team Permissions

**Manage Team**
- Name. Manage Team.
- Description. Authorization to manage a team.
- Applies To. Team.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Dispute Permissions

**Raise Dispute**
- Name. Raise Dispute.
- Description. Authorization to raise a dispute.
- Applies To. Dispute.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md.

## Administration Permissions

**Moderate Content**
- Name. Moderate Content.
- Description. Authorization to moderate content.
- Applies To. Moderation Case.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Resolve Dispute**
- Name. Resolve Dispute.
- Description. Authorization to resolve a dispute.
- Applies To. Dispute.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Suspend Participant**
- Name. Suspend Participant.
- Description. Authorization to suspend a participant.
- Applies To. Participant.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

**Verify Participant**
- Name. Verify Participant.
- Description. Authorization to verify a participant.
- Applies To. Participant.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

## Reporting Permissions

**View Analytics**
- Name. View Analytics.
- Description. Authorization to view analytics.
- Applies To. Analytics Record.
- Out of Scope. Who holds it, the conditions under which it applies, how it is evaluated, and implementation.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/roles.md.

# Repository Growth

New permissions are added by extending this inventory. Each new permission is a new entry under the appropriate group, using the same five-field template. The structure of this document never changes as Open Lance grows, no existing entry is enlarged to accommodate a new one, and growth is always additive. Existing permission identities remain stable as the inventory grows.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It owns the existence and identity of every permission. Who holds a permission, how it is evaluated, and how it is enforced are owned elsewhere, not here.
- No other document may add a permission to the inventory or redefine a permission's identity; other documents reference permissions only.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only permissions that exist, and it never defines authorization logic, role assignment, conditions, business rules, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Who receives a permission, and the assignment of permissions to roles: future authorization documents, and roles at knowledge/product/roles.md.
- How authorization is evaluated, including any access-control model: future authorization documents and the codebase.
- Conditions that govern a permission: knowledge/product/business-rules.md.
- Workflow gates and sequencing: knowledge/product/workflows.md and the process documents under knowledge/processes/.
- State requirements: knowledge/product/states.md.
- Policies: the policy documents in their owning folders.
- Entities, roles, features, and relationships: knowledge/product/entities.md, knowledge/product/roles.md, knowledge/product/features.md, and knowledge/product/relationships.md.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Authentication, security controls, implementation, databases, interfaces, and APIs: these live in the codebase, not in the knowledge repository.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/features.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Companion structural documents. This document references knowledge/product/business-rules.md and future authorization documents that will own permission assignment and evaluation. Those documents are created over time, following knowledge/product/README.md and knowledge/CONTRIBUTING.md. Until then, the references are intentional forward references.
- Metadata field set. The creation request listed the metadata fields created, related_documents, and tags, which are not part of the frozen Metadata Standard in knowledge/README.md and are not present in the frozen sibling product documents. This document uses the frozen, canonical metadata shape for consistency. If those additional fields are wanted repository-wide, they would first be adopted by amending the Metadata Standard in knowledge/README.md, after which every document would carry them.
