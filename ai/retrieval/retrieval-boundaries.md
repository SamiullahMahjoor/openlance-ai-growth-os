---
id: OL-AI-RETRIEVAL-RETRIEVAL-BOUNDARIES
document: ai/retrieval/retrieval-boundaries.md

title: Open Lance AIOS Retrieval Boundaries

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
  - ai/retrieval/README.md
  - ai/retrieval/retrieval.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Retrieval namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the architectural boundaries of a retrieval: what a retrieval may and
  may not do, and where it stops. It owns the boundaries of retrieval only,
  and defers the governance rules that bound it and the runtime boundaries to
  their owners.
---

# Open Lance AIOS Retrieval Boundaries

This document owns the architectural boundaries of a retrieval. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of retrieval only. It never defines the governance rules that bound a retrieval, owned by ai/governance/, and it never defines the runtime boundaries, owned by ai/runtime/execution-boundaries.md.

# Purpose

This document owns one retrieval concern: the architectural limits within which a retrieval operates, and where a retrieval stops. It exists so that any human or AI agent can determine what a retrieval may and may not do, independent of how the limits are enforced.

# Principles

These are the enduring principles for retrieval boundaries. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- Retrieval determines; it does not load or execute. A retrieval produces a validated result and stops; loading and execution are the runtime's.
- Retrieval consumes truth; it never owns it. A retrieval reads the knowledge repository and never writes, restates, or amends business truth.
- Retrieval stays within governance. A retrieval determines only knowledge an execution is permitted to consume, and never exceeds that permission.
- Retrieval is minimal and complete. A retrieval yields the minimum sufficient, dependency-complete set, and never more or less.

# Specification

A retrieval operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/ and the knowledge repository.

- Determination boundary. A retrieval discovers, selects, expands, prioritizes, assembles, and validates a knowledge set, and stops at the validated result. It never loads the set, assembles the execution context, or executes.
- Truth boundary. A retrieval reads the knowledge repository and names knowledge by its canonical owner. It never owns, writes, restates, caches as truth, or amends any business truth, and it never promotes any state into the knowledge repository.
- Governance boundary. A retrieval determines only what an execution is permitted to consume, under ai/governance/, and refuses or escalates rather than retrieve what is not permitted.
- Layer boundary. A retrieval consumes the knowledge repository one-directionally; the knowledge repository never consumes retrieval. A retrieval never reaches into reasoning, memory, prompts, providers, tools, agents, evaluation, safety, operations, or the runtime, and owns none of their concerns.
- Technology boundary. A retrieval is defined as a model of determination, never as a search engine, index, embedding, ranking, database, algorithm, or protocol.

A retrieval that would cross any of these boundaries does not proceed; it is refused or escalated under ai/governance/escalation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- A retrieval produces a validated result and never loads, assembles the execution context, or executes.
- A retrieval never writes, restates, or amends business truth, and never promotes state into the knowledge repository.
- A retrieval determines only governance-permitted knowledge.
- Retrieval consumes the knowledge repository one-directionally.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of retrieval only. It owns none of the following, and references each by its canonical owner.

- The governance rules that bound retrieval: ai/governance/.
- The runtime boundaries of an execution: ai/runtime/execution-boundaries.md.
- The AI boundary and the cross-layer boundary: ai/README.md.
- The validation that enforces the boundaries on a result: ai/retrieval/retrieval-validation.md.
- The escalation or refusal of an out-of-bounds retrieval: ai/governance/escalation.md.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/retrieval-validation.md
- ai/runtime/execution-boundaries.md
- ai/governance/escalation.md
