import type { OperationsHash } from './hash.js';
import type { OperationalFacts, OperationalMetrics } from './types.js';

/**
 * The metrics collector: it derives the metrics computed from the aggregated telemetry totals - the failure ratio over
 * the terminal executions. It derives only; it collects no raw telemetry (that is the telemetry collector's) and decides
 * nothing.
 */
export class MetricsCollector {
  /** The failure ratio (failed plus cancelled, over terminal executions); zero when nothing has completed. */
  failureRatio(totals: OperationalFacts): number {
    const terminal = totals.completed + totals.failed + totals.cancelled;
    return terminal === 0 ? 0 : (totals.failed + totals.cancelled) / terminal;
  }
}

/**
 * The metrics aggregator: it composes the aggregated telemetry totals and the derived failure ratio into an immutable
 * {@link OperationalMetrics} with a deterministic content-hash id. It aggregates only; it carries no runtime truth and
 * recomputes no runtime metric.
 */
export class MetricsAggregator {
  readonly #collector: MetricsCollector;
  readonly #hash: OperationsHash;

  constructor(collector: MetricsCollector, hash: OperationsHash) {
    this.#collector = collector;
    this.#hash = hash;
  }

  /** Build the immutable operational metrics from the telemetry totals. */
  build(totals: OperationalFacts): OperationalMetrics {
    const failureRatio = this.#collector.failureRatio(totals);
    const canonical = JSON.stringify([
      totals.executions,
      totals.completed,
      totals.failed,
      totals.cancelled,
      totals.stepsRun,
      totals.retries,
      totals.recoveries,
      totals.timeouts,
      totals.unknown,
      failureRatio,
    ]);
    return Object.freeze({
      executions: totals.executions,
      completed: totals.completed,
      failed: totals.failed,
      cancelled: totals.cancelled,
      stepsRun: totals.stepsRun,
      retries: totals.retries,
      recoveries: totals.recoveries,
      timeouts: totals.timeouts,
      unknown: totals.unknown,
      failureRatio,
      id: this.#hash.hash(canonical),
    });
  }
}
