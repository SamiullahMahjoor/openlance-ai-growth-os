import type { HealthState } from '@openlance/aios-operations';

import type { OperationsHash } from './hash.js';
import type { OperationalDiagnostics, OperationalMetrics } from './types.js';

/**
 * The diagnostics manager: it builds an immutable operational diagnostics view from the assessed health and the observed
 * metrics - the failure ratio and the retry, timeout, recovery, and unknown-telemetry counts - so an operator can
 * investigate the running of the layer. It diagnoses operationally and reproducibly; it changes no behavior and executes
 * nothing.
 */
export class DiagnosticsManager {
  /** Build the immutable operational diagnostics view. */
  diagnose(
    health: HealthState,
    metrics: OperationalMetrics,
    hash: OperationsHash,
  ): OperationalDiagnostics {
    const canonical = JSON.stringify([
      health,
      metrics.failureRatio,
      metrics.retries,
      metrics.timeouts,
      metrics.recoveries,
      metrics.unknown,
    ]);
    return Object.freeze({
      health,
      failureRatio: metrics.failureRatio,
      retries: metrics.retries,
      timeouts: metrics.timeouts,
      recoveries: metrics.recoveries,
      unknown: metrics.unknown,
      id: hash.hash(canonical),
    });
  }
}
