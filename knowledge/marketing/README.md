---
id: OL-KNOW-MARKETING-README
document: knowledge/marketing/README.md

title: Open Lance Marketing Namespace Guide

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
  - knowledge/brand/README.md
  - knowledge/customers/customers.md
  - knowledge/competitors/competitors.md

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
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how marketing knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every marketing document under knowledge/marketing/ must follow. It
  owns how marketing knowledge is documented, and owns no strategy,
  company, product, customer, competitor, or brand fact itself.
---

# Open Lance Marketing Namespace Guide

This document is the guide for the Marketing namespace at knowledge/marketing/. It establishes the constitutional architecture that every marketing document must follow. It defines how marketing strategy is documented; it owns no strategy itself.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Marketing namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how marketing knowledge is documented within the repository. It is the single guide for the Marketing namespace, and every marketing document follows it.

The Marketing namespace exists so that every agent and contributor works from one shared, durable understanding of how Open Lance is presented to the market: how it acquires, educates, converts, retains, and grows its customers. A human strategist and an AI agent reasoning from this namespace should reach the same strategy.

This guide does not own any strategy, and it owns no company, product, customer, competitor, or brand fact. Each of those is owned elsewhere and is only referenced.

# Scope

This guide governs the Marketing namespace. It defines the standard structure a marketing document uses, the rules for writing one, the boundaries a marketing document must respect, and how the namespace grows.

The namespace owns marketing strategy: the durable, standing decisions about how Open Lance goes to market. It owns strategy, not the facts strategy is built on, and not the produced content strategy directs. This guide does not define any specific strategy; it defines how the documents that do are written and organized. Each strategy is owned by its own document, created under this guide.

# Architectural Identity

Marketing is its own kind of concept and is not any of the following. Marketing consumes each of these and owns none of them.

- Marketing is not a company fact. Who Open Lance is, its mission, principles, and marketplace model are owned by knowledge/company/. Marketing uses them; it does not restate them.
- Marketing is not a product fact. Product capabilities, entities, workflows, states, permissions, business rules, and pricing are owned by knowledge/product/. Marketing references them; it does not restate them.
- Marketing is not customer knowledge. Who Open Lance serves, and their needs, behaviors, and language, are owned by the Customers namespace, knowledge/customers/. Marketing targets them; it does not define them.
- Marketing is not competitor knowledge. The organizations Open Lance competes with are owned by the Competitors namespace, knowledge/competitors/. Marketing positions against them; it does not describe them.
- Marketing is not a brand standard. Voice, tone, vocabulary, naming, the messaging standard, and the visual identity are owned by the Brand namespace, knowledge/brand/. Marketing applies them; it does not set them.
- Marketing is not a legal constraint. What may be claimed and disclosed is owned by the legal documents in their owning folders. Marketing operates within those constraints; it does not define them.
- Marketing is not produced content. A specific page, post, campaign asset, or email is an Output. Marketing directs what content should achieve; it does not own the content.
- Marketing is not an implementation. Tools, platforms, tags, keywords, and templates live in the codebase and operational systems. Marketing sets strategy; it does not specify technology.

Marketing owns only strategy: the durable decisions about how the facts, standards, and knowledge owned elsewhere are used to acquire, educate, convert, retain, and grow customers. Its strategy is technology-neutral and remains valid even as tools, platforms, and channels change.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Marketing Strategy. A durable, standing decision about how Open Lance is presented to the market to acquire, educate, convert, retain, or grow customers.
- Positioning. The strategic place Open Lance claims in the market. Owned by knowledge/marketing/positioning.md.
- Value Proposition. The strategic promise of value Open Lance makes to an audience. The underlying facts are owned by knowledge/product/ and knowledge/company/.
- Differentiator. A strategically emphasized difference between Open Lance and its alternatives. The competitor and product facts behind it are owned by knowledge/competitors/ and knowledge/product/.
- Lifecycle. The stages a customer moves through: acquire, educate, convert, retain, and grow. The strategy across the lifecycle is owned by knowledge/marketing/growth-strategy.md.
- Channel. A durable class of route to an audience, such as content, search, social, or email. The strategy for a channel is owned by that channel's document.

# Marketing Principles

