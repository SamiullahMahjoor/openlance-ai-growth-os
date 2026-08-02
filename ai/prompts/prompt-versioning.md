---
id: OL-AI-PROMPTS-PROMPT-VERSIONING
document: ai/prompts/prompt-versioning.md

title: Open Lance AIOS Prompt Versioning

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
  - ai/prompts/README.md
  - ai/prompts/prompts.md
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns prompt versioning, evolution, change governance consumption, and version
  compatibility. It owns prompt versioning only, and defers the document
  amendment workflow and the repository evolution map to their owners.
---

# Open Lance AIOS Prompt Versioning

This document owns how a prompt definition is versioned and evolves. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns prompt versioning only. It never defines the document amendment workflow, owned by ai/CONTRIBUTING.md, and it never defines the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Purpose

This document owns one prompt concern: how a prompt definition is versioned, how it evolves over time under governed change, and how versions remain compatible with the prompts that depend on them. It exists so that any human or AI agent can determine how a prompt definition changes without breaking the prompts that derive from it, independent of how the change is carried out.

# Principles

These are the enduring principles for prompt versioning. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- A prompt definition is versioned. A durable prompt definition, layer, template, or base prompt carries a version, so a change is identified and traceable.
- Change is governed. A prompt definition evolves only under the change rules owned by ai/governance/, never arbitrarily and never as a side effect of composing a prompt.
- Compatibility is preserved or versioned. A change that a derived prompt can still depend on preserves compatibility; a change that a derived prompt cannot is a new version, so a dependent prompt is never silently broken.
- Versioning governs definitions, not truth. Versioning applies to prompt architecture, never to business truth, which is versioned by the knowledge repository, and never to a composed prompt, which is transient.

# Specification

A prompt definition is versioned and evolves in the following way. This document owns prompt versioning; the permission to change is owned by ai/governance/change-governance.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Prompt versioning. A durable prompt definition, a layer, a template, or a base prompt carries a version that identifies it, so a change to it is explicit and traceable, and the dependency model owned by ai/prompts/prompt-inheritance.md can determine what depends on it.
- Prompt evolution. A prompt definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the prompt model grows without redesign. Evolution never rewrites business truth and never promotes a prompt into the knowledge repository.
- Version compatibility. A change is compatible when a prompt that depends on the changed definition still composes correctly against it; such a change preserves the version's compatibility. A change that a dependent prompt cannot absorb is issued as a new version, and the dependent prompt is migrated to it deliberately, never broken silently.
- Change governance and conflict. What change is permitted, reviewed, and approved is owned by ai/governance/change-governance.md, which this document applies and never restates. A change that would conflict with a higher-authority definition is resolved by the conflict resolution owned by ai/prompts/prompt-inheritance.md.

Versioning keeps prompt definitions identified, governed, and compatible as they evolve; the versioning of a document in this namespace, and of the repository, are owned by ai/CONTRIBUTING.md and ai/architecture/repository-evolution.md. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- A durable prompt definition carries a version, so a change to it is explicit and traceable.
- A prompt definition evolves only under the governed change rules, never arbitrarily and never as a side effect of composition.
- A change that a dependent prompt cannot absorb is a new version, so no dependent prompt is broken silently.
- Versioning applies to prompt architecture, never to business truth and never to a transient composed prompt.
- Versioning a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns prompt versioning only. It owns none of the following, and references each by its canonical owner.

- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The amendment workflow for a document in this namespace: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The dependency model and conflict resolution a version relies on: ai/prompts/prompt-inheritance.md.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-inheritance.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
