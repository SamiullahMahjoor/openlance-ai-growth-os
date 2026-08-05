# 41. Runtime Execution Engine implementation design (Phase 4, Stage 10)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 10).** Built design-first per ADR-0007.
[ADR-0044](adr/0044-runtime-execution-engine.md) is Accepted. Package: `apps/runtime-execution-engine`
(`@openlance/aios-runtime-execution-engine`).

## 1. Mandate and scope (Ambiguity Gate resolved)

The Stage 10 mandate assigned a single "Operations Engine" ownership of runtime execution. A source reading found this
spans two frozen namespaces: execution/orchestration/scheduling is owned by `ai/runtime/` ("The Runtime namespace owns
execution ... the kernel of the AI Operating System"), while `ai/operations/` explicitly "is not the runtime ... never
executes, orchestrates, or schedules." The approved resolution: **Stage 10 = Runtime Execution Engine** (operationalizes
`ai/runtime/`); the **Operations Engine** (`ai/operations/`: observability, monitoring, health, incident, maintenance) is
a separate, deferred **Stage 11**. The engine consumes the immutable `ExecutionRequest` envelope.

## 2. The runtime pipeline (constitutionally fixed, ADR-0044)

`Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`, with the Operations Engine (Stage 11) an
orthogonal observability layer over the running runtime. Governance decides whether execution is authorized; Safety
whether authorized execution is safe; the Runtime Execution Engine executes only an authorized, safe plan; Operations
observes. No stage may bypass this pipeline.

## 3. What it owns / never owns

