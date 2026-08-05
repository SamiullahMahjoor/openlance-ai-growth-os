import type { HealthState, MaintenanceCategory } from '@openlance/aios-operations';
import type { RuntimeEvent } from '@openlance/aios-runtime';
import type {
  ExecutionRecord,
  ExecutionStatistics,
} from '@openlance/aios-runtime-execution-engine';

/**
 * An immutable operational observation the engine consumes: a frozen `RuntimeEvent` occurrence, an immutable
 * `ExecutionRecord`, or an immutable `ExecutionStatistics` snapshot. Each carries an idempotency `id`, so a repeated
 * observation is recognized and never double-counted. Operations consumes these immutable runtime outputs only; it never
 * consumes a plan, a decision, or any runtime internal.
 */
export type Observation =
  | {
      readonly kind: 'event';
      readonly id: string;
      readonly executionId: string;
      readonly event: RuntimeEvent;
      readonly at: number;
    }
  | { readonly kind: 'record'; readonly id: string; readonly record: ExecutionRecord }
  | {
      readonly kind: 'statistics';
      readonly id: string;
      readonly statistics: ExecutionStatistics;
      readonly at: number;
    };

/** The operational facts extracted from one observation; the metrics aggregate them incrementally. */
export interface OperationalFacts {
  readonly executions: number;
  readonly completed: number;
  readonly failed: number;
  readonly cancelled: number;
  readonly stepsRun: number;
  readonly retries: number;
  readonly recoveries: number;
  readonly timeouts: number;
  readonly unknown: number;
}

/** The immutable aggregated operational metrics derived from the observed runtime outputs. */
export interface OperationalMetrics {
  readonly executions: number;
  readonly completed: number;
  readonly failed: number;
  readonly cancelled: number;
  readonly stepsRun: number;
  readonly retries: number;
  readonly recoveries: number;
  readonly timeouts: number;
  readonly unknown: number;
  readonly failureRatio: number;
  readonly id: string;
}

/** An immutable health report: the assessed frozen health state, the reason, and the recent state history. */
export interface HealthReport {
  readonly state: HealthState;
  readonly reason: string;
  readonly history: readonly HealthState[];
  readonly id: string;
}

/** The realized operational incident lifecycle states (grounded in the frozen "recognition to closure" lifecycle). */
export type IncidentState =
  'open' | 'acknowledged' | 'investigating' | 'mitigated' | 'resolved' | 'closed';

/** The operational severity an incident or alert is classified by (grounded in the frozen "classified by severity"). */
export type OperationalSeverity = 'info' | 'warning' | 'critical';

/** An immutable operational incident: a discrete disruption, correlated by key, with a realized lifecycle. */
export interface Incident {
  readonly key: string;
  readonly state: IncidentState;
  readonly severity: OperationalSeverity;
  readonly occurrences: number;
  readonly reason: string;
  readonly id: string;
}

/** An immutable incident report: the current incidents, newest disruption first. */
export interface IncidentReport {
  readonly incidents: readonly Incident[];
  readonly open: number;
  readonly id: string;
}

/** An immutable operational alert: a monitored threshold breach, routed by severity, suppressible while active. */
export interface OperationalAlert {
  readonly key: string;
  readonly severity: OperationalSeverity;
  readonly route: string;
  readonly reason: string;
  readonly id: string;
}

/** The realized maintenance-activity lifecycle states (grounded in the frozen "plan to completion" lifecycle). */
export type MaintenanceState =
  'planned' | 'approved' | 'scheduled' | 'running' | 'completed' | 'cancelled';

/** An immutable maintenance activity: a frozen category and a realized lifecycle state. */
export interface MaintenanceActivity {
  readonly key: string;
  readonly category: MaintenanceCategory;
  readonly state: MaintenanceState;
  readonly summary: string;
  readonly id: string;
}

/** An immutable maintenance plan: the current maintenance activities. */
export interface MaintenancePlan {
  readonly activities: readonly MaintenanceActivity[];
  readonly id: string;
}

/** An immutable capacity report: throughput and load visibility derived from the observed metrics. */
export interface CapacityReport {
  readonly executions: number;
  readonly stepsRun: number;
  readonly retries: number;
  readonly failureRatio: number;
  readonly bottleneck: 'none' | 'failures' | 'retries';
  readonly id: string;
}

/** The direction of a monitored metric trend. */
export type Trend = 'rising' | 'falling' | 'stable';

/** An immutable operational status: the top-level operational summary. */
export interface OperationalStatus {
  readonly health: HealthState;
  readonly openIncidents: number;
  readonly activeAlerts: number;
  readonly executions: number;
  readonly failureRatio: number;
  readonly id: string;
}

/** An immutable operational dashboard: a composed, read-only view of the operational state. */
export interface OperationalDashboard {
  readonly status: OperationalStatus;
  readonly health: HealthState;
  readonly metrics: OperationalMetrics;
  readonly incidents: number;
  readonly alerts: number;
  readonly capacity: CapacityReport;
  readonly trend: Trend;
  readonly id: string;
}

/** An immutable operational diagnostics view. */
export interface OperationalDiagnostics {
  readonly health: HealthState;
  readonly failureRatio: number;
  readonly retries: number;
  readonly timeouts: number;
  readonly recoveries: number;
  readonly unknown: number;
  readonly id: string;
}

/** One immutable operational audit entry: an observation the engine processed. */
export interface AuditEntry {
  readonly observation: string;
  readonly kind: Observation['kind'];
  readonly at: number;
}

/** An immutable operational audit trail. */
export interface OperationalAudit {
  readonly entries: readonly AuditEntry[];
  readonly id: string;
}

/** A named operations policy: an operator- or plugin-contributed set of alert keys to suppress (mute). */
export interface OperationsPolicy {
  readonly name: string;
  readonly mutedAlerts: readonly string[];
}

/** An operations policy's registration input; the factory validates it, normalizes its names, and freezes it. */
export interface OperationsPolicyInput {
  readonly name: string;
  readonly mutedAlerts?: readonly string[];
}

/** A read-only snapshot of the engine's own operational counters. */
export interface OperationsStatistics {
  readonly observations: number;
  readonly duplicates: number;
  readonly incidentsOpened: number;
  readonly alertsRaised: number;
}

/** A read-only operational view of the engine itself. */
export interface OperationsDiagnosticsView {
  readonly policyCount: number;
  readonly statistics: OperationsStatistics;
}
