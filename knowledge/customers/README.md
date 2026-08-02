---
id: OL-KNOW-CUSTOMERS-README
document: knowledge/customers/README.md

title: Open Lance Customers Namespace Guide

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
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how customer knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every customer document under knowledge/customers/ must follow. It
  owns how customer knowledge is documented, and owns no customer segment,
  role, company fact, product fact, or campaign itself.
---

# Open Lance Customers Namespace Guide

This document is the guide for the Customers namespace at knowledge/customers/. It establishes the constitutional architecture that every customer document must follow. It defines how knowledge about the people and organizations Open Lance serves is documented; it does not itself describe any of them.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Customers namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how customer knowledge is documented within the repository. It is the single guide for the Customers namespace, and every customer document follows it.

The Customers namespace exists so that every agent and contributor works from one shared, durable understanding of who Open Lance serves, what those people and organizations need, how they behave, and the language they use. A human strategist and an AI agent reasoning from this namespace should reach the same understanding of the audience.

This guide does not own any customer segment, any role, any company fact, any product fact, any brand standard, or any marketing plan. Each of those is owned elsewhere and is only referenced by customer documents.

# Scope

This guide governs the Customers namespace. It defines the standard structure a customer document uses, the rules for writing one, the boundaries a customer document must respect, and how the namespace grows.

The namespace owns durable, segment-level knowledge of the audience Open Lance serves: which segments exist, what each needs, how each behaves and decides, and the language each uses. This guide does not describe any specific segment; it defines how the documents that do are written and organized. Each segment is owned by its own document, created over time under this guide.

# Architectural Identity

A customer segment is its own kind of concept and is not any of the following.

- A customer segment is not a role. A role is a capacity in which a participant acts inside the product, owned by knowledge/product/roles.md. A customer segment is who an audience is and what it needs. A customer document references the role its segment tends to hold and never redefines it.
- A customer segment is not a product entity. Entities are owned by knowledge/product/entities.md. A segment is an audience, not a thing the product models.
- A customer segment is not a single person. It is a durable description of a group. This namespace never holds personal data, individual records, or any information that identifies a specific person; such data lives in operational systems and the codebase, never in the knowledge repository.
- A customer segment is not a company or product fact. Who Open Lance is and what it offers are owned by knowledge/company/ and knowledge/product/. A segment references those facts and never restates them.
- A customer segment is not a brand standard. How Open Lance speaks is owned by the Brand namespace. A segment records how the audience speaks, which is a different thing.
- A customer segment is not a marketing plan. Which segments to pursue, through which channels, and how, is owned by the Marketing namespace. A segment records who the audience is; it does not decide how to reach it.

A customer document answers only who a segment is, what it needs, how it behaves, and the language it uses. Its knowledge is durable and technology-neutral, and it remains valid even if the application, database, pricing, or interface change.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Customer. A person or organization that Open Lance serves.
- Customer Segment. A durable group of customers who share needs, behaviors, and language. Segments are the unit of knowledge in this namespace.
- Need. A goal or problem a customer comes to Open Lance to satisfy or solve. A need is owned by the customer document; the product capability that meets it is owned by knowledge/product/features.md.
- Behavior. A durable pattern in how a segment decides and acts. It describes the audience, not the product workflow that the audience uses, which is owned by knowledge/product/workflows.md and the process documents under knowledge/processes/.
- Customer Language. The words and phrases a segment naturally uses to describe its needs and its work. This is the audience's own language, distinct from the brand's prescribed word choice owned by knowledge/brand/vocabulary.md.

# Customer Principles

- Every customer segment has exactly one canonical document, which owns that segment.
- Segments reference roles; they never redefine them. The Business and Freelancer roles are owned by knowledge/product/roles.md.
- Needs reference features; they never redefine them. A customer document records the need; the capability that meets it is owned by knowledge/product/features.md.
- Behaviors reference workflows; they never redefine them. A customer document records how a segment tends to act; the workflow and process are owned by knowledge/product/workflows.md and knowledge/processes/.
- Customer language is the audience's, not the brand's. A customer document records how the audience speaks; how Open Lance speaks is owned by the Brand namespace.
- No personal data, ever. Customer documents describe segments, never individuals. They contain no name, contact, account, or other information that identifies a person.
- Segment knowledge is durable and evidence-based. A customer document captures enduring truth about a segment, not transient metrics or a single campaign's data, and never invents a fact about the audience.
- Growth is additive only. New segments extend the namespace without changing this guide.

