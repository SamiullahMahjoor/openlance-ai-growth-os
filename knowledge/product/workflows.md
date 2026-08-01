---
id: OL-KNOW-PRODUCT-WORKFLOWS
document: knowledge/product/workflows.md

title: Open Lance Product Workflows

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: Product Manager
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/product/README.md
  - knowledge/product/features.md
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
  - Any AI Agent that discovers product workflows

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/features.md, knowledge/product/entities.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the workflows Open Lance recognizes.
  It records only that each workflow exists, not its logic, states,
  sequencing, permissions, or implementation, which are owned elsewhere.
---

# Open Lance Product Workflows

This document is the single canonical inventory of the workflows that exist within Open Lance. It records only that each workflow exists. It does not define workflow logic, states, sequencing, permissions, behavior, or implementation, which are owned by the process documents under knowledge/processes/.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Workflows in this inventory are technology-neutral and implementation-independent. A workflow continues to exist even if databases, APIs, or interfaces change. New workflows are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence of workflows. It is the single place where the presence of a workflow is recorded. No other document may add a workflow to the inventory, and other documents may only reference workflows recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which repeatable business workflows Open Lance recognizes, and then follow a canonical reference to the document that owns each workflow's behavior.

# Product Workflow Definition

A workflow is a repeatable sequence of business activities that transforms one business state into another.

A workflow is not a feature, an entity, a relationship, a role, a permission, a business rule, or a technical implementation. This document records only that a workflow exists. Its logic, states, sequencing, and behavior are owned by the process documents under knowledge/processes/.

A feature and a workflow are distinct concepts, and neither owns the other.

- A feature represents product capability, and is owned by knowledge/product/features.md.
- A workflow represents repeatable business activity, and is owned here.
- A feature may take part in many workflows.
- A workflow may use many features.
- Neither owns the other.

Each workflow has exactly one canonical entry, which lives in this document. No other document may add or redefine a workflow, and other documents may only reference the workflows recorded here.

# Workflow Principles

- A workflow is a business concept, not a technical one. It exists at the level of business activity, independent of any interface, database, or system.
- A workflow transforms a business state into another business state. That is what makes it a workflow rather than an isolated activity.
- A workflow is repeatable. It describes a recurring shape of work, not a single occurrence.
- A workflow's existence is stable. Its behavior may be refined in its owning process document without changing the fact that the workflow exists.
- A workflow's identity is independent of implementation, automation, interface, technology, and internal process change. It remains the same business workflow even if the way it is executed changes completely.

# Workflow Boundaries

Each ontology concept has exactly one owner. This document owns the existence of workflows only.

- Features own functionality: knowledge/product/features.md.
- Entities own identity: knowledge/product/entities.md.
- Roles own participation capacity: knowledge/product/roles.md.
- Relationships own connections: knowledge/product/relationships.md.
- Workflows own that a repeatable sequence exists: this document.
- Workflow behavior, logic, and sequencing: the process documents under knowledge/processes/.
- States own lifecycle: knowledge/product/states.md.
- Permissions own authorization: knowledge/product/permissions.md.
- Business rules own conditions and constraints: knowledge/product/business-rules.md.
- Policies own rules: the policy documents in their owning folders.

A workflow owns none of the above. For any workflow, its behavior and sequencing belong to the process documents under knowledge/processes/, its states belong to knowledge/product/states.md, its permissions belong to knowledge/product/permissions.md, its business rules belong to knowledge/product/business-rules.md, and its implementation belongs outside the Product knowledge namespace. This document records only that a repeatable sequence exists.

# Definitions

These definitions are repository-wide and timeless.

- Workflow. A repeatable sequence of business activities that transforms one business state into another.
- Business Activity. A unit of business action that takes place within a workflow. Its behavior is owned by the process documents under knowledge/processes/.
- Business State. A condition of the business at a point in time. Business states are owned by knowledge/product/states.md.
- Transition. The change from one business state to another that a workflow brings about.

# Workflow Inventory

Each workflow below states what it is, who uses it, its scope as an inventory entry, what belongs elsewhere, and the document that owns its behavior. No entry defines logic, states, sequencing, permissions, or implementation.

## Hiring Workflows

**Job Posting**
- Name. Job Posting.
- Description. The workflow by which a business makes work available in the marketplace.
- Users. Participants in the Business role.
- Scope. The existence of the job-posting workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/job-posting.md.

**Proposal Submission**
- Name. Proposal Submission.
- Description. The workflow by which a freelancer offers to perform available work.
- Users. Participants in the Freelancer role.
- Scope. The existence of the proposal-submission workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/proposal-submission.md.

**Engagement Formation**
- Name. Engagement Formation.
- Description. The workflow by which a business and a freelancer reach an agreed engagement.
- Users. Participants in the Business role and participants in the Freelancer role.
- Scope. The existence of the engagement-formation workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/engagement-formation.md.