Owns: deterministic execution orchestration - dependency resolution, scheduling, sequencing, bounded concurrency, the
execution state machine and lifecycle, bounded retry / timeout / cancellation / recovery / checkpointing, deterministic
result aggregation, and execution telemetry (the frozen runtime lifecycle events and an immutable audit trail) - by
**applying** the frozen `ai/runtime/` model. Never owns: authorization, permissions, human approval (governance's);
hazard, risk, prompt / tool / memory / retrieval safety, refusal, degradation (safety's); provider selection, model
routing, inference (the Provider Engine's / behind the injected seam); the definition of the execution model (the frozen
`ai/runtime/` namespace's); and observability dashboards, monitoring, alerting, health, incident, maintenance (the
Operations Engine's, Stage 11). It re-evaluates no governance and no safety, and mutates none of the three immutable
upstream contracts.

## 4. Component inventory (implemented)

- **Runtime execution types.** `ExecutionContext` (execution id, correlation id, optional `deadline`, a read-only
  `cancellation` signal, trace id, `mode`, tenant - runtime metadata only), `ExecutionRequest` (the immutable
  `AgentExecutionPlan`, `GovernanceDecision`, `SafetyDecision`, and `ExecutionContext`), `StepExecutor` / `StepOutcome`
  (the injected step-execution seam and its result), `StepResult` and `ExecutionRecord` (the immutable execution outcome:
  the final state, the terminal runtime event, per-step results, the state path taken, timing, the consumed governance and
  safety ids, and `validated: true`), `ExecutionStatistics`, `ExecutionDiagnostics`.
- **`ExecutionStateManager`.** Drives the frozen `EXECUTION_STATES` through the frozen `transitionAllowed`, recording the
  transition path; it refuses an unpermitted transition (fail-closed) and never invents a state.
- **`ExecutionLifecycleManager`.** Maps each frozen state to its frozen `EXECUTION_LIFECYCLE_PHASE` and exposes the frozen
  phase order (`executionPhaseAtOrAfter`); validation always precedes execution.
- **`DependencyResolver`.** Resolves the plan's steps into a deterministic execution order and re-verifies the plan's
  coordination topology is acyclic (a boundary re-check; fail-closed on a cycle).
- **`Scheduler`.** Partitions the resolved order into ordered stages of at most `maxConcurrency` steps (one per stage by
  default, fully sequential in plan order); it never reorders across the plan's order.
- **`ParallelExecutionCoordinator`.** Runs the steps of one stage concurrently and collects their outcomes by index
  (deterministic regardless of completion order).
- **`RetryManager`.** The bounded retry policy: whether a failed step may retry (attempts `< maxAttempts`) and the
  deterministic backoff; retries never run without end.
- **`TimeoutManager`.** The deadline policy: whether the `ExecutionContext.deadline` has passed (via the injected clock).
- **`CancellationManager`.** Reads the `ExecutionContext` cancellation signal and propagates a cancellation into the state
  machine; it never cancels anything itself beyond recording the governed/human decision.
- **`RecoveryManager`.** The `recovering`-state handling: a bounded decision to continue (retry) or terminate to `failed`.
- **`CheckpointManager`.** Captures the completed-step results and restores them on a resume, so a retry or resume never
  re-executes a completed step (idempotency).
- **`ResultAggregator`.** Composes the per-step results into the immutable `ExecutionRecord`, deterministically by step
  index.
- **`ExecutionCoordinator`.** Orchestrates the run: precondition gate, the state-machine-and-lifecycle drive, the schedule
  over the seam with retry / timeout / cancellation / recovery / checkpoint, aggregation, and finalization.
- **`TelemetryManager`.** Emits the frozen `RUNTIME_EVENTS` and builds the immutable audit trail (the state path and
  per-step outcomes); every execution emits `execution-started` and reaches exactly one terminal event.
- **`ExecutionMetrics`, `ExecutionStatistics`, `ExecutionDiagnostics`.** Operational counters and a read-only view.
- **`ExecutionEvents`, `EXECUTION_EVENT_PREFIX`.** Framework events on the frozen `EventBus` via `createEvent`; each
  emitted type is the prefix followed by the frozen `RuntimeEvent` name.
- **`ExecutionConfiguration`, `ExecutionSettings`.** `maxAttempts`, `maxRecoveries`, `backoffBaseMillis`,
  `maxConcurrency`, `checkpointing`.
- **`ExecutionError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`), `EXECUTION.*` codes.
- **`ExecutionPluginBridge`, `ExecutionPlugin`.** Adopts named execution-policy plugins into the policy registry.
- **`RuntimeExecutionManager`.** The facade and DI entry (`RUNTIME_EXECUTION_MANAGER`): execute a request into an
  immutable execution record, register a policy, and read statistics and diagnostics.
- **`runtimeExecutionEngineModule`, `RUNTIME_EXECUTION_MANAGER`.** The `di` `Module` and token, through the ADR-0026 seam.

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-runtime-execution-engine -> {
@openlance/aios-agent-engine, @openlance/aios-governance-engine, @openlance/aios-safety-engine (app, type-only);
@openlance/aios-runtime (namespace, the frozen execution model); @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel (substrate) }`. Three `app -> app` (type-only
contracts), one `app -> namespace`, five `app -> substrate`. It depends on none of the six operational engines directly
(they are reached only through the injected `StepExecutor` seam wired by the composition root) and holds no vendor
knowledge. Acyclic (nothing depends on the runtime-execution-engine). Composition root, config, and logging are test-only
devDependencies.

## 6. Execution model (deterministic orchestration, fail-closed, bounded)

The engine drives the frozen execution state machine, verifies preconditions (governance `AUTHORIZE` and safety in
`{SAFE, SANITIZE, RESTRICT, DEGRADE}`, else `failed` with no step run), then, in `executing`, runs the plan's steps stage
by stage over the injected seam. A step failure is retried while bounded (attempts `< maxAttempts`) via the `recovering`
state; when retries are exhausted the execution terminates to `failed`; a cancellation signal drives it to `cancelled`; a
passed deadline fails the running step. Completed-step results are checkpointed, so a retry or resume never re-executes a
completed step. Results are aggregated by plan-step index (deterministic regardless of completion order). Every execution
reaches exactly one terminal state (`completed | failed | cancelled`) and then `closed`, releasing its resources, and
emits exactly one terminal runtime event. Given identical inputs, configuration, environment, and seam behavior, the
`ExecutionRecord` is deterministic wherever execution semantics allow.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component and every path is tested: state manager (every frozen transition; a refused transition), lifecycle,
  dependency resolver (order; cycle fail-closed), scheduler, parallel coordinator, retry (bounded, exhausted), timeout,
  cancellation, recovery (continue / terminate), checkpoint (no re-execution on resume), aggregator, coordinator (every
  outcome; the precondition gate for a non-authorizing governance decision and each non-executing safety outcome),
  telemetry, metrics, events, configuration, plugin bridge, and the manager. Plus concurrency, determinism, idempotency,
  and stress suites, and the no-vendor-knowledge and no-reevaluation guards.
- **Fail-closed.** The public API never throws; a precondition failure or an internal fault yields a `failed`
  `ExecutionRecord`, never an uncontrolled proceed.
- **Benchmarks (ADR-0022 Rule 5).** Execution (a full run), dependency resolution, scheduling, aggregation, a state
  transition, and telemetry, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0044 and this design are the Stage 10 artifacts. On completion the stage is validated, benchmarked,
independently audited, documented, committed, and frozen. Stage 11 (the Operations Engine, `ai/operations/`, which
observes the running runtime and consumes this engine's telemetry, and never executes) is not begun.
