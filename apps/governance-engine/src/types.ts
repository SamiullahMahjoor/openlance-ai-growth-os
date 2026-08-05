import type { AgentExecutionPlan } from '@openlance/aios-agent-engine';
import type { AutonomyLevel, OversightRequirement, TrustLevel } from '@openlance/aios-governance';

/** A governance subject's stable identity within the engine (the acting agent's id). */
export type GovernanceId = string;

/**
 * A governance grant: what an accountable authority has granted a subject. It carries the `permissions` the subject
 * holds (the capabilities it is granted, per the frozen `explicit-grant` mandate: absence of a grant is a denial) and
 * the `autonomy` level it is granted (its operational independence). The engine applies the grant; it never widens or
 * mints it.
 */
export interface GovernanceGrant {
  readonly subject: GovernanceId;
  readonly permissions: readonly string[];
  readonly autonomy: AutonomyLevel;
}

/** A grant's registration input; the factory validates it, normalizes its names, and freezes it. */
export interface GovernanceGrantInput {
  readonly subject: GovernanceId;
  readonly permissions: readonly string[];
  readonly autonomy: AutonomyLevel;
}

/**
 * A governance request: the immutable `AgentExecutionPlan` to authorize, the action's `trust` classification (provided;
 * governance applies it and never scores risk), the `requiredAutonomy` the action needs (optional), and whether a human
 * `approved` it (for the require-approval path). The engine authorizes the plan against the subject's grant and the
 * frozen governance model; it never modifies the plan.
 */
export interface GovernanceRequest {
  readonly plan: AgentExecutionPlan;
  readonly trust: TrustLevel;
  readonly requiredAutonomy?: AutonomyLevel;
  readonly approved?: boolean;
}

/**
 * A governance outcome: the only legal governance decisions. `AUTHORIZE` (permitted, validated, within autonomy, and no
 * outstanding oversight), `DENY` (unknown subject, an ungranted capability, or an unvalidated plan), `REQUIRE_APPROVAL`
 * (a human approval is required and not recorded), or `ESCALATE` (the action needs more autonomy than the subject is
 * granted). The safety-owned `SANITIZE` and `RESTRICT` are the Safety Engine's, not governance's.
 */
export type GovernanceOutcome = 'AUTHORIZE' | 'DENY' | 'REQUIRE_APPROVAL' | 'ESCALATE';

/**
 * An immutable governance decision: the authorization the runtime carries. It names the `subject`, the `decision`, the
 * explaining `reason`, the `oversight` the trust level requires, the `violations` that produced the decision, the
 * granted capabilities the plan `permitted`, the `trust` applied, and a deterministic content-hash `id` (the reproducible
 * audit identifier). `validated: true` marks that it was produced by the frozen evaluation. It is minted authorization,
 * not policy; it may only be consumed, rejected, archived, or superseded by a new evaluation, never modified.
 */
export interface GovernanceDecision {
  readonly subject: GovernanceId;
  readonly decision: GovernanceOutcome;
  readonly reason: string;
  readonly oversight: OversightRequirement;
  readonly violations: readonly string[];
  readonly permitted: readonly string[];
  readonly trust: TrustLevel;
  readonly id: string;
  readonly validated: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface GovernanceStatistics {
  readonly registrations: number;
  readonly evaluations: number;
  readonly authorized: number;
  readonly denied: number;
  readonly approvalsRequired: number;
  readonly escalated: number;
}

/** A read-only operational view of the engine. */
export interface GovernanceDiagnostics {
  readonly grantCount: number;
  readonly statistics: GovernanceStatistics;
}
