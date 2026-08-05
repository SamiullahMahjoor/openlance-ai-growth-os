import type { Trend } from './types.js';

/**
 * The trend analyzer: it retains the two most recent values of a monitored metric and reports the direction of the trend
 * deterministically - `rising`, `falling`, or `stable` - by comparing the newest value to the previous one. Before two
 * values have been recorded it is `stable`. It analyzes only; it decides nothing and changes no behavior.
 */
export class TrendAnalyzer {
  #previous: number | null = null;
  #current: number | null = null;

  /** Record a value, retaining it and the one before it. */
  record(value: number): void {
    this.#previous = this.#current;
    this.#current = value;
  }

  /** The direction of the trend across the two most recent values. */
  trend(): Trend {
    if (this.#previous === null || this.#current === null) {
      return 'stable';
    }
    if (this.#current > this.#previous) {
      return 'rising';
    }
    if (this.#current < this.#previous) {
      return 'falling';
    }
    return 'stable';
  }
}
