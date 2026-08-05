import { EvaluationNormalizer } from './normalizer.js';
import type { MeasuredMetric, MetricMeasurement } from './types.js';

/**
 * The measurer: it records the framed metric measurements as immutable measured metrics, observing each value and never
 * changing it, and never defining a metric mechanism. It normalizes each metric name and settles the measured metrics
 * into a deterministic, name-sorted order, so the same distinct metrics (in any input order) yield the same measurement
 * (duplicate metric names are rejected by well-formedness validation). Zero
 * trust: a structurally malformed metric never throws; a missing name settles to blank and a missing value to `NaN`, both
 * rejected downstream by validation. It measures nothing itself and decides nothing.
 */
export class Measurer {
  readonly #normalizer = new EvaluationNormalizer();

  /** Record the framed measurements as measured metrics, in a deterministic name-sorted order. */
  measure(metrics: readonly MetricMeasurement[]): readonly MeasuredMetric[] {
    const framed = Array.isArray(metrics) ? metrics : [];
    const measured = framed.map((metric) =>
      Object.freeze({
        metric: this.#normalizer.normalize(typeof metric?.metric === 'string' ? metric.metric : ''),
        value: typeof metric?.value === 'number' ? metric.value : Number.NaN,
        grounded: metric?.grounded === true,
      }),
    );
    return Object.freeze([...measured].sort((a, b) => (a.metric < b.metric ? -1 : 1)));
  }
}
