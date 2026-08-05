import { healthStateAtOrAfter } from '@openlance/aios-operations';
import type { HealthState } from '@openlance/aios-operations';

import type { OperationsHash } from './hash.js';
import type { HealthReport, OperationalMetrics } from './types.js';

/** An assessed health state and its explaining reason. */
export interface HealthAssessment {
  readonly state: HealthState;
  readonly reason: string;
}

/**
 * The health manager: it assesses the operational health of the running layer as one of the frozen `HEALTH_STATES`
 * (`healthy`, `degraded`, `failed`), from the aggregated metrics, applying the frozen model and inventing no state. It is
 * fail closed: no confirmed execution, any failure below the failed threshold, or any unrecognized telemetry yields
 * `degraded`, never `healthy`; a failure ratio at or above the failed threshold yields `failed`. It assesses and reports;
 * it never itself protects, degrades, or decides (the frozen health-management invariant), and assessing is inert.
 */
export class HealthManager {
  /** Assess the health state deterministically from the metrics. */
  assess(metrics: OperationalMetrics, failedThreshold: number): HealthAssessment {
    const terminal = metrics.completed + metrics.failed + metrics.cancelled;
    if (terminal === 0) {
      return {
        state: 'degraded',
        reason:
          'No completed execution has been observed; health is not yet confirmed (fail closed).',
      };
    }
    if (metrics.failureRatio >= failedThreshold) {
      return {
        state: 'failed',
        reason: `The failure ratio ${metrics.failureRatio} is at or above the failed threshold ${failedThreshold}.`,
      };
    }
    if (metrics.unknown > 0) {
      return {
        state: 'degraded',
        reason: 'Unrecognized telemetry was observed; health cannot be confirmed (fail closed).',
      };
    }
    if (metrics.failureRatio > 0) {
      return {
        state: 'degraded',
        reason: `The failure ratio ${metrics.failureRatio} is nonzero but below the failed threshold.`,
      };
    }
    return { state: 'healthy', reason: 'Every observed execution completed successfully.' };
  }
}

/**
 * The health aggregator: it aggregates component health into an overall health state using the frozen
 * `healthStateAtOrAfter` order (the worst component health wins, so overall health is never better than its worst part),
 * retains a bounded health history, and builds the immutable {@link HealthReport}. An empty component set is `degraded`
 * (fail closed). It aggregates only; assessing is inert.
 */
export class HealthAggregator {
  readonly #history: HealthState[] = [];

  /** The overall (worst) health across a set of component states; `degraded` when there is none (fail closed). */
  worst(states: readonly HealthState[]): HealthState {
    let overall: HealthState | null = null;
    for (const state of states) {
      if (overall === null || healthStateAtOrAfter(state, overall)) {
        overall = state;
      }
    }
    return overall ?? 'degraded';
  }

  /** Append a state to the bounded health history. */
  record(state: HealthState, limit: number): void {
    this.#history.push(state);
    while (this.#history.length > limit) {
      this.#history.shift();
    }
  }

  /** Build the immutable health report. */
  report(assessment: HealthAssessment, hash: OperationsHash): HealthReport {
    const history = Object.freeze([...this.#history]);
    const canonical = JSON.stringify([assessment.state, assessment.reason, history]);
    return Object.freeze({
      state: assessment.state,
      reason: assessment.reason,
      history,
      id: hash.hash(canonical),
    });
  }
}
