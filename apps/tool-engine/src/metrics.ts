import type { ToolStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and preparation outcomes (registrations, preparations, successes,
 * failures, and validation failures). It records operational facts only; it carries no business truth and decides
 * nothing.
 */
export class ToolMetrics {
  #registrations = 0;
  #preparations = 0;
  #successes = 0;
  #failures = 0;
  #validationFailures = 0;

  /** Record that a tool was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a preparation was attempted. */
  recordPreparation(): void {
    this.#preparations += 1;
  }

  /** Record that a preparation produced a validated execution. */
  recordSuccess(): void {
    this.#successes += 1;
  }

  /** Record that a preparation was refused. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** Record that a preparation failed a validation check. */
  recordValidationFailure(): void {
    this.#validationFailures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): ToolStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      preparations: this.#preparations,
      successes: this.#successes,
      failures: this.#failures,
      validationFailures: this.#validationFailures,
    });
  }
}
