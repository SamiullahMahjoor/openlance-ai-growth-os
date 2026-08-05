import type { EvaluationStatistics, EvaluationVerdict } from './types.js';

/**
 * The engine's own counters: evaluations processed, accepted, withheld, and duplicates recognized. It records
 * operational facts about the engine's own work only; it carries no assessment truth and decides nothing.
 */
export class EvaluationMetrics {
  #evaluations = 0;
  #accepted = 0;
  #withheld = 0;
  #duplicates = 0;

  /** Record that an evaluation was processed, counting its verdict. */
  recordEvaluation(verdict: EvaluationVerdict): void {
    this.#evaluations += 1;
    if (verdict === 'accepted') {
      this.#accepted += 1;
    } else {
      this.#withheld += 1;
    }
  }

  /** Record that a duplicate evaluation (by identity) was recognized. */
  recordDuplicate(): void {
    this.#duplicates += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): EvaluationStatistics {
    return Object.freeze({
      evaluations: this.#evaluations,
      accepted: this.#accepted,
      withheld: this.#withheld,
      duplicates: this.#duplicates,
    });
  }
}
