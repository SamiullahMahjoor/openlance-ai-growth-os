---
id: OL-KNOW-PRODUCT-BUSINESS-RULES
document: knowledge/product/business-rules.md

title: Open Lance Product Business Rules

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
  - knowledge/product/states.md
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
  - Any AI Agent that discovers product business rules

provenance:
  - Derived from knowledge/company/company.md, knowledge/product/entities.md, knowledge/product/states.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the business rules Open Lance
  recognizes. It records only the existence and identity of each rule,
  not its logic, conditions, values, or implementation.
---

# Open Lance Product Business Rules

This document is the single canonical inventory of the business rules that exist within Open Lance. It records only the existence and identity of each business rule: an enduring business constraint or decision that governs business behavior. It does not record the rule's logic, conditions, thresholds, values, or implementation.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Business rules in this inventory are technology-neutral and implementation-independent. A business rule remains the same rule even if workflows, permissions, databases, payment providers, or code change completely. New business rules are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of business rules. It is the single place where a business rule is defined. No other document may add a business rule to the inventory, and other documents may only reference business rules recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which business constraints and decisions Open Lance recognizes, and rely on a single consistent identity for each.

# Scope

This document owns only the existence, identity, definition, and grouping of business rules. For each rule it records its name, what it governs at a business level, and the object it applies to. It does not record the rule's logic, conditions, calculations, values, timing, or how it is enforced. Those are owned by other documents and by the codebase.

# Product Business Rule Definition

A business rule is an enduring business constraint or decision that governs business behavior.

A business rule answers only what business constraint exists. It never answers who, when, why, how, where, under what conditions, what values, what thresholds, what sequence, or what implementation. Those are owned elsewhere, by the workflows, permissions, states, pricing, and process documents, and by the codebase.

# Architectural Identity

A business rule is its own kind of concept and is not any of the following.

- Business Rule is not a Feature. Features are owned by knowledge/product/features.md.
- Business Rule is not an Entity. Entities are owned by knowledge/product/entities.md.
- Business Rule is not a Relationship. Relationships are owned by knowledge/product/relationships.md.
- Business Rule is not a Workflow. Workflows are owned by knowledge/product/workflows.md.
- Business Rule is not a Permission. Permissions are owned by knowledge/product/permissions.md.
- Business Rule is not a State. States are owned by knowledge/product/states.md.
- Business Rule is not a Policy. Policies are owned by the policy documents in their owning folders.
- Business Rule is not a Process. Processes are owned by the process documents under knowledge/processes/.
- Business Rule is not a technical implementation or validation code. Implementation lives in the codebase.

A business rule represents only an enduring business constraint or decision. It never represents implementation, execution, validation logic, a workflow, a permission, a policy, configuration, a calculation, or automation.

Changing implementation, technology, workflow, automation, or authorization never changes the identity of a business rule. A business rule's identity remains stable even if workflows change, permissions change, implementation changes, technology changes, pricing models change, payment providers change, business processes change, or software architecture changes. This inventory records identity only.

A business rule is distinct from a policy. Policies define enduring governance decisions and govern organizational behavior; business rules define enduring product constraints and govern product behavior. Neither owns the other, and each is referenced, never redefined, across that boundary.

# Definitions

These definitions are repository-wide and timeless.

- Business Rule. An enduring business constraint or decision that governs business behavior.
- Validation Rule. A business rule that determines whether something is acceptable.
- Eligibility Rule. A business rule that determines whether something or someone qualifies.
- Calculation Rule. A business rule that determines how a business value is derived, without stating the value.
- Transition Rule. A business rule that determines whether a change from one state to another is permitted.
- Constraint. A business rule that limits what is allowed.

# Business Rule Principles

