---
id: OL-AI-MEMORY-MEMORY-BOUNDARIES
document: ai/memory/memory-boundaries.md

title: Open Lance AIOS Memory Boundaries

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
  Owns what memory never owns, and where memory stops. It owns the boundaries of
  memory only, and defers the governance rules that bound it and the concerns of
  the surrounding namespaces to their owners.
---

# Open Lance AIOS Memory Boundaries

This document owns the architectural boundaries of memory. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns the boundaries of memory only. It never defines the governance rules that bound memory, owned by ai/governance/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one memory concern: what memory never owns, and where memory stops. It exists so that any human or AI agent can determine the limits of memory, independent of how those limits are enforced.

# Principles

These are the enduring principles for memory boundaries. Each instantiates a memory invariant owned by ai/memory/README.md.

- Memory retains; it does not execute, retrieve knowledge, reason, or express. Memory holds and offers retained context and stops there; execution, knowledge retrieval, reasoning, and expression belong to other namespaces.
- Memory holds runtime state; it never owns truth. Memory retains runtime context and never owns, restates, replaces, or becomes business truth, and knowledge always prevails over it.
- Memory never invents and never persists beyond purpose. Memory holds only what was actually formed, only within its scope and retention.
- Memory stays within governance. Retention, removal, and change of memory occur within the governing rules, and memory escalates a conflict it cannot resolve rather than invent one.

# Specification

Memory operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/, and the concerns beyond them by their namespaces.

- Truth boundary. Memory holds runtime state and never owns, restates, replaces, invents, or amends business truth, which is owned by the knowledge repository and always prevails over memory. Nothing in memory is automatically promoted into the knowledge repository.
- Knowledge boundary. Memory offers retained context and never discovers, selects, or loads knowledge; those are owned by ai/retrieval/, and the assembly of the execution context from loaded knowledge, memory, and the task is owned by ai/runtime/context-loading.md.
- Reasoning boundary. Memory provides prior context and never reasons, concludes, or decides; those are owned by ai/reasoning/. Memory is drawn on by reasoning; it never performs it.
- Execution boundary. Memory is retained and made available within the session and execution lifecycles owned by ai/runtime/, and it never orchestrates, schedules, or executes. The runtime hands state to memory and draws context from it.
- Governance boundary. Memory applies the governing rules for retention, removal, and change and never defines them; those are owned by ai/governance/. Memory escalates a conflict it cannot resolve rather than invent a resolution.
- Implementation boundary. Memory is a model of retained context, never a store, a database, an index, a cache, an embedding, a vector search, a persistence technology, a learning or training process, an algorithm, or code.

A memory operation that would cross any of these boundaries does not proceed; it is refused or escalated under ai/governance/escalation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- Memory holds runtime state and never owns, restates, replaces, invents, or amends business truth.
- Memory never retrieves knowledge, assembles the execution context, reasons, or executes.
- Memory holds nothing beyond its scope and retention, and nothing in memory is automatically promoted into the knowledge repository.
- Memory concludes no conflict by invention; it escalates rather than exceed the governing rules.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of memory only. It owns none of the following, and references each by its canonical owner.

- The governance rules that bound memory: ai/governance/.
- The runtime boundaries of an execution: ai/runtime/execution-boundaries.md.
- The retrieval boundaries and the reasoning boundaries: ai/retrieval/retrieval-boundaries.md and ai/reasoning/reasoning-boundaries.md.
- The AI boundary and the cross-layer boundary: ai/README.md.
- The escalation or refusal of an out-of-bounds memory operation: ai/governance/escalation.md.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/runtime/execution-boundaries.md
- ai/retrieval/retrieval-boundaries.md
- ai/reasoning/reasoning-boundaries.md
- ai/governance/escalation.md
