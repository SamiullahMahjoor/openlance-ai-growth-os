import type { ReasoningStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and reasoning outcomes (registrations, reasonings, concluded,
 * inconclusive, escalated, and failures). It records operational facts only; it carries no business truth and decides
 * nothing.
 */
export class ReasoningMetrics {
  #registrations = 0;
  #reasonings = 0;
  #concluded = 0;
  #inconclusive = 0;
  #escalated = 0;
  #failures = 0;

  /** Record that a premise was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a reasoning was attempted. */
  recordReasoning(): void {
    this.#reasonings += 1;
  }

  /** Record that a reasoning reached a validated conclusion. */
  recordConcluded(): void {
    this.#concluded += 1;
  }

  /** Record that a reasoning yielded a governed absence of a conclusion. */
  recordInconclusive(): void {
    this.#inconclusive += 1;
  }

  /** Record that a reasoning escalated. */
  recordEscalated(): void {
    this.#escalated += 1;
  }

  /** Record that a reasoning was refused for a malformed request. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): ReasoningStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      reasonings: this.#reasonings,
      concluded: this.#concluded,
      inconclusive: this.#inconclusive,
      escalated: this.#escalated,
      failures: this.#failures,
    });
  }
}
