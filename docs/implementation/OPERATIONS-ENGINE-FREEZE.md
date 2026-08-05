# Operations Engine, Freeze Declaration (Phase 4, Stage 11) - PHASE 4 COMPLETE

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN). **This is the final Phase 4 stage.**
**Package:** `@openlance/aios-operations-engine` (`apps/operations-engine`).
**Scope:** Phase 4, Stage 11: the Runtime's operational supervision subsystem, the operational realization of the frozen
`ai/operations/` observability model, built on the frozen Phase 2A substrate, the frozen `@openlance/aios-operations` and
`@openlance/aios-runtime` models, and the Runtime Execution Engine's immutable outputs, and registered through the frozen
Phase 3 composition-root seam. Decision: [ADR-0045](adr/0045-operations-engine.md) (Accepted). Design:
[docs/implementation/42-operations-engine.md](42-operations-engine.md).

It is the eleventh operational stage and the observing layer of the runtime pipeline. It performs real operational
supervision (health, monitoring, incident, alerting, capacity, maintenance, diagnostics, audit) but it **observes and
never executes**: it consumes the runtime's immutable outputs and produces immutable operations-owned outputs.

## The Ambiguity Gate (resolved: Option 1)

The mandate said "introduce a frozen immutable RuntimeEvent contract", but `RuntimeEvent` is already a frozen type owned
by `ai/runtime/` (a closed 8-event set), and the frozen Stage-10 Runtime Execution Engine emits only a subset plus the
immutable `ExecutionRecord` / `ExecutionStatistics` / `ExecutionDiagnostics`. The mandate's richer examples (`RetryStarted`,
`CheckpointCreated`, `TimeoutOccurred`) are execution-domain and are not emitted. The approved resolution (Option 1):
**Operations consumes only the existing immutable runtime outputs, introduces no new/competing `RuntimeEvent`, and
observes retry / recovery / checkpoint / timeout by reading the immutable records** (step `attempts`, the `recovering`
state in the path, `statistics.retries`) - never new runtime events, never modifying Stage 10. Health applies the frozen
`HEALTH_STATES` (the mandate's 5-state example is superseded by the frozen 3); alerting, dashboards, and capacity ground
in the frozen `monitoring` and `observability` concerns; incident and maintenance lifecycles are realized within the
frozen bounds.

## What this stage owns

Operational supervision by **applying** the frozen `ai/operations/` model: observability and telemetry aggregation,
monitoring, health assessment (the frozen `HEALTH_STATES`), incident management (a realized lifecycle), alerting (grounded
in monitoring), dashboards and capacity (grounded in observability), maintenance (the frozen `MAINTENANCE_CATEGORIES` and
a realized lifecycle), operational diagnostics, trend analysis, and an immutable operational audit. It re-owns nothing: it
never executes, orchestrates, schedules, retries, recovers, cancels, checkpoints, selects or invokes a provider, or
performs inference (the runtime's / providers'); it never introduces or extends the frozen `RuntimeEvent`, modifies a
runtime output, or recomputes a runtime metric; and it defers a protective response to `ai/safety/` and a governed
decision to `ai/governance/`.

## What was built

24 modules; ~30 classes covering the mandate's required components: `types`, `errors`, `hash`, `normalizer`,
`configuration`; `TelemetryCollector` / `TelemetryAggregator`; `MetricsCollector` / `MetricsAggregator`; `HealthManager` /
`HealthAggregator`; `IncidentManager` / `IncidentCorrelationEngine`; `AlertManager` / `AlertRouter` / `AlertSuppressor`;
`CapacityManager`; `TrendAnalyzer`; `MaintenanceManager`; `DiagnosticsManager`; `OperationalAuditManager`;
`DashboardManager` / `DashboardBuilder`; `OperationsCoordinator`; `OperationsMetrics`; `OperationsEvents`;
`OperationsPolicyFactory` / `OperationsPolicyRegistry`; `OperationsPluginBridge`; `OperationsManager`;
`operationsEngineModule` + `OPERATIONS_MANAGER`; and the public barrel `index.ts`.

## The operational model

A deterministic operational-state machine over immutable observations. Each observation is deduplicated by its id (the
audit is the idempotency authority, before any state mutation), so a duplicate changes nothing. Telemetry is aggregated
into `OperationalMetrics`; health is one of the frozen `HEALTH_STATES`, fail-closed (an unknown observation or no
confirmation never yields `healthy`); an incident is opened once per correlation key with a realized `open -> closed`
lifecycle; an alert is raised once per active condition, routed by severity, suppressed while active or muted. Every
output is immutable and carries a deterministic content-hash id, so an identical observation sequence always yields
identical outputs. The public API never throws; the engine holds no shared static state.

## Dependency graph (acyclic)

`operations-engine -> { runtime-execution-engine (app, type-only: ExecutionRecord / ExecutionStatistics); runtime,
operations (namespaces, the frozen models); di, events, plugins, errors, kernel (substrate) }` (eight edges, recorded in
`dependency-graph.snapshot.json`). One `app -> app` (type-only), two `app -> namespace`, five `app -> substrate`. It
depends on no other operational engine and on no runtime internal, holds no vendor knowledge, and nothing depends on it,
so the graph is acyclic.

## Validation and audits

`pnpm run validate` EXIT 0: typecheck, lint, format, depcruise, arch (10/10), graph:check, docs-check (43 packages, 45
ADRs, 255 constitution ids), test, bench, docs, build. **100% coverage** (statements/branches/functions/lines; barrel and
the type-only module excluded), 32 tests across 4 files, no `.only`/`.skip`, including determinism, idempotency,
fail-closed, zero-trust, large-event-stream, stress, alert, incident, health, capacity, maintenance, and dashboard
suites. Benchmarks recorded. Two independent audits (architecture/ownership/dependency/constitution and
correctness/observability/idempotency/security) returned CLEAN. No file under `ai/` or `knowledge/` was modified.

## Phase 4 status: COMPLETE

Phase 4 is complete. The full runtime pipeline `Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`,
with the Operations Engine observing the running runtime, is built and frozen across Stages 5 to 11:

| Stage | Engine | ADR | Commit |
|---|---|---|---|
| 5 | Tool Engine | 0039 | fa7dc63 |
| 6 | Reasoning Engine | 0040 | 9b0b999 |
| 7 | Agent Engine | 0041 | 3cf940b |
| 8 | Governance Enforcement Engine | 0042 | 3f3b678 |
| 9 | Safety Engine | 0043 | d471e20 |
| 10 | Runtime Execution Engine | 0044 | 6a95a68 |
| 11 | Operations Engine | 0045 | (this commit) |

The recommended next step, before any Phase 5 work, is a **Phase 4 constitutional review across Stages 7 to 11**:
end-to-end verification of the runtime pipeline, the dependency graph, ADR consistency, the public contracts, and the
ownership boundaries.
