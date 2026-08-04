import type { MemoryStatistics } from './types.js';

/**
 * Operational metrics: counters over formation and recall outcomes (formations, recalls, removals,
 * failures, and validation failures). It records operational facts only; it carries no business truth and
 * decides nothing.
 */
export class MemoryMetrics {
  #formations = 0;
  #recalls = 0;
  #removals = 0;
  #failures = 0;
  #validationFailures = 0;

  /** Record that a record was formed and retained. */
  recordFormation(): void {
    this.#formations += 1;
  }

  /** Record that a recall was made. */
  recordRecall(): void {
    this.#recalls += 1;
  }

  /** Record that a record was removed. */
  recordRemoval(): void {
    this.#removals += 1;
  }

  /** Record that an operation failed. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** Record that a formation failed grounding validation. */
  recordValidationFailure(): void {
    this.#validationFailures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): MemoryStatistics {
    return Object.freeze({
      formations: this.#formations,
      recalls: this.#recalls,
      removals: this.#removals,
      failures: this.#failures,
      validationFailures: this.#validationFailures,
    });
  }
}
