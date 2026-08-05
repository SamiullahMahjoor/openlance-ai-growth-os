import type { GovernanceStatistics } from './types.js';

/**
 * Operational metrics: counters over registration and decision outcomes (registrations, evaluations, authorized, denied,
 * approvals required, and escalated). It records operational facts only; it carries no governance policy and decides
 * nothing.
 */
export class GovernanceMetrics {
  #registrations = 0;
  #evaluations = 0;
  #authorized = 0;
  #denied = 0;
  #approvalsRequired = 0;
  #escalated = 0;

  /** Record that a grant was registered. */
  recordRegistration(): void {
    this.#registrations += 1;
  }

  /** Record that a request was evaluated. */
  recordEvaluation(): void {
    this.#evaluations += 1;
  }

  /** Record that a request was authorized. */
  recordAuthorized(): void {
    this.#authorized += 1;
  }

  /** Record that a request was denied. */
  recordDenied(): void {
    this.#denied += 1;
  }

  /** Record that a request required human approval. */
  recordApprovalRequired(): void {
    this.#approvalsRequired += 1;
  }

  /** Record that a request was escalated. */
  recordEscalated(): void {
    this.#escalated += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): GovernanceStatistics {
    return Object.freeze({
      registrations: this.#registrations,
      evaluations: this.#evaluations,
      authorized: this.#authorized,
      denied: this.#denied,
      approvalsRequired: this.#approvalsRequired,
      escalated: this.#escalated,
    });
  }
}
