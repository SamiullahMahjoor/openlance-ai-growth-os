/**
 * Safety uncertainty management (ai/safety/uncertainty-management.md,
 * OL-AI-SAFETY-UNCERTAINTY-MANAGEMENT).
 *
 * How uncertainty is managed as a safety signal, so that what is unknown, ambiguous, or in conflict is
 * surfaced and handled safely rather than hidden, as immutable definitions (ADR-0020). This concern owns
 * the safety uncertainty model only; it never defines the classification of uncertainty within reasoning
 * (owned by ai/reasoning/uncertainty-handling.md) nor the escalation triggers (owned by
 * ai/governance/escalation.md). Handling a concrete uncertainty is a runtime evaluation this concern does
 * not own. This concern states what safety uncertainty management is and the invariants it always
 * satisfies.
 */

/**
 * A safety uncertainty-management principle (ai/safety/uncertainty-management.md, "Principles"). Each
 * instantiates a safety invariant owned by ai/safety/README.md.
 */
export type UncertaintyManagementPrinciple =
  | 'surfaced-never-hidden'
  | 'low-confidence-raises-protection'
  | 'incompleteness-is-risk'
  | 'unresolved-escalates';

/** The four safety uncertainty-management principles, in constitutional order; frozen. */
export const UNCERTAINTY_MANAGEMENT_PRINCIPLES: readonly UncertaintyManagementPrinciple[] =
  Object.freeze([
    'surfaced-never-hidden',
    'low-confidence-raises-protection',
    'incompleteness-is-risk',
    'unresolved-escalates',
  ]);

/** The statement each safety uncertainty-management principle makes (ai/safety/uncertainty-management.md). */
export const UNCERTAINTY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<UncertaintyManagementPrinciple, string>
> = Object.freeze({
  'surfaced-never-hidden':
    'What is unknown, ambiguous, or in conflict is made explicit, so protection is never removed by a false confidence.',
  'low-confidence-raises-protection':
    'The less certain the AI is, the more it protects, up to refusal or escalation.',
  'incompleteness-is-risk':
    'Missing knowledge is treated as a hazard, not assumed away, deferring the truth itself to the knowledge repository.',
  'unresolved-escalates':
    'Uncertainty that cannot be safely resolved is escalated rather than acted through.',
});

/**
 * A safety uncertainty-management invariant (ai/safety/uncertainty-management.md, "Invariants"): a
 * guarantee that always holds for the uncertainty model.
 */
export type UncertaintyManagementInvariant =
  | 'bearing-uncertainty-surfaced-never-hidden'
  | 'lower-confidence-raises-protection'
  | 'incompleteness-treated-as-hazard'
  | 'conflict-resolved-by-authority-and-least-harm-or-escalated'
  | 'managing-is-inert';

/** The five safety uncertainty-management invariants, in constitutional order; frozen. */
export const UNCERTAINTY_MANAGEMENT_INVARIANTS: readonly UncertaintyManagementInvariant[] =
  Object.freeze([
    'bearing-uncertainty-surfaced-never-hidden',
    'lower-confidence-raises-protection',
    'incompleteness-treated-as-hazard',
    'conflict-resolved-by-authority-and-least-harm-or-escalated',
    'managing-is-inert',
  ]);

/** The guarantee each safety uncertainty-management invariant states (ai/safety/uncertainty-management.md). */
export const UNCERTAINTY_MANAGEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<UncertaintyManagementInvariant, string>
> = Object.freeze({
  'bearing-uncertainty-surfaced-never-hidden':
    'Uncertainty that bears on safety is surfaced and never hidden.',
  'lower-confidence-raises-protection':
    'Lower confidence raises protection, so uncertainty never lowers it.',
  'incompleteness-treated-as-hazard':
    'Incomplete knowledge is treated as a hazard, not assumed away.',
  'conflict-resolved-by-authority-and-least-harm-or-escalated':
    'A detected conflict is resolved by higher authority and least harm, or escalated, never applied silently.',
  'managing-is-inert':
    'Managing uncertainty never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
