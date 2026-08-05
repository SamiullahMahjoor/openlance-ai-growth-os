import type { OperationsHash } from './hash.js';
import type { AuditEntry, Observation, OperationalAudit } from './types.js';

/**
 * The operational audit manager: it records each observation the engine processes as one immutable audit entry, and it
 * is the idempotency authority - a repeated observation (by its id) is recognized and never recorded twice, so no
 * downstream alert, incident, or metric is duplicated. It records only; it changes no runtime output and executes
 * nothing.
 */
export class OperationalAuditManager {
  readonly #seen = new Set<string>();
  readonly #entries: AuditEntry[] = [];

  /** Record an observation; returns `false` if it was already recorded (a duplicate), else `true`. */
  record(observation: Observation): boolean {
    if (this.#seen.has(observation.id)) {
      return false;
    }
    this.#seen.add(observation.id);
    const at = observation.kind === 'record' ? observation.record.finishedAt : observation.at;
    this.#entries.push(Object.freeze({ observation: observation.id, kind: observation.kind, at }));
    return true;
  }

  /** The number of recorded (deduplicated) observations. */
  get count(): number {
    return this.#entries.length;
  }

  /** Build the immutable operational audit trail, in processing order. */
  audit(hash: OperationsHash): OperationalAudit {
    const entries = Object.freeze(this.#entries.map((entry) => Object.freeze({ ...entry })));
    return Object.freeze({
      entries,
      id: hash.hash(
        JSON.stringify(entries.map((entry) => [entry.observation, entry.kind, entry.at])),
      ),
    });
  }
}
