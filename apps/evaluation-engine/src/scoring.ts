import type { MeasuredMetric, Score } from './types.js';

/**
 * The scorer: it derives a score from the measured metrics by a defined, transparent, traceable calculation - the
 * arithmetic mean of the measured values - recording the metric names it derived from, so a score is always traceable to
 * its measurements and never assigned by opinion. It returns `null` when no score can be derived (no metrics, or a
 * non-finite or out-of-range value), so a score is never invented from ungrounded ground. It derives; it decides nothing.
 */
export class Scorer {
  /** Derive a score from the measured metrics, or `null` when no score can be derived. */
  derive(measured: readonly MeasuredMetric[]): Score | null {
    if (measured.length === 0) {
      return null;
    }
    let sum = 0;
    for (const metric of measured) {
      if (!Number.isFinite(metric.value) || metric.value < 0 || metric.value > 1) {
        return null;
      }
      sum += metric.value;
    }
    return Object.freeze({
      value: sum / measured.length,
      method: 'mean',
      metrics: Object.freeze(measured.map((metric) => metric.metric)),
    });
  }
}
