---
id: OL-KNOW-BRAND-TYPOGRAPHY
document: knowledge/brand/typography.md

title: Open Lance Typography Standard

version: 1.0
status: Frozen

document_type: normative
authority: Policy

owner: Founder
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/brand/README.md
  - knowledge/brand/brand.md
  - knowledge/company/company.md
  - knowledge/company/principles.md

used_by:
  - CMO Agent
  - Content Marketing Director
  - AI Copywriter
  - SEO Director
  - Social Media Manager
  - Any AI Agent that produces outward-facing communication
  - Any contributor to the Brand namespace

provenance:
  - Derived from knowledge/brand/README.md and the Open Lance brand

loading_priority: Required

summary: >
  The durable standard for Open Lance's typography: the character of the
  type, its hierarchy, and its legibility. It owns the typography standard
  only, and defers font files, weights, loading, and rendering to the
  codebase and asset systems.
---

# Open Lance Typography Standard

This document owns the Typography standard for Open Lance: the character of the type, how hierarchy is set, and the legibility it must keep. It is a brand standard document within the Brand namespace, and it follows the Brand Document Standard defined in knowledge/brand/README.md. This document owns the standard only. The specific font files, weights, loading, and rendering are owned by the codebase and asset systems, and the color applied to type is owned by knowledge/brand/color.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the standard for how Open Lance sets type. Its purpose is that text always reads as Open Lance and always reads easily, in any medium, whoever or whatever sets it.

# Standard

Open Lance sets type by the following durable rules, stated by character and role rather than by file.

- Primary typeface. Nearly all communication is set in a clean, humanist sans-serif, chosen for clarity and quiet warmth. The character of the typeface is what matters: neutral, highly legible, and friendly without being decorative. The current expression of this standard is the Inter typeface.
- Monospace typeface. Code, precise data, and technical detail are set in a legible monospace, so that exact characters read unambiguously. The current expression of this standard is the JetBrains Mono typeface.
- Hierarchy is clear and restrained. Headings are confident and tightly set; body text is highly legible at a comfortable reading size; hierarchy is signaled by a small, deliberate set of sizes and weights, never by many competing ones.
- Emphasis labels are used sparingly. Small, uppercase, wide-tracked labels, set in the brand's primary color, may mark a section; they are an accent, not a habit.
- Legibility comes first. Comfortable line length and spacing, a body size that reads easily, and sufficient contrast are never traded away for decoration.
- Restraint. The type system is small. New typefaces, sizes, and weights are not added casually.

# Rationale

Type carries almost every word the organization says, so it must sound like the voice, owned by knowledge/brand/voice.md, looks. A humanist sans expresses the warm, plain, human character of that voice; a clear, restrained hierarchy expresses the simplicity the organization commits to in knowledge/company/principles.md; and putting legibility first expresses fairness and accessibility, because type everyone can read is part of a fair marketplace. A separate monospace for data and code expresses precision where money and technical accuracy are at stake, owned by knowledge/company/mission.md.

# Application

The typography standard applies wherever text appears, in every medium: screens, print, presentations, documents, and social. When setting text, a contributor or agent uses the primary typeface for communication and the monospace for code and precise data, keeps hierarchy small and clear, and protects legibility and contrast. This document states the standard by character and role; the font files, weights, loading, and rendering that realize it are owned by the codebase and asset systems, and it never itself produces an Output.

# Boundaries

This document owns the typography standard only. It owns none of the following.

- The identity of the Typography concept in the brand inventory: knowledge/brand/brand.md.
- The font files, weights, loading, and rendering: the codebase and asset systems, not the knowledge repository.
- The color applied to type: knowledge/brand/color.md.
- The typeface as used in the logo wordmark, governed for logo use: knowledge/brand/logo.md.
- Voice, tone, vocabulary, and messaging expressed in words: their documents under knowledge/brand/.
- Company identity and principles: the documents in knowledge/company/.
- Marketing and campaign typographic treatment: the Marketing namespace, knowledge/marketing/.
- Produced content and assets: the Output level of the knowledge hierarchy and the asset systems.

# Related Knowledge

- knowledge/brand/README.md
- knowledge/brand/brand.md
- knowledge/brand/color.md
- knowledge/brand/logo.md
- knowledge/brand/voice.md
- knowledge/company/mission.md
- knowledge/company/principles.md
