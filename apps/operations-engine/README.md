# @openlance/aios-operations-engine

The AIOS **Operations Engine** (Phase 4, Stage 11, the final Phase 4 stage): the Runtime's operational supervision
subsystem, the operational realization of the frozen `ai/operations/` observability model. See
[ADR-0045](../../docs/implementation/adr/0045-operations-engine.md) and the
[design doc](../../docs/implementation/42-operations-engine.md).

## Ambiguity Gate (resolved: Option 1)

The mandate said "introduce a frozen RuntimeEvent contract", but `RuntimeEvent` is already a frozen type owned by
`ai/runtime/` (a closed 8-event set), and the frozen Stage-10 engine emits only a subset plus the immutable
`ExecutionRecord` / `ExecutionStatistics` / `ExecutionDiagnostics`. Resolution: **Operations consumes only the existing
immutable runtime outputs, introduces no new/competing `RuntimeEvent`, and observes retry/recovery/checkpoint/timeout by
reading the immutable records** (step `attempts`, the `recovering` state in the path, `statistics.retries`) - never new
runtime events, never modifying Stage 10.

## What it does

For an immutable `Observation` (a frozen `RuntimeEvent` occurrence, an `ExecutionRecord`, or an `ExecutionStatistics`
snapshot, each with an idempotency id), the engine deterministically: deduplicates it; aggregates telemetry into
`OperationalMetrics`; assesses one of the frozen `HEALTH_STATES` (`healthy < degraded < failed`, fail-closed - an unknown
observation never yields `healthy`); correlates and opens an `Incident` on a failing execution (a realized `open -> closed`
lifecycle); evaluates, routes, and suppresses an `OperationalAlert`; and records the trend and an immutable audit. It
produces only operations-owned outputs: `OperationalStatus`, `HealthReport`, `IncidentReport`, `OperationalAlert`,
`MaintenancePlan` (over the frozen `MAINTENANCE_CATEGORIES`), `OperationalMetrics`, `OperationalDashboard`,
`CapacityReport`, `OperationalDiagnostics`, and `OperationalAudit`.

## What it never does

It never executes, orchestrates, schedules, retries, recovers, cancels, checkpoints, selects or invokes a provider, or
performs inference; it never introduces or extends the frozen `RuntimeEvent`, modifies a runtime output, or recomputes a
runtime metric; and it never protects, degrades, or decides - it defers a protective response to `ai/safety/` and a
governed decision to `ai/governance/`. It is deterministic, idempotent, fail-closed, zero-trust, and holds no vendor
knowledge.

## Public API

`OperationsManager` (facade and DI entry, registered under `OPERATIONS_MANAGER` through the composition-root seam)
exposes `observe` (an immutable runtime output) and the immutable report readers (`status`, `health`, `incidents`,
`alerts`, `metrics`, `capacity`, `dashboard`, `operationalDiagnostics`, `maintenance`, `audit`), plus `register` /
`remove` (policies), incident and maintenance transitions, `statistics`, and `diagnostics`. See `src/index.ts`.

## Boundaries

Operations depends on the Runtime Execution Engine (type-only: `ExecutionRecord` / `ExecutionStatistics`), the `runtime`
namespace (the frozen `RuntimeEvent`), the `operations` namespace (the frozen model it applies), and the substrate. It
depends on no other operational engine and on no runtime internal, and nothing depends on it.
