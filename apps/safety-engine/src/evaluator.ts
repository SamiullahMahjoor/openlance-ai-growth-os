import { TRUST_LEVELS } from '@openlance/aios-governance';
import type { OversightRequirement, TrustLevel } from '@openlance/aios-governance';
import type { ImpactDimension, RefusalCategory } from '@openlance/aios-safety';

import type { HazardAnalyzer } from './hazard-analyzer.js';
import type { IsolationManager } from './isolation-manager.js';
import { SafetyNormalizer } from './normalizer.js';
import { isExecuting, strongest } from './policy.js';
import type { EffectivePolicy } from './policy.js';
import type { ClassifiedHazard, RiskAnalyzer } from './risk-analyzer.js';
import type { RuntimeBoundaryEnforcer } from './runtime-boundary-enforcer.js';
import type { SafeRefusalEngine } from './safe-refusal-engine.js';
import type { SafetyHash } from './hash.js';
import type { SanitizationEngine } from './sanitization-engine.js';
import type {
  Hazard,
  SafetyDecision,
  SafetyDirective,
  SafetyId,
  SafetyOutcome,
  SafetyRequest,
} from './types.js';

/** The frozen fields a decision's deterministic audit id is hashed from. */
interface DecisionCore {
  readonly subject: SafetyId;
  readonly outcome: SafetyOutcome;
  readonly reason: string;
  readonly hazards: readonly Hazard[];
  readonly directives: readonly SafetyDirective[];
  readonly refusalCategory: RefusalCategory | null;
  readonly escalated: boolean;
  readonly emergencyStop: boolean;
  readonly impact: readonly ImpactDimension[];
  readonly oversight: OversightRequirement;
  readonly trust: TrustLevel;
  readonly governance: string;
  readonly evaluated: boolean;
}

/**
 * The safety evaluator: it evaluates an authorized plan against the frozen safety model and produces an immutable
 * {@link SafetyDecision}. It is fail-closed and zero-trust and it never overrides governance: a non-`AUTHORIZE`
 * governance decision short-circuits to a constitutional `REFUSE` without evaluation; an unrecognized governed trust
 * fails closed to `UNSAFE`; no hazard yields `SAFE`; otherwise it identifies hazards, classifies each against the
 * governed trust, combines them defense-in-depth (the strongest protection wins, protection never lowers), and
 * constructs the protective directives Operations is to apply. It **protects and stops**: it invokes no engine, executes
 * nothing, selects no provider, holds no mutable shared state, and is deterministic (identical inputs yield an identical
 * decision, including its content-hash audit id).
 */
export class SafetyEvaluator {
  readonly #hazards: HazardAnalyzer;
  readonly #risk: RiskAnalyzer;
  readonly #sanitizer: SanitizationEngine;
  readonly #boundary: RuntimeBoundaryEnforcer;
  readonly #isolation: IsolationManager;
  readonly #refusal: SafeRefusalEngine;
  readonly #hash: SafetyHash;
  readonly #normalizer = new SafetyNormalizer();

  constructor(
    hazards: HazardAnalyzer,
    risk: RiskAnalyzer,
    sanitizer: SanitizationEngine,
    boundary: RuntimeBoundaryEnforcer,
    isolation: IsolationManager,
    refusal: SafeRefusalEngine,
    hash: SafetyHash,
  ) {
    this.#hazards = hazards;
    this.#risk = risk;
    this.#sanitizer = sanitizer;
    this.#boundary = boundary;
    this.#isolation = isolation;
    this.#refusal = refusal;
    this.#hash = hash;
  }

