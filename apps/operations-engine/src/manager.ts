import type { MaintenanceCategory } from '@openlance/aios-operations';
import type { Clock, Result } from '@openlance/aios-kernel';
import { err, isErr, ok } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { OperationalAuditManager } from './audit.js';
import { AlertManager } from './alert.js';
import { CapacityManager } from './capacity.js';
import { OperationsConfiguration } from './configuration.js';
import type { OperationsSettings } from './configuration.js';
import { OperationsCoordinator } from './coordinator.js';
import { DashboardManager } from './dashboard.js';
import { DiagnosticsManager } from './diagnostics.js';
import type { OperationsError } from './errors.js';
import { OperationsEvents } from './events.js';
import { OperationsPolicyFactory } from './factory.js';
import { OperationsHash } from './hash.js';
import { HealthAggregator, HealthManager } from './health.js';
import { IncidentManager } from './incident.js';
import { MaintenanceManager } from './maintenance.js';
import { MetricsAggregator, MetricsCollector } from './metrics.js';
import { OperationsMetrics } from './ops-metrics.js';
import { OperationsPolicyRegistry } from './registry.js';
import { TelemetryAggregator, TelemetryCollector } from './telemetry.js';
import { TrendAnalyzer } from './trend.js';
import type {
  CapacityReport,
  HealthReport,
  IncidentReport,
  IncidentState,
  MaintenancePlan,
  MaintenanceState,
  Observation,
  OperationalAlert,
  OperationalAudit,
  OperationalDashboard,
  OperationalDiagnostics,
  OperationalMetrics,
  OperationalStatus,
  OperationsDiagnosticsView,
  OperationsPolicyInput,
  OperationsStatistics,
} from './types.js';

/** The options an {@link OperationsManager} is constructed from. */
export interface OperationsManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<OperationsSettings>;
}

/**
 * The Operations Engine facade and DI entry. It composes the observation pipeline (telemetry, metrics, health, incident,
 * alert, trend, audit) through the coordinator, and the report builders (capacity, diagnostics, dashboard) and the
 * maintenance and policy managers, into one operational supervision subsystem, and exposes the engine's operations:
 * observe an immutable runtime output, and read the immutable operations-owned outputs (status, health, incidents,
 * alerts, metrics, capacity, dashboard, maintenance, diagnostics, audit). It applies the frozen operations model,
 * observes and supervises, and never executes or overrides a runtime output.
 */
export class OperationsManager {
  readonly #configuration: OperationsConfiguration;
  readonly #hash: OperationsHash;
  readonly #registry: OperationsPolicyRegistry;
  readonly #factory: OperationsPolicyFactory;
  readonly #coordinator: OperationsCoordinator;
  readonly #maintenance: MaintenanceManager;
  readonly #capacity: CapacityManager;
  readonly #diagnostics: DiagnosticsManager;
  readonly #dashboard: DashboardManager;

  constructor(options: OperationsManagerOptions) {
    this.#configuration = new OperationsConfiguration(options.settings);
    this.#hash = new OperationsHash();
    this.#registry = new OperationsPolicyRegistry();
    this.#factory = new OperationsPolicyFactory();
    this.#maintenance = new MaintenanceManager();
    this.#capacity = new CapacityManager();
    this.#diagnostics = new DiagnosticsManager();
    this.#dashboard = new DashboardManager();
    this.#coordinator = new OperationsCoordinator(
      {
        telemetryCollector: new TelemetryCollector(),
        telemetryAggregator: new TelemetryAggregator(),
        metricsAggregator: new MetricsAggregator(new MetricsCollector(), this.#hash),
        health: new HealthManager(),
        healthAggregator: new HealthAggregator(),
        trend: new TrendAnalyzer(),
        incidents: new IncidentManager(),
        alerts: new AlertManager(),
        audit: new OperationalAuditManager(),
        counters: new OperationsMetrics(),
        events: new OperationsEvents(options.bus, options.clock),
        hash: this.#hash,
      },
      this.#configuration.settings,
    );
  }

