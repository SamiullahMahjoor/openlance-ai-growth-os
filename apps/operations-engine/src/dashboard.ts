import type { HealthState } from '@openlance/aios-operations';

import type { OperationsHash } from './hash.js';
import type {
  CapacityReport,
  OperationalDashboard,
  OperationalMetrics,
  OperationalStatus,
  Trend,
} from './types.js';

/** The composed inputs a dashboard is built from; every part is already an immutable operational output. */
export interface DashboardInput {
  readonly status: OperationalStatus;
  readonly health: HealthState;
  readonly metrics: OperationalMetrics;
  readonly incidents: number;
  readonly alerts: number;
  readonly capacity: CapacityReport;
  readonly trend: Trend;
}

/**
 * The dashboard builder: it composes the immutable operational parts (status, health, metrics, incident and alert counts,
 * capacity, and trend) into one immutable {@link OperationalDashboard} with a deterministic content-hash id. It composes
 * only; it collects nothing and changes no behavior.
 */
export class DashboardBuilder {
  /** Build the immutable dashboard from its parts. */
  build(input: DashboardInput, hash: OperationsHash): OperationalDashboard {
    const canonical = JSON.stringify([
      input.status.id,
      input.health,
      input.metrics.id,
      input.incidents,
      input.alerts,
      input.capacity.id,
      input.trend,
    ]);
    return Object.freeze({
      status: input.status,
      health: input.health,
      metrics: input.metrics,
      incidents: input.incidents,
      alerts: input.alerts,
      capacity: input.capacity,
      trend: input.trend,
      id: hash.hash(canonical),
    });
  }
}

/**
 * The dashboard manager: it produces the immutable operational dashboard from the current operational state through the
 * {@link DashboardBuilder}. It reports a read-only view only; it changes no behavior and executes nothing.
 */
export class DashboardManager {
  readonly #builder = new DashboardBuilder();

  /** Compose the immutable dashboard. */
  compose(input: DashboardInput, hash: OperationsHash): OperationalDashboard {
    return this.#builder.build(input, hash);
  }
}
