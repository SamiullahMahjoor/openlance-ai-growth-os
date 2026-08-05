import { requiredOversight, requiresHumanApproval } from '@openlance/aios-governance';
import type { OversightRequirement, TrustLevel } from '@openlance/aios-governance';

/** The oversight a trust level requires, and whether it requires a human before the action proceeds. */
export interface OversightResult {
  readonly oversight: OversightRequirement;
  readonly needsHuman: boolean;
}

/**
 * Human-oversight evaluation: it applies the frozen risk-and-oversight model (ai/governance/risk-management,
 * ai/governance/human-oversight) via `requiredOversight` and `requiresHumanApproval`. A critical action requires human
 * approval, and a high action requires human review, before it proceeds; low and moderate actions proceed under the
 * standing rules. It consumes the frozen predicates and states what oversight a trust level requires; it presents no
 * action to a human and records no decision (that workflow is the runtime's).
 */
export class OversightEvaluator {
  /** The oversight the trust level requires, and whether it requires a human before the action proceeds. */
  evaluate(trust: TrustLevel): OversightResult {
    const oversight = requiredOversight(trust);
    return { oversight, needsHuman: requiresHumanApproval(trust) || oversight === 'human-review' };
  }
}
