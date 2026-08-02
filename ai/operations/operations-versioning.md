---
id: OL-AI-OPERATIONS-OPERATIONS-VERSIONING
document: ai/operations/operations-versioning.md

title: Open Lance AIOS Operations Versioning

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
  - ai/operations/README.md
  - ai/operations/operations.md
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that operates the layer
  - Any contributor to the Operations namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns operational evolution, migration, compatibility, and deprecation. It owns
  operations versioning only, and defers the maintenance that applies a change
  and the document amendment workflow to their owners.
---

# Open Lance AIOS Operations Versioning

This document owns how an operational definition is versioned and evolves. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns operations versioning only. It never defines the maintenance that applies a change, owned by ai/operations/maintenance.md, and it never defines the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Purpose

This document owns one operational concern: how an operational definition, including a signal, a health model, an incident classification, and a runtime-artifact version the layer runs, is versioned, evolves, migrates, and is deprecated over time, so that operating the layer stays consistent without changing what the layer does. It exists so that any human or AI agent can determine how operating changes safely, independent of the maintenance that applies a change.

# Principles

These are the enduring principles for operations versioning. Each instantiates an operational invariant owned by ai/operations/README.md.

- An operational definition is versioned. An operational definition and a runtime-artifact version the layer runs carry a version, so a change is identified and traceable.
- Change is governed. An operational definition evolves only under the change rules owned by ai/governance/, never arbitrarily.
- Compatibility is preserved or migrated. A change that keeps operating consistent is absorbed; a change that breaks it is versioned and migrated, so operation is never silently disrupted.
- Versioning changes operation, not behavior. Versioning changes how the layer is operated and never changes the behavior of any namespace.

# Specification

An operational definition is versioned and evolves in the following way. This document owns operations versioning; the maintenance that applies a change is owned by ai/operations/maintenance.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Version rules. An operational definition, a signal under ai/operations/observability.md, a health model under ai/operations/health-management.md, an incident classification under ai/operations/incident-management.md, and a runtime-artifact version the layer runs carry a version that identifies it, so a change is explicit and traceable.
- Operational evolution. An operational definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the operational model grows without redesign. Evolution changes how the layer is operated and never changes the behavior of a namespace or rewrites business truth.
- Migration. A change that breaks operating consistency is issued as a new version and migrated deliberately, applied through maintenance under ai/operations/maintenance.md, so there is never a window in which the layer is operated inconsistently.
- Compatibility and deprecation. A change is compatible when the operation stays consistent under it; an incompatible change is versioned and migrated, and a superseded operational definition or runtime-artifact version is deprecated rather than abruptly removed, remaining available until each dependent is migrated, so deprecation never disrupts operation silently.

Versioning keeps an operational definition identified, governed, and consistent as it evolves, without changing behavior; the maintenance that applies a change and the amendment workflow are owned elsewhere. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- An operational definition and a runtime-artifact version carry a version, so a change is explicit and traceable.
- An operational definition evolves only under the governed change rules.
- A change that breaks operating consistency is versioned and migrated, never applied silently.
- Versioning changes how the layer is operated and never changes the behavior of a namespace.
- Versioning an operational definition never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns operations versioning only. It owns none of the following, and references each by its canonical owner.

- The maintenance that applies a versioned change: ai/operations/maintenance.md.
- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The document amendment workflow: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The runtime behavior a runtime-artifact version runs: ai/runtime/.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/maintenance.md
- ai/operations/observability.md
- ai/operations/health-management.md
- ai/operations/incident-management.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
