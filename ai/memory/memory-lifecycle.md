---
id: OL-AI-MEMORY-MEMORY-LIFECYCLE
document: ai/memory/memory-lifecycle.md

title: Open Lance AIOS Memory Lifecycle

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
  Owns the phases of memory, from formation to removal. It owns the memory
  lifecycle only, and defers the ordered operations, the session and execution
  lifecycles, and the layers around memory to their owners.
---

# Open Lance AIOS Memory Lifecycle

This document owns the phases of a single memory. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns the memory lifecycle only. It defers the ordered operations within it to ai/memory/memory-workflow.md, and the session and execution lifecycles the memory is scoped against to ai/runtime/.

# Purpose

This document owns one memory concern: the phases a memory passes through, from being formed to being removed. It exists so that any human or AI agent can determine the shape of a memory's life, independent of how it is carried out or where it is held.

# Principles

These are the enduring principles for the memory lifecycle. Each instantiates a memory invariant owned by ai/memory/README.md.

- A memory has a defined beginning and end. It begins with formation and ends with removal; nothing persists beyond its defined purpose.
- Memory is grounded at formation. A memory comes into being grounded in what was actually formed, never invented.
- Retention is scoped. A memory is held only within its retention class and purpose, and it is removed when that purpose ends.
- Memory yields to knowledge throughout its life. At every phase, a memory holds runtime state and never business truth, and knowledge always prevails over it.

# Specification

A memory passes through the following phases. This document owns the phases; the ordered operations within them are owned by ai/memory/memory-workflow.md, and the session and execution lifecycles a memory is scoped against are owned by ai/runtime/.

- Formation. A memory is formed from an execution and validated for grounding under ai/memory/memory-validation.md, and it is classified by its architectural type under ai/memory/memory-types.md and its retention class under ai/memory/memory-retention.md. A memory comes into being grounded, scoped, and never invented.
- Retention. The memory is held under its retention class, scoped and lifecycled. During retention it is available to reasoning on recall under ai/memory/memory-retrieval.md, it is kept consistent under ai/memory/memory-consistency.md, and it may be revalidated or replaced over time under ai/memory/memory-evolution.md. Retention never promotes the memory to business truth.
- Removal. The memory's retention ends and it is removed within the governing rules, because it expired under ai/memory/memory-retention.md, was replaced under ai/memory/memory-evolution.md, or the purpose it served has ended. Removal leaves the knowledge repository untouched, because memory never held business truth.

Formation precedes Retention, which precedes Removal. Recall, revalidation, and replacement occur within Retention and never change the memory's identity or promote it to truth. The lifecycle is the same for one memory and for millions, and it never changes as providers, models, or stores change.

# Invariants

- A memory holds exactly one lifecycle, from one formation to one removal.
- The Formation phase precedes Retention, which precedes Removal.
- A memory is grounded at Formation and never invented, and it never becomes business truth at any phase.
- During Retention, recall, revalidation, and replacement never change the memory's identity or promote it to truth.
- The lifecycle never executes, reasons, retrieves knowledge, expresses, or alters ownership, authority, governance, or business truth.

# Boundaries

This document owns the memory lifecycle only. It owns none of the following, and references each by its canonical owner.

- The ordered operations of memory: ai/memory/memory-workflow.md.
- The classification and retention of a memory: ai/memory/memory-types.md and ai/memory/memory-retention.md.
- The availability, consistency, validation, and evolution of a memory: ai/memory/memory-retrieval.md, ai/memory/memory-consistency.md, ai/memory/memory-validation.md, and ai/memory/memory-evolution.md.
- The session and execution lifecycles a memory is scoped against: ai/runtime/session-lifecycle.md and ai/runtime/execution-lifecycle.md.
- The rules that govern retention and removal: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/memory/memory-workflow.md
- ai/memory/memory-retention.md
- ai/runtime/session-lifecycle.md
- ai/runtime/execution-lifecycle.md
