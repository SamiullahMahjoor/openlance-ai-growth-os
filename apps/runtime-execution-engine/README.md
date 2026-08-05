# @openlance/aios-runtime-execution-engine

The AIOS **Runtime Execution Engine** (Phase 4, Stage 10): the Runtime's operational execution subsystem, the operational
realization of the frozen `ai/runtime/` model ("the actual orchestration over a concrete task is the operational
runtime's"). See [ADR-0044](../../docs/implementation/adr/0044-runtime-execution-engine.md) and the
[design doc](../../docs/implementation/41-runtime-execution-engine.md).

## Ambiguity Gate (resolved)

The Stage 10 mandate assigned a single "Operations Engine" ownership of runtime execution. The frozen constitution owns
execution in `ai/runtime/` ("The Runtime namespace owns execution ... the kernel of the AI Operating System"), while
`ai/operations/` "is not the runtime ... never executes, orchestrates, or schedules." So Stage 10 is the **Runtime
Execution Engine** (`ai/runtime/`); the **Operations Engine** (`ai/operations/`: observability, monitoring, health,
incident, maintenance) is a separate, deferred **Stage 11**. The revised pipeline is
`Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`, with Operations observing the running runtime.

## What it does

For an immutable `ExecutionRequest` (`AgentExecutionPlan` + `GovernanceDecision` + `SafetyDecision` + `ExecutionContext`):

1. Drives the frozen `EXECUTION_STATES` state machine (created → ... → executing → completed | failed | cancelled →
   closed), validating every transition with the frozen `transitionAllowed`.
2. Verifies preconditions: governance `AUTHORIZE` and safety in `{SAFE, SANITIZE, RESTRICT, DEGRADE}`. It never
   re-evaluates governance or safety, and never overrides or rewrites either decision or the plan.
3. Resolves the plan's steps into a deterministic order (fail-closed on a coordination cycle), schedules them into
   bounded-concurrency stages (sequential by default), and runs each stage over the injected `StepExecutor` seam.
4. Applies bounded retry, timeout, execution-level recovery, and idempotent checkpointing (a completed step is never
   re-executed on recovery); aggregates a deterministic immutable `ExecutionRecord` by plan-step index; and emits the
   frozen runtime lifecycle events (started, exactly one terminal, closed).

## What it never does

It authorizes nothing, evaluates no safety, selects and invokes no provider directly (the seam does), performs no
inference, and holds no vendor knowledge. Real per-step work is behind the injected `StepExecutor` seam, which the
composition root wires to the public contracts of the Provider, Prompt, Tool, Memory, Retrieval, and Reasoning Engines.
It is deterministic in orchestration and fail-closed. It owns execution telemetry only, not observability dashboards,
monitoring, alerting, health, incident, or maintenance (the Operations Engine's, Stage 11).

## Public API

`RuntimeExecutionManager` (facade and DI entry, registered under `RUNTIME_EXECUTION_MANAGER` through the composition-root
seam) exposes `register` (a policy), `execute` (a request into an `ExecutionRecord`), `remove`, `statistics`, and
`diagnostics`. The state manager, lifecycle, resolver, scheduler, parallel coordinator, reliability managers, checkpoint,
aggregator, coordinator, telemetry, metrics, events, configuration, registry, factory, and plugin bridge are also
exported. See `src/index.ts`.