- Every marketing strategy has exactly one canonical document, which owns that strategy.
- Marketing consumes; it does not restate. Company, product, customer, competitor, and brand knowledge is referenced by canonical path, never copied.
- Brand owns communication standards; marketing applies them. Voice, tone, vocabulary, naming, the messaging standard, and the visual identity are owned by knowledge/brand/ and are never redefined here.
- Marketing owns strategy, not output. A marketing document directs what content and campaigns should achieve; the produced content is an Output owned elsewhere.
- Strategy is technology-neutral. A marketing document records a durable strategic decision, not a tool, platform, tag, keyword, or template.
- Strategy is evidence-based. A marketing document is grounded in the frozen knowledge it consumes and in Open Lance itself, never invented because a tactic is popular.
- Growth is additive only. New strategies extend the namespace without changing this guide.

# Marketing Document Standard

Every marketing strategy document under knowledge/marketing/ uses the following standard structure. This section defines the template only. It does not define any actual strategy. The inventory at knowledge/marketing/marketing.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The strategy the document owns.
- Strategic Intent. What the strategy aims to achieve for Open Lance, tied to the company's goals owned by knowledge/company/.
- Strategy. The durable strategic approach and principles the document owns.
- Inputs. The frozen knowledge this strategy consumes, referenced to its owner and never restated.
- Application. How the strategy is applied in principle, without producing any output or specifying any implementation.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the strategy references.

A marketing document may add a section only when a genuine strategy need requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

A marketing document records one strategy. It records a durable strategic decision, and nothing more.

- A marketing document never restates a company, product, customer, competitor, or brand fact. It references them by canonical repository path.
- A marketing document never redefines a brand standard. It applies voice, tone, vocabulary, naming, the messaging standard, and the visual identity as owned by knowledge/brand/.
- A marketing document never contains produced content or names a specific tool, platform, tag, keyword, or template.
- Everything a marketing document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concept has exactly one owner. A marketing document owns only its own strategy. It owns none of the following.

- Company identity, mission, principles, and marketplace model: the documents in knowledge/company/.
- Product capabilities, entities, workflows, states, permissions, business rules, and pricing: the documents in knowledge/product/.
- Customer segments, needs, behaviors, and language: the Customers namespace, knowledge/customers/.
- Competitor identities and records: the Competitors namespace, knowledge/competitors/.
- Brand voice, tone, vocabulary, naming, messaging standard, and visual identity: the Brand namespace, knowledge/brand/.
- Legal constraints on claims and disclosures: the legal documents in their owning folders.
- Produced content, campaign assets, and individual campaigns: the Campaign and Output levels of the knowledge hierarchy and the asset systems.
- Marketing tools, platforms, analytics implementation, tags, keywords, and templates: the codebase and operational systems, not the knowledge repository.

A marketing document references all of the above and owns none of it. It records only durable marketing strategy.

# Repository Growth

New marketing strategy is added by creating new marketing documents under knowledge/marketing/, each following the Marketing Document Standard and owning a single strategy. The namespace grows only when Open Lance genuinely adopts a distinct new strategy, never by importing strategies that other companies happen to run. The structure defined by this guide never changes as the namespace grows, existing strategies never change identity, and growth is always additive. The namespace supports an unlimited number of strategies.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Marketing namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at knowledge/marketing/marketing.md is a reference document and declares the Reference authority level. Each strategy document declares the Policy authority level, because a marketing strategy is a standing decision derived from principles. A marketing document never overrides a higher-authority normative document, and it always operates within the brand standards and legal constraints owned elsewhere.
- Marketing documents follow the standard and rules defined here. A marketing document that conflicts with them is corrected to conform, which does not change that document's ownership of its own strategy.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/company.md
- knowledge/product/features.md
- knowledge/customers/customers.md
- knowledge/competitors/competitors.md
- knowledge/brand/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Marketing documents. The individual marketing documents governed by this guide are created over time under knowledge/marketing/, following this guide and knowledge/CONTRIBUTING.md. Until then, references to specific marketing documents elsewhere in the repository are intentional forward references.
- Campaign and Output levels. This guide references the Campaign and Output levels of the knowledge hierarchy defined in knowledge/README.md as the owners of individual campaigns and produced content. Documents at those levels are created over time; the references are intentional forward references.
- Legal namespace. This guide references the legal constraints that bound marketing claims. A dedicated legal namespace is created over time under knowledge/legal/, following knowledge/README.md; until then, the reference is an intentional forward reference, and knowledge/company/legal.md holds the enduring legal principles.
