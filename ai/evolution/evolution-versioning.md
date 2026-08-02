---
id: OL-AI-EVOLUTION-EVOLUTION-VERSIONING
document: ai/evolution/evolution-versioning.md

title: Open Lance AIOS Evolution Versioning

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/evolution/README.md
  - ai/evolution/evolution.md
  - ai/governance/change-governance.md
  - ai/architecture/repository-evolution.md

used_by:
  - AI Systems Architect
  - Any AI agent that maintains or extends the AI layer
  - All human governors
  - Any contributor to the Evolution namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns version evolution, compatibility across generations, and constitutional
  evolution governance consumption. It owns evolution versioning only, and defers
  the compatibility relationships a version preserves and the document version
  field and workflow to their owners.
---

# Open Lance AIOS Evolution Versioning

This document owns how the architecture is versioned across generations. It is an evolution document at the Specification authority level defined in ai/README.md, and it follows the Evolution Document Standard in ai/evolution/README.md. It instantiates the evolution invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns evolution versioning only. It never defines the compatibility relationships a version preserves, owned by ai/evolution/compatibility-management.md, and it never defines the document version field and amendment workflow, owned by ai/CONTRIBUTING.md.

# Purpose

This document owns one evolution concern: how the architecture as a whole is versioned across generations, how compatibility is kept across those generations, and how such versioning is governed as constitutional change. It exists so that any human or AI agent can determine how the architecture advances from one generation to the next without breaking what depends on earlier ones, independent of the compatibility relationships and the document-level version workflow.

# Principles

These are the enduring principles for evolution versioning. Each instantiates an evolution invariant owned by ai/evolution/README.md.

- The architecture is versioned across generations. The architecture advances through defined generations, so a change of generation is identified and traceable, distinct from a single document's version.
- Change is governed. A change of generation evolves only under the change rules owned by ai/governance/change-governance.md, never arbitrarily.
- Compatibility spans generations. A new generation preserves compatibility with the prior one, or migrates and deprecates the superseded part, so a dependent on an earlier generation is never silently broken.
- Versioning changes the architecture, not behavior. Versioning advances the architecture and never changes the behavior of a namespace or the business truth of the knowledge repository.

# Specification

The architecture is versioned across generations in the following way. This document owns evolution versioning; the compatibility relationships a version preserves are owned by ai/evolution/compatibility-management.md, and the version field and amendment workflow of a single document are owned by ai/CONTRIBUTING.md.

- Version evolution. The architecture advances through defined generations, each a coherent state of the architecture recorded in ai/architecture/repository-evolution.md. A generation is identified so that a change from one generation to the next is explicit and traceable. This document owns the versioning of the architecture across generations; the version of a single document is owned by ai/CONTRIBUTING.md.
- Compatibility across generations. A new generation preserves compatibility with the prior generation where it can, under ai/evolution/compatibility-management.md; where it cannot, the incompatible part is migrated under ai/evolution/migration-model.md and deprecated under ai/evolution/deprecation-model.md, so a consumer of an earlier generation is migrated deliberately and never broken silently.
- Constitutional evolution governance. A change of generation is governed as constitutional change under ai/governance/change-governance.md and approved under the human governance owned by ai/governance/human-oversight.md, because advancing the architecture is a significant, human-accountable change. This document applies those rules and never restates them.
- Behavior-preserving. Versioning the architecture advances its structure and never changes the behavior of a namespace, which each namespace owns, nor the business truth or generation of the knowledge repository, which the knowledge repository owns.

Evolution versioning advances the architecture across governed, compatible generations; the compatibility relationships and the document-level version workflow are owned elsewhere. Versioning is deterministic in outcome and holds across decades of growth.

# Invariants

- The architecture advances through defined, identified generations, distinct from a single document's version.
- A change of generation evolves only under the governed change rules and human governance.
- A new generation preserves compatibility with the prior one, or migrates and deprecates the superseded part, never breaking a dependent silently.
- Versioning the architecture never changes the behavior of a namespace or the business truth of the knowledge repository.
- Versioning the architecture never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.

# Boundaries

This document owns evolution versioning only. It owns none of the following, and references each by its canonical owner.

- The compatibility relationships a generation preserves: ai/evolution/compatibility-management.md.
- The migration and deprecation of an incompatible part across generations: ai/evolution/migration-model.md and ai/evolution/deprecation-model.md.
- The version field and amendment workflow of a single document: ai/CONTRIBUTING.md.
- The change rules and human governance of a generation change: ai/governance/change-governance.md and ai/governance/human-oversight.md.
- The record of the current generation of the architecture: ai/architecture/repository-evolution.md.
- The versioning and generation of the knowledge repository: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evolution/README.md
- ai/evolution/evolution.md
- ai/evolution/compatibility-management.md
- ai/evolution/migration-model.md
- ai/evolution/deprecation-model.md
- ai/governance/change-governance.md
- ai/governance/human-oversight.md
- ai/architecture/repository-evolution.md
