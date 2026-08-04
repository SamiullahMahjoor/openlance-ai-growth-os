import type { ProviderStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and invocation outcomes (invocations, successes,
 * failures, and failovers). It records operational facts only; it carries no business truth and
 * decides nothing.
 */
export class ProviderMetrics {
  #registrations = 0;
  #invocations = 0;
  #successes = 0;
  #failures = 0;
  #failovers = 0;

  /** Record that a provider was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a governed invocation was attempted. */
  recordInvocation(): void {
    this.#invocations += 1;
  }

  /** Record that a governed invocation succeeded. */
  recordSuccess(): void {
    this.#successes += 1;
  }

  /** Record that a governed invocation failed. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** Record that an invocation failed over from one provider to the next. */
  recordFailover(): void {
    this.#failovers += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): ProviderStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      invocations: this.#invocations,
      successes: this.#successes,
      failures: this.#failures,
      failovers: this.#failovers,
    });
  }
}
