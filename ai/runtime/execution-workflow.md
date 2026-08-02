---
id: OL-AI-RUNTIME-EXECUTION-WORKFLOW
document: ai/runtime/execution-workflow.md

title: Open Lance AIOS Execution Workflow

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
  - ai/governance/constitutional-validation.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Critical

summary: >
  Owns the required order of an execution: the ordered sequence of phases from
  initialization through finalization. It owns the execution order only, and
  defers the rules validated at each step and the states it moves through to
  their owners.
---

# Open Lance AIOS Execution Workflow

This document owns the required order of an execution. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the ordered execution sequence only. It never defines the rules validated at each step, which are owned by ai/governance/, and it never defines the states an execution moves through, which are owned by ai/runtime/execution-states.md.

# Purpose

This document owns one execution concern: the required order in which the phases of an execution occur. It exists so that any human or AI agent can determine the sequence every execution follows, and in particular that governance is loaded and validated before the task runs, independent of how the sequence is carried out.

# Principles

These are the enduring principles for the execution order. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- The order is fixed and governed. Every execution follows the same required order, and no step is skipped or reordered to reach execution sooner.
- Governance is loaded and validated before the task runs. Loading and validation always precede execution.
- Knowledge is loaded before context is assembled. The context an execution runs with is assembled only from knowledge and inputs already loaded.
- Validation precedes execution. Permissions and policies are validated before the task is run, never after.
- The order holds at any scale. One execution and millions of concurrent executions follow the same order.

# Specification

Every execution follows this required order. This document owns the order; each step defers its rules and its work to the owners named. The order is architectural: it defines what happens before what, never how any step is carried out.

- Initialize. The execution is created, bound to its session, and its scope and grant are established.
- Validate constitution. The execution is checked against the AI constitution before it proceeds, under ai/governance/constitutional-validation.md.
- Load governance. The governance mandates that bind the execution are loaded, owned by ai/governance/.
- Resolve task. The task to be executed is admitted and resolved to what it requires.
- Load required knowledge. The knowledge the task requires is loaded, orchestrated by ai/runtime/knowledge-resolution.md and found by the Retrieval namespace from the knowledge repository.
- Load contextual knowledge. The knowledge the situation triggers is loaded, under the same orchestration.
- Assemble execution context. The loaded knowledge, memory, and task are assembled into the execution context, owned by ai/runtime/context-loading.md.
- Validate permissions. The execution is validated against the permission mandates owned by ai/governance/permission-governance.md, in the order owned by ai/runtime/validation-pipeline.md.
- Validate policies. The execution is validated against the policy mandates owned by ai/governance/policy-enforcement.md, in the same order.
- Execute. The validated task runs.
- Monitor state. The running execution's state is monitored, under ai/runtime/execution-states.md.
- Handle failures. Any failure is handled under ai/runtime/failure-recovery.md, and whether execution may continue, escalate, or refuse is decided by ai/governance/.
- Return result. The result of the execution is returned.
- Finalize session. The execution reaches its terminal state, its resources are released, and it is closed within its session, under ai/runtime/session-lifecycle.md.

The order is the same regardless of provider, model, framework, runtime, or scale. A step never runs before a step that must precede it, and validation never runs after execution.

# Invariants

- Validate constitution, load governance, and validate permissions and policies all precede Execute.
- Knowledge is loaded before context is assembled, and context is assembled before Execute.
- No execution reaches Execute without passing every validation step before it.
- The order never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the execution order only. It owns none of the following, and references each by its canonical owner.

- The rules validated at each step: ai/governance/, including constitutional-validation, permission-governance, and policy-enforcement.
- The states the order moves through: ai/runtime/execution-states.md.
- The orchestration of knowledge loading and the assembly of context: ai/runtime/knowledge-resolution.md and ai/runtime/context-loading.md.
- The validation order within the validation steps: ai/runtime/validation-pipeline.md.
- Failure handling: ai/runtime/failure-recovery.md.
- Any mechanism, algorithm, or system that carries out a step: the runtime and the operational namespaces, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/execution-states.md
- ai/runtime/validation-pipeline.md
- ai/runtime/knowledge-resolution.md
- ai/runtime/context-loading.md
- ai/runtime/failure-recovery.md
- ai/governance/constitutional-validation.md
