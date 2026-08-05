import { TRUST_LEVELS } from '@openlance/aios-governance';
import type { OversightRequirement, TrustLevel } from '@openlance/aios-governance';

import type { AutonomyEvaluator } from './autonomy-evaluator.js';
import type { ConstitutionalValidator } from './constitutional-validator.js';
import type { GovernanceHash } from './hash.js';
import { GovernanceNormalizer } from './normalizer.js';
import type { OversightEvaluator } from './oversight-evaluator.js';
import type { PermissionEvaluator } from './permission-evaluator.js';
import type { GovernanceRegistry } from './registry.js';
import type {
  GovernanceDecision,
  GovernanceId,
  GovernanceOutcome,
  GovernanceRequest,
} from './types.js';

/** The frozen fields a decision's deterministic audit id is hashed from. */
interface DecisionCore {
  readonly subject: GovernanceId;
  readonly decision: GovernanceOutcome;
  readonly reason: string;
  readonly oversight: OversightRequirement;
  readonly violations: readonly string[];
  readonly permitted: readonly string[];
  readonly trust: TrustLevel;
}

/**
 * The governance evaluator: it authorizes a request against the subject's grant and the frozen governance model, in
 * order (constitutional validation, permission, autonomy, human oversight), and produces an immutable
 * {@link GovernanceDecision}. It is fail-closed and zero-trust: an unrecognized trust level, an unknown subject, an
 * ungranted capability, or an unvalidated plan yields `DENY`; insufficient autonomy yields `ESCALATE`; a required but
 * unrecorded human approval yields `REQUIRE_APPROVAL`; a human rejection yields `DENY`; otherwise `AUTHORIZE`. It
 * **authorizes and stops**: it invokes no engine, executes nothing, holds no mutable shared state, and is deterministic
 * (identical inputs yield an identical decision, including its content-hash audit id).
 */
export class GovernanceEvaluator {
  readonly #permission: PermissionEvaluator;
  readonly #constitutional: ConstitutionalValidator;
  readonly #autonomy: AutonomyEvaluator;
  readonly #oversight: OversightEvaluator;
  readonly #hash: GovernanceHash;
  readonly #normalizer = new GovernanceNormalizer();

  constructor(
    permission: PermissionEvaluator,
    constitutional: ConstitutionalValidator,
    autonomy: AutonomyEvaluator,
    oversight: OversightEvaluator,
    hash: GovernanceHash,
  ) {
    this.#permission = permission;
    this.#constitutional = constitutional;
    this.#autonomy = autonomy;
    this.#oversight = oversight;
    this.#hash = hash;
  }

  /** Authorize a request into an immutable governance decision, failing closed. */
  evaluate(
    request: GovernanceRequest,
    registry: GovernanceRegistry,
    requireExplicitApproval: boolean,
  ): GovernanceDecision {
    const subject = this.#normalizer.normalize(request.plan.agent);
    const trust = request.trust;
    // An unrecognized trust level fails closed to the strictest oversight; the engine never proceeds on unknown trust.
    if (!TRUST_LEVELS.includes(trust)) {
      return this.#build({
        subject,
        decision: 'DENY',
        reason: `The trust level '${trust}' is not a recognized governance trust level.`,
        oversight: 'human-approval',
        violations: ['GOVERNANCE.UNKNOWN_TRUST'],
        permitted: [],
        trust,
      });
    }
    const oversight = this.#oversight.evaluate(trust).oversight;
    if (!this.#constitutional.isValidated(request.plan)) {
      return this.#build({
        subject,
        decision: 'DENY',
        reason: 'The plan is not a validated agent plan; validation precedes authorization.',
        oversight,
        violations: ['GOVERNANCE.UNVALIDATED_PLAN'],
        permitted: [],
        trust,
      });
    }
    const grant = registry.get(subject);
    if (grant === undefined) {
      return this.#build({
        subject,
        decision: 'DENY',
        reason: `No governance grant is registered for subject '${subject}'.`,
        oversight,
        violations: ['GOVERNANCE.UNKNOWN_SUBJECT'],
        permitted: [],
        trust,
      });
    }
    const permission = this.#permission.evaluate(grant, request.plan);
    if (permission.ungranted.length > 0) {
      return this.#build({
        subject,
        decision: 'DENY',
        reason: `The subject is not granted ${permission.ungranted.join(', ')}; absence of a grant is a denial.`,
        oversight,
        violations: permission.ungranted.map(
          (capability) => `GOVERNANCE.NOT_GRANTED:${capability}`,
        ),
        permitted: permission.permitted,
        trust,
      });
    }
    if (!this.#autonomy.isSufficient(grant.autonomy, request.requiredAutonomy)) {
      return this.#build({
        subject,
        decision: 'ESCALATE',
        reason: `The action requires more autonomy than '${grant.autonomy}' grants; it must escalate.`,
        oversight,
        violations: ['GOVERNANCE.INSUFFICIENT_AUTONOMY'],
        permitted: permission.permitted,
        trust,
      });
    }
    const needsHuman = this.#oversight.evaluate(trust).needsHuman || requireExplicitApproval;
    if (needsHuman) {
      if (request.approved === false) {
        return this.#build({
          subject,
          decision: 'DENY',
          reason: 'A human rejected the action.',
          oversight,
          violations: ['GOVERNANCE.HUMAN_REJECTED'],
          permitted: permission.permitted,
          trust,
        });
      }
      if (request.approved !== true) {
        return this.#build({
          subject,
          decision: 'REQUIRE_APPROVAL',
          reason: `The action requires human ${oversight === 'human-approval' ? 'approval' : 'review'} before it proceeds.`,
          oversight,
          violations: [],
          permitted: permission.permitted,
          trust,
        });
      }
    }
    return this.#build({
      subject,
      decision: 'AUTHORIZE',
      reason:
        'The action is permitted, validated, within autonomy, and cleared for human oversight.',
      oversight,
      violations: [],
      permitted: permission.permitted,
      trust,
    });
  }

  /**
   * Assemble the immutable decision, computing its deterministic content-hash audit id. The violations and permitted
   * are sorted, so the stored fields match the hashed content, and the canonical form is JSON-encoded, so distinct
   * decisions never share an id through delimiter ambiguity (the id is an injective, reproducible audit identifier).
   */
  #build(core: DecisionCore): GovernanceDecision {
    const violations = Object.freeze([...core.violations].sort());
    const permitted = Object.freeze([...core.permitted].sort());
    const canonical = JSON.stringify([
      core.subject,
      core.decision,
      core.trust,
      core.oversight,
      violations,
      permitted,
    ]);
    const decision: GovernanceDecision = {
      subject: core.subject,
      decision: core.decision,
      reason: core.reason,
      oversight: core.oversight,
      violations,
      permitted,
      trust: core.trust,
      id: this.#hash.hash(canonical),
      validated: true,
    };
    return Object.freeze(decision);
  }
}
