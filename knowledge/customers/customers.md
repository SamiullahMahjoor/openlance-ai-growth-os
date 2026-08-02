---
id: OL-KNOW-CUSTOMERS-CUSTOMERS
document: knowledge/customers/customers.md

title: Open Lance Customer Segment Inventory

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: Founder
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/customers/README.md
  - knowledge/product/roles.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Social Media Manager
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that discovers customer segments
  - Any contributor to the Customers namespace

provenance:
  - Derived from knowledge/customers/README.md and the Open Lance marketplace

loading_priority: Required

summary: >
  The single canonical inventory of the customer segments Open Lance
  serves. It records only that each segment exists and its identity, not
  the segment's needs, behaviors, language, the roles it holds, or any
  company or product fact, which are owned elsewhere.
---

# Open Lance Customer Segment Inventory

This document is the single canonical inventory of the customer segments that Open Lance serves. It records only that each segment exists and what its identity is. It does not describe any segment's needs, behaviors, or language, and it does not define roles, company facts, product facts, or marketing strategy, all of which are owned elsewhere and are only referenced here.

This is a reference document within the Customers namespace. It follows the namespace guide in knowledge/customers/README.md, the repository constitution in knowledge/README.md, and the contribution process in knowledge/CONTRIBUTING.md, and it does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Customer segments in this inventory are durable and technology-neutral. A segment continues to exist even if the application, database, pricing, or interface change. New segments are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of customer segments. It is the single place where the presence of a segment is recorded. No other document may add a segment to the inventory, and other documents may only reference the segments recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which audiences Open Lance serves, and then follow a canonical reference to the document that owns each segment's detail.

# Scope

This inventory lists every customer segment that Open Lance currently serves. Each segment is represented exactly once and has exactly one canonical entry.

Each entry records identity only. It does not describe what a segment needs, how it behaves, or the language it uses, which are owned by that segment's own document. It does not define the role a segment holds, which is owned by knowledge/product/roles.md.

# Segments and Roles

A customer segment and a role are related but different, and neither owns the other.

- A role is a capacity in which a participant acts inside the product. The Business, Freelancer, and Administrator roles are owned by knowledge/product/roles.md.
- A customer segment is a group of people or organizations the marketplace serves, described by who they are, what they need, how they behave, and how they speak. Segments are owned by this namespace.

A segment tends to hold a particular role, and its entry references that role. This reference is not a redefinition. The role answers how a participant acts in the product; the segment answers who the audience is and what it needs. The Administrator role holds no customer segment, because administrators operate the platform rather than being served by it.

# Every Customer Segment Entry

Every customer segment in this inventory uses the same thin structure. The structure records identity only.

- Name. The canonical name of the segment.
- Description. A single identity statement of who the segment is.
- Role Held. The role the segment tends to hold, referenced to knowledge/product/roles.md.
- Out of Scope. What this entry does not record, deferred to its owner.
- Related Knowledge. Canonical repository paths to the role the segment holds and the document that owns the segment's detail.

An entry contains no needs, no behaviors, no language, no role definition, and no company or product fact. It records identity only.

# Definitions

These definitions are repository-wide and timeless. Each defers ownership where the concept is owned elsewhere.

- Customer Segment. The concept of a customer segment is defined in knowledge/customers/README.md. This inventory owns only the existence and identity of each segment, not the definition of the term and not any segment's detail.
- Marketplace Side. A grouping used to organize this inventory by the two sides of the marketplace, the demand side that hires and the supply side that works. A side is an organizational convenience only; it carries no detail and grants no authority. The two-sided marketplace model itself is owned by knowledge/company/company.md.

# Architectural Identity

This inventory reinforces, and does not replace, the identity boundaries defined in knowledge/customers/README.md.

A customer segment represents only a durable group the organization serves. It never represents any of the following, each of which is owned elsewhere.

- A segment's needs, behaviors, and language. Owned by the segment's own document under knowledge/customers/.
- A role or participation capacity. Owned by knowledge/product/roles.md.
- A product entity, capability, workflow, or state. Owned by the documents in knowledge/product/.
- Company identity and the marketplace model. Owned by the documents in knowledge/company/.
- Brand expression. Owned by the Brand namespace, knowledge/brand/.
- Marketing strategy and targeting. Owned by the Marketing namespace, knowledge/marketing/.
- A single person or any personal data. This never lives in the knowledge repository.

A segment identity remains unchanged even if the application, database, pricing, or interface change. The identity of a segment is independent of how the organization serves it.

# Ownership

- Each customer segment has exactly one canonical entry, which lives in this document.
- No other document may add a customer segment to the inventory or redefine a segment's existence or identity.
- Other documents reference the segments recorded here and never restate them.
- The detail of each segment, its needs, behaviors, and language, is owned by that segment's own document under knowledge/customers/.
- The roles segments hold are owned by knowledge/product/roles.md.
- Company, product, brand, and marketing knowledge is owned by its namespace and is only referenced here.
- Personal data and individual records belong outside this inventory, in the operational systems and the codebase.

# Reuse

Existing customer segments are reused. A duplicate segment is never created. When a contributor needs a segment that already exists, they reference the existing identity recorded here rather than creating a new one. Before adding a segment, a contributor confirms that no existing entry already records it, following the contribution process in knowledge/CONTRIBUTING.md.

# Repository Growth

New customer segments are added by extending this inventory. Each new segment is a new entry under the appropriate side, using the same thin structure, and it points to the document that owns its detail. A segment is added only when Open Lance genuinely serves a distinct new audience, never because another company has it. The structure of this document does not change as the number of segments grows, existing segment identities never change, and growth is always additive.

# Customer Segment Inventory

Each customer segment below states who it is at the level of identity, the role it tends to hold, its scope as an inventory entry, and the documents that own the role and the segment's detail. No entry describes needs, behaviors, or language.

## Demand Side

**Businesses**
- Name. Businesses.
- Description. The people and organizations that come to Open Lance to hire and pay for work.
- Role Held. The Business role, owned by knowledge/product/roles.md.
- Out of Scope. The segment's needs, behaviors, and language, owned by knowledge/customers/businesses.md, and the role definition, owned by knowledge/product/roles.md.
- Related Knowledge. knowledge/product/roles.md, knowledge/customers/businesses.md.

## Supply Side

**Freelancers**
- Name. Freelancers.
- Description. The people who come to Open Lance to find work, deliver it, and be paid for it.
- Role Held. The Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. The segment's needs, behaviors, and language, owned by knowledge/customers/freelancers.md, and the role definition, owned by knowledge/product/roles.md.
- Related Knowledge. knowledge/product/roles.md, knowledge/customers/freelancers.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/customers/README.md
- knowledge/customers/businesses.md
- knowledge/customers/freelancers.md
- knowledge/product/roles.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now and describe no defect.

- Owning segment documents. Each entry references a document under knowledge/customers/ that owns the segment's detail. Those documents are created alongside this inventory, following knowledge/customers/README.md and knowledge/CONTRIBUTING.md.
- Sub-segments within a side. Each side contains variety, such as smaller and larger businesses, or solo freelancers and freelance teams. These are described within each segment's document as variation, not split into separate segments, unless Open Lance ever serves one as a genuinely distinct audience.
- Future segments. If Open Lance ever serves a distinct new audience, for example a separately-served enterprise buyer or a partner audience, it is added here as a new entry under the appropriate side, and a matching segment document is created, without changing this document's structure.
