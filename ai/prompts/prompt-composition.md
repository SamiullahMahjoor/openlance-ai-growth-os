---
id: OL-AI-PROMPTS-PROMPT-COMPOSITION
document: ai/prompts/prompt-composition.md

title: Open Lance AIOS Prompt Composition

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
  - ai/retrieval/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the composition model: how the layers, template, inherited parts, and
  referenced context are combined into one prompt. It owns the composition model
  only, and defers the ordered assembly stages and the resolution of conflicts
  to their owners.
---

# Open Lance AIOS Prompt Composition

This document owns the composition model of a prompt. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the composition model only. It never defines the ordered stages that produce the final prompt, owned by ai/prompts/prompt-assembly.md, and it never defines the resolution of conflicts among parts, owned by ai/prompts/prompt-inheritance.md.

# Purpose

This document owns one prompt concern: how the layers, template, inherited parts, and referenced context are combined into one prompt, and the composition pipeline that governs that combination. It exists so that any human or AI agent can determine how a prompt is put together from its parts, independent of the order of the stages that carry it out.

# Principles

These are the enduring principles for prompt composition. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- Composition is deterministic. The same layers, template, inherited parts, and referenced context compose the same prompt, with no randomness and no hidden step.
- Composition combines parts; it never invents them. A prompt is composed only from its defined layers, template, inherited parts, and referenced context, and never from invented content.
- Composition preserves separation. Referenced context is composed as reference, kept separate from instruction, so a prompt points to knowledge and never embeds it.
- Composition is governed and bounded. A prompt is composed within the governing rules and the prompt boundaries, and a composition that would exceed them is not produced.

# Specification

A prompt is composed in the following way. This document owns the composition model, the pipeline by which parts combine; the ordered stages that produce the final prompt are owned by ai/prompts/prompt-assembly.md, and the resolution of conflicting parts is owned by ai/prompts/prompt-inheritance.md.

- Parts of a composition. A prompt is composed from the ordered layers owned by ai/prompts/prompt-architecture.md, the reusable template owned by ai/prompts/prompt-templates.md, the inherited parts owned by ai/prompts/prompt-inheritance.md, and the referenced context owned in its separation by ai/prompts/prompt-context.md.
- The composition pipeline. Composition combines these parts in the layer order defined by ai/prompts/prompt-architecture.md: the more authoritative layers are composed before the more specific, so higher authority is expressed first. The pipeline defines what combines with what, never the order of the stages, which is owned by ai/prompts/prompt-assembly.md.
- Precedence and conflict. Where composed or inherited parts overlap, precedence follows the inheritance and dependency model owned by ai/prompts/prompt-inheritance.md, and this document defers the resolution to it and never restates it.
- Governed and separated result. The composed prompt expresses the governing constraints, points to its referenced context rather than embedding it, and stays within the prompt boundaries owned by ai/prompts/prompt-boundaries.md. A composition that cannot be produced within the rules yields no prompt.

Composition defines how a prompt's parts combine into one prompt; the ordered stages that carry the composition out, and the normalization of the result, are owned by ai/prompts/prompt-assembly.md. Composition is deterministic and the same at any scale.

# Invariants

- The same layers, template, inherited parts, and referenced context compose the same prompt.
- A prompt is composed only from its defined parts, and never from invented content.
- Referenced context is composed as reference, separated from instruction, and never embedded.
- A composition that would exceed the governing rules or the prompt boundaries yields no prompt.
- Composing a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the composition model only. It owns none of the following, and references each by its canonical owner.

- The ordered stages that produce the final prompt, and normalization: ai/prompts/prompt-assembly.md.
- The layers and template combined: ai/prompts/prompt-architecture.md and ai/prompts/prompt-templates.md.
- The inheritance, dependency, and conflict resolution among parts: ai/prompts/prompt-inheritance.md.
- The separation and referencing of context: ai/prompts/prompt-context.md.
- The assembly of the execution context the prompt composes from: ai/runtime/context-loading.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-architecture.md
- ai/prompts/prompt-templates.md
- ai/prompts/prompt-inheritance.md
- ai/prompts/prompt-context.md
- ai/prompts/prompt-assembly.md
- ai/prompts/prompt-boundaries.md
- ai/retrieval/README.md
- ai/runtime/context-loading.md
