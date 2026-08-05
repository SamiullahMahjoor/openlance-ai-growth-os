import type { EvaluationHash } from './hash.js';
import type { AuditEntry, EvaluationAudit, EvaluationVerdict } from './types.js';

/**
 * The evaluation audit manager: it records each evaluation the engine processes as one immutable audit entry, and it is
 * the idempotency authority - a repeated evaluation (by its identity) is recognized and never recorded twice, so a
 * re-evaluation of the same identity does not double-count. It records only; it changes no output and decides nothing.
 */
export class EvaluationAuditManager {
  readonly #seen = new Set<string>();
  readonly #entries: AuditEntry[] = [];

  /** Record an evaluation; returns `false` if its identity was already recorded (a duplicate), else `true`. */
  record(evaluation: string, verdict: EvaluationVerdict, at: number): boolean {
    if (this.#seen.has(evaluation)) {
      return false;
    }
    this.#seen.add(evaluation);
    this.#entries.push(Object.freeze({ evaluation, verdict, at }));
    return true;
  }

  /** The number of recorded (deduplicated) evaluations. */
  get count(): number {
    return this.#entries.length;
  }

  /** Build the immutable audit trail, bounded to the most recent `limit` entries, in processing order. */
  audit(hash: EvaluationHash, limit: number): EvaluationAudit {
    const bounded = this.#entries.slice(Math.max(0, this.#entries.length - limit));
    const entries = Object.freeze(bounded.map((entry) => Object.freeze({ ...entry })));
    return Object.freeze({
      entries,
      id: hash.hash(
        JSON.stringify(entries.map((entry) => [entry.evaluation, entry.verdict, entry.at])),
      ),
    });
  }
}