- A business rule captures business logic only, never technical implementation.
- Each business rule has exactly one canonical definition, which lives in this document.
- No other document may redefine a business rule; other documents reference business rules only. Business logic implementation, rule evaluation, and rule enforcement belong outside this inventory, to the codebase.
- Business rules are technology-independent.
- Business rules are implementation-independent.
- A business rule remains valid even if workflows change.
- A business rule remains valid even if permissions change.
- A business rule remains valid even if implementation changes.
- Existing business rules are reused rather than duplicated. A duplicate business rule is never created; when a similar constraint applies in more than one place, the existing business rule is referenced, which prevents ontology drift.
- Growth is additive only. New business rules extend the inventory without changing the structure of this document.

# Boundaries

Each ontology concept has exactly one owner. This document owns the existence and identity of business rules only.

- Features: knowledge/product/features.md.
- Entities: knowledge/product/entities.md.
- Relationships: knowledge/product/relationships.md.
- Workflows: knowledge/product/workflows.md.
- Permissions: knowledge/product/permissions.md.
- States: knowledge/product/states.md.
- Policies: the policy documents in their owning folders.
- Processes: the process documents under knowledge/processes/.
- Pricing and commercial values: knowledge/product/pricing.md.
- Rule logic, conditions, thresholds, timing, configuration, validation algorithms, and implementation: the codebase, not the knowledge repository.

A business rule never defines a workflow, a permission, a state, a policy, a process, an implementation, a validation algorithm, a pricing or commission value, timing, configuration, an interface, an API, a database, or automation. It records only that a business constraint or decision exists.

# Business Rule Inventory

Each business rule below states its name, what it governs at a business level, the object it applies to, what belongs elsewhere, and the documents that own the connected concepts. No entry states the rule's logic, conditions, calculations, values, or sequence.

## Eligibility Rules

**Proposal Eligibility**
- Name. Proposal Eligibility.
- Description. The business rule that governs whether a participant may submit a proposal.
- Applies To. Proposal.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Hiring Eligibility**
- Name. Hiring Eligibility.
- Description. The business rule that governs whether a participant may engage a freelancer.
- Applies To. Contract.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Matching Eligibility**
- Name. Matching Eligibility.
- Description. The business rule that governs whether work and talent are eligible to be matched.
- Applies To. Job.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Subscription Eligibility**
- Name. Subscription Eligibility.
- Description. The business rule that governs whether a participant may hold a subscription.
- Applies To. Subscription.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Review Eligibility**
- Name. Review Eligibility.
- Description. The business rule that governs whether a review may be submitted.
- Applies To. Review.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Dispute Eligibility**
- Name. Dispute Eligibility.
- Description. The business rule that governs whether a dispute may be raised.
- Applies To. Dispute.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

## Validation Rules

**Job Validation**
- Name. Job Validation.
- Description. The business rule that governs whether a job is acceptable to publish.
- Applies To. Job.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Proposal Validation**
- Name. Proposal Validation.
- Description. The business rule that governs whether a proposal is acceptable to submit.
- Applies To. Proposal.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Identity Validation**
- Name. Identity Validation.
- Description. The business rule that governs whether identity information is acceptable.
- Applies To. Participant.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Document Validation**
- Name. Document Validation.
- Description. The business rule that governs whether a submitted document is acceptable.
- Applies To. Deliverable.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Payment Validation**
- Name. Payment Validation.
- Description. The business rule that governs whether a payment is acceptable to process.
- Applies To. Payment.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

## Calculation Rules

**Fee Calculation**
- Name. Fee Calculation.
- Description. The business rule that governs how a platform fee is derived.
- Applies To. Payment.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule. Fee values are owned by knowledge/product/pricing.md.
- Related Knowledge. knowledge/product/entities.md, knowledge/product/pricing.md.

**Reputation Calculation**
- Name. Reputation Calculation.
- Description. The business rule that governs how a reputation or talent level is derived.
- Applies To. Profile.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Search Visibility**
- Name. Search Visibility.
- Description. The business rule that governs what appears in search results and how they are ordered.
- Applies To. Job, Participant.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

## Constraint Rules