  /** Observe one immutable runtime output; a duplicate changes nothing. It never throws. */
  async observe(observation: Observation): Promise<void> {
    await this.#coordinator.observe(observation, this.#registry.mutedAlerts());
  }

  /** The immutable operational status. */
  status(): OperationalStatus {
    const metrics = this.#coordinator.metrics();
    const health = this.#coordinator.health();
    const openIncidents = this.#coordinator.openIncidents();
    const activeAlerts = this.#coordinator.activeAlerts();
    const canonical = JSON.stringify([
      health.state,
      openIncidents,
      activeAlerts,
      metrics.executions,
      metrics.failureRatio,
    ]);
    return Object.freeze({
      health: health.state,
      openIncidents,
      activeAlerts,
      executions: metrics.executions,
      failureRatio: metrics.failureRatio,
      id: this.#hash.hash(canonical),
    });
  }

  /** The immutable health report. */
  health(): HealthReport {
    return this.#coordinator.healthReport();
  }

  /** The immutable incident report. */
  incidents(): IncidentReport {
    return this.#coordinator.incidentReport();
  }

  /** Transition an incident along its realized lifecycle; fail closed on an unknown incident or an illegal move. */
  transitionIncident(key: string, to: IncidentState): Result<void, OperationsError> {
    return this.#coordinator.transitionIncident(key, to);
  }

  /** The immutable active alerts. */
  alerts(): readonly OperationalAlert[] {
    return this.#coordinator.alerts();
  }

  /** The immutable operational metrics. */
  metrics(): OperationalMetrics {
    return this.#coordinator.metrics();
  }

  /** The immutable capacity report. */
  capacity(): CapacityReport {
    return this.#capacity.report(this.#coordinator.metrics(), this.#hash);
  }

  /** The immutable operational diagnostics about the running layer. */
  operationalDiagnostics(): OperationalDiagnostics {
    return this.#diagnostics.diagnose(
      this.#coordinator.health().state,
      this.#coordinator.metrics(),
      this.#hash,
    );
  }

  /** The immutable operational dashboard. */
  dashboard(): OperationalDashboard {
    const status = this.status();
    return this.#dashboard.compose(
      {
        status,
        health: status.health,
        metrics: this.#coordinator.metrics(),
        incidents: this.#coordinator.openIncidents(),
        alerts: this.#coordinator.activeAlerts(),
        capacity: this.capacity(),
        trend: this.#coordinator.trend(),
      },
      this.#hash,
    );
  }

  /** Plan a maintenance activity; fail closed on a blank key, an unknown category, or a duplicate. */
  planMaintenance(
    key: string,
    category: MaintenanceCategory,
    summary: string,
  ): Result<void, OperationsError> {
    return this.#maintenance.plan(key, category, summary);
  }

  /** Transition a maintenance activity along its realized lifecycle. */
  transitionMaintenance(key: string, to: MaintenanceState): Result<void, OperationsError> {
    return this.#maintenance.transition(key, to);
  }

  /** The immutable maintenance plan. */
  maintenance(): MaintenancePlan {
    return this.#maintenance.plans(this.#hash);
  }

  /** The immutable operational audit trail. */
  audit(): OperationalAudit {
    return this.#coordinator.audit();
  }

  /** Register an operations policy; fail closed on an invalid or duplicate policy. */
  register(input: OperationsPolicyInput): Result<string, OperationsError> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    return ok(created.value.name);
  }

  /** Remove a registered policy; returns whether one was removed. */
  remove(name: string): boolean {
    return this.#registry.unregister(name);
  }

  /** A frozen snapshot of the engine's own statistics. */
  statistics(): OperationsStatistics {
    return this.#coordinator.statistics();
  }

  /** A frozen operational view of the engine itself. */
  diagnostics(): OperationsDiagnosticsView {
    return Object.freeze({
      policyCount: this.#registry.list().length,
      statistics: this.#coordinator.statistics(),
    });
  }
}
