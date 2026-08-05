---
id: ADR-0044
title: The Runtime Execution Engine is the Runtime's operational execution subsystem operationalizing the frozen runtime model; it executes an authorized, safe plan over an injected step-execution seam and consumes the immutable ExecutionRequest envelope, and the Operations namespace (observability) is a separate deferred stage
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0044: The Runtime Execution Engine is the Runtime's operational execution subsystem; it operationalizes the frozen ai/runtime model, executes an authorized and safe plan over an injected step-execution seam, consumes the immutable ExecutionRequest envelope, and never authorizes, evaluates safety, or overrides an upstream decision

## Status

**Accepted** (Phase 4, Stage 10). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0043. It refines the Stage 10
terminology used loosely in ADR-0042 and ADR-0043 (see Rationale) without altering either ADR's decisions.

## Context

The Stage 10 mandate assigned a single "Operations Engine" exclusive ownership of runtime execution: execution, step
execution, sequencing, scheduling, orchestration, engine invocation, concurrency, reliability (retries, backoff, timeout,
cancellation, recovery, checkpointing), result management, execution state, and execution telemetry. A full source
reading fixed a constitutional ownership conflict that forced an Ambiguity Gate:

- **Execution is the Runtime namespace's; the Operations namespace never executes.** `ai/runtime/README.md`: "The
  Runtime namespace owns execution: how an AI task is initialized, loaded, validated, run, monitored, recovered, and
  finalized. It is the kernel of the AI Operating System" and "Runtime sequences and combines the results of the
  Reasoning, Agents, Memory, Retrieval, Prompts, Providers, and Tools namespaces." `ai/operations/README.md`: "Operations
  is not the runtime. The runtime executes, orchestrates, and schedules; operations ... never executes, orchestrates, or
  schedules ... those are owned by ai/runtime/", and its boundaries assign "Execution, orchestration, scheduling, and
  runtime behavior" to `ai/runtime/`. A single engine owning both execution and operations would violate ADR-0020
  single-ownership and the frozen operations invariant "Operations operates the layer; it never changes its behavior."
- **The frozen runtime namespace names this engine.** `@openlance/aios-runtime` (ADR-0024 category 3, Runtime Service)
  states it "owns the constitutional role of lifecycle and orchestration ... the actual orchestration over a concrete
  task is the operational runtime's." That operational runtime is this engine.

