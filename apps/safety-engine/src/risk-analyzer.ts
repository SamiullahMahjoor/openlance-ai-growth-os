import { requiredOversight } from '@openlance/aios-governance';
import type { TrustLevel } from '@openlance/aios-governance';
import type { HazardCategory, ImpactDimension } from '@openlance/aios-safety';

import { strongest } from './policy.js';
import type { Hazard, SafetyOutcome } from './types.js';

/** A hazard with its trust-classified required protection and the impact dimensions it implicates. */
export interface ClassifiedHazard {
  readonly hazard: Hazard;
  readonly outcome: SafetyOutcome;
  readonly impact: readonly ImpactDimension[];
}

/** The impact dimensions each hazard category implicates (a subset of the frozen conjunctive `IMPACT_DIMENSIONS`). */
const IMPACT_BY_CATEGORY: Readonly<Record<HazardCategory, readonly ImpactDimension[]>> =
  Object.freeze({
    capability: ['severity', 'scope'],
    knowledge: ['scope', 'human', 'organizational'],
    permission: ['severity', 'scope'],
    reasoning: ['severity', 'likelihood'],
    runtime: ['severity', 'propagation', 'reversibility'],
    prompt: ['severity', 'likelihood'],
    agent: ['propagation', 'scope'],
    compound: ['severity', 'propagation', 'long-term'],
  });

/**
 * Risk classification (applying the frozen `risk-classification` model): it classifies each identified hazard's required
 * protection by applying the governed trust the `GovernanceDecision` carries, never redefining governance's risk
 * categories. Higher governed risk raises protection and never lowers it (`higher-risk-raises-protection`): a hazard on
 * a human-approval (critical) action is raised to at least `ESCALATE`, and on a human-review (high) action to at least
 * `DEGRADE`. It assesses the implicated impact along the frozen `IMPACT_DIMENSIONS`. Classifying is inert; it exposes no
 * risk-level enum (the frozen model deliberately names none), expressing risk as required protection.
 */
export class RiskAnalyzer {
  /** Classify every hazard's trust-raised required protection and implicated impact. */
  classify(hazards: readonly Hazard[], trust: TrustLevel): readonly ClassifiedHazard[] {
    const floor = this.#trustFloor(trust);
    return hazards.map((hazard) => ({
      hazard,
      outcome: strongest(hazard.response, floor),
      impact: IMPACT_BY_CATEGORY[hazard.category],
    }));
  }

  /** The minimum protection the governed trust demands of any identified hazard (it never lowers protection). */
  #trustFloor(trust: TrustLevel): SafetyOutcome {
    const oversight = requiredOversight(trust);
    if (oversight === 'human-approval') {
      return 'ESCALATE';
    }
    if (oversight === 'human-review') {
      return 'DEGRADE';
    }
    return 'SAFE';
  }
}
