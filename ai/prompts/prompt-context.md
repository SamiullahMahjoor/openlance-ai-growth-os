---
id: OL-AI-PROMPTS-PROMPT-CONTEXT
document: ai/prompts/prompt-context.md

title: Open Lance AIOS Prompt Context

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
  Owns prompt context separation: how referenced context is held in a prompt,
  separated from instruction, so a prompt points to knowledge and never embeds
  it. It owns context separation only, and defers the determination of knowledge
  and the retained context to their owners.
---

# Open Lance AIOS Prompt Context

This document owns how context is held and separated within a prompt. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns prompt context separation only. It never determines which knowledge to load, owned by ai/retrieval/, and it never owns the retained context or its persistence, owned by ai/memory/.

# Purpose

This document owns one prompt concern: how the context a prompt draws on is held within the prompt as reference, separated from instruction, so that a prompt points to knowledge and never embeds or restates it. It exists so that any human or AI agent can determine how a prompt carries context without becoming a copy of truth, independent of how the context was found or retained.

# Principles

These are the enduring principles for prompt context separation. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- A prompt points to knowledge; it never embeds it. Context enters a prompt as a reference to its canonical owner, never as a copy, cache, or paraphrase of business truth.
- Context is separated from instruction. The referenced context is held in its own layer, distinct from the intent and the task, so instruction never mixes with truth.
- Context is consumed, never owned. A prompt references the knowledge retrieval determined and the context memory retained, and owns none of it.
- Context is deterministic. The same referenced context enters a prompt the same way, with no invented context.

# Specification

Context is held within a prompt in the following way. This document owns the separation and referencing of context; which knowledge is loaded is owned by ai/retrieval/, and the retained context is owned by ai/memory/.

- Reference, not embedding. The context a prompt draws on is held as a reference to its canonical owner in the knowledge repository, so a prompt points to knowledge and never embeds, copies, caches, or restates it. This upholds the constitutional principle that a prompt is not a source of truth.
- Separation from instruction. The referenced context is held in the context layer owned by ai/prompts/prompt-architecture.md, separated from the intent layer and the task layer, so that instruction and referenced truth never blur into one another.
- Sources of context. The knowledge a prompt references is determined by ai/retrieval/, and the retained context a prompt may reference is held by ai/memory/. This document owns how such context is separated and referenced within the prompt, and never how it is found or retained.
- No promotion. Referenced context is used for the execution and is never promoted from a prompt into the knowledge repository; a prompt is transient and never becomes truth.

Context separation confirms that a prompt carries context as reference, kept apart from instruction; the determination of that knowledge and the retention of context are owned elsewhere. Separation is deterministic and the same at any scale.

# Invariants

- Context enters a prompt as a reference to its canonical owner, never as embedded, copied, or restated truth.
- Referenced context is held separately from instruction, in its own layer.
- A prompt references the knowledge retrieval determined and the context memory retained, and owns none of it.
- Referenced context is never promoted from a prompt into the knowledge repository.
- Separating context never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns prompt context separation only. It owns none of the following, and references each by its canonical owner.

- The determination, discovery, selection, and loading of knowledge: ai/retrieval/.
- The retained context and its persistence: ai/memory/.
- The assembly of the execution context from loaded knowledge, memory, and the task: ai/runtime/context-loading.md.
- The layer the referenced context is held in: ai/prompts/prompt-architecture.md.
- Business truth itself: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-architecture.md
- ai/retrieval/README.md
- ai/memory/README.md
- ai/runtime/context-loading.md