The Ambiguity Gate resolution (approved): Stage 10 is the **Runtime Execution Engine** (operationalizes `ai/runtime/`);
the **Operations Engine** (operationalizes `ai/operations/`: observability, monitoring, health, incident, maintenance,
which never executes and consumes the runtime's telemetry) is a separate, deferred **Stage 11**. The immutable envelope
the engine consumes is named `ExecutionRequest`.

## Decision

1. **The revised runtime pipeline is `Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`, with the
   Operations Engine (observability) an orthogonal layer that observes the running runtime (Stage 11).** Governance
   decides whether execution is authorized; Safety decides whether authorized execution is safe; the Runtime Execution
   Engine executes only an authorized, safe plan; the Operations Engine (later) observes and keeps the running layer
   healthy and never executes. No stage may bypass this pipeline.

2. **Stage 10 is a new `apps/`-layer package, `@openlance/aios-runtime-execution-engine`, the operational realization of
   the frozen `ai/runtime/` model.** It consumes an immutable `ExecutionRequest` and drives an execution through the
   frozen execution state model, lifecycle, workflow order, failure-and-recovery model, boundaries, and lifecycle events,
   producing an immutable execution record. It follows the ADR-0035 operational-layer pattern (`apps/*`,
   composition-root seam, no vendor knowledge).

3. **The `ExecutionRequest` is a new immutable, read-only envelope (additive; no frozen contract changes).** It contains
   only the immutable `AgentExecutionPlan`, the immutable `GovernanceDecision`, the immutable `SafetyDecision`, and an
   immutable `ExecutionContext`. `ExecutionContext` carries runtime metadata only (execution id, correlation id, an
   optional deadline, a read-only cancellation signal, a trace id, an execution mode, and a tenant); it never duplicates,
   reinterprets, or modifies any field of the three decisions. The three frozen contracts pass through unchanged.

4. **It applies the frozen runtime model; it invents no state machine, lifecycle, or workflow.** It drives the execution
   through the frozen `EXECUTION_STATES` (`created -> initializing -> loading -> validating -> ready -> executing ->
   waiting | paused | recovering -> completed | cancelled | failed -> closed`), validating every transition with the
   frozen `transitionAllowed`; it maps states to the frozen `EXECUTION_LIFECYCLE_PHASES` and follows the frozen
   `EXECUTION_WORKFLOW_STEPS` order; it performs bounded retry, recovery, and termination per the frozen failure-recovery
   model (retry and continuation are the `recovering` state; the mandate's example "RETRYING" is realized as `recovering`,
   not a new state); and it emits the frozen `RUNTIME_EVENTS` (`execution-started` ... exactly one terminal event).

5. **Governance and safety precede execution; the engine verifies preconditions and never re-evaluates or overrides
   them.** Execution begins only if `GovernanceDecision.decision == AUTHORIZE` and `SafetyDecision.outcome` is one of
   `SAFE`, `SANITIZE`, `RESTRICT`, or `DEGRADE` (the executing outcomes). If either precondition fails, the execution
   reaches `failed` without executing any step (fail-closed). The engine never recomputes authorization or safety, never
   rewrites the plan, the governance decision, or the safety decision, and never continues against a governance decision
   to stop. It faithfully carries the safety directives to the step-execution seam; it never reinterprets, weakens, or
   ignores them.

6. **Execution is deterministic orchestration over an injected `StepExecutor` seam.** The engine owns the deterministic
   orchestration: dependency resolution, scheduling, sequencing, bounded concurrency, the state machine, bounded retry /
   timeout / cancellation / recovery / checkpointing, and deterministic result aggregation (by plan-step index, never by
   completion order). The actual per-step work (invoking the operational namespaces and, later, vendor adapters) is
   performed by an injected `StepExecutor` port, which the composition root wires to the public contracts of the Provider,
   Prompt, Tool, Memory, Retrieval, and Reasoning Engines. The engine holds no vendor client, model, URL, auth, or
   inference logic; the vendor boundary is entirely behind the injected port (the same injected-adapter precedent as the
   Provider Engine). Given identical inputs, environment, and seam behavior, the engine behaves deterministically wherever
   execution semantics allow; retries never duplicate a completed step (idempotent checkpoint recovery).

7. **It owns execution telemetry only, not operations.** It emits the frozen runtime lifecycle events and an immutable
   execution audit trail (the state path and per-step outcomes), and exposes engine metrics and diagnostics. It does not
   own observability dashboards, monitoring, alerting, health, incident, or maintenance (all the Operations Engine's,
   Stage 11).

8. **It consumes only public contracts, and the graph stays acyclic.** Its `src` edge set is
   `{ agent-engine, governance-engine, safety-engine (app, type-only contracts); runtime (namespace, the frozen execution
   model it applies); di, events, plugins, errors, kernel (substrate) }`. It imports each through its public barrel,
   depends on no vendor and on none of the six operational engines directly (they are reached only through the injected
   seam), and nothing depends on the Runtime Execution Engine, so the graph is acyclic.

9. **No vendor knowledge (the ADR-0035 invariant carries forward).** Enforced by a guard test. A second guard enforces
   that the engine never re-evaluates governance or safety and never mints a decision (it reads the immutable decisions
   only).

10. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/41-runtime-execution-engine.md` are the Stage
    10 artifacts. A new ADR is warranted because Stage 10 makes genuinely new architectural decisions: the Ambiguity Gate
    resolution separating runtime execution from operations, the operational realization of the frozen runtime model, the
    `ExecutionRequest` envelope, and the injected step-execution seam.

## Rationale

Naming the operational realization of execution is what the frozen `ai/runtime/` namespace anticipates ("the actual
orchestration over a concrete task is the operational runtime's") and what ADR-0035 established. Separating it from
operations is forced by the frozen `ai/operations/` identity ("Operations is not the runtime ... never executes,
orchestrates, or schedules") and single-ownership (ADR-0020). ADR-0042 and ADR-0043 referred to the Stage 10 executor
colloquially as the "Operations Engine"; those ADRs' decisions (the pipeline sequence Agent -> Governance -> Safety ->
[executor], and that no stage may bypass, override, recompute, or modify a governance or safety decision) are correct and
unchanged. This ADR refines only the executor's identity, correcting it to the Runtime Execution Engine per the frozen
runtime-versus-operations ownership, and records that Operations (`ai/operations/`) is a distinct deferred stage; it
therefore supersedes neither ADR. Alternatives rejected: one engine owning both runtime execution and operations
(violates single-ownership and the frozen operations identity; the original mandate); re-evaluating or overriding
governance or safety (governance's and safety's, ADR-0042 / ADR-0043); selecting or invoking a provider or performing
inference directly, or embedding a vendor adapter (behind the injected seam; the Provider Engine and vendor boundary own
that); inventing a state machine (the frozen `ai/runtime/` model owns it); and mutating the immutable upstream contracts
(forbidden).

## Consequences

- The `apps/` layer gains its execution engine; the runtime pipeline is complete for its executing stages. The Operations
  Engine (Stage 11) consumes this engine's telemetry and never executes.
- The engine remains non-authorizing, non-safety-evaluating, provider-agnostic, and deterministic-in-orchestration. Real
  vendor execution is wired behind the injected step-execution seam.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/runtime/README.md` and the frozen
`ai/runtime/execution-states.md`, `execution-lifecycle.md`, `execution-workflow.md`, `failure-recovery.md`,
`execution-boundaries.md`, `event-lifecycle.md`, `validation-pipeline.md`, `context-loading.md`,
`knowledge-resolution.md`, and `session-lifecycle.md` (the execution model the engine applies); `ai/operations/README.md`
(operations is not the runtime; the Stage 11 boundary); `ai/governance/` and `ai/safety/` (the decisions the engine
verifies and never re-evaluates); `ai/agents/` (the plan it executes); and ADR-0020, ADR-0024, ADR-0035, ADR-0041,
ADR-0042, and ADR-0043.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer and the governance-cleared seam), ADR-0042 (the
Governance Enforcement Engine, whose `GovernanceDecision` it verifies) and ADR-0043 (the Safety Engine, whose
`SafetyDecision` it verifies and whose directives it carries) - refining the "Operations" label those two ADRs used for
the Stage 10 executor to "Runtime Execution Engine". Builds on ADR-0041 (the Agent Engine, whose `AgentExecutionPlan` it
executes), ADR-0026 (the composition-root seam), ADR-0005 (frozen DI), ADR-0006 (Result), and ADR-0007 (design-first).
Consumes the frozen Phase 2B `@openlance/aios-runtime` model. Anticipates the Stage 11 Operations Engine (`ai/operations/`),
which observes the running runtime and consumes this engine's telemetry.
