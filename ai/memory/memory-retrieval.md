---
id: OL-AI-MEMORY-MEMORY-RETRIEVAL
document: ai/memory/memory-retrieval.md

title: Open Lance AIOS Memory Retrieval

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
  - ai/memory/README.md
  - ai/memory/memory.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Memory namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns how retained memory becomes available to reasoning, and memory
  relevance. It owns memory availability only, and defers the retrieval of
  knowledge, and any index or search mechanism, to their owners.
---

# Open Lance AIOS Memory Retrieval

This document owns how retained memory becomes available to reasoning. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns memory availability and relevance only. It never owns the retrieval of knowledge, owned by ai/retrieval/, and it never defines an index, a ranking, or a search mechanism, which are implementation.

# Purpose

This document owns one memory concern: how the retained memory relevant to a task is made available to reasoning, and what makes a memory relevant. It exists so that any human or AI agent can determine how prior context reaches reasoning and which memory is relevant, independent of how memory is held or searched.

# Principles

These are the enduring principles for memory availability. Each instantiates a memory invariant owned by ai/memory/README.md.

- Only relevant memory is made available. The memory offered to reasoning is the memory pertinent to the task, not all retained context.
- Availability is deterministic. The same retained memory and the same request make the same memory available, with no randomness and no hidden step.
- Memory is offered, never imposed as truth. Retained memory is made available to reasoning as context, and it never replaces the retrieved knowledge that always prevails over it.
- Available memory is grounded. Only validated, grounded memory is made available, so reasoning never draws on an invented memory.

# Specification

Retained memory is made available to reasoning in the following way. This document owns availability and relevance; the retrieval of knowledge is owned by ai/retrieval/, and the assembly of the execution context that combines loaded knowledge, memory, and the task is owned by ai/runtime/context-loading.md.

- Memory relevance. The retained memory pertinent to the task, by its type, scope, and subject, is what becomes available. Relevance is an architectural property of the match between a memory and the request, and it determines which memory is offered, never how a mechanism searches for it. A memory that is not relevant is not made available.
- Availability to reasoning. The relevant memory is made available so that reasoning under ai/reasoning/ may draw on it as prior context. Memory is offered as retained context alongside the retrieved knowledge; it never supplants it, and where memory and knowledge differ, the knowledge repository prevails.
- Grounded and fresh. Only memory that is validated under ai/memory/memory-validation.md and fresh under ai/memory/memory-quality.md is made available, so reasoning never draws on an invented or stale memory.
- Consistent offering. The memory made available is internally consistent under ai/memory/memory-consistency.md, so reasoning is not offered conflicting memories for the same request.

Making memory available offers retained context to reasoning; it never retrieves knowledge, assembles the execution context, or reasons. Availability is deterministic and the same at any scale, because it is a function of the retained memory and the request alone.

# Invariants

- Only relevant, grounded, fresh, and consistent memory is made available to reasoning.
- The same retained memory and the same request make the same memory available.
- Available memory is offered as context and never replaces the knowledge that always prevails over it.
- Making memory available never retrieves knowledge, assembles the execution context, reasons, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns memory availability and relevance only. It owns none of the following, and references each by its canonical owner.

- The retrieval of knowledge, its discovery, selection, and loading: ai/retrieval/.
- The assembly of the execution context from loaded knowledge, memory, and the task: ai/runtime/context-loading.md.
- The reasoning that draws on available memory: ai/reasoning/.
- The validation and freshness of the memory made available: ai/memory/memory-validation.md and ai/memory/memory-quality.md.
- Any index, ranking, search, or mechanism that finds a memory: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/memory/memory-validation.md
- ai/memory/memory-quality.md
- ai/memory/memory-consistency.md
- ai/retrieval/README.md
- ai/runtime/context-loading.md
- ai/reasoning/README.md
