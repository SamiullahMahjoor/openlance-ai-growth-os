import type { OperationsHash } from './hash.js';
import type { CapacityReport, OperationalMetrics } from './types.js';

/**
 * The capacity manager: it builds an immutable capacity report from the observed metrics - throughput (executions),
 * work (steps), retries, the failure ratio, and the dominant bottleneck (grounded in the frozen observability and
 * monitoring concerns of resource signals). It reports visibility only; it schedules and executes nothing, and it
 * changes no runtime behavior.
 */
export class CapacityManager {
  /** Build the immutable capacity report from the metrics. */
  report(metrics: OperationalMetrics, hash: OperationsHash): CapacityReport {
    const bottleneck: CapacityReport['bottleneck'] =
      metrics.failureRatio >= 0.5
        ? 'failures'
        : metrics.executions > 0 && metrics.retries > metrics.executions
          ? 'retries'
          : 'none';
    const canonical = JSON.stringify([
      metrics.executions,
      metrics.stepsRun,
      metrics.retries,
      metrics.failureRatio,
      bottleneck,
    ]);
    return Object.freeze({
      executions: metrics.executions,
      stepsRun: metrics.stepsRun,
      retries: metrics.retries,
      failureRatio: metrics.failureRatio,
      bottleneck,
      id: hash.hash(canonical),
    });
  }
}
