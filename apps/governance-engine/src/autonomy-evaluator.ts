import { AUTONOMY_LEVELS, autonomyAtLeast } from '@openlance/aios-governance';
import type { AutonomyLevel } from '@openlance/aios-governance';

/**
 * Autonomy evaluation: it applies the frozen autonomy model (ai/governance/autonomy-boundaries) and the
 * `autonomyAtLeast` predicate. Where the action requires more autonomy than the subject is granted, the action falls
 * under the `must-escalate` bound and never proceeds autonomously. It consumes the frozen `AUTONOMY_LEVELS` and the
 * predicate; it enforces no bound and decides no action of its own (that is the evaluator's).
 */
export class AutonomyEvaluator {
  /** The frozen autonomy levels, from least to most independent. */
  levels(): readonly AutonomyLevel[] {
    return AUTONOMY_LEVELS;
  }

  /** Whether the granted autonomy is sufficient for a required autonomy; where it is not, the action must escalate. */
  isSufficient(granted: AutonomyLevel, required: AutonomyLevel | undefined): boolean {
    return required === undefined || autonomyAtLeast(granted, required);
  }
}
