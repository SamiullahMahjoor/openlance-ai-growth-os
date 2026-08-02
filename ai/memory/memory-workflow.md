---
id: OL-AI-MEMORY-MEMORY-WORKFLOW
document: ai/memory/memory-workflow.md

title: Open Lance AIOS Memory Workflow

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
  Owns the required order of memory operations, from receiving an operation to
  governed removal. It owns the memory order only, and defers the model of each
  operation, the phases it groups under, and the execution workflow to their
  owners.
---

# Open Lance AIOS Memory Workflow

This document owns the required order of memory operations. It is a memory document at the Specification authority level defined in ai/README.md, and it follows the Memory Document Standard in ai/memory/README.md. It instantiates the memory invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and knowledge always prevails over memory.

This document owns the ordered sequence of memory operations only. It never defines the model of any operation, which is owned by that operation's document, and it never defines the execution workflow, owned by ai/runtime/execution-workflow.md.

# Purpose

This document owns one memory concern: the required order in which the operations on a memory occur. It exists so that any human or AI agent can determine the sequence memory follows, and that a memory is validated before it is retained and reconciled before it is relied on, independent of how any operation is carried out.

# Principles

These are the enduring principles for the memory order. Each instantiates a memory invariant owned by ai/memory/README.md.

- The order is fixed and deterministic. Every memory operation follows the same required order, so the same retained memory and the same request yield the same remembered context.
- Validation precedes retention. A memory is validated for grounding before it is retained, so no invented memory is ever held.
- Reconciliation precedes reliance. A conflicting memory is reconciled, with knowledge prevailing, before it is relied on.
- Removal is governed. A memory is removed only within the governing rules, and never silently promoted to truth before removal.
- The order holds at any scale. One memory and millions follow the same order.

# Specification

Every memory operation follows this required order. This document owns the order; each operation defers its model to the owner named. The order is architectural: it defines what happens before what, never how any operation is carried out, and it defines no store, index, or algorithm.

- Receive. A memory operation is requested for an execution or session, to record retained context, to recall it, or to remove it, carried by the runtime owned by ai/runtime/.
- Classify. The memory is classified by its architectural type under ai/memory/memory-types.md and its retention class under ai/memory/memory-retention.md, so its scope and purpose are established.
- Validate. On recording, the remembered information is validated for grounding under ai/memory/memory-validation.md, so that memory never invents and never records business truth.
- Retain. The validated memory is retained under its retention class, scoped and lifecycled, and never promoted to the knowledge repository.
- Recall. On request, the relevant and fresh memory is made available to reasoning under ai/memory/memory-retrieval.md and ai/memory/memory-quality.md, without replacing the retrieved knowledge that always prevails over it.
- Reconcile. The memory is kept consistent under ai/memory/memory-consistency.md, and a conflict among memories, or between a memory and the knowledge repository, is handled with the knowledge repository prevailing, or escalated under ai/governance/escalation.md.
- Evolve or remove. Over time the memory is revalidated, replaced, or expired under ai/memory/memory-evolution.md and ai/memory/memory-retention.md, and it is removed within the governing rules.

An operation never runs before an operation that must precede it: a memory is classified and validated before it is retained, retained before it is recalled, and reconciled before it is relied on. The order is the same regardless of provider, model, store, or scale.

# Invariants

- Classify and Validate precede Retain, which precedes Recall.
- A memory is validated for grounding before it is retained, so no invented memory is retained.
- A conflicting memory is reconciled, with knowledge prevailing, before it is relied on.
- A memory is removed only within the governing rules, and never promoted into the knowledge repository.
- The same retained memory and the same request always produce the same remembered context.
- The order never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the memory order only. It owns none of the following, and references each by its canonical owner.

- The model of each operation: memory-types, memory-retention, memory-validation, memory-retrieval, memory-consistency, and memory-evolution.
- The phases the order groups under: ai/memory/memory-lifecycle.md.
- The execution workflow the memory operation serves: ai/runtime/execution-workflow.md.
- The reasoning that relies on recalled memory: ai/reasoning/.
- The escalation of an unresolved conflict: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/memory/README.md
- ai/memory/memory.md
- ai/memory/memory-types.md
- ai/memory/memory-retention.md
- ai/memory/memory-validation.md
- ai/memory/memory-retrieval.md
- ai/memory/memory-consistency.md
- ai/memory/memory-evolution.md
- ai/memory/memory-lifecycle.md
- ai/runtime/execution-workflow.md
- ai/governance/escalation.md
