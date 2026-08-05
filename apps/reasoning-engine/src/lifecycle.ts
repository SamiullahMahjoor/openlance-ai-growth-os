import { REASONING_LIFECYCLE_PHASES, reasoningPhaseAtOrAfter } from '@openlance/aios-reasoning';
import type { ReasoningLifecyclePhase } from '@openlance/aios-reasoning';

/**
 * Reasoning lifecycle evaluation over the frozen reasoning-lifecycle model. It consumes the frozen ordered
 * `REASONING_LIFECYCLE_PHASES` and the pure predicate `reasoningPhaseAtOrAfter`; it defines no phase and re-owns no
 * ordering (ai/reasoning/reasoning-lifecycle.md, ADR-0020). A reasoning is framed before it transforms, forms a
 * conclusion before it validates, and Validation is the last phase.
 */
export class ReasoningLifecycle {
  /** The frozen, ordered reasoning lifecycle phases. */
  phases(): readonly ReasoningLifecyclePhase[] {
    return REASONING_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: ReasoningLifecyclePhase, b: ReasoningLifecyclePhase): boolean {
    return reasoningPhaseAtOrAfter(a, b);
  }

  /** Whether a phase has reached validation (a conclusion may not be accepted before this). */
  isValidated(phase: ReasoningLifecyclePhase): boolean {
    return reasoningPhaseAtOrAfter(phase, 'validation');
  }
}
