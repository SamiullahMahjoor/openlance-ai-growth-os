import type { OperationsStatistics } from './types.js';

/**
 * The engine's own operational counters: observations processed, duplicates recognized, incidents opened, and alerts
 * raised. It records operational facts about the engine's own work only; it carries no runtime truth and decides nothing.
 */
export class OperationsMetrics {
  #observations = 0;
  #duplicates = 0;
  #incidentsOpened = 0;
  #alertsRaised = 0;

  /** Record that an observation was processed. */
  recordObservation(): void {
    this.#observations += 1;
  }

  /** Record that a duplicate observation was recognized. */
  recordDuplicate(): void {
    this.#duplicates += 1;
  }

  /** Record that an incident was opened. */
  recordIncidentOpened(): void {
    this.#incidentsOpened += 1;
  }

  /** Record that an alert was raised. */
  recordAlertRaised(): void {
    this.#alertsRaised += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): OperationsStatistics {
    return Object.freeze({
      observations: this.#observations,
      duplicates: this.#duplicates,
      incidentsOpened: this.#incidentsOpened,
      alertsRaised: this.#alertsRaised,
    });
  }
}
