---
id: OL-AI-OPERATIONS-MAINTENANCE
document: ai/operations/maintenance.md

title: Open Lance AIOS Maintenance

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that operates the layer
  - Any contributor to the Operations namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the maintenance model, maintenance categories, and the maintenance
  lifecycle of a maintenance activity. It owns maintenance only, and defers the
  maintenance phase of the layer's operation and the versioning it may apply to
  their owners.
---

# Open Lance AIOS Maintenance

This document owns the maintenance model. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns maintenance only. It never defines the maintenance phase of the layer's operation, owned by ai/operations/operations-lifecycle.md, and it never defines the versioning a maintenance may apply, owned by ai/operations/operations-versioning.md.

# Purpose

This document owns one operational concern: how a maintenance activity is modelled, the categories maintenance falls into, and the lifecycle of a single maintenance activity. It exists so that any human or AI agent can determine how the running layer is kept in good order, without changing its behavior, independent of the operational phase in which maintenance occurs and of the versioning a maintenance applies.

# Principles

These are the enduring principles for maintenance. Each instantiates an operational invariant owned by ai/operations/README.md.

- Maintenance upkeeps operation; it never changes behavior. A maintenance activity keeps the running of the layer in good order and never changes the behavior of any namespace.
- Maintenance is categorized. Every maintenance activity falls into a defined category, so its intent is explicit, never ad hoc.
- Maintenance is governed and validated. A maintenance activity occurs within the rules owned by ai/governance/ and is bounded by the limits owned by ai/safety/, and never bypasses them.
- Maintenance follows a defined lifecycle. A maintenance activity has a defined beginning and end, so it is planned, carried out, and completed rather than left open.

# Specification

A maintenance activity is modelled in the following way. This document owns the maintenance model, categories, and lifecycle of an activity; the maintenance phase of the layer's operation is owned by ai/operations/operations-lifecycle.md, and the versioning a maintenance applies is owned by ai/operations/operations-versioning.md.

- The maintenance model. A maintenance activity is a defined operational action that keeps the running of the layer in good order, drawing on a diagnosis under ai/operations/diagnostics.md where it addresses a problem. This document owns how a maintenance activity is modelled; it never changes the behavior of a namespace, which each namespace owns.
- Maintenance categories. A maintenance activity falls into a defined category by its intent: corrective maintenance that restores operation after a problem, preventive maintenance that keeps operation from degrading, and adaptive maintenance that keeps operation aligned as the layer evolves under the Evolution namespace. The categories describe intent; they may be extended additively under this document.
- Maintenance lifecycle of an activity. A single maintenance activity has a defined lifecycle: it is planned, validated for permission and safety, carried out, and completed, then recorded. This is the lifecycle of one activity, distinct from the maintenance phase of the layer's operation owned by ai/operations/operations-lifecycle.md.
- Governed and behavior-preserving. A maintenance activity is permitted under ai/governance/ and bounded by ai/safety/, and it never changes the behavior of a namespace; where it applies a change to an operational definition, that change is versioned under ai/operations/operations-versioning.md. Maintenance keeps operation well; it never alters what the layer does.

Maintenance keeps the running layer in good order through categorized, governed activities; the operational phase in which maintenance occurs and the versioning it applies are owned elsewhere. Maintenance is deterministic in its categorization and the same at any scale.

# Invariants

- A maintenance activity keeps operation in good order and never changes the behavior of a namespace.
- Every maintenance activity falls into a defined category by its intent.
- A maintenance activity is permitted under governance and bounded by safety, and follows a defined lifecycle from plan to completion.
- A change a maintenance applies to an operational definition is versioned under ai/operations/operations-versioning.md.
- Maintaining operation never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns maintenance only. It owns none of the following, and references each by its canonical owner.

- The maintenance phase of the layer's operation: ai/operations/operations-lifecycle.md.
- The diagnosis a corrective maintenance rests on: ai/operations/diagnostics.md.
- The versioning a maintenance applies: ai/operations/operations-versioning.md.
- The permission and the limits a maintenance respects: ai/governance/ and ai/safety/.
- The evolution of the layer a maintenance keeps operation aligned with: the Evolution namespace.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/operations-lifecycle.md
- ai/operations/diagnostics.md
- ai/operations/operations-versioning.md
- ai/safety/README.md
