/**
 * Risk classification (ai/safety/risk-classification.md, OL-AI-SAFETY-RISK-CLASSIFICATION).
 *
 * How the risk of a hazard is classified for protection, as immutable definitions (ADR-0020). This
 * concern owns the safety risk model only; it never defines the risk governance, categories, and
 * tolerance (owned by ai/governance/risk-management.md, which it applies and aligns with, never
 * redefines) nor the impact dimensions (owned by ai/safety/impact-assessment.md).
 *
 * Risk levels are deliberately NOT enumerated here. The constitution states that risk is "classified
 * into an ordered set of levels, from the lowest risk to the highest" that "apply, and align with, the
 * governed risk categories owned by ai/governance/risk-management.md, and never redefine them", but it
 * does not name the levels. Naming them would invent a classification, and mirroring governance's
 * TrustLevel would recreate a model owned elsewhere (referenced-model non-restatement); so this concern
 * exposes no RiskLevel enum and no ordering predicate, and states the ordered-levels rule as prose in
 * the principles and invariants, exactly as governance deferred its own underspecified relationships.
 * Classifying a concrete hazard's risk is a runtime evaluation this concern does not own.
 */

/**
 * A risk-classification principle (ai/safety/risk-classification.md, "Principles"). Each instantiates a
 * safety invariant owned by ai/safety/README.md.
 */
export type RiskClassificationPrinciple =
  | 'classified-not-guessed'
  | 'applies-governance-not-replaces'
  | 'carries-confidence'
  | 'higher-risk-raises-protection';

/** The four risk-classification principles, in constitutional order; frozen. */
export const RISK_CLASSIFICATION_PRINCIPLES: readonly RiskClassificationPrinciple[] = Object.freeze(
  [
    'classified-not-guessed',
    'applies-governance-not-replaces',
    'carries-confidence',
    'higher-risk-raises-protection',
  ],
);

/** The statement each risk-classification principle makes (ai/safety/risk-classification.md). */
export const RISK_CLASSIFICATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RiskClassificationPrinciple, string>
> = Object.freeze({
  'classified-not-guessed':
    'Every hazard is classified into a defined risk level by a defined model, never by an arbitrary judgment.',
  'applies-governance-not-replaces':
    'Risk classification applies the risk categories and tolerance owned by ai/governance/risk-management.md, and never redefines them.',
  'carries-confidence':
    'A risk classification is accompanied by the confidence in it, so a low-confidence classification is treated cautiously under ai/safety/uncertainty-management.md.',
  'higher-risk-raises-protection':
    'The higher the classified risk, the stronger the required protection, up to refusal or mandatory human escalation.',
});

/**
 * A risk-classification invariant (ai/safety/risk-classification.md, "Invariants"): a guarantee that
 * always holds for the risk model.
 */
export type RiskClassificationInvariant =
  | 'one-classified-level-ordered-by-protection'
  | 'applies-governed-categories-never-redefines'
  | 'low-confidence-raises-level'
  | 'threshold-crossing-escalates-inherited-never-lowers'
  | 'classifying-is-inert';

/** The five risk-classification invariants, in constitutional order; frozen. */
export const RISK_CLASSIFICATION_INVARIANTS: readonly RiskClassificationInvariant[] = Object.freeze(
  [
    'one-classified-level-ordered-by-protection',
    'applies-governed-categories-never-redefines',
    'low-confidence-raises-level',
    'threshold-crossing-escalates-inherited-never-lowers',
    'classifying-is-inert',
  ],
);

/** The guarantee each risk-classification invariant states (ai/safety/risk-classification.md). */
export const RISK_CLASSIFICATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RiskClassificationInvariant, string>
> = Object.freeze({
  'one-classified-level-ordered-by-protection':
    'Every hazard holds exactly one classified risk level, ordered by required protection.',
  'applies-governed-categories-never-redefines':
    'Risk classification applies the governed risk categories and tolerance and never redefines them.',
  'low-confidence-raises-level':
    'Low confidence in a classification raises the level, so uncertainty never lowers protection.',
  'threshold-crossing-escalates-inherited-never-lowers':
    'A hazard whose level crosses a threshold is escalated, and inherited risk never lowers protection.',
  'classifying-is-inert':
    'Classifying risk never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