**Escrow Funding Constraint**
- Name. Escrow Funding Constraint.
- Description. The business rule that constrains when escrow may be funded.
- Applies To. Escrow.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Escrow Release Constraint**
- Name. Escrow Release Constraint.
- Description. The business rule that constrains when escrow may be released.
- Applies To. Escrow.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Contract Formation Constraint**
- Name. Contract Formation Constraint.
- Description. The business rule that constrains when a contract may be formed.
- Applies To. Contract.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Milestone Approval Constraint**
- Name. Milestone Approval Constraint.
- Description. The business rule that constrains when a milestone may be approved.
- Applies To. Milestone.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Withdrawal Constraint**
- Name. Withdrawal Constraint.
- Description. The business rule that constrains when funds may be withdrawn.
- Applies To. Wallet.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Subscription Renewal Constraint**
- Name. Subscription Renewal Constraint.
- Description. The business rule that constrains when a subscription renews or lapses.
- Applies To. Subscription.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Proposal Limit Constraint**
- Name. Proposal Limit Constraint.
- Description. The business rule that constrains the number of proposals available to a participant.
- Applies To. Proposal.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

## Decision Rules

**Dispute Resolution Decision**
- Name. Dispute Resolution Decision.
- Description. The business rule that governs how a dispute outcome is decided.
- Applies To. Dispute.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Moderation Decision**
- Name. Moderation Decision.
- Description. The business rule that governs how a flagged matter is decided.
- Applies To. Moderation Case.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

**Verification Requirement**
- Name. Verification Requirement.
- Description. The business rule that governs what verification is required.
- Applies To. Participant.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule.
- Related Knowledge. knowledge/product/entities.md.

## Transition Rules

**State Transition Rule**
- Name. State Transition Rule.
- Description. The business rule that governs which changes between states are permitted.
- Applies To. Any entity that occupies states, as defined in knowledge/product/states.md.
- Out of Scope. The specific logic, conditions, thresholds, values, and implementation of the rule, and the states themselves.
- Related Knowledge. knowledge/product/states.md, knowledge/product/entities.md.

# Repository Growth

New business rules are added by extending this inventory. Each new business rule is a new entry under the appropriate group, using the same five-field template. The structure of this document never changes as Open Lance grows, no existing entry is enlarged to accommodate a new one, existing rule identities never change, and unlimited growth is always additive.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It owns the existence and identity of every business rule. The rule's logic, conditions, values, and enforcement are owned elsewhere, not here.
- No other document may add a business rule to the inventory or redefine a business rule's identity; other documents reference business rules only.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only business rules that exist, and it never defines rule logic, conditions, values, workflows, permissions, states, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Rule logic, conditions, thresholds, timing, and configuration: the codebase, not the knowledge repository.
- Pricing, commission, and commercial values: knowledge/product/pricing.md.
- Workflows and sequencing: knowledge/product/workflows.md and the process documents under knowledge/processes/.
- Permissions: knowledge/product/permissions.md.
- States: knowledge/product/states.md.
- Entities, relationships, and features: knowledge/product/entities.md, knowledge/product/relationships.md, and knowledge/product/features.md.
- Policies: the policy documents in their owning folders.
- Validation algorithms, implementation, automation, databases, interfaces, and APIs: these live in the codebase, not in the knowledge repository.

# Related Knowledge

- knowledge/product/README.md
- knowledge/product/entities.md
- knowledge/product/states.md
- knowledge/product/workflows.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Companion documents. This document references knowledge/product/pricing.md and the process documents under knowledge/processes/, which are created over time following knowledge/product/README.md and knowledge/CONTRIBUTING.md. Until then, the references are intentional forward references.
- Rule logic location. This inventory records that a business rule exists and what it governs. The specific logic, conditions, thresholds, and values of each rule are owned by the codebase and, for commercial values, by knowledge/product/pricing.md. If a durable, business-level statement of a rule's content is ever wanted in the knowledge repository, it would be added to a future rule-detail document without changing this inventory.
