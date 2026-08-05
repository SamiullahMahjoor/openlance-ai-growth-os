import type { SafetyOutcome, SafetyStatistics } from './types.js';

/**
 * Operational metrics: counters over evaluations and decision outcomes (safe, sanitized, restricted, degraded,
 * escalated, refused, and unsafe). It records operational facts only; it carries no safety policy and decides nothing.
 */
export class SafetyMetrics {
  #evaluations = 0;
  #safe = 0;
  #sanitized = 0;
  #restricted = 0;
  #degraded = 0;
  #escalated = 0;
  #refused = 0;
  #unsafe = 0;

  /** Record that a request was evaluated. */
  recordEvaluation(): void {
    this.#evaluations += 1;
  }

  /** Record a decided outcome. */
  recordOutcome(outcome: SafetyOutcome): void {
    if (outcome === 'SAFE') {
      this.#safe += 1;
    } else if (outcome === 'SANITIZE') {
      this.#sanitized += 1;
    } else if (outcome === 'RESTRICT') {
      this.#restricted += 1;
    } else if (outcome === 'DEGRADE') {
      this.#degraded += 1;
    } else if (outcome === 'ESCALATE') {
      this.#escalated += 1;
    } else if (outcome === 'REFUSE') {
      this.#refused += 1;
    } else {
      this.#unsafe += 1;
    }
  }

  /** A frozen snapshot of the current counters. */
  statistics(): SafetyStatistics {
    return Object.freeze({
      evaluations: this.#evaluations,
      safe: this.#safe,
      sanitized: this.#sanitized,
      restricted: this.#restricted,
      degraded: this.#degraded,
      escalated: this.#escalated,
      refused: this.#refused,
      unsafe: this.#unsafe,
    });
  }
}
