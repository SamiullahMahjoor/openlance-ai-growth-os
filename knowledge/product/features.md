---
id: OL-KNOW-PRODUCT-FEATURES
document: knowledge/product/features.md

title: Open Lance Product Capabilities

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: Product Manager
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/product/README.md
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
  - Any AI Agent that discovers product capabilities

provenance:
  - Derived from knowledge/company/company.md and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the capabilities Open Lance provides.
  It names each capability and points to its owning document. It records
  what the product can do, not how, why, or with what implementation.
---

# Open Lance Product Capabilities

This document is the single canonical inventory of what Open Lance can do. It names each capability, states that the capability exists, and points to the document that owns its detail. It records what the product can do, not how it works, why it exists, or how it is built.

This is a reference document within the Product namespace. It follows knowledge/product/README.md and does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Capabilities in this inventory are technology-neutral and implementation-independent. A capability continues to exist even if its implementation changes, and changes in interface, workflow, or implementation do not change this inventory.

New capabilities are added by extending this inventory. The structure of this document does not change as Open Lance grows; only entries are added.

# Purpose

The purpose of this document is discovery. It lets any human or AI contributor find, in one place, every capability the product provides, and then follow a canonical reference to the document that owns the details of that capability.

It exists so that capability knowledge is not scattered, duplicated, or invented, and so that every contributor works from the same list of what the product can do.

# Product Definition

Open Lance is a two-sided freelance marketplace where businesses and freelancers form escrow-protected engagements, from a small fixed-scope task to an ongoing monthly engagement, and complete and pay for work through the platform.

# Definitions

These definitions are repository-wide and timeless.

- Capability. Something the product can do, independent of how it is built. A capability is what this document inventories.
- Feature. A specific expression of a capability as delivered to users. Features are owned by the capability's own document, not by this inventory.
- Configuration. A setting or option that adjusts how a capability behaves. Configuration is owned by the capability's own document, not by this inventory.
- Workflow. An ordered sequence of steps by which a capability is used. Workflows are owned by process documents, not by this inventory.

# Core Capabilities

Each capability below states what exists, who can use it, its scope as an inventory entry, what belongs elsewhere, and the document that owns its detail. No entry describes behavior, workflow, interface, business rules, pricing, or implementation.

## Marketplace

**Two-sided marketplace**
- Description. The capability for businesses and freelancers to participate in a single marketplace.
- Users. Businesses and freelancers.
- Scope. The existence of a marketplace connecting the two sides.
- Out of Scope. Marketplace mechanics detail, matching, and any behavior.
- Related Knowledge. knowledge/product/marketplace.md.

**Talent categories**
- Description. The capability to organize work and talent into professional categories.
- Users. Businesses and freelancers.
- Scope. The existence of a category system.
- Out of Scope. The category taxonomy contents and their maintenance.
- Related Knowledge. knowledge/product/categories.md.

## Identity and Trust

**Accounts and roles**
- Description. The capability for participants to hold accounts under defined roles, including business, freelancer, delegated bidder, and team roles.
- Users. Businesses, freelancers, and their delegated team members.
- Scope. The existence of accounts and the role model.
- Out of Scope. Authentication, permissions detail, and account behavior.
- Related Knowledge. knowledge/product/accounts.md.

**Verification and reputation level**
- Description. The capability to verify participants and to represent a reputation or talent level, including importing external track record.
- Users. Freelancers and businesses.
- Scope. The existence of verification and a reputation-level signal.
- Out of Scope. Verification criteria, scoring rules, and level thresholds.
- Related Knowledge. knowledge/product/verification.md.

## Discovery

**Search and browse**
- Description. The capability to search and browse jobs and, after signing in, to discover talent.
- Users. Businesses and freelancers.
- Scope. The existence of search and browse.
- Out of Scope. Ranking rules, filters detail, and search behavior.
- Related Knowledge. knowledge/product/search.md.

**Matching and recommendations**
- Description. The capability to surface relevant talent and work through matching and recommendations.
- Users. Businesses and freelancers.
- Scope. The existence of matching and recommendation capability.
- Out of Scope. Recommendation logic, weighting, and any algorithm.
- Related Knowledge. knowledge/product/recommendations.md.

