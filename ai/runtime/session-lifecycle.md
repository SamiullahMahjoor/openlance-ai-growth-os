---
id: OL-AI-RUNTIME-SESSION-LIFECYCLE
document: ai/runtime/session-lifecycle.md

title: Open Lance AIOS Session Lifecycle

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
  - ai/runtime/README.md
  - ai/runtime/runtime.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Critical

summary: >
  Owns the lifecycle of a session, the container within which executions run,
  from establishment to closure. It owns the session lifecycle only, and
  defers the execution lifecycle, memory persistence, and governance to their
  owners.
---

# Open Lance AIOS Session Lifecycle

This document owns the lifecycle of a session. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the session lifecycle only. It defers the lifecycle of a single execution to ai/runtime/execution-lifecycle.md and the persistence of memory within a session to the Memory namespace.

# Purpose

This document owns one execution concern: the lifecycle of a session, the container within which one or more executions run. It exists so that any human or AI agent can determine how a session is established, sustained, and closed, independent of how it is carried out.

# Principles

These are the enduring principles for the session lifecycle. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- A session is a bounded container. A session is established, holds executions, and is closed; it never persists unbounded.
- Executions run within a session. Every execution belongs to exactly one session and inherits its scope and grant.
- Sessions terminate cleanly. A session always reaches closure and releases what it held, including its executions.
- The session owns no persistence. Any state that outlives a session is owned by the Memory namespace, not by the session itself.

# Specification

A session passes through defined lifecycle phases. This document owns the session phases; the lifecycle of each execution within a session is owned by ai/runtime/execution-lifecycle.md.

- Establishment. A session is created and its scope, grant, and governing context are established, under the governance owned by ai/governance/.
- Active. The session holds one or more executions over time. Each execution runs its own lifecycle within the session, and the session sustains the shared scope they run within.
- Closure. The session is closed. Its open executions are brought to a terminal state, its resources are released, and any state meant to outlive it is handed to the Memory namespace before closure completes.

A session may hold a single execution or many, sequentially or concurrently, and the lifecycle is the same at any scale. Closing a session never leaves an execution running and never promotes runtime state into the knowledge repository.

# Invariants

- A session holds exactly one lifecycle, from one establishment to one closure.
- Every execution belongs to exactly one session.
- Closing a session brings all its executions to a terminal state and releases its resources.
- A session never persists state on its own; persistence beyond a session is owned by the Memory namespace.
- The session lifecycle never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the session lifecycle only. It owns none of the following, and references each by its canonical owner.

- The lifecycle of a single execution: ai/runtime/execution-lifecycle.md.
- The named states an execution or session holds: ai/runtime/execution-states.md.
- Memory persistence beyond a session: the Memory namespace, once created.
- The governance that bounds a session: ai/governance/.
- The events a session emits: ai/runtime/event-lifecycle.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/execution-lifecycle.md
- ai/runtime/execution-states.md
- ai/runtime/event-lifecycle.md
