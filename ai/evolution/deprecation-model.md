---
id: OL-AI-EVOLUTION-DEPRECATION-MODEL
document: ai/evolution/deprecation-model.md

title: Open Lance AIOS Deprecation Model

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
  Owns the deprecation lifecycle, the replacement model, and retirement rules. It
  owns the deprecation model only, and defers the migration to a replacement and
  the retirement phase of the evolution lifecycle to their owners.
---

# Open Lance AIOS Deprecation Model

This document owns the deprecation model. It is an evolution document at the Specification authority level defined in ai/README.md, and it follows the Evolution Document Standard in ai/evolution/README.md. It instantiates the evolution invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the deprecation model only. It never defines the migration to a replacement, owned by ai/evolution/migration-model.md, and it never defines the retirement phase of the evolution lifecycle, owned by ai/evolution/evolution-lifecycle.md.

# Purpose

This document owns one evolution concern: how a superseded part of the architecture is deprecated and retired, expressed as the deprecation lifecycle, the model by which a replacement supersedes it, and the rules under which it is finally retired. It exists so that any human or AI agent can determine how a part of the architecture is safely wound down, independent of the migration to its replacement and of the lifecycle's retirement phase.

# Principles

These are the enduring principles for deprecation. Each instantiates an evolution invariant owned by ai/evolution/README.md.

- Deprecation precedes retirement. A part is deprecated, and its dependents migrated, before it is retired; nothing is removed while still depended on.
- Deprecation is announced, not silent. A deprecation is explicit and recorded, so dependents know a part is being wound down and can migrate.
- A replacement is defined before deprecation. A part is deprecated in favor of a defined replacement, so there is always a path forward, not a gap.
- Retirement follows defined rules. A part is retired only when its retirement rules are met, so retirement is deliberate and never premature.

# Specification

A superseded part is deprecated and retired in the following way. This document owns the deprecation lifecycle, the replacement model, and retirement rules; the migration to a replacement is owned by ai/evolution/migration-model.md, and the retirement phase of the evolution lifecycle is owned by ai/evolution/evolution-lifecycle.md.

- The deprecation lifecycle. A part passes from active to deprecated to retired: it is marked deprecated once a replacement exists, it remains available and compatible while its dependents migrate under ai/evolution/migration-model.md, and it is retired only when no dependent remains. This document owns the deprecation states and their order.
- The replacement model. A part is deprecated in favor of a defined replacement, and dependents are directed to the replacement, so deprecation always offers a path forward. This document owns that a replacement is defined and that dependents move to it; the migration itself is owned by ai/evolution/migration-model.md.
- Retirement rules. A deprecated part is retired only when its retirement rules are met: a replacement exists, every dependent has migrated, and its compatibility guarantees under ai/evolution/compatibility-management.md have been released. A part that still has a dependent is not retired.
- Announced and recorded. A deprecation and a retirement are explicit and recorded against the current architecture in ai/architecture/repository-evolution.md, so the winding down of a part is never silent and the maturity map reflects it.

Deprecation winds a superseded part down safely toward retirement; the migration to its replacement and the lifecycle's retirement phase are owned elsewhere. Deprecation is deterministic in its lifecycle and holds across decades of growth.

# Invariants

- A part is deprecated, and its dependents migrated, before it is retired.
- A deprecation is explicit and recorded, never silent.
- A part is deprecated only in favor of a defined replacement, so there is always a path forward.
- A part is retired only when a replacement exists and no dependent remains.
- Deprecating a part never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.

# Boundaries

This document owns the deprecation model only. It owns none of the following, and references each by its canonical owner.

- The migration of dependents to a replacement: ai/evolution/migration-model.md.
- The retirement phase of the evolution lifecycle: ai/evolution/evolution-lifecycle.md.
- The compatibility guarantees released at retirement: ai/evolution/compatibility-management.md.
- The recording of a deprecation in the maturity map: ai/architecture/repository-evolution.md.
- The governed approval of a deprecation: ai/governance/change-governance.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evolution/README.md
- ai/evolution/evolution.md
- ai/evolution/migration-model.md
- ai/evolution/evolution-lifecycle.md
- ai/evolution/compatibility-management.md
- ai/architecture/repository-evolution.md
- ai/governance/change-governance.md
