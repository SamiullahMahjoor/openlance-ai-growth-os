/**
 * Safety principles (ai/safety/safety-principles.md, OL-AI-SAFETY-SAFETY-PRINCIPLES).
 *
 * The enduring principles of protection, as immutable definitions (ADR-0020). This concern owns the
 * safety principles only; it never defines the governance rules the principles apply (owned by
 * ai/governance/) nor the risk model (owned by ai/safety/risk-classification.md). The principles are the
 * permanent commitments every safety document instantiates; stating a principle never executes.
 */

/**
 * A safety principle: an enduring principle of protection (ai/safety/safety-principles.md,
 * "Principles"). Each instantiates a safety invariant owned by ai/safety/README.md and applies, never
 * redefines, the governance rules owned by ai/governance/.
 */
export type SafetyPrinciple =
  | 'constitutional-safety'
  | 'least-harm'
  | 'defense-in-depth'
  | 'safe-failure'
  | 'fail-closed'
  | 'least-privilege-alignment'
  | 'risk-awareness'
  | 'uncertainty-first'
  | 'deterministic-protection'
  | 'human-accountability'
  | 'future-proofing';

/** The eleven safety principles, in constitutional order; frozen. */
export const SAFETY_PRINCIPLES: readonly SafetyPrinciple[] = Object.freeze([
  'constitutional-safety',
  'least-harm',
  'defense-in-depth',
  'safe-failure',
  'fail-closed',
  'least-privilege-alignment',
  'risk-awareness',
  'uncertainty-first',
  'deterministic-protection',
  'human-accountability',
  'future-proofing',
]);

/** The statement each safety principle makes (ai/safety/safety-principles.md). */
export const SAFETY_PRINCIPLE_DESCRIPTIONS: Readonly<Record<SafetyPrinciple, string>> =
  Object.freeze({
    'constitutional-safety':
      'Safety operates within the constitution and the governance mandates, and never outside them; it applies the rules and never overrides or replaces them.',
    'least-harm':
      'Where harm cannot be wholly avoided, the safest available course, causing the least harm, is taken, and no greater harm is accepted for convenience.',
    'defense-in-depth':
      'Protection is layered across hazard identification, risk classification, impact assessment, boundary enforcement, refusal, escalation, and degradation, so that no single failure removes protection.',
    'safe-failure':
      'When any part of the AI fails, it fails into a safe state, and a failure never removes a protection or widens what the AI may do.',
    'fail-closed':
      'When safety cannot confirm an action is within safe limits, the default is to refuse, escalate, or degrade, never to proceed.',
    'least-privilege-alignment':
      'Safety aligns with least privilege: it never assumes authority beyond what governance grants, and it treats excess authority as a hazard, deferring the permission rules to ai/governance/permission-governance.md.',
    'risk-awareness':
      'Every action is protected in proportion to its risk and impact, assessed under ai/safety/risk-classification.md and ai/safety/impact-assessment.md.',
    'uncertainty-first':
      'Uncertainty is surfaced and treated as a safety signal before an action proceeds, never hidden inside a confident action, under ai/safety/uncertainty-management.md.',
    'deterministic-protection':
      'The same hazard and context yield the same protective response, so protection is predictable and never arbitrary.',
    'human-accountability':
      'Safety escalates to accountable humans for the matters the constitution reserves to them, and never substitutes its own judgment for theirs, deferring the human role to ai/governance/human-oversight.md.',
    'future-proofing':
      'The principles are stated independently of any provider, model, framework, or runtime, so they endure as those change.',
  });

/**
 * A safety-principles invariant (ai/safety/safety-principles.md, "Invariants"): a guarantee that always
 * holds for the safety principles.
 */
export type SafetyPrinciplesInvariant =
  | 'operates-within-governance-never-overrides'
  | 'unconfirmed-refuses-escalates-degrades'
  | 'layered-no-single-failure'
  | 'same-hazard-same-response'
  | 'stating-a-principle-is-inert';

/** The five safety-principles invariants, in constitutional order; frozen. */
export const SAFETY_PRINCIPLES_INVARIANTS: readonly SafetyPrinciplesInvariant[] = Object.freeze([
  'operates-within-governance-never-overrides',
  'unconfirmed-refuses-escalates-degrades',
  'layered-no-single-failure',
  'same-hazard-same-response',
  'stating-a-principle-is-inert',
]);

/** The guarantee each safety-principles invariant states (ai/safety/safety-principles.md). */
export const SAFETY_PRINCIPLES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<SafetyPrinciplesInvariant, string>
> = Object.freeze({
  'operates-within-governance-never-overrides':
    'Safety operates within the constitution and the governance mandates, and never overrides them.',
  'unconfirmed-refuses-escalates-degrades':
    'When safety cannot confirm an action is within safe limits, the AI refuses, escalates, or degrades, never proceeds.',
  'layered-no-single-failure': 'Protection is layered, so no single failure removes it.',
  'same-hazard-same-response': 'The same hazard and context yield the same protective response.',
  'stating-a-principle-is-inert':
    'Stating a principle never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
