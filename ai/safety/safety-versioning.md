---
id: OL-AI-SAFETY-SAFETY-VERSIONING
document: ai/safety/safety-versioning.md

title: Open Lance AIOS Safety Versioning

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
  - ai/safety/README.md
  - ai/safety/safety.md
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns safety evolution, compatibility, migration, version rules, backward
  compatibility, deprecation, and constitutional amendment of safety. It owns
  safety versioning only, and defers the document amendment workflow and the
  repository evolution map to their owners.
---

# Open Lance AIOS Safety Versioning

This document owns how the safety model is versioned and evolves. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns safety versioning only. It never defines the document amendment workflow, owned by ai/CONTRIBUTING.md, and it never defines the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Purpose

This document owns one safety concern: how the safety model changes over time, how versions stay compatible, and how a change is migrated and, where it rises to the constitution, amended, all without a change ever lowering protection. It exists so that any human or AI agent can determine how safety evolves safely, independent of how the change is carried out.

# Principles

These are the enduring principles for safety versioning. Each instantiates a safety invariant owned by ai/safety/README.md.

- A change never lowers protection. Safety evolves only in ways that preserve or strengthen protection; a change that would weaken it is not made outside a sanctioned constitutional amendment.
- Safety is versioned. Each safety definition carries a version, so a change is identified and traceable.
- Change is governed. The safety model evolves only under the change rules owned by ai/governance/, never arbitrarily.
- Compatibility is preserved or migrated. A compatible change preserves existing protection; an incompatible one is migrated deliberately, so no protection is silently broken.

# Specification

The safety model is versioned and evolves in the following way. This document owns safety versioning; the permission to change is owned by ai/governance/change-governance.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Version rules. Each safety definition, a principle, a risk model, a hazard category, or a protective response, carries a version that identifies it, so a change is explicit and traceable, and what depends on it, including the risk inheritance owned by ai/safety/risk-classification.md, can be determined.
- Safety evolution. The safety model evolves by governed change under ai/governance/change-governance.md, additively where possible, so protection grows without redesign. A change never lowers protection; strengthening protection is preferred, and a weakening change is made only through a sanctioned constitutional amendment.
- Backward compatibility. A change is backward compatible when existing protections still hold under it; such a change preserves compatibility. A change that existing protections cannot absorb is incompatible and is versioned and migrated, never applied silently.
- Migration. An incompatible change is migrated deliberately: the new version is adopted in a controlled way that maintains protection throughout, so there is never a window in which protection is lowered.
- Deprecation. A superseded safety definition is deprecated rather than abruptly removed, and it continues to protect until every dependent is migrated, so deprecation never opens a protection gap.
- Constitutional amendment of safety. A change to safety that rises to the constitution follows the amendment workflow owned by ai/CONTRIBUTING.md, including the emergency amendment path for urgent safety corrections. This document owns that a constitutional safety change is versioned and migrated; the amendment workflow itself is owned by ai/CONTRIBUTING.md.

Safety versioning keeps the safety model identified, governed, and compatible as it evolves, without ever lowering protection; the amendment workflow and the repository evolution map are owned elsewhere. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- A change to safety never lowers protection outside a sanctioned constitutional amendment.
- Each safety definition carries a version, so a change is explicit and traceable.
- An incompatible change is versioned and migrated, never applied silently.
- A deprecated safety definition continues to protect until every dependent is migrated.
- Versioning safety never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns safety versioning only. It owns none of the following, and references each by its canonical owner.

- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The document amendment and emergency amendment workflow: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The risk inheritance and compatibility a version tracks: ai/safety/risk-classification.md.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/risk-classification.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
