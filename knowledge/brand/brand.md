---
id: OL-KNOW-BRAND-BRAND
document: knowledge/brand/brand.md

title: Open Lance Brand Inventory

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
  - knowledge/brand/README.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Social Media Manager
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that discovers brand concepts
  - Any contributor to the Brand namespace

provenance:
  - Derived from knowledge/brand/README.md and the Open Lance brand

loading_priority: Required

summary: >
  The single canonical inventory of the brand concepts Open Lance
  recognizes. It records only that each brand concept exists and its
  identity, not the concept's definition, standard, values, or
  implementation, which are owned elsewhere.
---

# Open Lance Brand Inventory

This document is the single canonical inventory of the brand concepts that exist within Open Lance. It records only that each brand concept exists and what its identity is. It does not define any brand concept's standard, and it does not define company facts, product facts, marketing strategy, campaigns, positioning strategy, or any implementation, asset, color, typeface, logo, message, tone, or voice, all of which are owned elsewhere and are only referenced here.

This is a reference document within the Brand namespace. It follows the namespace guide in knowledge/brand/README.md, the repository constitution in knowledge/README.md, and the contribution process in knowledge/CONTRIBUTING.md, and it does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Brand concepts in this inventory are technology-neutral and implementation-independent. A brand concept continues to exist even if channels, media, tools, or produced assets change. New brand concepts are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of brand concepts. It is the single place where the presence of a brand concept is recorded. No other document may add a brand concept to the inventory, and other documents may only reference the brand concepts recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which brand concepts Open Lance recognizes, and then follow a canonical reference to the document that owns each concept's standard.

# Scope

This inventory lists every brand concept that currently exists in Open Lance, grouped into the two areas of brand identity defined in knowledge/brand/README.md. Each brand concept is represented exactly once and has exactly one canonical entry.

Each entry records identity only. It does not define the concept, and it does not state the concept's standard, values, or content. The definition of each brand term is owned by knowledge/brand/README.md, and the standard for each brand concept is owned by that concept's own document under knowledge/brand/.

# Brand Concepts, Definitions, and Standards

A brand concept is documented across three owners, and this inventory is only one of them.

- The definition of each brand term is owned by knowledge/brand/README.md, which defines the repository-wide brand vocabulary.
- The existence and identity of each brand concept is owned here, in this inventory.
- The standard for each brand concept, including any rule, value, or content, is owned by that concept's own document under knowledge/brand/, created over time.

This inventory neither defines the brand terms nor states the brand standards. It records that each brand concept exists and points to the documents that own its definition and its standard.

# Every Brand Concept Entry

Every brand concept in this inventory uses the same thin structure. The structure records identity only.

- Name. The canonical name of the brand concept.
- Description. A single identity statement of what the concept covers, deferring the definition to its owner.
- Out of Scope. What this entry does not record, deferred to its owner.
- Related Knowledge. Canonical repository paths to the document that owns the concept's definition and the document that owns its standard.

An entry contains no definition, no standard, no value, no content, no asset, and no implementation detail. It records identity only.

# Definitions

These definitions are repository-wide and timeless. Each defers ownership where the concept is owned elsewhere.

- Brand Concept. A recognized aspect of the organization's brand that has, or will have, a canonical standard. The definitions of the specific brand terms are owned by knowledge/brand/README.md; this inventory owns only the existence and identity of each brand concept.
- Brand Concept Group. A named grouping of related brand concepts used to organize this inventory. The two groups used here, Verbal Identity and Visual Identity, are defined in knowledge/brand/README.md. A group is an organizational convenience only; it carries no standard and grants no authority.

# Architectural Identity

This inventory reinforces, and does not replace, the identity boundaries defined in knowledge/brand/README.md.

A brand concept represents only a recognized aspect of how the organization presents and communicates itself. It never represents any of the following, each of which is owned elsewhere.

- A brand standard, value, or content. Owned by the concept's own document under knowledge/brand/.
- A brand term definition. Owned by knowledge/brand/README.md.
- Company identity, vision, mission, principles, and legal principles. Owned by the documents in knowledge/company/.
- Product facts, capabilities, and entities. Owned by the documents in knowledge/product/.
- Marketing strategy, channels, campaigns, and positioning strategy. Owned by the Marketing namespace, knowledge/marketing/.
- A produced output or asset. Owned by the Output level of the knowledge hierarchy and the asset systems.
- Implementation, colors, typefaces, logo files, fonts, rendering, content systems, and tooling. These live in the codebase and asset systems, not in the knowledge repository.

A brand concept identity remains unchanged even if channels change, media change, tools change, assets change, technology changes, or the concept's standard is refined. The identity of a brand concept is independent of how it is expressed and of who or what expresses it.

# Ownership

