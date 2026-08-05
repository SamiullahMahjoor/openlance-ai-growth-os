import type { RetrievalCandidate } from './types.js';

/**
 * Retrieval prioritization: the `prioritize` step. It orders the dependency-complete set by authority so
 * that governing knowledge comes first, with a stable id tiebreak, so the same set always produces the
 * same order. It is deterministic and structural (authority, then id by code point); it performs no
 * relevance scoring and applies no search technology. The tiebreak compares ids by code point rather than
 * by locale collation, so the ordering is total and identical in every environment.
 */
export class RetrievalRanker {
  /** Order the candidates by authority (governing first), with a stable, environment-independent id tiebreak. */
  rank(candidates: readonly RetrievalCandidate[]): readonly RetrievalCandidate[] {
    return [...candidates].sort(
      (a, b) => b.authority - a.authority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
  }
}
