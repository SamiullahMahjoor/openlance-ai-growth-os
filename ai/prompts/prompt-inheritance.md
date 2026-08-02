---
id: OL-AI-PROMPTS-PROMPT-INHERITANCE
document: ai/prompts/prompt-inheritance.md

title: Open Lance AIOS Prompt Inheritance

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the inheritance hierarchy and dependency model of prompts, and prompt
  conflict resolution. It owns prompt inheritance only, and defers the
  composition of a single prompt and the Authority Hierarchy to their owners.
---

# Open Lance AIOS Prompt Inheritance

This document owns how one prompt derives from another. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns prompt inheritance only. It never defines the composition of a single prompt, owned by ai/prompts/prompt-composition.md, and it never defines the Authority Hierarchy conflicts resolve by, owned by ai/README.md.

# Purpose

This document owns one prompt concern: how a prompt inherits from a more general base prompt, the dependency this creates, and how conflicts among inherited parts are resolved. It exists so that any human or AI agent can determine how prompts share a common base and how overlaps are settled, independent of how any prompt is composed.

# Principles

These are the enduring principles for prompt inheritance. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- Inheritance is derivation, not duplication. A prompt derives shared parts from a base prompt rather than restating them, so common structure is defined once.
- The hierarchy descends from general to specific. A base prompt holds the more general parts, and a derived prompt adds the more specific, so specificity increases down the hierarchy.
- A derived prompt depends on its base. A prompt depends on the base prompts and shared definitions it derives from, and that dependency is explicit and traceable.
- Conflicts resolve by authority, then owner, then specificity. Where inherited parts conflict, the higher authority wins; where authority is equal, the single owner governs; where still unresolved, the more specific derived part governs, and an unresolvable conflict is escalated rather than guessed.

# Specification

Prompt inheritance is defined in the following way. This document owns the inheritance hierarchy, the dependency model, and conflict resolution; the composition of a single prompt is owned by ai/prompts/prompt-composition.md, and the Authority Hierarchy conflicts resolve by is owned by ai/README.md.

- The inheritance hierarchy. A prompt may derive from a base prompt, which may itself derive from a more general base, forming a hierarchy from general to specific. A derived prompt inherits the base's layers and adds or specializes its own, so shared structure is defined once and specialized where needed.
- The dependency model. A derived prompt depends on the base prompts and shared definitions it derives from. These dependencies are explicit and traceable, so the effect of changing a base is known through the versioning owned by ai/prompts/prompt-versioning.md, and a prompt is composed with its base resolved first under ai/prompts/prompt-assembly.md.
- Conflict resolution. Where inherited and derived parts conflict, resolution follows a fixed precedence: the part of higher authority wins, applying the Authority Hierarchy owned by ai/README.md; where authority is equal, the single owner of the concern governs, applying the ownership owned by ai/architecture/ownership-map.md; where still equal, the more specific derived part governs the more general base. This mirrors the conflict resolution of the knowledge repository and never invents a resolution.
- Unresolvable conflict. A conflict that cannot be resolved by this precedence is not guessed; the prompt is not composed and the matter is escalated under ai/governance/escalation.md.

Inheritance defines how prompts derive from one another and how overlaps are settled; the combination of the resolved parts into one prompt is owned by ai/prompts/prompt-composition.md. Inheritance and its resolution are deterministic and the same at any scale.

# Invariants

- A derived prompt inherits shared parts from its base rather than restating them.
- A derived prompt depends explicitly and traceably on the base prompts it derives from.
- A conflict among parts resolves by higher authority, then single owner, then greater specificity.
- An unresolvable conflict is escalated, never guessed, and yields no composed prompt.
- Resolving inheritance never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns prompt inheritance only. It owns none of the following, and references each by its canonical owner.

- The composition of the resolved parts into one prompt: ai/prompts/prompt-composition.md.
- The ordered stage that resolves inheritance during assembly: ai/prompts/prompt-assembly.md.
- The Authority Hierarchy conflicts resolve by: ai/README.md.
- The ownership a single owner is determined by: ai/architecture/ownership-map.md.
- The versioning that tracks the effect of changing a base prompt: ai/prompts/prompt-versioning.md.
- The escalation of an unresolvable conflict: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-composition.md
- ai/prompts/prompt-assembly.md
- ai/prompts/prompt-versioning.md
- ai/architecture/ownership-map.md
- ai/governance/escalation.md
