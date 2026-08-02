---
id: OL-KNOW-LEGAL-README
document: knowledge/legal/README.md

title: Open Lance Legal Namespace Guide

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
  - knowledge/company/legal.md
  - knowledge/company/company.md
  - knowledge/company/principles.md

used_by:
  - Founder
  - Customer Support Agent
  - Product Manager
  - Partnership Manager
  - Community Manager
  - CMO Agent
  - Any AI Agent that handles a legally relevant matter
  - Any contributor to the Legal namespace

provenance:
  - Derived from knowledge/README.md and knowledge/company/legal.md

loading_priority: Required

summary: >
  Defines how legal knowledge is documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every legal document under knowledge/legal/ must follow. It owns how
  legal knowledge is documented, and owns no legal principle, business
  fact, contract, or legal advice itself.
---

# Open Lance Legal Namespace Guide

This document is the guide for the Legal namespace at knowledge/legal/. It establishes the constitutional architecture that every legal document must follow. The Legal namespace documents the enduring legal policy that governs Open Lance: the domain-specific legal governance that applies the foundational legal principles to particular concerns. It defines how legal knowledge is documented; it owns no legal principle and no policy itself.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and it operates under the foundational legal principles owned by knowledge/company/legal.md. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how legal knowledge is documented within the repository. It is the single guide for the Legal namespace, and every legal document follows it.

The Legal namespace exists so that any human or AI agent can find, in one place, the enduring legal policy that governs Open Lance, and can determine which document owns which legal concern. It holds durable legal governance; it holds no legal advice.

This guide owns no legal principle, no business fact, no contract, and no legal advice. The foundational legal principles are owned by knowledge/company/legal.md; the business knowledge is owned by the Company, Product, and other namespaces; the actual legal instruments are produced at the Output level, and any legal advice belongs to accountable humans and counsel, outside this repository.

# Scope

This guide governs the Legal namespace. It defines the standard structure a legal document uses, the rules for writing one, the boundaries a legal document must respect, and how the namespace grows.

The namespace owns enduring legal policy: the durable, domain-specific legal governance that instantiates the foundational legal principles for concerns such as terms of use, privacy, intellectual property, and compliance. Each concern is owned by its own document, created under this guide. This guide does not state any policy; it defines how the documents that do are written and organized.

# Architectural Identity

Legal policy is its own kind of knowledge, and it is not any of the following.

- Legal policy is not a foundational legal principle. The nine timeless legal principles that bound Open Lance are owned by knowledge/company/legal.md at the Legal authority level. Legal documents in this namespace instantiate and apply those principles; they conform to them, reference them, and never restate or weaken them.
- Legal policy is not legal advice. This namespace documents Open Lance's own enduring policy. It does not advise any party, and it does not replace qualified legal counsel.
- Legal policy is not jurisdiction-specific law. A legal policy does not name or restate the law of any country, state, or region. Applicable law is an absolute external constraint owned by no document, and the specific requirements of any jurisdiction are identified and interpreted by accountable humans and counsel.
- Legal policy is not a contract or an instrument. The actual Terms of Service, privacy notice, licenses, and other instruments that a policy is applied through are produced Outputs, expressed at the Output level.
- Legal policy is not a business fact. Company identity, the operating entity, product capabilities, pricing, workflows, and business rules are owned by their namespaces. Legal documents reference them and never restate them.
- Legal policy is not an implementation. Security controls, data storage, consent mechanisms, and other technical measures live in the codebase and operational systems.

A legal document answers only what enduring legal policy governs one concern. Its knowledge is durable, jurisdiction-neutral, and independent of any specific law, contract, or technology, so it remains valid as laws, instruments, and systems change.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Legal Policy. An enduring, domain-specific legal governance decision that applies the foundational legal principles to a particular concern. Legal policies are owned by this namespace.
- Legal Principle. A timeless legal constraint that bounds Open Lance. The foundational legal principles are owned by knowledge/company/legal.md.
- Legal Instrument. A produced legal document, such as a Terms of Service or a privacy notice, through which a policy is applied to an audience. Instruments are Outputs, produced at the Output level.
- Applicable Law. The law that governs Open Lance wherever it operates. It is an absolute external constraint that overrides every internal document, and it is owned by no document.
- Responsibility. A duty this policy assigns, described by the role that holds it. Roles are owned by knowledge/product/roles.md.

# Legal Principles