- Each brand concept has exactly one canonical entry, which lives in this document.
- No other document may add a brand concept to the inventory or redefine a brand concept's existence or identity.
- Other documents reference the brand concepts recorded here and never restate them.
- The definition of each brand term is owned by knowledge/brand/README.md.
- The standard for each brand concept is owned by that concept's own document under knowledge/brand/.
- Company, product, and marketing facts are owned by their namespaces and are only referenced here.
- Produced assets and implementation belong outside this inventory, in the asset systems and the codebase.

# Reuse

Existing brand concepts are reused. A duplicate brand concept is never created. When a contributor needs a brand concept that already exists, they reference the existing identity recorded here rather than creating a new one. Before adding a brand concept, a contributor confirms that no existing entry already records it, following the contribution process in knowledge/CONTRIBUTING.md.

# Repository Growth

New brand concepts are added by extending this inventory. Each new brand concept is a new entry under the appropriate group, using the same thin structure, and it points to the document that owns its standard. The structure of this document does not change as the number of brand concepts grows, existing brand concept identities never change, and growth is always additive. The namespace supports an unlimited number of brand concepts.

# Brand Concept Inventory

Each brand concept below states what it is at the level of identity, its scope as an inventory entry, what belongs elsewhere, and the documents that own its definition and its standard. No entry defines the concept or states its standard, values, or content.

## Verbal Identity

**Voice**
- Name. Voice.
- Description. A brand concept whose definition is owned by knowledge/brand/README.md.
- Out of Scope. The definition of the term, owned by knowledge/brand/README.md, and the voice standard, owned by the future document knowledge/brand/voice.md.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/voice.md.

**Tone**
- Name. Tone.
- Description. A brand concept whose definition is owned by knowledge/brand/README.md.
- Out of Scope. The definition of the term, owned by knowledge/brand/README.md, and the tone standard, owned by the future document knowledge/brand/tone.md.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/tone.md.

**Vocabulary**
- Name. Vocabulary.
- Description. The organization's standard terminology and word choice.
- Out of Scope. The vocabulary standard, including approved and avoided terms, owned by the future document knowledge/brand/vocabulary.md.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/vocabulary.md.

**Naming**
- Name. Naming.
- Description. A brand concept whose definition is owned by knowledge/brand/README.md.
- Out of Scope. The definition of the term, owned by knowledge/brand/README.md, the naming standard, owned by the future document knowledge/brand/naming.md, and the names of things, owned by their canonical documents.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/naming.md.

**Messaging**
- Name. Messaging.
- Description. A brand concept whose definition is owned by knowledge/brand/README.md.
- Out of Scope. The definition of the term, owned by knowledge/brand/README.md, the messaging standard, owned by the future document knowledge/brand/messaging.md, the facts expressed, owned by knowledge/product/ and knowledge/company/, and marketing and positioning strategy, owned by the Marketing namespace.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/messaging.md.

## Visual Identity

**Logo**
- Name. Logo.
- Description. The organization's primary visual mark.
- Out of Scope. The logo standard, owned by the future document knowledge/brand/logo.md, and any logo asset or file, owned by the asset systems.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/logo.md.

**Color**
- Name. Color.
- Description. The organization's use of color in its presentation.
- Out of Scope. The color standard, including any specific values, owned by the future document knowledge/brand/color.md, and color implementation, owned by the codebase and asset systems.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/color.md.

**Typography**
- Name. Typography.
- Description. The organization's use of type in its presentation.
- Out of Scope. The typography standard, including any specific typefaces, owned by the future document knowledge/brand/typography.md, and font files and implementation, owned by the codebase and asset systems.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/typography.md.

**Imagery**
- Name. Imagery.
- Description. The organization's use of images and visual style in its presentation.
- Out of Scope. The imagery standard, owned by the future document knowledge/brand/imagery.md, and image assets, owned by the asset systems.
- Related Knowledge. knowledge/brand/README.md, knowledge/brand/imagery.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/brand/README.md
- knowledge/company/company.md
- knowledge/product/features.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now and describe no defect.

- Owning standard documents. Each entry references a document under knowledge/brand/ that owns the concept's standard. Those documents are created over time, following knowledge/brand/README.md and knowledge/CONTRIBUTING.md. Until each exists, the reference to it is an intentional forward reference.
- Downstream namespaces. This inventory references the Marketing namespace as the owner of marketing and positioning strategy. That namespace is created over time under knowledge/marketing/, and the reference is an intentional forward reference that expresses the planned architecture, as permitted by knowledge/README.md.
- New brand concepts. If Open Lance ever recognizes a further brand concept, for example a motion or sound standard, it is added here as a new entry under the appropriate group and points to the document that will own its standard, without changing this document's structure.
