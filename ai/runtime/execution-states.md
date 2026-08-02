---
id: OL-AI-RUNTIME-EXECUTION-STATES
document: ai/runtime/execution-states.md

title: Open Lance AIOS Execution States

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

loading_priority: Required

summary: >
  Owns the execution state model, the named states an execution may hold, and
  the permitted transitions between them. It owns the state model only, and
  defers the ordered workflow that drives transitions and the lifecycle
  framing to their owners.
---

# Open Lance AIOS Execution States

This document owns the execution state model. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the state model only. It defers the ordered workflow that drives transitions to ai/runtime/execution-workflow.md and the lifecycle framing to ai/runtime/execution-lifecycle.md.

# Purpose

This document owns one execution concern: the named states an execution may hold and the permitted transitions between them. It exists so that any human or AI agent can determine the condition an execution is in and where it may move next, independent of how transitions are carried out.

# Principles

These are the enduring principles for the state model. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- An execution is always in exactly one state. Its condition is defined at every point in its life.
- Transitions are defined, not arbitrary. An execution moves only along a permitted transition, never to an undefined state.
- Every execution reaches a terminal state. The model always leads to completion, cancellation, or failure, and then to closure.
- The state model is technology-neutral. It describes conditions and transitions, never a mechanism that implements them.

# Specification

An execution holds one of the following named states. This document owns the states and the permitted transitions; the order that drives them is owned by ai/runtime/execution-workflow.md.

- Created. The execution exists and is bound to its session, but has not begun.
- Initializing. The execution establishes its scope and grant, and passes the initial constitutional admission check before it proceeds to loading.
- Loading. Governance, the task, and required and contextual knowledge are loaded, and context is assembled.
- Validating. The execution is validated against its permissions and policies before it may run, under ai/runtime/validation-pipeline.md.
- Ready. Validation has passed and the execution is prepared to run.
- Executing. The validated task is running.
- Waiting. The execution is paused pending an external result it depends on, and will resume.
- Paused. The execution is held by governance or by a human decision, and will resume or terminate.
- Recovering. A failure is being handled under the failure and recovery model.
- Completed. The task finished and produced its result.
- Cancelled. The execution was stopped before completion by a governed or human decision.
- Failed. The execution ended without completing, after recovery did not succeed.
- Closed. The execution is finalized, its resources are released, and it holds a terminal record.

Permitted transitions follow the lifecycle. An execution moves forward from Created through Initializing, Loading, Validating, and Ready into Executing. From Executing it may move to Waiting or Paused and back, to Recovering on failure, or to Completed on success. Validation that does not pass moves the execution toward Cancelled or Failed rather than Executing. The terminal states Completed, Cancelled, and Failed each transition to Closed. No transition leads out of Closed. This model holds identically at any scale of concurrent executions.

# Invariants

- An execution is in exactly one state at all times.
- Executing is entered only from Ready, which is entered only after Validating has passed.
- Every path through the model reaches Closed.
- Closed is terminal; no execution leaves it.
- A state change never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the state model only. It owns none of the following, and references each by its canonical owner.

- The ordered workflow that drives transitions: ai/runtime/execution-workflow.md.
- The lifecycle phases the states group under: ai/runtime/execution-lifecycle.md.
- The validation that gates the transition into Executing: ai/runtime/validation-pipeline.md and ai/governance/.
- The failure handling behind Recovering, Cancelled, and Failed: ai/runtime/failure-recovery.md.
- The rules that decide a Paused or Cancelled outcome: ai/governance/.
- Any mechanism that implements a state or transition: the runtime, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/execution-lifecycle.md
- ai/runtime/execution-workflow.md
- ai/runtime/failure-recovery.md
