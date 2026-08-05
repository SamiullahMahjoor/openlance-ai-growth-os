import type { Result } from '@openlance/aios-kernel';

import type { OperationalAuditManager } from './audit.js';
import type { AlertManager } from './alert.js';
import type { OperationsSettings } from './configuration.js';
import type { OperationsError } from './errors.js';
import type { OperationsEvents } from './events.js';
import type { OperationsHash } from './hash.js';
import type { HealthAssessment, HealthAggregator, HealthManager } from './health.js';
import type { IncidentManager } from './incident.js';
import type { MetricsAggregator } from './metrics.js';
import type { OperationsMetrics } from './ops-metrics.js';
import type { TelemetryAggregator, TelemetryCollector } from './telemetry.js';
import type { TrendAnalyzer } from './trend.js';
import type {
  IncidentReport,
  IncidentState,
  Observation,
  OperationalAlert,
  OperationalAudit,
  OperationalMetrics,
  OperationalSeverity,
  OperationsStatistics,
  Trend,
} from './types.js';

/** The collaborators a {@link OperationsCoordinator} is composed from. */
export interface OperationsParts {
  readonly telemetryCollector: TelemetryCollector;
  readonly telemetryAggregator: TelemetryAggregator;
  readonly metricsAggregator: MetricsAggregator;
  readonly health: HealthManager;
  readonly healthAggregator: HealthAggregator;
  readonly trend: TrendAnalyzer;
  readonly incidents: IncidentManager;
  readonly alerts: AlertManager;
  readonly audit: OperationalAuditManager;
  readonly counters: OperationsMetrics;
  readonly events: OperationsEvents;
  readonly hash: OperationsHash;
}

/** The alert severity implied by an assessed health state. */
const SEVERITY: Readonly<Record<'healthy' | 'degraded' | 'failed', OperationalSeverity>> =
  Object.freeze({
    healthy: 'info',
    degraded: 'warning',
    failed: 'critical',
  });

/**
 * The operations coordinator: it orchestrates one immutable observation - deduplicate (the audit is the idempotency
 * authority), collect and aggregate telemetry into metrics, assess health, record the trend, correlate and open an
 * incident on a failing execution, evaluate and suppress an alert, and emit the operations-owned events -
 * deterministically and idempotently. It observes and reports only; it reads the immutable runtime outputs and never
 * modifies them, never executes, and never protects, degrades, or decides.
 */
export class OperationsCoordinator {
  readonly #parts: OperationsParts;
  readonly #settings: OperationsSettings;
  #lastHealth: 'healthy' | 'degraded' | 'failed' | null = null;

  constructor(parts: OperationsParts, settings: OperationsSettings) {
    this.#parts = parts;
    this.#settings = settings;
  }

  /** Observe one immutable runtime output; a duplicate (by id) changes nothing. */
  async observe(observation: Observation, muted: ReadonlySet<string>): Promise<void> {
    if (!this.#parts.audit.record(observation)) {
      this.#parts.counters.recordDuplicate();
      return;
    }
    this.#parts.counters.recordObservation();
    this.#parts.telemetryAggregator.record(this.#parts.telemetryCollector.collect(observation));
    const metrics = this.metrics();
    const assessment = this.health();
    this.#parts.healthAggregator.record(assessment.state, this.#settings.historyLimit);
    // Only a record observation moves the failure ratio; an event or statistics heartbeat must not flatten the trend.
    if (observation.kind === 'record') {
      this.#parts.trend.record(metrics.failureRatio);
    }

    if (observation.kind === 'record' && observation.record.terminal !== 'completed') {
      const severity: OperationalSeverity =
        observation.record.terminal === 'failed' ? 'critical' : 'warning';
      if (
        this.#parts.incidents.recognize(
          observation.record.governance,
          severity,
          observation.record.reason,
        )
      ) {
        this.#parts.counters.recordIncidentOpened();
        await this.#parts.events.incidentOpened(observation.record.governance);
      }
    }

    if (
      this.#parts.alerts.evaluate(
        metrics.failureRatio,
        this.#settings.alertThreshold,
        SEVERITY[assessment.state],
        muted,
      )
    ) {
      this.#parts.counters.recordAlertRaised();
      await this.#parts.events.alertRaised('high-failure-ratio');
    }

    if (this.#lastHealth !== assessment.state) {
      this.#lastHealth = assessment.state;
      await this.#parts.events.healthChanged(assessment.state);
    }
    await this.#parts.events.observed(observation.id);
  }

  /** The current immutable operational metrics. */
  metrics(): OperationalMetrics {
    return this.#parts.metricsAggregator.build(this.#parts.telemetryAggregator.totals());
  }

  /** The current health assessment. */
  health(): HealthAssessment {
    return this.#parts.health.assess(this.metrics(), this.#settings.failedThreshold);
  }

  /** The current immutable health report. */
  healthReport(): ReturnType<HealthAggregator['report']> {
    return this.#parts.healthAggregator.report(this.health(), this.#parts.hash);
  }

  /** The current immutable incident report. */
  incidentReport(): IncidentReport {
    return this.#parts.incidents.report(this.#parts.hash);
  }

  /** Transition an incident along its realized lifecycle. */
  transitionIncident(key: string, to: IncidentState): Result<void, OperationsError> {
    return this.#parts.incidents.transition(key, to);
  }

  /** The number of active incidents. */
  openIncidents(): number {
    return this.#parts.incidents.openCount;
  }

  /** The current immutable active alerts. */
  alerts(): readonly OperationalAlert[] {
    return this.#parts.alerts.alerts(this.#parts.hash);
  }

  /** The number of active alerts. */
  activeAlerts(): number {
    return this.#parts.alerts.activeCount;
  }

  /** The current metric trend. */
  trend(): Trend {
    return this.#parts.trend.trend();
  }

  /** The current immutable operational audit. */
  audit(): OperationalAudit {
    return this.#parts.audit.audit(this.#parts.hash);
  }

  /** A frozen snapshot of the engine's own counters. */
  statistics(): OperationsStatistics {
    return this.#parts.counters.statistics();
  }
}
