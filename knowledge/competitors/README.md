---
id: OL-KNOW-COMPETITORS-README
document: knowledge/competitors/README.md

title: Open Lance Competitors Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: Founder
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/company/company.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - SEO Director
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that performs competitive analysis
  - Any contributor to the Competitors namespace

provenance:
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how competitor knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every competitor document under knowledge/competitors/ must follow.
  It owns how competitor knowledge is documented, and owns no competitor,
  comparison, ranking, opinion, or positioning strategy itself.
---

# Open Lance Competitors Namespace Guide

This document is the guide for the Competitors namespace at knowledge/competitors/. It establishes the constitutional architecture that every competitor document must follow. It defines how knowledge about the organizations Open Lance competes with is documented; it does not describe any of them and it does not compare them.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Competitors namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how competitor knowledge is documented within the repository. It is the single guide for the Competitors namespace, and every competitor document follows it.

The Competitors namespace exists so that every agent and contributor works from one shared, neutral, factual understanding of the organizations Open Lance competes with. A human analyst and an AI agent reasoning from this namespace should reach the same factual understanding of a competitor, free of opinion or persuasion.

This guide does not own any competitor, any comparison, any ranking, any opinion, any company or product fact, or any marketing or positioning strategy. Each of those is owned elsewhere or, in the case of comparison and persuasion, is deliberately excluded from this namespace.

# Scope

This guide governs the Competitors namespace. It defines the standard structure a competitor document uses, the rules for writing one, the boundaries a competitor document must respect, and how the namespace grows.

The namespace owns durable, neutral, factual descriptions of the organizations Open Lance competes with: who they are, how their model works, whom they serve, and how they relate to Open Lance as fact. This guide does not describe any specific competitor; it defines how the documents that do are written and organized. Each competitor is owned by its own document, created over time under this guide.

# Architectural Identity

A competitor record is its own kind of concept and is not any of the following.

- A competitor record is not a comparison. It describes one organization on its own terms. It does not rank competitors against one another or against Open Lance.
- A competitor record is not an opinion or a persuasion. It states fact, neutrally. It never praises, criticizes, or argues that Open Lance is better.
- A competitor record is not a positioning strategy. How Open Lance positions itself against a competitor, and what to say about it in market, is owned by the Marketing namespace.
- A competitor record is not an Open Lance fact. Who Open Lance is, what it offers, and whom it serves are owned by knowledge/company/, knowledge/product/, and knowledge/customers/. A competitor record references those and never restates them.
- A competitor record is not a customer segment. The audiences Open Lance serves are owned by the Customers namespace. A competitor serves its own audiences, which this namespace describes as fact.
- A competitor record is not a live data feed. It captures the durable model and approach of a competitor, not volatile specifics such as current fees, feature lists, or metrics, which change and live in external sources.

A competitor document answers only who a competitor is, how it works, whom it serves, and how it relates to Open Lance as neutral fact. Its knowledge is durable and technology-neutral, and it remains valid even as the competitor's current terms change.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Competitor. An external organization that competes with Open Lance for the same customers.
- Direct Competitor. A competitor that competes for substantially the same customers with substantially the same kind of model.
- Indirect Competitor. A competitor that competes for the same customers with a different kind of model.
- Substitute. A non-marketplace alternative that satisfies the same customer need without being a competitor platform.
- Marketplace Model. The durable way a competitor's platform connects and serves the sides of its market. The Open Lance marketplace model itself is owned by knowledge/company/company.md.
- Neutral Description. A statement of fact about a competitor that ranks nothing, argues nothing, and persuades toward nothing.

# Competitor Principles

- Every competitor has exactly one canonical document, which owns that competitor.
- Descriptions are neutral. A competitor document describes; it never ranks, praises, criticizes, or persuades.
- Comparison for advantage is excluded. A competitor document states facts about the competitor; it never argues that Open Lance is superior. Competitive positioning strategy is owned by the Marketing namespace.
- Open Lance facts are referenced, never restated. A competitor document references Open Lance's identity, model, customers, and product via knowledge/company/, knowledge/product/, and knowledge/customers/, and never restates them.
- Facts are durable and evidence-based. A competitor document records the enduring model and approach of a competitor, drawn from public information, not volatile fees, features, or metrics.
- Only genuine competitors are documented. A competitor document is created only for an organization Open Lance actually competes against, never because a competitor is well known or because another company documents it.
- Growth is additive only. New competitors extend the namespace without changing this guide.

