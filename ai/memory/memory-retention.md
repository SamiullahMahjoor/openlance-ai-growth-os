---
id: OL-AI-MEMORY-MEMORY-RETENTION
document: ai/memory/memory-retention.md

title: Open Lance AIOS Memory Retention

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
  - ai/governance/policy-enforcement.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Memory namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the retention classifications, temporary, session, long-term, and
  permanent, governed removal, and memory expiration. It owns the retention
  classifications only, and defers time periods and stores, and the session and
  execution scopes, to their owners.
---

# Open Lance AIOS Memory Retention

This document owns the retention classifications of memory. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns the retention classifications, expiration, and governed removal only. It never defines a time period, a storage policy, a database, or a store, which are implementation, and it never defines the session and execution boundaries a scope is delimited by, owned by ai/runtime/.

# Purpose

This document owns one memory concern: how long a memory is retained, classified architecturally, and how a memory expires and is removed under governance. It exists so that any human or AI agent can determine the retention class of a memory and that its removal is governed, independent of any duration, store, or mechanism.

# Principles

These are the enduring principles for memory retention. Each instantiates a memory invariant owned by ai/memory/README.md.

- Retention is classified, not timed. Retention is described by architectural class, never by a duration, schedule, or storage policy.
- Retention is bounded by purpose. A memory is retained only as long as its class and purpose require, and nothing persists beyond that purpose.
- Removal is governed. A memory expires and is removed within the governing rules owned by ai/governance/, never arbitrarily and never by promotion into the knowledge repository.
- Permanence is not truth. Even permanent retained context remains runtime state, and knowledge always prevails over it.

# Specification

A memory is retained under one of the following retention classes. This document owns the classes; the duration or store that realizes a class is implementation, and the session and execution scopes a class is delimited by are owned by ai/runtime/. The classes describe how long a memory is held by purpose, never by a fixed period.

- Temporary. Retained context held only for the immediate purpose within an execution, released as soon as that purpose ends. It is the shortest-lived class and never outlives the execution owned by ai/runtime/execution-lifecycle.md.
- Session. Retained context held for the duration of a single session and released at its close, when any state meant to outlive the session is handed on. Its bound is the session owned by ai/runtime/session-lifecycle.md.
- Long-term. Retained context held across sessions for a bounded, purposeful period, subject to expiration and revalidation under ai/memory/memory-evolution.md, and removed when its purpose ends.
- Permanent. Retained context held indefinitely as durable retained state, subject to governed removal and never overriding a canonical knowledge source. Permanence is a retention class, not a claim to truth.

Memory expiration and governed removal apply across the classes. A memory expires when the purpose or period of its retention class ends, and it is then removed within the governing rules owned by ai/governance/policy-enforcement.md, or it is replaced under ai/memory/memory-evolution.md. Removal never touches the knowledge repository, because a memory never held business truth. The retention classes are the same regardless of provider, model, or store, and they may be extended additively under this document as the memory model grows.

# Invariants

- Retention is described by architectural class, never by a duration, schedule, or storage policy.
- A memory is retained only within its class and purpose, and nothing persists beyond that purpose.
- A memory expires and is removed only within the governing rules, and never by promotion into the knowledge repository.
- Even permanent retained context remains runtime state, and knowledge always prevails over it.
- Classifying retention or removing a memory never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the retention classifications, expiration, and governed removal only. It owns none of the following, and references each by its canonical owner.

- Any time period, schedule, duration, storage policy, database, or store: implementation, outside every knowledge document.
- The session and execution scopes a class is delimited by: ai/runtime/session-lifecycle.md and ai/runtime/execution-lifecycle.md.
- The rules under which removal is permitted: ai/governance/policy-enforcement.md.
- The replacement and revalidation of retained memory over time: ai/memory/memory-evolution.md.
- The architectural categories the retention classes apply to: ai/memory/memory-types.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/memory/memory-types.md
- ai/memory/memory-evolution.md
- ai/runtime/session-lifecycle.md
- ai/runtime/execution-lifecycle.md
- ai/governance/policy-enforcement.md
