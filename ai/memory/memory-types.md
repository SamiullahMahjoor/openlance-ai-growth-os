---
id: OL-AI-MEMORY-MEMORY-TYPES
document: ai/memory/memory-types.md

title: Open Lance AIOS Memory Types

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
  Owns the architectural categories of memory: working, session, conversational,
  episodic, procedural, and organizational memory. It owns the categories only,
  and defers any store or mechanism that holds a type, and the retention of a
  type, to their owners.
---

# Open Lance AIOS Memory Types

This document owns the architectural categories of memory. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns the categories only. It never defines a store, a structure, or a mechanism that holds a type, which is implementation, and it never defines the retention of a type, owned by ai/memory/memory-retention.md.

# Purpose

This document owns one memory concern: the architectural categories into which retained context falls. It exists so that any human or AI agent can determine what kinds of memory exist as architecture, independent of how any of them is held.

# Principles

These are the enduring principles for the categories of memory. Each instantiates a memory invariant owned by ai/memory/README.md.

- Categories are architectural, not stores. A category names a kind of retained context by its scope and role; it is never a database, an index, a cache, or a structure.
- Categories are scoped and lifecycled. Each category has a defined scope and purpose, and no memory of any category persists beyond that purpose.
- Categories hold runtime state, never truth. Every category retains runtime context and never owns, restates, or becomes business truth.
- Categories are extensible. New architectural categories may be added over time, additively, without changing the ones defined here.

# Specification

Retained context falls into the following architectural categories. This document owns the categories; how any is held is owned elsewhere, and the retention class of each is owned by ai/memory/memory-retention.md.

- Working memory. The category of retained context an execution holds while it is acting, in service of the immediate task. It owns that the category exists and what it is, never how it is held. Its scope is delimited by the execution owned by ai/runtime/execution-lifecycle.md.
- Session memory. The category of retained context that spans a single session across its executions and turns. It owns that the category exists and what it is, never how it is held. Its scope is delimited by the session owned by ai/runtime/session-lifecycle.md.
- Conversational memory. The category of retained context that carries the exchange between the AI and a counterpart across turns, so a later turn can draw on an earlier one. It owns that the category exists and what it is, never the content of any exchange, which is runtime state.
- Episodic memory. The category of retained context that records that a particular event or interaction occurred, so it can be recalled later as a past episode. It owns that the category exists and what it is, never a business record, which is owned by the knowledge repository.
- Procedural memory. The category of retained context that retains how a task was carried out, so a later task can proceed consistently. It owns that the category exists and what it is, never a governed procedure or policy, which is owned by ai/governance/ and the knowledge repository.
- Organizational memory. The category of retained context shared across sessions and agents at the level of the operating organization, so common context is available beyond a single session. It owns that the category exists and what it is, never business truth, which is owned by the knowledge repository and always prevails over it.

Each category is a kind of retained context, distinguished by its scope and role, held only within its purpose. The categories are the same regardless of provider, model, store, or scale, and they may be extended additively under this document as the memory model grows. The retention class that governs how long a memory of any category is held is owned by ai/memory/memory-retention.md.

# Invariants

- A category names a kind of retained context by scope and role, never a store, database, index, or cache.
- A memory of any category holds runtime state and never business truth, and knowledge always prevails over it.
- A memory of any category is scoped and lifecycled, and nothing persists beyond its defined purpose.
- Classifying a memory by category never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the categories of memory only. It owns none of the following, and references each by its canonical owner.

- Any store, structure, index, cache, or mechanism that holds a type: implementation, outside every knowledge document.
- The retention class and expiration of a type: ai/memory/memory-retention.md.
- The session and execution scopes a type is delimited by: ai/runtime/session-lifecycle.md and ai/runtime/execution-lifecycle.md.
- The availability of a type to reasoning: ai/memory/memory-retrieval.md.
- Business truth that a type must never become: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/memory/memory-retention.md
- ai/memory/memory-retrieval.md
- ai/runtime/session-lifecycle.md
- ai/runtime/execution-lifecycle.md
