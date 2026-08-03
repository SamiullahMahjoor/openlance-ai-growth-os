/**
 * Refusal model (ai/safety/refusal-model.md, OL-AI-SAFETY-REFUSAL-MODEL).
 *
 * How the AI refuses an action it cannot take safely, the kinds of refusal, and how it recovers, as
 * immutable definitions (ADR-0020). This concern owns the refusal architecture only; it never defines
 * the governed conditions that require a refusal (owned by ai/governance/autonomy-boundaries.md) nor the
 * escalation routing (owned by ai/safety/escalation-model.md). Whether a concrete action requires
 * refusal is a runtime evaluation this concern does not own. This concern states the refusal categories
 * and the invariants it always satisfies. (The document's Specification enumerates exactly these three
 * refusal categories; "graceful refusal" and "recovery after refusal" are separate cross-cutting
 * properties of every refusal, not categories, and are stated in the principles and invariants.)
 */

/**
 * A refusal-model principle (ai/safety/refusal-model.md, "Principles"). Each instantiates a safety
 * invariant owned by ai/safety/README.md.
 */
export type RefusalModelPrinciple =
  'protective-not-punitive' | 'proportionate-and-correct' | 'graceful' | 'recoverable';

/** The four refusal-model principles, in constitutional order; frozen. */
export const REFUSAL_MODEL_PRINCIPLES: readonly RefusalModelPrinciple[] = Object.freeze([
  'protective-not-punitive',
  'proportionate-and-correct',
  'graceful',
  'recoverable',
]);

/** The statement each refusal-model principle makes (ai/safety/refusal-model.md). */
export const REFUSAL_MODEL_PRINCIPLE_DESCRIPTIONS: Readonly<Record<RefusalModelPrinciple, string>> =
  Object.freeze({
    'protective-not-punitive':
      'A refusal exists to prevent harm, and it declines only the unsafe action, never more than necessary.',
    'proportionate-and-correct':
      'The AI refuses when, and only when, safety requires it, so protection is neither missing nor excessive.',
    graceful:
      'A refusal is clear and orderly, leaves the AI in a safe state, and never destabilizes it.',
    recoverable:
      'After a refusal, safe operation resumes without loss of protection, and the refusal itself removes no protection.',
  });

/**
 * A refusal category (ai/safety/refusal-model.md, "Specification"). A refusal falls into exactly one of
 * these architectural categories, so that every refusal is defined and never arbitrary.
 */
export type RefusalCategory = 'protective' | 'constitutional' | 'escalation';

/** The three refusal categories, in constitutional order; frozen. */
export const REFUSAL_CATEGORIES: readonly RefusalCategory[] = Object.freeze([
  'protective',
  'constitutional',
  'escalation',
]);

/** What each refusal category refuses, and its owner (ai/safety/refusal-model.md). */
export const REFUSAL_CATEGORY_DESCRIPTIONS: Readonly<Record<RefusalCategory, string>> =
  Object.freeze({
    protective:
      'An action is refused because a hazard makes it unsafe, identified under ai/safety/hazard-identification.md and classified under ai/safety/risk-classification.md.',
    constitutional:
      'An action is refused because it would violate the constitution or a governance mandate, whose conditions are owned by ai/governance/autonomy-boundaries.md and which this document applies and never restates.',
    escalation:
      'An action is refused pending human decision, because it is reserved to an accountable human, and it is routed through ai/safety/escalation-model.md under the triggers owned by ai/governance/escalation.md.',
  });

/**
 * A refusal-model invariant (ai/safety/refusal-model.md, "Invariants"): a guarantee that always holds
 * for the refusal model.
 */
export type RefusalModelInvariant =
  | 'declines-only-unsafe-never-fails-open'
  | 'refuses-when-and-only-when-required'
  | 'leaves-safe-state-recoverable'
  | 'not-retried-unless-hazard-resolved'
  | 'refusing-is-inert';

/** The five refusal-model invariants, in constitutional order; frozen. */
export const REFUSAL_MODEL_INVARIANTS: readonly RefusalModelInvariant[] = Object.freeze([
  'declines-only-unsafe-never-fails-open',
  'refuses-when-and-only-when-required',
  'leaves-safe-state-recoverable',
  'not-retried-unless-hazard-resolved',
  'refusing-is-inert',
]);

/** The guarantee each refusal-model invariant states (ai/safety/refusal-model.md). */
export const REFUSAL_MODEL_INVARIANT_DESCRIPTIONS: Readonly<Record<RefusalModelInvariant, string>> =
  Object.freeze({
    'declines-only-unsafe-never-fails-open':
      'A refusal declines only the unsafe action and preserves every protection, never failing open.',
    'refuses-when-and-only-when-required':
      'The AI refuses when and only when safety requires it, so protection is proportionate.',
    'leaves-safe-state-recoverable':
      'A refusal leaves the AI in a safe state and is recoverable without loss of protection.',
    'not-retried-unless-hazard-resolved':
      'A refused action is not retried unless the hazard that caused the refusal is resolved.',
    'refusing-is-inert':
      'Refusing an action never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
  });