  /** Evaluate a request into an immutable safety decision, failing closed. */
  evaluate(request: SafetyRequest, policy: EffectivePolicy): SafetyDecision {
    const subject = this.#normalizer.normalize(request.plan.agent);
    const governance = request.governance;
    // Governance precedes safety: safety never evaluates, nor overrides, an unauthorized plan.
    if (governance.decision !== 'AUTHORIZE') {
      return this.#build({
        subject,
        outcome: 'REFUSE',
        reason: `Governance decision '${governance.id}' is ${governance.decision}, not AUTHORIZE; safety defers to governance and does not evaluate.`,
        hazards: [],
        directives: [],
        refusalCategory: 'constitutional',
        escalated: false,
        emergencyStop: false,
        impact: [],
        oversight: governance.oversight,
        trust: governance.trust,
        governance: governance.id,
        evaluated: false,
      });
    }
    // Defense in depth: an unrecognized governed trust fails closed; safety never proceeds on unknown risk.
    if (!TRUST_LEVELS.includes(governance.trust)) {
      const hazard: Hazard = {
        category: 'runtime',
        source: 'plan',
        code: 'SAFETY.UNKNOWN_TRUST',
        response: 'UNSAFE',
        detail: `The governed trust level '${governance.trust}' is not recognized; safety fails closed.`,
      };
      return this.#build({
        subject,
        outcome: 'UNSAFE',
        reason: 'The governed trust level is not recognized; safety fails closed to UNSAFE.',
        hazards: [hazard],
        directives: [],
        refusalCategory: null,
        escalated: false,
        emergencyStop: true,
        impact: [],
        oversight: governance.oversight,
        trust: governance.trust,
        governance: governance.id,
        evaluated: true,
      });
    }
    const hazards = this.#hazards.analyze(request.plan, policy);
    if (hazards.length === 0) {
      return this.#build({
        subject,
        outcome: 'SAFE',
        reason: 'No runtime hazard was identified; the authorized plan is safe to execute.',
        hazards: [],
        directives: [],
        refusalCategory: null,
        escalated: false,
        emergencyStop: false,
        impact: [],
        oversight: governance.oversight,
        trust: governance.trust,
        governance: governance.id,
        evaluated: true,
      });
    }
    const classified = this.#risk.classify(hazards, governance.trust);
    const outcome = classified.reduce<SafetyOutcome>(
      (accumulator, item) => strongest(accumulator, item.outcome),
      'SAFE',
    );
    const directives = isExecuting(outcome) ? this.#directives(classified) : [];
    const disposition = this.#refusal.disposition(outcome);
    return this.#build({
      subject,
      outcome,
      reason: `The plan is ${outcome} on ${hazards.length} identified hazard(s): ${hazards.map((hazard) => hazard.code).join(', ')}.`,
      hazards,
      directives,
      refusalCategory: disposition.refusalCategory,
      escalated: disposition.escalated,
      emergencyStop: disposition.emergencyStop,
      impact: this.#impact(classified),
      oversight: governance.oversight,
      trust: governance.trust,
      governance: governance.id,
      evaluated: true,
    });
  }

  /** The protective directives for the executing hazards, in plan order (defense in depth: restrict is layered with isolate). */
  #directives(classified: readonly ClassifiedHazard[]): readonly SafetyDirective[] {
    const directives: SafetyDirective[] = [];
    for (const item of classified) {
      if (item.outcome === 'SANITIZE') {
        directives.push(this.#sanitizer.directive(item.hazard));
      } else if (item.outcome === 'RESTRICT') {
        directives.push(this.#boundary.restrict(item.hazard));
        if (this.#isolation.requiresIsolation(item.hazard)) {
          directives.push(this.#isolation.directive(item.hazard));
        }
      } else if (item.outcome === 'DEGRADE') {
        directives.push(this.#boundary.degrade(item.hazard));
      }
    }
    return directives;
  }

  /** The sorted union of the impact dimensions the classified hazards implicate (conjunctive; never a ranked scale). */
  #impact(classified: readonly ClassifiedHazard[]): readonly ImpactDimension[] {
    const dimensions = new Set<ImpactDimension>();
    for (const item of classified) {
      for (const dimension of item.impact) {
        dimensions.add(dimension);
      }
    }
    return Object.freeze([...dimensions].sort());
  }

  /**
   * Assemble the immutable decision, computing its deterministic content-hash audit id over a canonical, injective
   * JSON encoding of the frozen fields (the hazards and directives by their sorted keys), so the encoding is a faithful,
   * order-independent fingerprint and an identical decision reproduces an identical id. The id is a reproducible audit
   * identifier, not a collision-proof security primitive. It deep-freezes the decision and its nested records.
   */
  #build(core: DecisionCore): SafetyDecision {
    const hazards = Object.freeze(core.hazards.map((hazard) => Object.freeze({ ...hazard })));
    const directives = Object.freeze(
      core.directives.map((directive) => Object.freeze({ ...directive })),
    );
    const impact = Object.freeze([...core.impact]);
    const hazardKeys = hazards.map((hazard) => `${hazard.code}@${hazard.source}`).sort();
    const directiveKeys = directives
      .map((directive) => `${directive.kind}@${directive.target}`)
      .sort();
    const canonical = JSON.stringify([
      core.subject,
      core.outcome,
      core.trust,
      core.oversight,
      core.evaluated,
      core.refusalCategory,
      core.escalated,
      core.emergencyStop,
      hazardKeys,
      directiveKeys,
      [...impact],
      core.governance,
    ]);
    const decision: SafetyDecision = {
      subject: core.subject,
      outcome: core.outcome,
      reason: core.reason,
      hazards,
      directives,
      refusalCategory: core.refusalCategory,
      escalated: core.escalated,
      emergencyStop: core.emergencyStop,
      impact,
      oversight: core.oversight,
      trust: core.trust,
      governance: core.governance,
      evaluated: core.evaluated,
      id: this.#hash.hash(canonical),
      validated: true,
    };
    return Object.freeze(decision);
  }
}
