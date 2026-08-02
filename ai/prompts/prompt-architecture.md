---
id: OL-AI-PROMPTS-PROMPT-ARCHITECTURE
document: ai/prompts/prompt-architecture.md

title: Open Lance AIOS Prompt Architecture

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
  Owns the prompt layering model: the ordered architectural layers and sections
  a single prompt is organized into. It owns the layering model only, and defers
  how the layers are combined and how one prompt derives from another to their
  owners.
---

# Open Lance AIOS Prompt Architecture

This document owns the layering model of a prompt. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the layering model only. It never defines how the layers are combined, owned by ai/prompts/prompt-composition.md, and it never defines how one prompt derives from another, owned by ai/prompts/prompt-inheritance.md.

# Purpose

This document owns one prompt concern: the ordered architectural layers and sections a single prompt is organized into. It exists so that any human or AI agent can determine the structural anatomy of a prompt, independent of how the layers are combined or what any layer contains.

# Principles

These are the enduring principles for the prompt layering model. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- Layers are architectural, not content. A layer names a structural part of a prompt by its role; it is never prompt text, a format, or a template language.
- Layers are ordered and separated. A prompt is organized into layers in a fixed order, and each layer holds one kind of part, so instruction is separated from referenced context.
- Layers descend from constitution to task. The most authoritative layers come first, and the most specific, task-level layers come last, so higher authority is expressed before narrower intent.
- Layers are extensible. New architectural layers or sections may be added over time, additively, without changing the ones defined here.

# Specification

A prompt is organized into the following ordered architectural layers. This document owns the layers and their order; how they are combined is owned by ai/prompts/prompt-composition.md. The layers describe the role of each structural part, never its content, and never a format or a template language.

- Governing layer. The layer that carries the governing constraints a prompt must express, derived from the rules owned by ai/governance/. It comes first, so every prompt is bounded before it instructs.
- Role layer. The layer that establishes the acting role the prompt is composed for, derived from the agent definition owned by the Agents namespace. It never defines the agent, which is owned outside this namespace.
- Intent layer. The layer that expresses the governed intent or conclusion the prompt conveys, derived from the reasoning owned by ai/reasoning/. It carries what is to be done, never how it was reasoned.
- Context layer. The layer that holds the referenced context the prompt points to, owned in its separation by ai/prompts/prompt-context.md. It references knowledge by its canonical owner and never embeds it.
- Task layer. The most specific layer, expressing the immediate task instruction. It is the narrowest layer and comes last.

The layers are ordered from the most authoritative to the most specific, and each holds one kind of part. A section is a named division within a layer; sections organize a layer without changing the layer order. The layering model is the same regardless of provider, model, framework, or scale, and it may be extended additively under this document as the prompt model grows.

# Invariants

- A prompt is organized into ordered layers, from the governing layer to the task layer.
- Each layer holds one kind of part, and referenced context is separated from instruction.
- A layer names a structural role, never prompt text, a format, or a template language.
- Defining the layering never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the prompt layering model only. It owns none of the following, and references each by its canonical owner.

- How the layers are combined into a prompt: ai/prompts/prompt-composition.md.
- The reusable form the layers are expressed through: ai/prompts/prompt-templates.md.
- How one prompt derives its layers from another: ai/prompts/prompt-inheritance.md.
- The separation and referencing of context within the context layer: ai/prompts/prompt-context.md.
- The rules, reasoning, and agent definition the layers derive from: ai/governance/, ai/reasoning/, and the Agents namespace.
- Any prompt content, format, or template language: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-composition.md
- ai/prompts/prompt-templates.md
- ai/prompts/prompt-context.md
- ai/prompts/prompt-inheritance.md