## Hiring

**Drop-Ins**
- Description. The capability to buy a productized, fixed-scope service.
- Users. Businesses, offered by freelancers.
- Scope. The existence of the Drop-In hiring model.
- Out of Scope. Ordering behavior, pricing, and fulfillment rules.
- Related Knowledge. knowledge/product/drop-ins.md.

**Fixed-price projects**
- Description. The capability to hire on a fixed-price project agreed up front.
- Users. Businesses and freelancers.
- Scope. The existence of the fixed-price hiring model.
- Out of Scope. Milestone behavior, pricing, and approval rules.
- Related Knowledge. knowledge/product/fixed-price-projects.md.

**Hourly engagements**
- Description. The capability to hire a freelancer by the hour.
- Users. Businesses and freelancers.
- Scope. The existence of the hourly hiring model.
- Out of Scope. Time tracking behavior, review rules, and pricing.
- Related Knowledge. knowledge/product/hourly.md.

**Dedicated Hire**
- Description. The capability to engage a freelancer on an ongoing monthly basis.
- Users. Businesses and freelancers.
- Scope. The existence of the dedicated, ongoing hiring model.
- Out of Scope. Engagement management behavior and pricing.
- Related Knowledge. knowledge/product/dedicated-hire.md.

**Proposals**
- Description. The capability for freelancers to submit proposals to work.
- Users. Freelancers, reviewed by businesses.
- Scope. The existence of proposals.
- Out of Scope. Bidding costs, proposal limits, and pricing.
- Related Knowledge. knowledge/product/proposals.md.

## Contracts and Delivery

**Contracts and milestones**
- Description. The capability to form contracts organized into milestones.
- Users. Businesses and freelancers.
- Scope. The existence of contracts and milestones.
- Out of Scope. Contract lifecycle behavior and milestone rules.
- Related Knowledge. knowledge/product/contracts.md.

**Deliverables and approvals**
- Description. The capability to submit deliverables and to approve work.
- Users. Freelancers submit, businesses approve.
- Scope. The existence of deliverable submission and approval.
- Out of Scope. Revision rules, approval behavior, and timing.
- Related Knowledge. knowledge/product/deliverables.md.

## Escrow and Payments

**Milestone escrow**
- Description. The capability to hold funds for work in escrow and release them to the freelancer.
- Users. Businesses fund, freelancers receive.
- Scope. The existence of escrow and release capability.
- Out of Scope. Release timing rules, clearance behavior, and fees.
- Related Knowledge. knowledge/product/escrow.md.

**Wallet**
- Description. The capability for participants to hold funds in a wallet.
- Users. Freelancers and businesses.
- Scope. The existence of a wallet.
- Out of Scope. Balance behavior, limits, and accounting.
- Related Knowledge. knowledge/product/wallet.md.

**Payments and payouts**
- Description. The capability to pay for work and to withdraw earnings.
- Users. Businesses pay, freelancers withdraw.
- Scope. The existence of payment and payout capability.
- Out of Scope. Payment methods, fees, pricing, and processing behavior.
- Related Knowledge. knowledge/product/payments.md.

## Monetization

**Subscriptions and bid packs**
- Description. The capability to offer membership subscriptions and purchasable bid packs.
- Users. Freelancers, and businesses where applicable.
- Scope. The existence of subscription and bid-pack capability.
- Out of Scope. All pricing, tiers, and terms, which are owned by knowledge/product/pricing.md.
- Related Knowledge. knowledge/product/subscriptions.md.

## Communication

**Messaging**
- Description. The capability for participants to communicate through the hiring and project lifecycle.
- Users. Businesses and freelancers.
- Scope. The existence of messaging capability.
- Out of Scope. Message storage, moderation, notifications, and implementation.
- Related Knowledge. knowledge/product/messaging.md.

**Notifications**
- Description. The capability to notify participants of relevant events across channels.
- Users. All participants.
- Scope. The existence of notification capability.
- Out of Scope. Channels detail, delivery behavior, and preferences.
- Related Knowledge. knowledge/product/notifications.md.

