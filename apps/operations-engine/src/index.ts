/**
 * @packageDocumentation
 * `@openlance/aios-operations-engine`
 *
 * The AIOS Operations Engine (Phase 4, Stage 11): the Runtime's operational supervision subsystem, the operational
 * realization of the frozen `ai/operations/` observability model. It consumes only immutable runtime outputs - a frozen
 * `RuntimeEvent` occurrence, an `ExecutionRecord`, or an `ExecutionStatistics` snapshot - derives its operational state
 * internally, and produces only operations-owned outputs: `OperationalStatus`, `HealthReport`, `IncidentReport`,
 * `OperationalAlert`, `MaintenancePlan`, `OperationalMetrics`, `OperationalDashboard`, `CapacityReport`,
 * `OperationalDiagnostics`, and `OperationalAudit`.
 *
 * The pipeline is Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime, with the Operations Engine
 * observing the running runtime. It **observes and supervises**: it never executes, orchestrates, schedules, retries,
 * recovers, cancels, checkpoints, selects or invokes a provider, or performs inference; it never introduces or extends
 * the frozen `RuntimeEvent` contract, never modifies a runtime output, and recomputes no runtime metric; and it defers a
 * protective response to `ai/safety/` and a governed decision to `ai/governance/`. It applies the frozen `HEALTH_STATES`
 * and `MAINTENANCE_CATEGORIES`, is deterministic, idempotent, fail-closed, and zero-trust (an unknown observation never
 * yields `healthy`), and holds no vendor knowledge (ADR-0045). This file is the single supported public API (Engineering
 * Rule 1). This is the final Phase 4 stage.
 */

export type {
  Observation,
  OperationalFacts,
  OperationalMetrics,
  HealthReport,
  IncidentState,
  OperationalSeverity,
  Incident,
  IncidentReport,
  OperationalAlert,
  MaintenanceState,
  MaintenanceActivity,
  MaintenancePlan,
  CapacityReport,
  Trend,
  OperationalStatus,
  OperationalDashboard,
  OperationalDiagnostics,
  AuditEntry,
  OperationalAudit,
  OperationsPolicy,
  OperationsPolicyInput,
  OperationsStatistics,
  OperationsDiagnosticsView,
} from './types.js';

export { OperationsError } from './errors.js';
export { OperationsHash } from './hash.js';
export { OperationsNormalizer } from './normalizer.js';
export { OperationsConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { OperationsSettings } from './configuration.js';
export { TelemetryCollector, TelemetryAggregator } from './telemetry.js';
export { MetricsCollector, MetricsAggregator } from './metrics.js';
export { HealthManager, HealthAggregator } from './health.js';
export type { HealthAssessment } from './health.js';
export { IncidentManager, IncidentCorrelationEngine } from './incident.js';
export { AlertManager, AlertRouter, AlertSuppressor } from './alert.js';
export { CapacityManager } from './capacity.js';
export { TrendAnalyzer } from './trend.js';
export { MaintenanceManager } from './maintenance.js';
export { DiagnosticsManager } from './diagnostics.js';
export { OperationalAuditManager } from './audit.js';
export { DashboardManager, DashboardBuilder } from './dashboard.js';
export type { DashboardInput } from './dashboard.js';
export { OperationsCoordinator } from './coordinator.js';
export type { OperationsParts } from './coordinator.js';
export { OperationsMetrics } from './ops-metrics.js';
export { OperationsEvents, OPERATIONS_EVENT_TYPES } from './events.js';
export { OperationsPolicyFactory } from './factory.js';
export { OperationsPolicyRegistry } from './registry.js';
export { OperationsPluginBridge } from './plugin-bridge.js';
export type { OperationsPlugin } from './plugin-bridge.js';
export { OperationsManager } from './manager.js';
export type { OperationsManagerOptions } from './manager.js';
export { operationsEngineModule, OPERATIONS_MANAGER } from './module.js';
