---
id: OL-KNOW-BRAND-README
document: knowledge/brand/README.md

title: Open Lance Brand Namespace Guide

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
  - knowledge/company/mission.md
  - knowledge/company/principles.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Social Media Manager
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that produces outward-facing communication
  - Any contributor to the Brand namespace

provenance:
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how brand knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every brand document under knowledge/brand/ must follow. It owns
  only how brand standards are documented, and owns no brand standard,
  company fact, product fact, campaign, or output itself.
---

# Open Lance Brand Namespace Guide

This document is the guide for the Brand namespace at knowledge/brand/. It establishes the constitutional architecture that every brand document must follow. It defines how the standards for the organization's presentation and communication are documented; it does not itself produce any communication.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Brand namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how brand knowledge is documented within the repository. It is the single guide for the Brand namespace, and every brand document follows it.

The Brand namespace exists so that every outward-facing communication is consistent, recognizable, and true to the organization, regardless of who or what produces it. A human writer and an AI writer working from this namespace should express the organization in the same voice, with the same standards, and reach communication that is recognizably Open Lance.

This guide does not own any company fact, product fact, audience fact, competitive fact, marketing plan, campaign, or produced output. Each of those is owned elsewhere and is only referenced by brand documents.

# Scope

This guide governs the Brand namespace. It defines the standard structure a brand document uses, the rules for writing one, the boundaries a brand document must respect, and how the namespace grows.

The namespace owns the durable standards for how the organization presents and communicates itself. These fall into two areas. Verbal identity covers voice, tone, vocabulary, naming, and the standard expression of messaging. Visual identity covers the standards for logo, color, typography, and imagery. This guide does not define any of those standards; it defines how the documents that own them are written and organized. Each specific standard is owned by its own brand document, created over time under this guide.

# Architectural Identity

A brand standard is its own kind of concept and is not any of the following.

- A brand standard is not the company's identity. Who the organization is, its vision, mission, and principles, is owned by the documents in knowledge/company/. Brand expresses that identity; it does not define it.
- A brand standard is not a product fact. What the organization offers is owned by the documents in knowledge/product/. Brand names and messages the product; it does not define it.
- A brand standard is not a marketing plan. Growth strategy, channels, and campaigns are owned by the Marketing namespace. Brand governs how campaigns communicate; it does not plan them.
- A brand standard is not an audience or competitive fact. Who the organization serves and the competitive landscape are owned by the Customers and Competitors namespaces. Brand references them; it does not define them.
- A brand standard is not a legal constraint. What may be claimed or must be disclosed is owned by the legal documents in their owning folders. Brand references those constraints; it does not define them.
- A brand standard is not a produced output. A specific advertisement, post, page, or asset is an Output. Brand governs the standard an output must meet; it does not own the output.
- A brand standard is not a permission, a workflow, a business rule, or a policy owned elsewhere. Authorization, sequencing, product constraints, and non-brand policies are owned by their canonical documents and are only referenced here.
- A brand standard is not a technical implementation. Design files, fonts, rendered assets, color implementation, content systems, and tooling live in the codebase and asset systems, not in the knowledge repository.

A brand standard answers only how the organization should present and communicate itself. Its identity is independent of implementation, technology, channel, and format, and it remains the same standard whether it is applied by a human, by an AI agent, or by both.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Brand. The durable identity by which the organization is recognized, and the standards that govern how it presents and communicates itself.
- Brand Standard. A durable, normative rule that governs an aspect of brand expression. Brand standards are standing decisions derived from the company's identity and principles, owned by knowledge/company/.
- Verbal Identity. The standards that govern the organization's language: voice, tone, vocabulary, naming, and the expression of messaging.
- Voice. The consistent character of the organization's language across all communication.
- Tone. The adjustment of voice to a specific context, audience, or moment, within the bounds of the voice.
- Visual Identity. The standards that govern the organization's appearance: logo, color, typography, and imagery.
- Messaging. The standard way the organization expresses what it offers and why it matters. The underlying facts are owned by knowledge/product/ and knowledge/company/; brand owns only the standard expression of them.
- Naming. The standards for naming what the organization presents. The things being named are owned by their canonical documents; brand owns only the naming standard.
- Brand Asset. A produced artifact that embodies a brand standard, such as a logo file or a template. Brand assets live in the asset and implementation systems, not in this namespace.

# Brand Principles

