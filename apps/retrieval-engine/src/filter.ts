import type { RetrievalCandidate, RetrievalId } from './types.js';

/**
 * Retrieval filtering: the `discover` and `select` steps. `discover` finds the candidates whose topics
 * cover the request scope (candidates only; it selects, loads, and alters nothing). `select` keeps the
 * governance-permitted subset, applying the permission set the request supplies (never restating a
 * governance rule). Both are deterministic and structural over the provided candidates; neither applies
 * a search technology.
 */
export class RetrievalFilter {
  /** Discover the candidates whose topics cover the scope, in registration order. */
  discover(
    candidates: readonly RetrievalCandidate[],
    scope: string,
  ): readonly RetrievalCandidate[] {
    return candidates.filter((candidate) => candidate.topics.includes(scope));
  }

  /** Select the governance-permitted subset; when no permission set is given, all are eligible. */
  select(
    candidates: readonly RetrievalCandidate[],
    permitted: readonly RetrievalId[] | undefined,
  ): readonly RetrievalCandidate[] {
    if (permitted === undefined) {
      return candidates;
    }
    return candidates.filter((candidate) => permitted.includes(candidate.id));
  }
}
