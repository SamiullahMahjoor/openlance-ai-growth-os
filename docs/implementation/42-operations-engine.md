# 42. Operations Engine implementation design (Phase 4, Stage 11)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 11).** Built design-first per ADR-0007.
[ADR-0045](adr/0045-operations-engine.md) is Accepted. Package: `apps/operations-engine`
(`@openlance/aios-operations-engine`). This is the final Phase 4 stage.

## 1. Mandate and scope (Ambiguity Gate resolved: Option 1)

Stage 11 builds the Operations Engine: the operational supervision layer over the running runtime. The Ambiguity Gate
found one conflict: the mandate's "introduce a frozen RuntimeEvent contract" collides with the frozen `ai/runtime/`
ownership of `RuntimeEvent` (a closed 8-event set) and with the frozen Stage-10 engine, which emits only a subset plus the
immutable `ExecutionRecord` / `ExecutionStatistics` / `ExecutionDiagnostics`. Approved resolution: **Operations consumes
only the existing immutable runtime outputs, introduces no new/competing `RuntimeEvent`, and observes retry / recovery /
checkpoint / timeout by reading the immutable records and statistics.** The rest is a clean application of the frozen
`ai/operations/` model.

## 2. The pipeline (constitutionally fixed, ADR-0044 / ADR-0045)

`Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime`, with the Operations Engine observing the running
runtime. Operations never participates in execution; it only observes and supervises.

## 3. What it owns / never owns

Owns: operational supervision by **applying** the frozen `ai/operations/` model - observability and telemetry
aggregation, monitoring, health assessment (the frozen `HEALTH_STATES`), incident management (a realized lifecycle),
alerting (grounded in monitoring), operational dashboards and capacity (grounded in observability), maintenance (the
frozen `MAINTENANCE_CATEGORIES` and a realized lifecycle), operational diagnostics, trend analysis, and an immutable
operational audit. Never owns: execution, orchestration, scheduling, retry, recovery, cancellation, checkpointing,
execution state or lifecycle, provider selection or invocation, inference (all the runtime's / providers'); governance,
safety, authorization, permissions, human approval, hazard or risk analysis (governance's / safety's); and the behavior of
any subject namespace. It never modifies a runtime output and recomputes no runtime metric.

## 4. Component inventory (implemented)

- **Types.** `Observation` (a discriminated union over the immutable inputs: a frozen `RuntimeEvent` occurrence, an
  `ExecutionRecord`, or an `ExecutionStatistics`, each with an idempotency `id`), and the
  immutable outputs `OperationalStatus`, `HealthReport`, `Incident` / `IncidentReport`, `OperationalAlert`,
  `MaintenanceActivity` / `MaintenancePlan`, `OperationalMetrics`, `OperationalDashboard`, `CapacityReport`,
  `OperationalDiagnostics`, `OperationalAudit`.
- **`OperationsErrors`, `OperationsHash`, `OperationsNormalizer`, `OperationsConfiguration`.** The `EXECUTION`-analogue
  `OPERATIONS.*` error type; the deterministic FNV-1a content hash; structural normalization; and the immutable settings
  (failure and alert thresholds and the health-history bound), clamped to finite ranges.
- **`TelemetryCollector`, `TelemetryAggregator`, `MetricsCollector`, `MetricsAggregator`.** Extract operational facts from
  an observation (executions, completions, failures, cancellations, steps, retries, recoveries, timeouts, unknowns) and
  aggregate them incrementally into the operational metric totals.
- **`HealthManager`, `HealthAggregator`.** Assess the frozen `HEALTH_STATES` from the aggregated metrics, fail-closed
  (unknown telemetry or no confirmation never yields `healthy`), and aggregate component health to an overall state using
  `healthStateAtOrAfter` (the worst component wins).
- **`IncidentManager`, `IncidentCorrelationEngine`.** Open an incident on a failure observation, correlate failures by
  their execution/correlation key into one incident (idempotency), and drive the realized incident lifecycle
  (`open -> acknowledged -> investigating -> mitigated -> resolved -> closed`) with validated transitions.
- **`AlertManager`, `AlertRouter`, `AlertSuppressor`.** Generate an alert when a monitored threshold is breached, route it
  by severity, and suppress a duplicate while an equivalent alert is already active (idempotency).
- **`DashboardManager`, `DashboardBuilder`, `CapacityManager`, `TrendAnalyzer`.** Build the immutable operational
  dashboard, capacity report (throughput, work, retries, failure ratio, and the dominant bottleneck), and metric trend
  from the current state.
- **`MaintenanceManager`, `DiagnosticsManager`, `OperationalAuditManager`.** The realized maintenance lifecycle over the
  frozen categories, operational diagnostics, and the immutable, deduplicated audit trail.
- **`OperationsCoordinator`.** Orchestrates one observation: dedup, collect and aggregate, reassess health, correlate
  incidents, evaluate and suppress alerts, and audit - deterministically and idempotently.
- **`OperationsEvents`, `OperationsMetrics`, `OperationsPluginBridge`, `OperationsManager`, `operationsEngineModule`.** The
  framework events, the engine's own counters, the atomic policy-plugin bridge, the facade and DI entry
  (`OPERATIONS_MANAGER`: `observe`, then the immutable report readers), and the `di` module and token.

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-operations-engine -> {
@openlance/aios-runtime-execution-engine (app, type-only), @openlance/aios-runtime and @openlance/aios-operations
(namespaces, the frozen models), @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins,
@openlance/aios-errors, @openlance/aios-kernel (substrate) }`. One `app -> app` (type-only), two `app -> namespace`, five
`app -> substrate`. It depends on no other operational engine and on no runtime internal, holds no vendor knowledge, and
nothing depends on it, so the graph is acyclic.

## 6. Operational model (deterministic, fail-closed, idempotent)

The engine is a deterministic operational-state machine over immutable observations. Each observation is deduplicated by
its id; a duplicate changes nothing. Health is one of the frozen `HEALTH_STATES`; an unknown observation, or none, never
yields `healthy`. An incident is opened once per correlation key; an alert is raised once per active condition. Every
output is immutable and carries a deterministic content-hash id, so an identical observation sequence always yields
identical `OperationalStatus`, `HealthReport`, `IncidentReport`, dashboard, and audit. The engine holds no mutable shared
static state; each manager instance is self-contained.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component and path is tested: telemetry/metrics collection and aggregation, health (each frozen state, fail-closed
  unknown), incident (open, correlate, every lifecycle transition, illegal transition), alert (raise, route, suppress),
  dashboard, capacity, trend, maintenance (each category and lifecycle state), diagnostics, audit (dedup), the
  coordinator, and the manager. Plus determinism, idempotency, zero-trust, concurrency, large-event-stream, and stress
  suites, and the no-vendor-knowledge and no-execution guards.
- **Fail-closed.** The public API never throws; an unknown observation never yields `healthy`.
- **Benchmarks (ADR-0022 Rule 5).** Observe (a full cycle), health assessment, metrics aggregation, incident correlation,
  and dashboard build, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0045 and this design are the Stage 11 artifacts. On completion the stage is validated, benchmarked,
independently audited, documented, committed, and frozen, completing Phase 4. The recommended next step is a Phase 4
constitutional review across Stages 7-11 before any Phase 5 work.