# Customer Document Standard

Every customer document under knowledge/customers/ uses the following standard structure. This section defines the template only. It does not describe any actual segment.

- Purpose. The segment the document owns.
- Who They Are. The segment in context: the range it spans and the role it tends to hold, referenced to knowledge/product/roles.md. The segment's canonical identity is owned by knowledge/customers/customers.md and is referenced, not restated.
- Needs. What the segment comes to Open Lance to achieve, with the capabilities that meet those needs referenced to knowledge/product/features.md.
- Behaviors. How the segment tends to decide and act, with the workflows and processes it uses referenced to knowledge/product/workflows.md and knowledge/processes/.
- Language. The words and phrases the segment naturally uses, kept distinct from the brand's own word choice owned by knowledge/brand/vocabulary.md.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the customer document references.

A customer document may add a section only when a genuine segment need requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

A customer document describes an audience segment. It records who a segment is, what it needs, how it behaves, and how it speaks, and nothing more.

- A customer document never redefines any concept owned elsewhere. It references roles, entities, features, workflows, processes, brand standards, company facts, and marketing plans by canonical repository path.
- A customer document never holds personal data. It describes the segment in the aggregate and never an individual.
- Everything a customer document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concept has exactly one owner. A customer document owns only its own segment. It owns none of the following.

- Roles and participation capacity: knowledge/product/roles.md.
- Product capabilities, entities, workflows, states, permissions, and business rules: the documents in knowledge/product/.
- Process execution: the process documents under knowledge/processes/.
- Company identity, mission, principles, and the marketplace model: the documents in knowledge/company/.
- Brand voice, tone, vocabulary, and the rest of brand expression: the Brand namespace, knowledge/brand/.
- Marketing strategy, channels, campaigns, targeting, and positioning strategy: the Marketing namespace, knowledge/marketing/.
- The competitive landscape: the Competitors namespace, knowledge/competitors/.
- Pricing and commercial terms: knowledge/product/pricing.md.
- Personal data, individual accounts, analytics records, and operational data: the operational systems and the codebase, not the knowledge repository.

A customer document references all of the above and owns none of it. It records only durable, segment-level knowledge of the audience.

# Repository Growth

New segment knowledge is added by creating new customer documents under knowledge/customers/, each following the Customer Document Standard and owning a single segment. The namespace grows only when Open Lance genuinely serves a distinct new segment, never by importing segments that other companies happen to have. The structure defined by this guide never changes as the namespace grows, existing segment identities never change, and growth is always additive. The namespace supports an unlimited number of segments.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Customers namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- Customer documents governed by this guide are reference documents and declare the Reference authority level, because they record facts about the audience rather than set rules. A customer document never overrides a normative document.
- Customer documents follow the standard and rules defined here. A customer document that conflicts with them is corrected to conform, which does not change that document's ownership of its own segment.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/company.md
- knowledge/product/roles.md
- knowledge/product/features.md
- knowledge/product/workflows.md
- knowledge/brand/vocabulary.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Customer documents. The individual customer documents governed by this guide are created over time under knowledge/customers/, following this guide and knowledge/CONTRIBUTING.md. Until then, references to specific customer documents elsewhere in the repository are intentional forward references.
- Downstream namespaces. This guide references the Marketing and Competitors namespaces, which are created over time under knowledge/marketing/ and knowledge/competitors/. Until then, those references are intentional forward references that express the planned architecture, as permitted by knowledge/README.md.
- New segments. Open Lance serves two sides today, the demand side and the supply side. If it ever serves a genuinely distinct new segment, for example a separately-served enterprise buyer or a distinct partner audience, that segment is added as a new document under this guide, without changing the namespace structure.