## Reputation

**Reviews and ratings**
- Description. The capability to leave reviews and ratings tied to completed work.
- Users. Businesses and freelancers.
- Scope. The existence of reviews and ratings.
- Out of Scope. Review eligibility rules, scoring, and display behavior.
- Related Knowledge. knowledge/product/reviews.md.

## Trust and Safety

**Dispute resolution**
- Description. The capability to raise and resolve disputes through mediation.
- Users. Businesses and freelancers, with platform mediation.
- Scope. The existence of dispute resolution capability.
- Out of Scope. Dispute procedures, outcomes, and mediation rules.
- Related Knowledge. knowledge/product/disputes.md.

**Security and privacy**
- Description. The capability to protect participant accounts, funds, work, and information.
- Users. All participants.
- Scope. The existence of security and privacy protections.
- Out of Scope. Security controls detail, privacy policy, and implementation.
- Related Knowledge. knowledge/product/security.md.

## Operations

**Administration and moderation**
- Description. The capability for authorized administrators to manage and moderate the marketplace.
- Users. Platform administrators.
- Scope. The existence of administration and moderation capability.
- Out of Scope. Administrative procedures, roles detail, and moderation rules.
- Related Knowledge. knowledge/product/administration.md.

**Analytics and reporting**
- Description. The capability to produce analytics and reports about marketplace activity.
- Users. Platform administrators, and participants where applicable.
- Scope. The existence of analytics and reporting capability.
- Out of Scope. Metrics definitions, dashboards, and reporting behavior.
- Related Knowledge. knowledge/product/analytics.md.

# Capability Rules

Every entry in this document answers only four questions: what capability exists, who can use it, what functional purpose it serves, and what belongs elsewhere. No entry describes a workflow, an interface, an implementation, a business rule, or a price. Anything beyond the four questions is owned by the capability's own document.

# Product Boundary

This document inventories capabilities. It does not own any of them. Each capability is owned by its own document, referenced under Related Knowledge, which holds the detail. This document never becomes feature documentation, and it never contains capability behavior.

Every capability has exactly one canonical owning document. No other document may redefine or fully describe that capability, and other documents may only reference it. This inventory names the capability and its owner, and the owning document holds the single source of truth for the capability's detail.

# AI Usage

An AI agent uses this document to discover which capabilities exist and to find the document that owns each one. To learn how a capability behaves, the agent loads the referenced owning document. An agent never treats an entry here as a complete description of a capability, because this document holds only existence and location, never detailed behavior.

# Out of Scope

This document does not define any of the following. Each is owned elsewhere.

- Implementation and technical architecture: these live in the codebase, not in the knowledge repository.
- Workflows, processes, and operational guidance: the process documents under knowledge/processes/.
- Business rules and policies: the policy documents in their owning folders.
- Pricing, subscriptions terms, and commercial terms: knowledge/product/pricing.md.
- Roadmap and future or requested capabilities: this document lists only capabilities that exist.
- Marketing language and positioning: the documents under knowledge/marketing/.
- Detailed behavior of any capability: the capability's own document under knowledge/product/.

# Related Knowledge

- knowledge/product/README.md
- knowledge/company/company.md
- knowledge/company/mission.md
- knowledge/product/pricing.md

# Repository Evolution Notes

These notes record optional future improvements. They are informational only, are never blockers, and require no action now.

- Capability index generation. As the number of capabilities grows, this inventory would benefit from the repository indexing capability already deferred in the Future Architecture Roadmap of knowledge/README.md, so that the inventory and its owning documents can be cross-checked automatically.
- Owning-document backfill. Each capability references a future owning document. Those documents are created over time under knowledge/product/, following knowledge/product/README.md. Until then, the references are intentional forward references.

# Document Governance

- This is a reference document within the Product namespace, and it follows knowledge/product/README.md.
- It must remain consistent with the higher-authority documents it depends on, and it does not override any normative document. Where this document and a higher-authority document differ, the higher-authority document governs.
- It records only capabilities that exist, and it never contains capability behavior, pricing, or implementation.
- Changes require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
