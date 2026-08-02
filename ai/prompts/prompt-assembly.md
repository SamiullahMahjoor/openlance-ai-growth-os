---
id: OL-AI-PROMPTS-PROMPT-ASSEMBLY
document: ai/prompts/prompt-assembly.md

title: Open Lance AIOS Prompt Assembly

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
  Owns the ordered assembly stages that produce the final prompt, including
  prompt normalization. It owns the assembly stages only, and defers the
  composition model and the assembly of the execution context to their owners.
---

# Open Lance AIOS Prompt Assembly

This document owns the ordered stages that produce a final prompt. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the ordered assembly stages only. It never defines the composition model the stages apply, owned by ai/prompts/prompt-composition.md, and it never defines the assembly of the execution context, owned by ai/runtime/context-loading.md.

# Purpose

This document owns one prompt concern: the ordered stages by which a composed prompt is produced in its final form, and the normalization that gives every prompt a consistent form. It exists so that any human or AI agent can determine the sequence that produces a prompt, and that a prompt is validated before it is final, independent of how any stage is carried out.

# Principles

These are the enduring principles for prompt assembly. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- The order is fixed and deterministic. Every prompt is assembled through the same ordered stages, so the same parts produce the same prompt.
- Resolution precedes combination. Inherited parts and conflicts are resolved before the layers are combined, so composition acts on settled parts.
- Normalization precedes validation. The assembled prompt is normalized to a consistent form before it is validated, so validation acts on a stable prompt.
- The order holds at any scale. One prompt and tens of thousands are assembled through the same stages.

# Specification

Every prompt is assembled through the following ordered stages. This document owns the order; each stage defers its model to the owner named. The order is architectural: it defines what happens before what, never how any stage is carried out, and it defines no format or template language.

- Resolve inheritance. The base prompts a prompt derives from are resolved, and conflicts among inherited parts are settled, under ai/prompts/prompt-inheritance.md.
- Gather layers and template. The ordered layers owned by ai/prompts/prompt-architecture.md are gathered into the reusable template owned by ai/prompts/prompt-templates.md.
- Reference context. The referenced context is placed as reference, separated from instruction, under ai/prompts/prompt-context.md, so the prompt points to knowledge and never embeds it.
- Compose. The resolved parts, layers, template, and referenced context are combined into one prompt under ai/prompts/prompt-composition.md, in the layer order.
- Normalize. The composed prompt is normalized to a consistent structural form, so that prompts assembled from the same kind of parts have the same form. Normalization settles structure only; it never alters referenced context or invents content.
- Finalize for validation. The normalized prompt is produced as the final prompt, ready for validation under ai/prompts/prompt-validation.md, before it is expressed.

A stage never runs before a stage that must precede it: inheritance is resolved before layers are combined, and the prompt is normalized before it is validated. The order is the same regardless of provider, model, framework, or scale.

# Invariants

- Resolve inheritance precedes Compose, which precedes Normalize, which precedes Finalize for validation.
- The same parts always produce the same assembled prompt.
- Normalization settles structure only and never alters referenced context or invents content.
- A prompt is normalized and finalized before validation, and never expressed from this namespace.
- The order never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the ordered assembly stages only. It owns none of the following, and references each by its canonical owner.

- The composition model the stages apply: ai/prompts/prompt-composition.md.
- The layers, template, inheritance, and context the stages act on: ai/prompts/prompt-architecture.md, ai/prompts/prompt-templates.md, ai/prompts/prompt-inheritance.md, and ai/prompts/prompt-context.md.
- The validation that follows assembly: ai/prompts/prompt-validation.md.
- The assembly of the execution context the prompt is composed from: ai/runtime/context-loading.md.
- Any format, rendering, or template language that realizes a stage: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-composition.md
- ai/prompts/prompt-inheritance.md
- ai/prompts/prompt-architecture.md
- ai/prompts/prompt-templates.md
- ai/prompts/prompt-context.md
- ai/prompts/prompt-validation.md
- ai/runtime/context-loading.md