- Every brand standard has exactly one canonical document, which owns that standard.
- Brand expresses the company. A brand document references the company identity, mission, and principles it expresses, owned by knowledge/company/, and never redefines them.
- Brand messages the product. A brand document references the product facts it communicates, owned by knowledge/product/, and never redefines them.
- Brand governs outputs; it never becomes one. A brand document defines the standard an output must meet, and never contains a produced output.
- Brand references constraints; it never redefines them. Legal constraints, permissions, business rules, and policies owned elsewhere are referenced by canonical path, never restated.
- Brand standards are implementation-independent and channel-independent. A standard holds across every medium, format, and technology.
- Consistency over novelty. A brand document preserves the established identity rather than reinventing it. Change to a brand standard follows the amendment process in knowledge/CONTRIBUTING.md.
- Growth is additive only. New brand standards extend the namespace without changing this guide.
- Existing brand standards remain stable. A standard's meaning does not change casually; it is reused by reference rather than duplicated.

# Brand Document Standard

Every brand document under knowledge/brand/ uses the following standard structure. This section defines the template only. It does not define any actual brand standard.

- Purpose. The aspect of brand identity the document owns.
- Standard. The durable, normative brand rules the document owns, stated so they can be applied consistently.
- Rationale. Why the standard holds, referenced to the company identity and principles it derives from, owned by knowledge/company/.
- Application. How the standard is applied to outward communication in principle, without producing or prescribing any specific output.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the brand document references.

A brand document may add a section only when a genuine brand domain requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

A brand document describes a standard. It records how the organization should present or communicate itself, and nothing more.

- A brand document never redefines any concept owned elsewhere. It references company identity, product facts, audience and competitive facts, legal constraints, permissions, business rules, and policies by canonical repository path.
- A brand document never contains a produced output. It defines the standard; the output is created elsewhere and only checked against the standard.
- Everything a brand standard depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concept has exactly one owner. A brand document owns only its own brand standard. It owns none of the following.

- Company identity, vision, mission, principles, and legal principles: the documents in knowledge/company/.
- Product facts, capabilities, entities, and commercial policies: the documents in knowledge/product/.
- Audience and customer facts: the Customers namespace, knowledge/customers/.
- Competitive facts and positioning of others: the Competitors namespace, knowledge/competitors/.
- Growth strategy, channels, and campaigns: the Marketing namespace, knowledge/marketing/.
- Legal constraints, claims, and disclosures: the legal documents in their owning folders.
- Permissions and authorization: knowledge/product/permissions.md.
- Business rules and product constraints: knowledge/product/business-rules.md.
- Workflows and process execution: knowledge/product/workflows.md and the process documents under knowledge/processes/.
- Produced content and artifacts: the Output level of the knowledge hierarchy and the asset systems.
- Design files, fonts, rendered assets, color implementation, content systems, and tooling: the codebase and asset systems, not the knowledge repository.

A brand document references all of the above and owns none of it. It records only a standard for how the organization presents and communicates itself.

# Repository Growth

New brand standards are added by creating new brand documents under knowledge/brand/, each following the Brand Document Standard and owning a single brand responsibility. The namespace is expected to grow to cover verbal identity, such as voice, tone, vocabulary, naming, and messaging expression, and visual identity, such as logo, color, typography, and imagery, with each area owned by its own document. The structure defined by this guide never changes as the namespace grows, existing brand standards never change casually, and growth is always additive. The namespace supports an unlimited number of brand documents.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Brand namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- Brand documents governed by this guide declare their own authority. A document that sets a normative brand standard declares the Policy authority level, because a brand standard is a standing decision derived from principles. A document that only records brand reference material declares the Reference level. Neither overrides a higher-authority normative document.
- Brand documents follow the standard and rules defined here. A brand document that conflicts with them is corrected to conform, which does not change that document's ownership of its own standard.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/company.md
- knowledge/company/mission.md
- knowledge/company/principles.md
- knowledge/product/features.md
- knowledge/product/entities.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Brand documents. The individual brand documents governed by this guide are created over time under knowledge/brand/, following this guide and knowledge/CONTRIBUTING.md. Until then, references to specific brand documents elsewhere in the repository are intentional forward references.
- Downstream namespaces. This guide references the Marketing, Customers, and Competitors namespaces, which are created over time under knowledge/marketing/, knowledge/customers/, and knowledge/competitors/. Until then, those references are intentional forward references that express the planned architecture, as permitted by knowledge/README.md.
- Policy authority level. Brand standard documents are the first substantial content at the Policy authority level defined in knowledge/README.md. If a repository-wide convention for Policy-level documents is ever wanted, it would be recorded through an amendment to knowledge/README.md and would apply to brand standards along with every other Policy-level document.
