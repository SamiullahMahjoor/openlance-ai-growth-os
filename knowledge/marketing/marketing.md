---
id: OL-KNOW-MARKETING-MARKETING
document: knowledge/marketing/marketing.md

title: Open Lance Marketing Strategy Inventory

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
  - knowledge/marketing/README.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Social Media Manager
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that plans or executes marketing
  - Any contributor to the Marketing namespace

provenance:
  - Derived from knowledge/marketing/README.md and the Open Lance go-to-market

loading_priority: Required

summary: >
  The single canonical inventory of the marketing strategies Open Lance
  maintains. It records only that each strategy exists and its identity,
  not the strategy itself, and not any company, product, customer,
  competitor, or brand fact, which are owned elsewhere.
---

# Open Lance Marketing Strategy Inventory

This document is the single canonical inventory of the marketing strategies that Open Lance maintains. It records only that each strategy exists and what its identity is. It does not state any strategy, and it does not define any company, product, customer, competitor, or brand fact. Those are owned elsewhere and are only referenced here.

This is a reference document within the Marketing namespace. It follows the namespace guide in knowledge/marketing/README.md, the repository constitution in knowledge/README.md, and the contribution process in knowledge/CONTRIBUTING.md, and it does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Marketing strategies in this inventory are durable and technology-neutral. A strategy continues to exist even as tools, platforms, and channels change. New strategies are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of marketing strategies. It is the single place where the presence of a strategy is recorded. No other document may add a strategy to the inventory, and other documents may only reference the strategies recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which marketing strategies Open Lance maintains, and then follow a canonical reference to the document that owns each one.

# Scope

This inventory lists every marketing strategy Open Lance maintains, grouped into logical areas. Each strategy is represented exactly once and has exactly one canonical entry. Each entry records identity only; it does not state the strategy, which is owned by that strategy's own document.

# The Marketing Lifecycle

The marketing strategies are organized around one shared frame: the lifecycle by which Open Lance acquires, educates, converts, retains, and grows its customers, on both the demand side and the supply side of the marketplace. The lifecycle is an organizing frame for this inventory. The strategy across the lifecycle, and the two-sided growth model behind it, is owned by knowledge/marketing/growth-strategy.md, and the marketplace model itself is owned by knowledge/company/company.md. This frame carries no strategy of its own.

# Every Strategy Entry

Every strategy in this inventory uses the same thin structure. The structure records identity only.

- Name. The canonical name of the strategy.
- Description. A single identity statement of what the strategy governs.
- Out of Scope. What this entry does not record, deferred to its owner.
- Related Knowledge. The canonical repository path to the document that owns the strategy.

An entry contains no strategy, no facts, and no comparison. It records identity only.

# Definitions

These definitions are repository-wide and timeless. Each defers ownership where the concept is owned elsewhere.

- Marketing Strategy. The concept of a marketing strategy is defined in knowledge/marketing/README.md. This inventory owns only the existence and identity of each strategy, not the definition of the term and not any strategy's content.
- Strategy Group. A named grouping of related strategies used to organize this inventory. A group is an organizational convenience only; it carries no strategy and grants no authority.

# Architectural Identity

This inventory reinforces, and does not replace, the identity boundaries defined in knowledge/marketing/README.md.

A strategy entry represents only the identity of a marketing strategy. It never represents the strategy's content, owned by the strategy's own document, nor any company, product, customer, competitor, or brand fact, owned by their namespaces, nor any produced content or tool, which live at the Output level and in the codebase. A strategy identity remains unchanged even as tools, platforms, and channels change.

# Ownership

- Each marketing strategy has exactly one canonical entry, which lives in this document.
- No other document may add a strategy to the inventory or redefine a strategy's existence or identity.
- Other documents reference the strategies recorded here and never restate them.
- The content of each strategy is owned by that strategy's own document under knowledge/marketing/.
- Company, product, customer, competitor, and brand knowledge is owned by its namespace and is only referenced.

# Reuse

Existing strategies are reused. A duplicate strategy is never created. When a contributor needs a strategy that already exists, they reference the existing identity recorded here rather than creating a new one. Before adding a strategy, a contributor confirms that no existing entry already records it, following the contribution process in knowledge/CONTRIBUTING.md.

# Repository Growth

New strategies are added by extending this inventory. Each new strategy is a new entry under the appropriate group, using the same thin structure, and it points to the document that owns it. A strategy is added only when Open Lance genuinely adopts a distinct new strategy. The structure of this document does not change as the number of strategies grows, existing strategy identities never change, and growth is always additive.

