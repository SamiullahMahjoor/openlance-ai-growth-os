---
id: OL-AI-RUNTIME-FAILURE-RECOVERY
document: ai/runtime/failure-recovery.md

title: Open Lance AIOS Failure and Recovery

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
  - ai/governance/escalation.md
  - ai/governance/autonomy-boundaries.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns failure handling, retries, timeouts, cancellation, recovery, checkpoint
  and rollback policy, and execution termination. It owns the runtime failure
  model only, and defers whether execution may continue, escalate, or refuse
  to governance.
---

# Open Lance AIOS Failure and Recovery

This document owns how the runtime handles failure. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the runtime failure model only. It never decides whether an execution may continue, whether escalation is required, or whether refusal is required, all of which are owned by ai/governance/. The runtime owns the mechanics of failure; governance owns the decisions.

# Purpose

This document owns one execution concern: how an execution behaves when it fails, is delayed, or is stopped, including retries, timeouts, cancellation, recovery, checkpoints, and termination. It exists so that any human or AI agent can determine how failure is handled, independent of how it is carried out, and where the governance decisions sit.

# Principles

These are the enduring principles for failure and recovery. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- Failure is always handled. Every failure resolves to a defined outcome; no execution is left in an undefined condition.
- The runtime handles; governance decides. The runtime performs retry, recovery, and termination; whether execution may continue, escalate, or refuse is owned by ai/governance/.
- Recovery is bounded. Retries and recovery are bounded, so a failing execution does not loop or run without end.
- Failure is safe. A failure that cannot be recovered ends in a defined terminal state, never in invention or an unbounded state.
- Termination is clean. A terminated execution reaches a terminal state and releases its resources.

# Specification

When an execution fails, is delayed, or is stopped, the runtime handles it through the following model. This document owns the model; the governance decisions it defers to are owned by ai/governance/.

- Retry policy. A failed step may be retried within a bounded limit, when retrying is safe and permitted. Retries are finite; when the limit is reached, the execution moves to recovery or termination, and no retry proceeds against a governance decision to stop.
- Timeout behavior. An execution or a step that exceeds its bounded time moves to a defined state rather than waiting without end, and is then recovered or terminated.
- Cancellation. An execution may be cancelled by a governed or human decision. A cancelled execution stops, moves to the Cancelled state owned by ai/runtime/execution-states.md, and releases its resources.
- Checkpoint policy. The runtime may establish recovery points during an execution, so that on failure the execution can resume from a defined point rather than from the beginning. Checkpoints are an architectural policy; the mechanism that records them is the runtime's execution.
- Recovery workflow. On a recoverable failure, the execution enters the Recovering state, resumes from a checkpoint or retries within the bounded limit, and either continues or, if recovery does not succeed, terminates.
- Rollback. Where an execution cannot safely continue, the runtime returns to a prior recovery point or undoes an incomplete step, so the execution does not proceed from a corrupt condition.
- Termination. An execution that cannot be recovered is terminated to the Failed state, releases its resources, and is closed.

At every point, whether the execution may continue at all, whether it must escalate to a human, and whether it must refuse are decided by ai/governance/escalation.md and ai/governance/autonomy-boundaries.md, and the runtime never overrides those decisions. The model holds at any scale of concurrent executions.

# Invariants

- Every failure resolves to retry, recovery, or termination; none is left undefined.
- Retries and recovery are bounded and never run without end.
- A terminated or cancelled execution reaches a terminal state and releases its resources.
- The runtime never continues an execution against a governance decision to stop, escalate, or refuse.
- Handling a failure never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the runtime failure model only. It owns none of the following, and references each by its canonical owner.

- Whether execution may continue, and whether escalation or refusal is required: ai/governance/escalation.md and ai/governance/autonomy-boundaries.md.
- The states a failing execution moves through: ai/runtime/execution-states.md.
- The boundaries a failure must not cross: ai/runtime/execution-boundaries.md.
- Any mechanism that retries, times out, checkpoints, or terminates an execution: the runtime, outside every knowledge document.
- Any recording of a failure: implementation, and the Operations namespace once created.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/execution-states.md
- ai/runtime/execution-boundaries.md
- ai/governance/escalation.md
- ai/governance/autonomy-boundaries.md
