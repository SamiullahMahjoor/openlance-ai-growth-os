---
id: OL-AI-PROMPTS-PROMPT-BOUNDARIES
document: ai/prompts/prompt-boundaries.md

title: Open Lance AIOS Prompt Boundaries

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
  Owns what prompts never own, and where prompts stop. It owns the boundaries of
  prompts only, and defers the governance rules that bound them and the concerns
  of the surrounding namespaces to their owners.
---

# Open Lance AIOS Prompt Boundaries

This document owns the architectural boundaries of prompts. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the boundaries of prompts only. It never defines the governance rules that bound prompts, owned by ai/governance/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one prompt concern: what prompts never own, and where a prompt stops. It exists so that any human or AI agent can determine the limits of prompts, independent of how those limits are enforced.

# Principles

These are the enduring principles for prompt boundaries. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- Prompts express; they do not execute, reason, retrieve, or persist. A prompt composes and expresses a transient instruction and stops there; execution, reasoning, retrieval, and persistence belong to other namespaces.
- Prompts point to truth; they never own it. A prompt references business truth and never owns, restates, embeds, stores, or becomes it, and knowledge always governs.
- Prompts are transient; they are never stored as truth. A composed prompt is an operational output, never canonical content, and is never promoted into the knowledge repository.
- Prompts stay within governance. Composition, validation, and change occur within the governing rules, and a prompt that would exceed them is refused or escalated rather than expressed.

# Specification

Prompts operate within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/, and the concerns beyond them by their namespaces.

- Truth boundary. A prompt points to business truth by its canonical owner and never owns, restates, embeds, caches, or becomes it. Prompt content is an operational output and is never promoted into the knowledge repository.
- Reasoning boundary. A prompt expresses the governed conclusion reasoning produced and never reasons, concludes, or decides; those are owned by ai/reasoning/. A prompt is the expression of reasoning, never its performance.
- Retrieval and memory boundary. A prompt references the knowledge retrieval determined and the context memory retained and never discovers, selects, loads, or persists it; those are owned by ai/retrieval/ and ai/memory/.
- Execution boundary. A prompt is composed and validated within this namespace and is then carried by ai/runtime/ and executed by the Providers namespace. A prompt never orchestrates, schedules, executes, or selects a provider or model.
- Governance boundary. A prompt conforms to the governing rules for composition, validation, and change and never defines them; those are owned by ai/governance/. A prompt that would exceed them is refused or escalated rather than expressed.
- Implementation boundary. A prompt is a model of a transient instruction, never a template language, a syntax, a format, a provider, a model, a framework, or code, and this namespace holds no prompt text.

A composition that would cross any of these boundaries does not proceed; it is refused or escalated under ai/governance/escalation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- A prompt points to business truth and never owns, restates, embeds, or becomes it.
- A prompt never executes, reasons, retrieves, persists, or selects a provider or model.
- A prompt is transient and is never stored as truth or promoted into the knowledge repository.
- A prompt that would exceed the governing rules is refused or escalated, never expressed.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of prompts only. It owns none of the following, and references each by its canonical owner.

- The governance rules that bound prompts: ai/governance/.
- The runtime boundaries of an execution and the execution of a prompt: ai/runtime/execution-boundaries.md and the Providers namespace.
- The retrieval and reasoning boundaries: ai/retrieval/retrieval-boundaries.md and ai/reasoning/reasoning-boundaries.md.
- The AI boundary and the cross-layer boundary: ai/README.md.
- The escalation or refusal of an out-of-bounds prompt: ai/governance/escalation.md.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/runtime/execution-boundaries.md
- ai/retrieval/retrieval-boundaries.md
- ai/reasoning/reasoning-boundaries.md
- ai/governance/escalation.md