# Marketing Strategy Inventory

Each strategy below states what it governs at the level of identity, its scope as an inventory entry, and the document that owns it. No entry states the strategy itself.

## Foundation Strategies

**Positioning**
- Name. Positioning.
- Description. The strategy for the place Open Lance claims in the market.
- Out of Scope. The strategy content, owned by knowledge/marketing/positioning.md, and the company, customer, and competitor facts it consumes.
- Related Knowledge. knowledge/marketing/positioning.md.

**Value Propositions**
- Name. Value Propositions.
- Description. The strategy for the promises of value Open Lance makes to its audiences.
- Out of Scope. The strategy content, owned by knowledge/marketing/value-propositions.md, and the product and company facts it consumes.
- Related Knowledge. knowledge/marketing/value-propositions.md.

**Differentiators**
- Name. Differentiators.
- Description. The strategy for which differences from alternatives Open Lance emphasizes.
- Out of Scope. The strategy content, owned by knowledge/marketing/differentiators.md, and the competitor and product facts it consumes.
- Related Knowledge. knowledge/marketing/differentiators.md.

**Messaging Framework**
- Name. Messaging Framework.
- Description. The strategy for what messages Open Lance conveys, to whom, and in what order.
- Out of Scope. The strategy content, owned by knowledge/marketing/messaging-framework.md, and the brand messaging standard it applies.
- Related Knowledge. knowledge/marketing/messaging-framework.md.

## Growth Strategies

**Growth Strategy**
- Name. Growth Strategy.
- Description. The strategy for growing both sides of the marketplace across the acquire, educate, convert, retain, and grow lifecycle.
- Out of Scope. The strategy content, owned by knowledge/marketing/growth-strategy.md, and the marketplace model and customer facts it consumes.
- Related Knowledge. knowledge/marketing/growth-strategy.md.

**Channel Strategy**
- Name. Channel Strategy.
- Description. The strategy for which channels Open Lance uses and how they combine.
- Out of Scope. The strategy content, owned by knowledge/marketing/channel-strategy.md, and each channel's own strategy.
- Related Knowledge. knowledge/marketing/channel-strategy.md.

## Channel Strategies

**Content Strategy**
- Name. Content Strategy.
- Description. The strategy for the content Open Lance creates and why.
- Out of Scope. The strategy content, owned by knowledge/marketing/content-strategy.md, and produced content itself.
- Related Knowledge. knowledge/marketing/content-strategy.md.

**Search Strategy**
- Name. Search Strategy.
- Description. The strategy for how Open Lance becomes discoverable in search.
- Out of Scope. The strategy content, owned by knowledge/marketing/seo.md, and any search implementation.
- Related Knowledge. knowledge/marketing/seo.md.

**Social Media Strategy**
- Name. Social Media Strategy.
- Description. The strategy for the role social channels play for Open Lance.
- Out of Scope. The strategy content, owned by knowledge/marketing/social-media.md, and any specific platform or tool.
- Related Knowledge. knowledge/marketing/social-media.md.

**Email Marketing Strategy**
- Name. Email Marketing Strategy.
- Description. The strategy for how Open Lance educates, nurtures, and retains through email.
- Out of Scope. The strategy content, owned by knowledge/marketing/email-marketing.md, and transactional notifications owned by knowledge/product/.
- Related Knowledge. knowledge/marketing/email-marketing.md.

## Initiative Strategies

**Campaign Strategy**
- Name. Campaign Strategy.
- Description. The strategy for how Open Lance runs time-bound marketing initiatives.
- Out of Scope. The strategy content, owned by knowledge/marketing/campaigns.md, and any individual campaign.
- Related Knowledge. knowledge/marketing/campaigns.md.

**Launch Strategy**
- Name. Launch Strategy.
- Description. The strategy for how Open Lance brings something new to market.
- Out of Scope. The strategy content, owned by knowledge/marketing/launches.md, and any individual launch.
- Related Knowledge. knowledge/marketing/launches.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/marketing/README.md
- knowledge/company/company.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now and describe no defect.

- Owning strategy documents. Each entry references a document under knowledge/marketing/ that owns the strategy. Those documents are created alongside this inventory, following knowledge/marketing/README.md and knowledge/CONTRIBUTING.md.
- New strategies. If Open Lance ever adopts a genuinely distinct new marketing strategy, for example a partnerships or community strategy, it is added here as a new entry under the appropriate group and given its own document, without changing this document's structure.
- Grouping. Strategies are grouped by area as an organizational convenience and never as a ranking. If a new area is needed, a new group is added without changing existing entries.
