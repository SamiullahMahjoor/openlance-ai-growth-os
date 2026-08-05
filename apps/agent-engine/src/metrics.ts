import type { AgentStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and planning outcomes (registrations, plans, successes, and
 * failures). It records operational facts only; it carries no business truth and decides nothing.
 */
export class AgentMetrics {
  #registrations = 0;
  #plans = 0;
  #successes = 0;
  #failures = 0;

  /** Record that an agent was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a plan was attempted. */
  recordPlan(): void {
    this.#plans += 1;
  }

  /** Record that a plan was composed. */
  recordSuccess(): void {
    this.#successes += 1;
  }

  /** Record that a plan was refused. */
  recordFailure(): void {
    this.#failures += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): AgentStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      plans: this.#plans,
      successes: this.#successes,
      failures: this.#failures,
    });
  }
}
