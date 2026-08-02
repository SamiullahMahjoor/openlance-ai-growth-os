---
id: OL-AI-EVOLUTION-COMPATIBILITY-MANAGEMENT
document: ai/evolution/compatibility-management.md

title: Open Lance AIOS Compatibility Management

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

used_by:
  - AI Systems Architect
  - Any AI agent that maintains or extends the AI layer
  - All human governors
  - Any contributor to the Evolution namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the compatibility relationships, compatibility guarantees, and
  compatibility preservation across architectural evolution. It owns
  compatibility management only, and defers the migration of an incompatible
  change and a namespace's own internal compatibility to their owners.
---

# Open Lance AIOS Compatibility Management

This document owns compatibility across architectural evolution. It is an evolution document at the Specification authority level defined in ai/README.md, and it follows the Evolution Document Standard in ai/evolution/README.md. It instantiates the evolution invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns compatibility management only. It never defines the migration of an incompatible change, owned by ai/evolution/migration-model.md, and it never defines a namespace's own internal compatibility, owned by that namespace.

# Purpose

This document owns one evolution concern: how compatibility is preserved as the architecture evolves, expressed as the compatibility relationships between parts of the architecture, the guarantees compatibility provides, and how those guarantees are preserved across change. It exists so that any human or AI agent can determine whether an architectural change keeps the architecture compatible, independent of how an incompatible change is migrated.

# Principles

These are the enduring principles for compatibility management. Each instantiates an evolution invariant owned by ai/evolution/README.md.

- Compatibility is a defined relationship. Compatibility between parts of the architecture is a defined relation, so whether a change preserves it is determined, never assumed.
- Compatibility is preserved by default. A change preserves compatibility unless it is deliberately an incompatible, superseding change, which is migrated and deprecated.
- A guarantee is honored across change. A compatibility guarantee, once made, is honored until it is deliberately retired through migration and deprecation, so nothing that depends on it breaks silently.
- Compatibility spans the architecture. Compatibility management governs compatibility between namespaces and across generations of the architecture, above any single namespace's own internal compatibility.

# Specification

Compatibility across evolution is managed in the following way. This document owns the compatibility relationships, guarantees, and preservation; the migration of an incompatible change is owned by ai/evolution/migration-model.md, and a namespace's own internal compatibility is owned by that namespace.

- Compatibility relationships. A compatibility relationship holds between parts of the architecture when a change to one does not break what depends on it, following the dependency direction owned by ai/architecture/dependency-map.md. This document owns the architecture-wide relationships; the internal compatibility of a namespace, such as a provider, tool, or evaluation version, is owned by that namespace.
- Compatibility guarantees. A compatibility guarantee states what a part of the architecture promises to keep stable for what depends on it, so that dependents can rely on it across change. A guarantee is explicit and is honored until deliberately retired.
- Compatibility preservation. A change preserves compatibility when the guarantees the changed part makes still hold under it. A change that preserves them is compatible and is introduced additively under ai/evolution/evolution-lifecycle.md; a change that breaks them is incompatible and is not introduced silently, but migrated under ai/evolution/migration-model.md and the superseded part deprecated under ai/evolution/deprecation-model.md.
- No silent break. Because compatibility is preserved or the change is migrated and deprecated, a dependent is never silently broken by evolution. An incompatible change that has not been migrated does not proceed.

Compatibility management preserves the compatibility of the architecture across change; the migration of an incompatible change and each namespace's internal compatibility are owned elsewhere. Compatibility determination is deterministic and holds across decades of growth.

# Invariants

- Compatibility between parts of the architecture is a defined relationship, never assumed.
- A change preserves compatibility, or is an incompatible change that is migrated and deprecated, never introduced silently.
- A compatibility guarantee is honored until deliberately retired through migration and deprecation.
- Compatibility management governs compatibility across the architecture, above any single namespace's internal compatibility.
- Managing compatibility never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.

# Boundaries

This document owns compatibility management only. It owns none of the following, and references each by its canonical owner.

- The migration of an incompatible change: ai/evolution/migration-model.md.
- The deprecation of a superseded part: ai/evolution/deprecation-model.md.
- The additive introduction of a compatible change: ai/evolution/evolution-lifecycle.md.
- The dependency direction compatibility follows: ai/architecture/dependency-map.md.
- A namespace's own internal compatibility: that namespace, including ai/providers/provider-compatibility.md, ai/tools/tool-compatibility.md, and ai/evaluation/evaluation-compatibility.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evolution/README.md
- ai/evolution/evolution.md
- ai/evolution/migration-model.md
- ai/evolution/deprecation-model.md
- ai/evolution/evolution-lifecycle.md
- ai/architecture/dependency-map.md
