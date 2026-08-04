import type { PromptStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and compilation outcomes (compilations, successes,
 * failures, and validation failures). It records operational facts only; it carries no business truth
 * and decides nothing.
 */
export class PromptMetrics {
  #registrations = 0;
  #compilations = 0;
  #successes = 0;
  #failures = 0;
  #validationFailures = 0;

  /** Record that a definition was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a compilation was attempted. */
  recordCompilation(): void {
    this.#compilations += 1;
  }

  /** Record that a compilation succeeded. */
  recordSuccess(): void {
    this.#successes += 1;
  }

  /** Record that a compilation failed. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** Record that a compilation failed a validation check. */
  recordValidationFailure(): void {
    this.#validationFailures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): PromptStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      compilations: this.#compilations,
      successes: this.#successes,
      failures: this.#failures,
      validationFailures: this.#validationFailures,
    });
  }
}
