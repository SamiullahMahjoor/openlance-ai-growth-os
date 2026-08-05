import type { RetrievalStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and retrieval outcomes (registrations, retrievals,
 * successes, failures, and validation failures). It records operational facts only; it carries no business
 * truth and decides nothing.
 */
export class RetrievalMetrics {
  #registrations = 0;
  #retrievals = 0;
  #successes = 0;
  #failures = 0;
  #validationFailures = 0;

  /** Record that a candidate was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a retrieval was attempted. */
  recordRetrieval(): void {
    this.#retrievals += 1;
  }

  /** Record that a retrieval produced a validated result. */
  recordSuccess(): void {
    this.#successes += 1;
  }

  /** Record that a retrieval was refused. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** Record that a retrieval failed a validation dimension. */
  recordValidationFailure(): void {
    this.#validationFailures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): RetrievalStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      retrievals: this.#retrievals,
      successes: this.#successes,
      failures: this.#failures,
      validationFailures: this.#validationFailures,
    });
  }
}
