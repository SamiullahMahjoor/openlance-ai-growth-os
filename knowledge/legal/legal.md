---
id: OL-KNOW-LEGAL-LEGAL
document: knowledge/legal/legal.md

title: Open Lance Legal Inventory

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
  - knowledge/legal/README.md
  - knowledge/company/legal.md

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
  - Derived from knowledge/legal/README.md and knowledge/company/legal.md

loading_priority: Required

summary: >
  The canonical inventory of Open Lance's enduring legal policies. It owns
  the identity and existence of each legal concern and which document owns
  it. It owns no policy content, no legal principle, and no legal advice.
---

# Open Lance Legal Inventory

This document is the canonical inventory of Open Lance's enduring legal policies. It owns the identity of the Legal namespace and the list of legal concerns the namespace governs, so that any human or AI agent can determine, from one place, which legal concerns exist and which document owns each. It is a reference document and follows the inventory pattern, not the Legal Document Standard.

This inventory owns only identity and existence. It does not state any policy, it does not restate any legal principle, and it gives no legal advice. How legal knowledge is documented is owned by knowledge/legal/README.md. The foundational legal principles are owned by knowledge/company/legal.md. Each policy's content is owned by that policy's own document.

# Purpose

This document exists so that the set of Open Lance's legal policies has a single canonical list. It answers one question: which enduring legal concerns does Open Lance govern, and which document owns each. It names each concern and points to its owner; it holds no policy of its own.

# Namespace Identity

The Legal namespace holds Open Lance's enduring legal policy: the durable, domain-specific legal governance that applies the foundational legal principles to particular concerns such as terms of use, privacy, intellectual property, and compliance.

The namespace sits below the foundational legal layer and instantiates it. The nine timeless legal principles that bound Open Lance are owned by knowledge/company/legal.md at the Legal authority level. Every policy in this namespace conforms to those principles, references them, and never restates or weakens them. The namespace owns policy; it owns no legal principle, no legal advice, no jurisdiction-specific law, and no produced legal instrument.

# The Legal Concerns

The Legal namespace governs the following enduring legal concerns. Each is owned by exactly one document. This list owns the identity of each concern; the content is owned by the named document.

## Terms of Use

- Document. knowledge/legal/terms.md.
- Owns. The enduring policy governing the relationship between Open Lance and those who use it: that use is governed by accepted terms, and how that relationship is defined, changed, and honored.
- Out of scope. The produced Terms of Service instrument, owned at the Output level; conduct rules, owned by knowledge/legal/acceptable-use.md; privacy, intellectual property, and pricing, owned by their documents; the foundational legal principles, owned by knowledge/company/legal.md.

## Privacy

- Document. knowledge/legal/privacy.md.
- Owns. The enduring policy governing personal information: the lawful, legitimate, and transparent handling of information and respect for the rights participants hold over it.
- Out of scope. How long information is kept, owned by knowledge/legal/data-retention.md; security controls and implementation, owned by the codebase; the operating entity, owned by knowledge/company/company.md; the foundational information-handling principle, owned by knowledge/company/legal.md.

## Data Retention

- Document. knowledge/legal/data-retention.md.
- Owns. The enduring policy governing how long information is kept and when it is removed: retention for defined and legitimate purposes only, and removal when no longer needed.
- Out of scope. How information is handled while held, owned by knowledge/legal/privacy.md; retention implementation and operational sweeps, owned by the codebase and knowledge/product/; record-integrity as a foundational principle, owned by knowledge/company/legal.md.

## Intellectual Property

- Document. knowledge/legal/intellectual-property.md.
- Owns. The enduring intellectual property policy: the framework by which Open Lance protects its own intellectual property, respects that of others, and governs the licensing of rights on the platform.
- Out of scope. Ownership of user content and work product, owned by knowledge/legal/content-ownership.md; the brand marks and identity, owned by the Brand and Company namespaces; the platform software, owned by the codebase; the foundational intellectual property principle, owned by knowledge/company/legal.md.

## Content Ownership

- Document. knowledge/legal/content-ownership.md.
- Owns. The enduring policy governing ownership of content and work product created through the platform: who owns user-generated content and deliverables, and the limited license the platform holds to operate.
- Out of scope. The intellectual property framework, owned by knowledge/legal/intellectual-property.md; engagement and contract mechanics, owned by knowledge/product/ and knowledge/processes/; the produced license text, owned at the Output level.

## Acceptable Use

- Document. knowledge/legal/acceptable-use.md.
- Owns. The enduring policy governing conduct on the platform: the use that is permitted and the conduct that is prohibited, so that use is lawful, honest, and fair.
- Out of scope. Enforcement execution, owned by the process documents under knowledge/processes/; trust and safety mechanics and business rules, owned by knowledge/product/; the relationship framework, owned by knowledge/legal/terms.md.

## Disclosures

- Document. knowledge/legal/disclosures.md.
- Owns. The enduring policy governing what Open Lance commits to disclose: the honest, clear, and accessible disclosure of material information so participants can make informed decisions.
- Out of scope. The disclosed facts themselves, owned by their documents, including the operating entity in knowledge/company/company.md, pricing in knowledge/product/pricing.md, and data practices in knowledge/legal/privacy.md; the produced disclosures, owned at the Output level.

## Compliance

- Document. knowledge/legal/compliance.md.
- Owns. The enduring policy governing Open Lance's commitment and approach to complying with applicable law: operating lawfully wherever it operates, and escalating legal uncertainty to accountable humans.
- Out of scope. The identification and interpretation of the specific laws and regulations that apply, carried out by accountable humans and counsel; compliance implementation and procedures, owned by operational systems and knowledge/processes/; the foundational applicable-law principle, owned by knowledge/company/legal.md.

## Consumer Protection

- Document. knowledge/legal/consumer-protection.md.
- Owns. The enduring policy governing fair treatment and protection of those who use Open Lance: honest dealing, protection against loss, and fair, accessible redress.
- Out of scope. The protection mechanisms, such as escrow and dispute resolution, owned by knowledge/product/ and knowledge/processes/; the fair-dealing foundational principle, owned by knowledge/company/legal.md; the honesty communication standard, owned by the Brand namespace.

# Boundaries

This inventory owns the identity and existence of the legal concerns only. It owns none of the following.

- How legal knowledge is documented: knowledge/legal/README.md.
- The content of any legal policy: that policy's own document.
- The foundational legal principles and AI legal constraints: knowledge/company/legal.md.
- Any business fact, product fact, or brand standard: the Company, Product, and Brand namespaces.
- Applicable law itself and legal advice: an absolute external constraint and the province of accountable humans and counsel; the specific requirements that any jurisdiction imposes are identified and interpreted by them.
- Produced legal instruments: the Output level.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/legal/README.md
- knowledge/company/legal.md
- knowledge/company/company.md
- knowledge/product/roles.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As Open Lance comes to govern a genuinely new and distinct legal concern, a new document is added under knowledge/legal/ following knowledge/legal/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- Concerns intentionally not split. Concerns tied to a specific technology, such as a policy named for one tracking mechanism, are not given their own documents, because the durable concern is owned by a broader policy, for example tracking and consent within knowledge/legal/privacy.md. This keeps the namespace future-proof as technologies change.
