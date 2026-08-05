import { RETRIEVAL_LIFECYCLE_PHASES, retrievalPhaseAtOrAfter } from '@openlance/aios-retrieval';
import type { RetrievalLifecyclePhase } from '@openlance/aios-retrieval';

/**
 * Retrieval lifecycle evaluation over the frozen retrieval-lifecycle model. It consumes the frozen ordered
 * `RETRIEVAL_LIFECYCLE_PHASES` and the pure predicate `retrievalPhaseAtOrAfter`; it defines no phase and
 * re-owns no ordering (ai/retrieval/retrieval-lifecycle.md, ADR-0020). A retrieval begins at Request and
 * ends at Result, and Validation always precedes Result.
 */
export class RetrievalLifecycle {
  /** The frozen, ordered retrieval lifecycle phases. */
  phases(): readonly RetrievalLifecyclePhase[] {
    return RETRIEVAL_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: RetrievalLifecyclePhase, b: RetrievalLifecyclePhase): boolean {
    return retrievalPhaseAtOrAfter(a, b);
  }

  /** Whether a phase has reached validation (a result may not be handed off before this). */
  isValidated(phase: RetrievalLifecyclePhase): boolean {
    return retrievalPhaseAtOrAfter(phase, 'validation');
  }
}
