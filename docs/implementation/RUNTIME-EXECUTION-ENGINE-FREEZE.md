# Runtime Execution Engine, Freeze Declaration (Phase 4, Stage 10)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-runtime-execution-engine` (`apps/runtime-execution-engine`).
**Scope:** Phase 4, Stage 10: the Runtime's operational execution subsystem, the operational realization of the frozen
`ai/runtime/` model, built on the frozen Phase 2A substrate, the frozen `@openlance/aios-runtime` model, and the Agent,
Governance, and Safety Engines' contracts, and registered through the frozen Phase 3 composition-root seam. Decision:
[ADR-0044](adr/0044-runtime-execution-engine.md) (Accepted). Design: [docs/implementation/41-runtime-execution-engine.md](41-runtime-execution-engine.md).

It is the tenth operational stage and the Runtime's executor. It performs real execution orchestration (state machine,
scheduling, concurrency, reliability, result aggregation, telemetry) but its per-step work is behind an injected seam:
it produces an immutable `ExecutionRecord` and holds no vendor knowledge.

## The Ambiguity Gate (resolved) and the corrected runtime pipeline

The Stage 10 mandate assigned a single "Operations Engine" ownership of runtime execution. The frozen constitution owns
execution in `ai/runtime/` ("The Runtime namespace owns execution ... the kernel of the AI Operating System"), while
`ai/operations/` "is not the runtime ... never executes, orchestrates, or schedules." A single engine owning both would
violate ADR-0020 single-ownership. The approved resolution: **Stage 10 = Runtime Execution Engine (`ai/runtime/`)**; the
**Operations Engine (`ai/operations/`: observability, monitoring, health, incident, maintenance, which never executes and
consumes the runtime's telemetry) is a separate, deferred Stage 11.** The corrected, constitutionally-fixed pipeline is
`Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`, with Operations observing the running runtime.
ADR-0044 refines the "Operations" label ADR-0042 / ADR-0043 used for the Stage 10 executor to "Runtime Execution Engine",
without altering either ADR's decisions.

## What this stage owns

Operational runtime execution: deterministic orchestration - dependency resolution, scheduling, sequencing, bounded
concurrency, the frozen execution state machine and lifecycle, bounded retry / timeout / cancellation / recovery /
checkpointing, deterministic result aggregation, and execution telemetry (the frozen runtime lifecycle events and an
immutable audit trail) - by **applying** the frozen `ai/runtime/` model. It re-owns nothing: it never authorizes
(governance's), never evaluates safety (safety's), never selects or invokes a provider or performs inference (the
Provider Engine's / the injected seam's), and never owns observability dashboards, monitoring, health, incident, or
maintenance (the Operations Engine's, Stage 11). It re-evaluates no governance and no safety and mutates none of the
three immutable upstream contracts.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the public types (`ExecutionRequest`, `ExecutionContext`, `StepExecutor` / `StepOutcome`, `Delay`, `StepResult`, `ExecutionRecord`, `ExecutionPolicy`, statistics, diagnostics); type-only, excluded from coverage |
| `src/errors.ts` | `ExecutionError` (a `BaseError` subtype, `infrastructure`, `EXECUTION.*` codes) |
| `src/configuration.ts` | `ExecutionSettings`, `DEFAULT_SETTINGS`, `ExecutionConfiguration` (clamps every bound to a finite `[min, max]` range; `Infinity`/`NaN` falls back to the default, so the engine always terminates) |
| `src/state.ts` | `ExecutionStateManager` (drives the frozen `EXECUTION_STATES` via the frozen `transitionAllowed`; fails closed on an illegal transition; one instance per execution) |
| `src/lifecycle.ts` | `ExecutionLifecycleManager` (maps a state to its frozen lifecycle phase; `executionPhaseAtOrAfter`) |
| `src/dependency-resolver.ts` | `DependencyResolver` (plan order; re-verifies acyclic coordination, fail-closed on a cycle) |
| `src/scheduler.ts` | `Scheduler` (bounded-concurrency stages; barrier capabilities; never reorders the plan) |
| `src/parallel.ts` | `ParallelExecutionCoordinator` (runs a stage concurrently; results in resolved order) |
| `src/retry.ts` | `RetryManager` (bounded per-step retry; deterministic backoff) |
| `src/timeout.ts` | `TimeoutManager` (deadline policy) |
| `src/cancellation.ts` | `CancellationManager` (reads the governed cancellation signal at the gate) |
| `src/recovery.ts` | `RecoveryManager` (bounded `recovering`-state continue/terminate decision) |
| `src/checkpoint.ts` | `CheckpointManager` (records completed steps; restores on recovery; idempotency; one instance per execution) |
| `src/aggregator.ts` | `ResultAggregator` (deterministic-by-index immutable `ExecutionRecord`; deep freeze) |
| `src/coordinator.ts` | `ExecutionCoordinator` (orchestrates the run: precondition gate, state machine, schedule over the seam, retry/timeout/recovery/checkpoint, aggregation, finalization; fail-closed; never throws) |
| `src/telemetry.ts` | `TelemetryManager` (emits the frozen `RUNTIME_EVENTS`: started, exactly one terminal, closed) |
| `src/metrics.ts` | `ExecutionMetrics` (executions, terminals, steps, retries) |
| `src/events.ts` | `ExecutionEvents` + `EXECUTION_EVENT_PREFIX` (republishes the frozen `RuntimeEvent` set as framework events) |
| `src/factory.ts` / `src/registry.ts` | `ExecutionPolicyFactory` / `ExecutionPolicyRegistry` (named barrier-capability policies) |
| `src/plugin-bridge.ts` | `ExecutionPluginBridge` (atomic adoption of policy-carrying plugins) |
| `src/manager.ts` | `RuntimeExecutionManager` (facade + DI entry: register / execute / remove / statistics / diagnostics) |
| `src/module.ts` | `runtimeExecutionEngineModule` + `RUNTIME_EXECUTION_MANAGER` (the `di` module and token, ADR-0026 seam) |
| `src/index.ts` | the single public barrel (Engineering Rule 1) |

## The execution model

The engine drives the frozen 13-state machine (`created -> initializing -> loading -> validating -> ready -> executing ->
recovering -> completed | cancelled | failed -> closed`), validating every transition with the frozen `transitionAllowed`.
It verifies preconditions - governance `AUTHORIZE` and safety in `{SAFE, SANITIZE, RESTRICT, DEGRADE}` - and fails closed
(to `failed`, no step run) otherwise; a governed cancellation at the validating gate reaches `cancelled`. In `executing`
it runs the plan's steps stage by stage over the injected `StepExecutor` seam, with bounded per-step retry, a deadline
timeout, bounded execution-level recovery through the `recovering` state, and idempotent checkpointing (a completed step
is never re-executed on recovery). It aggregates results by plan-step index (deterministic regardless of completion
order), reaches exactly one terminal state and one terminal runtime event, and closes, releasing resources. It never
re-evaluates or overrides governance or safety, never mutates the plan or either decision, and the public API never
throws.

## Dependency graph (acyclic)

`runtime-execution-engine -> { agent-engine, governance-engine, safety-engine (app, type-only); runtime (namespace, the
frozen execution model); di, events, plugins, errors, kernel (substrate) }` (nine edges, recorded in
`dependency-graph.snapshot.json`). Three `app -> app`, one `app -> namespace`, five `app -> substrate`. It depends on
none of the six operational engines directly (they are reached only through the injected seam) and holds no vendor
knowledge. Nothing depends on the runtime-execution-engine; the graph is acyclic.

## Validation and audits

`pnpm run validate` EXIT 0: typecheck, lint, format, depcruise, arch (10/10), graph:check, docs-check (42 packages, 44
ADRs, 255 constitution ids), test, bench, docs, build. **100% coverage** (statements/branches/functions/lines; barrel and
the type-only module excluded), 42 tests across 4 files, no `.only`/`.skip`, including retry, timeout, cancellation,
recovery, checkpoint, determinism, idempotency, concurrency, stress, and precondition fail-closed suites. Benchmarks
recorded. Two independent audits (architecture/ownership/dependency/constitution and correctness/concurrency/reliability/
security) returned CLEAN. No file under `ai/` or `knowledge/` was modified.

## Phase 4 status

The runtime pipeline `Agent -> Governance -> Safety -> Runtime Execution` is complete for its executing stages. The one
remaining deferred stage is **Stage 11, the Operations Engine (`ai/operations/`)**: observability, monitoring, health,
incident management, and maintenance over the running runtime, which never executes and consumes this engine's telemetry.
