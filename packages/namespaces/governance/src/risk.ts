/**
 * Risk and trust governance (ai/governance/risk-management.md, OL-AI-GOVERNANCE-RISK-MANAGEMENT).
 *
 * The governance trust levels and the oversight each requires, expressed as immutable truth and pure
 * predicates (ADR-0020). This module states the rule; it never detects, measures, or scores risk,
 * which is operational and owned by the operational namespaces and the runtime.
 */

/**
 * A governance trust level: the classification of the oversight an action requires
 * (ai/governance/risk-management.md, "Governance Trust Levels"). Ordered by increasing consequence.
 */
export type TrustLevel = 'low' | 'moderate' | 'high' | 'critical';

/** The trust levels in constitutional order, from least to most consequential; frozen. */
export const TRUST_LEVELS = Object.freeze([
  'low',
  'moderate',
  'high',
  'critical',
] as const) satisfies readonly TrustLevel[];

/**
 * The oversight a trust level requires, as stated by ai/governance/risk-management.md: Low is
 * governed by the standing rules with no added oversight; Moderate by the standing rules with
 * traceability preserved for review; High requires human review; Critical requires human approval
 * before it proceeds.
 */
export type OversightRequirement =
  'standing-rules' | 'standing-rules-with-traceability' | 'human-review' | 'human-approval';

const OVERSIGHT_BY_TRUST: Readonly<Record<TrustLevel, OversightRequirement>> = {
  low: 'standing-rules',
  moderate: 'standing-rules-with-traceability',
  high: 'human-review',
  critical: 'human-approval',
};

/** The oversight the given trust level requires (ai/governance/risk-management.md). */
export const requiredOversight = (level: TrustLevel): OversightRequirement =>
  OVERSIGHT_BY_TRUST[level];

/**
 * Whether an action at this trust level requires human approval before it proceeds. A Critical
 * action requires human approval and is never taken autonomously (ai/governance/risk-management.md).
 */
export const requiresHumanApproval = (level: TrustLevel): boolean => level === 'critical';

const TRUST_RANK: Readonly<Record<TrustLevel, number>> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

/** Whether trust level `a` is at least as consequential as trust level `b` (constitutional order). */
export const trustAtLeast = (a: TrustLevel, b: TrustLevel): boolean =>
  TRUST_RANK[a] >= TRUST_RANK[b];

/**
 * The more consequential of two trust levels. Unclear or combined risk is governed at the higher
 * level, never the lower (ai/governance/risk-management.md: an action of unclear risk is governed at
 * the higher level).
 */
export const higherTrust = (a: TrustLevel, b: TrustLevel): TrustLevel =>
  TRUST_RANK[a] >= TRUST_RANK[b] ? a : b;