**Drop-In Purchase**
- Name. Drop-In Purchase.
- Description. The workflow by which a business obtains a productized service.
- Users. Participants in the Business role.
- Scope. The existence of the drop-in-purchase workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/drop-in-purchase.md.

## Engagement Workflows

**Contract Execution**
- Name. Contract Execution.
- Description. The workflow by which an agreed engagement is carried out.
- Users. Participants in the Business role and participants in the Freelancer role.
- Scope. The existence of the contract-execution workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/contract-execution.md.

## Financial Workflows

**Escrow Funding**
- Name. Escrow Funding.
- Description. The workflow by which a business places funds into escrow for work.
- Users. Participants in the Business role.
- Scope. The existence of the escrow-funding workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/escrow-funding.md.

**Escrow Release**
- Name. Escrow Release.
- Description. The workflow by which funds held in escrow are released to a freelancer.
- Users. Participants in the Business role and participants in the Freelancer role.
- Scope. The existence of the escrow-release workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/escrow-release.md.

**Withdrawal**
- Name. Withdrawal.
- Description. The workflow by which a freelancer moves earnings out of the platform.
- Users. Participants in the Freelancer role.
- Scope. The existence of the withdrawal workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/withdrawal.md.

**Subscription Management**
- Name. Subscription Management.
- Description. The workflow by which a participant establishes or renews a membership.
- Users. Participants.
- Scope. The existence of the subscription-management workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/subscription-management.md.

## Trust and Safety Workflows

**Verification**
- Name. Verification.
- Description. The workflow by which a participant's identity or credentials are confirmed.
- Users. Participants.
- Scope. The existence of the verification workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/verification.md.

**Review Submission**
- Name. Review Submission.
- Description. The workflow by which a participant records feedback for work.
- Users. Participants in the Business role and participants in the Freelancer role.
- Scope. The existence of the review-submission workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/review-submission.md.

**Dispute Resolution**
- Name. Dispute Resolution.
- Description. The workflow by which a disagreement over work or payment is brought to a resolution.
- Users. Participants in the Business role, participants in the Freelancer role, and participants in the Administrator role.
- Scope. The existence of the dispute-resolution workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/dispute-resolution.md.

## Identity Workflows

**Onboarding**
- Name. Onboarding.
- Description. The workflow by which a new participant joins and becomes ready to take part.
- Users. New participants.
- Scope. The existence of the onboarding workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/onboarding.md.

## Administration Workflows

**Moderation Review**
- Name. Moderation Review.
- Description. The workflow by which the platform reviews a flagged matter.
- Users. Participants in the Administrator role.
- Scope. The existence of the moderation-review workflow.
- Out of Scope. Workflow logic, states, sequencing, permissions, and implementation.
- Related Knowledge. knowledge/processes/moderation-review.md.

# Repository Growth

New workflows are added by extending this inventory. Each new workflow is a new entry under the appropriate category, using the same six-field template, and points to the process document that owns its behavior. The structure of this document does not change as the number of workflows grows, and no existing entry is enlarged to accommodate a new one. New workflows are added by extending the inventory only, the document structure never changes as Open Lance grows, and growth is always additive.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It owns the existence of every workflow. Workflow behavior, logic, states, and sequencing are owned by the process documents under knowledge/processes/, not here.
- No other document may add a workflow to the inventory or redefine a workflow's existence; other documents reference workflows only.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only workflows that exist, and it never defines logic, states, sequencing, permissions, business rules, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Workflow logic, sequencing, and behavior: the process documents under knowledge/processes/.
- Business states and lifecycle: knowledge/product/states.md.
- Permissions and authorization: knowledge/product/permissions.md.
- Business rules: knowledge/product/business-rules.md.
- Policies: the policy documents in their owning folders.
- Features and capabilities: knowledge/product/features.md.
- Entities: knowledge/product/entities.md.
- Roles: knowledge/product/roles.md.
- Relationships: knowledge/product/relationships.md.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Implementation, automation, validation, exception handling, databases, interfaces, and APIs: these live in the codebase, not in the knowledge repository.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/features.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/relationships.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Owning process documents. Each workflow references a process document under knowledge/processes/ that owns its behavior. Those process documents are created over time, following knowledge/product/README.md and knowledge/CONTRIBUTING.md. Until then, the references are intentional forward references. This document also references knowledge/product/states.md, knowledge/product/permissions.md, and knowledge/product/business-rules.md, which are likewise created over time and remain intentional forward references until then.
- Workflow and process separation. This inventory records that a workflow exists; the process documents own how it runs. If a workflow's behavior is ever detailed, it is added to its process document without changing this inventory.
