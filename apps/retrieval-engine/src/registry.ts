import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { RetrievalError } from './errors.js';
import type { RetrievalCandidate, RetrievalId } from './types.js';

/**
 * The retrieval candidate registry: registration, discovery, and deterministic lookup of candidate
 * knowledge by id. It preserves registration order (Map insertion order), so determination is
 * deterministic. It holds candidate references (names of canonical owners), never business truth.
 */
export class RetrievalRegistry {
  readonly #byId = new Map<RetrievalId, RetrievalCandidate>();

  /** Register a candidate. Fails closed on a duplicate id (`RETRIEVAL.DUPLICATE_ID`). */
  register(candidate: RetrievalCandidate): Result<void, RetrievalError> {
    if (this.#byId.has(candidate.id)) {
      return err(
        new RetrievalError(
          'RETRIEVAL.DUPLICATE_ID',
          `A retrieval candidate with id '${candidate.id}' is already registered.`,
          { id: candidate.id },
        ),
      );
    }
    this.#byId.set(candidate.id, candidate);
    return ok(undefined);
  }

  /** Whether a candidate with the given id is registered. */
  has(id: RetrievalId): boolean {
    return this.#byId.has(id);
  }

  /** The registered candidate for an id, or `undefined`. */
  get(id: RetrievalId): RetrievalCandidate | undefined {
    return this.#byId.get(id);
  }

  /** All registered candidates, in registration order. */
  list(): readonly RetrievalCandidate[] {
    return [...this.#byId.values()];
  }

  /** Remove a candidate by id; returns whether one was removed. */
  unregister(id: RetrievalId): boolean {
    return this.#byId.delete(id);
  }
}