- Every legal concern has exactly one canonical document, which owns that concern.
- Every legal document instantiates, and never restates, the foundational legal principles owned by knowledge/company/legal.md, and it may never weaken or contradict them.
- Legal policies are jurisdiction-neutral. They state durable policy and never name or restate the law of any jurisdiction; the specific laws that apply are identified and interpreted by accountable humans and counsel.
- Legal documents give no advice. They document Open Lance's own policy and defer legal advice and interpretation to accountable humans and counsel.
- Legal documents reference; they do not restate. Company facts, product facts, and the foundational legal principles are referenced by canonical path.
- Legal documents own policy, not instruments. The produced Terms, notices, and licenses are Outputs, owned elsewhere.
- Legally significant decisions rest with accountable humans. This namespace records policy; it never replaces the human accountability owned by knowledge/company/legal.md and knowledge/CONTRIBUTING.md.
- Growth is additive only. New legal concerns extend the namespace without changing this guide.

# Legal Document Standard

Every legal document under knowledge/legal/ uses the following standard structure. This section defines the template only. It does not define any actual policy. The inventory at knowledge/legal/legal.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The legal concern the document owns.
- Principles. The enduring, domain-specific legal principles the document owns, each instantiating the foundational legal principles owned by knowledge/company/legal.md.
- Requirements. The durable requirements the policy establishes, stated without jurisdiction-specific law or implementation.
- Responsibilities. The duties the policy assigns, by role, referenced to knowledge/product/roles.md.
- Boundaries. What the document does not own, with each excluded concept referenced to its canonical owner.
- Related Knowledge. Canonical repository paths to the documents the policy references.

A legal document may add a section only when a genuine legal concern requires it, following knowledge/CONTRIBUTING.md, and never to move knowledge out of its canonical owner into this namespace.

# Documentation Rules

A legal document records one enduring legal policy, and nothing more.

- A legal document never restates a foundational legal principle, a business fact, or the text of any instrument. It references knowledge/company/legal.md, the business namespaces, and the Output level by canonical path.
- A legal document never names or restates the law of any jurisdiction, and never gives legal advice.
- A legal document never specifies a technical control, system, or implementation.
- Everything a legal document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concern has exactly one owner. A legal document owns only its own policy. It owns none of the following.

- The foundational legal principles and AI legal constraints: knowledge/company/legal.md.
- Company identity, the operating entity, mission, and principles: the documents in knowledge/company/.
- Product capabilities, entities, workflows, states, permissions, business rules, and pricing: the documents in knowledge/product/.
- Brand standards, customer knowledge, competitor knowledge, and marketing strategy: the Brand, Customers, Competitors, and Marketing namespaces.
- Process execution, including dispute and moderation procedures: the process documents under knowledge/processes/.
- Applicable law itself and legal advice: an absolute external constraint, and the province of accountable humans and qualified counsel. The specific laws and regional regulations that apply are identified and interpreted by them, and the durable, jurisdiction-neutral policy governing how Open Lance complies is owned by knowledge/legal/compliance.md.
- Produced legal instruments, such as a Terms of Service or a privacy notice: the Output level and the asset systems.
- Security controls, data storage, consent mechanisms, and other implementation: the codebase and operational systems.

A legal document references all of the above and owns none of it. It records only durable, jurisdiction-neutral legal policy.

# Repository Growth

New legal policy is added by creating new legal documents under knowledge/legal/, each following the Legal Document Standard and owning a single concern. The namespace grows only when Open Lance genuinely governs a distinct new legal concern, never by importing policies other companies happen to keep or by adding jurisdiction-specific documents. The structure defined by this guide never changes as the namespace grows, existing policies never change identity, and growth is always additive.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Legal namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and operates under the foundational legal principles owned by knowledge/company/legal.md. Where this guide and a higher-authority document differ, the higher-authority document governs, and applicable law overrides every internal document.
- The inventory at knowledge/legal/legal.md is a reference document and declares the Reference authority level. Each legal policy document declares the Policy authority level, because a legal policy is a standing decision that applies the foundational legal principles. A legal policy never overrides a normative document above it, and never weakens knowledge/company/legal.md.
- Legal documents follow the standard and rules defined here, and conform to knowledge/company/legal.md. A legal document that conflicts with either is corrected to conform.
- Changes to this guide require founder approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/company/legal.md
- knowledge/company/company.md
- knowledge/company/principles.md
- knowledge/product/roles.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Legal documents. The individual legal documents governed by this guide are created over time under knowledge/legal/, following this guide and knowledge/CONTRIBUTING.md.
- The constitutional legal layer. The foundational legal principles live in knowledge/company/legal.md at the Legal authority level, as recorded in that document's own evolution notes. This namespace instantiates them and does not move or restate them. If the constitutional legal document is ever co-located here, that would be a folder-organization change only, since authority is set by the authority field and not by folder.
- Produced instruments. The actual Terms of Service, privacy notice, and other instruments that these policies are applied through are Outputs, produced and maintained at the Output level under human and legal accountability. If a durable record of which instrument applies which policy is ever wanted, it would be added without changing these policies.
