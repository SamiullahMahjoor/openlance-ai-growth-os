---
id: OL-AI-PROMPTS-PROMPT-TEMPLATES
document: ai/prompts/prompt-templates.md

title: Open Lance AIOS Prompt Templates

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
  Owns the template model: the reusable structural forms a prompt is built from,
  and prompt reuse and consistency. It owns the template model only, and defers
  any template language and the layers a template organizes to their owners.
---

# Open Lance AIOS Prompt Templates

This document owns the template model of prompts. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the template model only. It never defines a template language, a syntax, or a format, which are implementation, and it never defines the layers a template organizes, owned by ai/prompts/prompt-architecture.md.

# Purpose

This document owns one prompt concern: the reusable structural forms a prompt is built from, and how those forms provide prompt reuse and structural consistency. It exists so that any human or AI agent can determine what a prompt template is as architecture, independent of any language, syntax, or format that realizes it.

# Principles

These are the enduring principles for prompt templates. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- A template is a reusable form, not content. A template names a reusable structural form with defined places for parts; it is never prompt text, a language, or a format.
- Templates provide reuse. A template is defined once and used by many prompts, so a common structure is not restated for each prompt.
- Templates provide consistency. Prompts built from the same template share the same structure, so prompt structure is consistent across the namespace.
- Templates hold references, not truth. A template holds defined places for referenced context, and never embeds business truth, which a prompt points to under ai/prompts/prompt-context.md.

# Specification

Prompt templates are defined in the following way. This document owns the template model; the layers a template organizes are owned by ai/prompts/prompt-architecture.md, and the language or format that realizes a template is implementation.

- The template model. A template is a reusable structural form that arranges the layers owned by ai/prompts/prompt-architecture.md into a fixed shape, with defined places for the intent, the referenced context, and the task. It defines structure and defined places only, never content.
- Prompt reuse. A template is defined once and used by many prompts, so the shared structure of a kind of prompt is defined in one place and reused. Reuse is architectural, the reuse of a form, and never the reuse of business truth or of a stored prompt.
- Prompt consistency. Because prompts of the same kind are built from the same template, they share a consistent structure. Consistency is a structural property owned here; the determinism of the composed result is owned by ai/prompts/prompts.md.
- Referenced places, not embedded truth. A template's places for context are filled by reference under ai/prompts/prompt-context.md, so a prompt built from a template points to knowledge and never embeds it.

A template is a reusable form that gives prompts reuse and consistency; how a template is expressed in a language or format is implementation, outside this namespace. Templates may grow into a library additively under this document, and the template model is the same at any scale.

# Invariants

- A template is a reusable structural form with defined places, never prompt text, a language, or a format.
- A template is defined once and used by many prompts, providing reuse without restating structure.
- Prompts built from the same template share a consistent structure.
- A template holds defined places for referenced context and never embeds business truth.
- Defining a template never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the template model only. It owns none of the following, and references each by its canonical owner.

- Any template language, syntax, or format that realizes a template: implementation, outside every knowledge document.
- The layers a template organizes: ai/prompts/prompt-architecture.md.
- The combination of a template with the other parts of a prompt: ai/prompts/prompt-composition.md.
- The separation and referencing of context in a template's places: ai/prompts/prompt-context.md.
- The determinism of the composed result: ai/prompts/prompts.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-architecture.md
- ai/prompts/prompt-composition.md
- ai/prompts/prompt-context.md