# Competitor Document Standard

Every competitor document under knowledge/competitors/ uses the following standard structure. This section defines the template only. It does not describe any actual competitor.

- Purpose. The competitor the document owns.
- Overview. A neutral, factual overview of the organization.
- Marketplace Model. How the competitor's platform works at the level of durable model, not current terms.
- Target Customers. Whom the competitor serves, described as fact.
- Strengths. What the competitor does well, stated neutrally as fact.
- Tradeoffs. The inherent tradeoffs of the competitor's model, stated neutrally and never as criticism.
- Where It Excels. The situations and segments the competitor serves best, stated as fact.
- Relationship to Open Lance. A neutral statement of where the competitor and Open Lance overlap in audience and where their models differ, as fact. It never argues advantage and never states positioning strategy, which is owned by the Marketing namespace, and it references Open Lance's model via knowledge/company/ and knowledge/product/ rather than restating it.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the competitor document references.

A competitor document may add a section only when a genuine need requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

A competitor document describes one competitor, neutrally. It records who a competitor is and how it works, and nothing more.

- A competitor document never ranks, praises, criticizes, or persuades. It states fact.
- A competitor document never argues that Open Lance is better. Competitive positioning is owned by the Marketing namespace.
- A competitor document never restates Open Lance facts. It references knowledge/company/, knowledge/product/, and knowledge/customers/ by canonical path.
- A competitor document records durable facts. It avoids volatile specifics such as current fees, feature lists, and metrics, which live in external sources.
- Everything a competitor document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concept has exactly one owner. A competitor document owns only its own competitor. It owns none of the following.

- Open Lance identity, mission, principles, and the marketplace model: the documents in knowledge/company/.
- Open Lance product capabilities, entities, workflows, and pricing: the documents in knowledge/product/.
- The audiences Open Lance serves: the Customers namespace, knowledge/customers/.
- Brand voice, tone, and vocabulary: the Brand namespace, knowledge/brand/.
- Competitive positioning strategy, comparison messaging, campaigns, and targeting: the Marketing namespace, knowledge/marketing/.
- Rankings, scorecards, and win-loss judgments: excluded from the knowledge repository; these are strategy outputs, owned by the Marketing namespace where they exist at all.
- The competitor's proprietary or internal information, and volatile current terms: external sources, not the knowledge repository.
- Personal data of any individual: never in the knowledge repository.

A competitor document references all of the above and owns none of it. It records only durable, neutral, factual knowledge of one competitor.

# Repository Growth

New competitor knowledge is added by creating new competitor documents under knowledge/competitors/, each following the Competitor Document Standard and owning a single competitor. The namespace grows only when Open Lance genuinely competes with a distinct new organization, never by importing competitors that other companies happen to track. The structure defined by this guide never changes as the namespace grows, existing competitor identities never change, and growth is always additive. The namespace supports an unlimited number of competitors.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Competitors namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- Competitor documents governed by this guide are reference documents and declare the Reference authority level, because they record facts about the world rather than set rules. A competitor document never overrides a normative document.
- Competitor documents follow the standard and rules defined here. A competitor document that conflicts with them is corrected to conform, which does not change that document's ownership of its own competitor.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/company.md
- knowledge/product/features.md
- knowledge/customers/customers.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Competitor documents. The individual competitor documents governed by this guide are created over time under knowledge/competitors/, following this guide and knowledge/CONTRIBUTING.md. Until then, references to specific competitor documents elsewhere in the repository are intentional forward references.
- Downstream namespace. This guide references the Marketing namespace as the owner of competitive positioning strategy. That namespace is created over time under knowledge/marketing/, and the reference is an intentional forward reference that expresses the planned architecture, as permitted by knowledge/README.md.
- Indirect competitors and substitutes. Beyond the direct freelance marketplaces, Open Lance also faces indirect competitors, such as professional networks and vertical or niche platforms, and substitutes, such as direct hiring, staffing agencies, and off-platform working relationships. These are recognized as categories in knowledge/competitors/competitors.md and are given their own documents only if one becomes a materially competitive organization, never speculatively.
