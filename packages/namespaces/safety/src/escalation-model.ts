/**
 * Safety escalation model (ai/safety/escalation-model.md, OL-AI-SAFETY-ESCALATION-MODEL).
 *
 * How a safety matter, once it must be escalated, is routed, prioritized, and carried to the right
 * authority without infinite or circular escalation, as immutable definitions (ADR-0020). This concern
 * owns the routing, priority, hierarchy, and compatibility of an escalation only; it never defines the
 * escalation triggers and human-review conditions (owned by ai/governance/escalation.md, which it
 * applies and never restates) nor the human authority an escalation reaches (owned by
 * ai/governance/human-oversight.md). The escalation hierarchy ascends toward greater authority, but its
 * authorities (agent, supervising authority, accountable human) are owned elsewhere and are referenced,
 * not recreated as a safety classification. Routing a concrete escalation is a runtime evaluation this
 * concern does not own. This concern states what escalation is and the invariants it always satisfies.
 */

/**
 * A safety escalation-model principle (ai/safety/escalation-model.md, "Principles"). Each instantiates a
 * safety invariant owned by ai/safety/README.md.
 */
export type EscalationModelPrinciple =
  | 'applies-triggers-never-defines'
  | 'bounded-and-acyclic'
  | 'higher-risk-higher-priority'
  | 'reaches-accountable-humans';

/** The four safety escalation-model principles, in constitutional order; frozen. */
export const ESCALATION_MODEL_PRINCIPLES: readonly EscalationModelPrinciple[] = Object.freeze([
  'applies-triggers-never-defines',
  'bounded-and-acyclic',
  'higher-risk-higher-priority',
  'reaches-accountable-humans',
]);

/** The statement each safety escalation-model principle makes (ai/safety/escalation-model.md). */
export const ESCALATION_MODEL_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EscalationModelPrinciple, string>
> = Object.freeze({
  'applies-triggers-never-defines':
    'Whether a matter must be escalated is owned by ai/governance/escalation.md; this document owns how it is then carried.',
  'bounded-and-acyclic':
    'Every escalation reaches an authority in a finite number of steps, so no infinite or circular escalation is possible.',
  'higher-risk-higher-priority':
    'A matter of greater risk is escalated more urgently, so the most serious matters reach an authority first.',
  'reaches-accountable-humans':
    'For matters reserved to humans, escalation routes to an accountable human, deferring the human role to ai/governance/human-oversight.md.',
});

/**
 * A safety escalation-model invariant (ai/safety/escalation-model.md, "Invariants"): a guarantee that
 * always holds for the escalation model.
 */
export type EscalationModelInvariant =
  | 'applies-governed-triggers-never-defines'
  | 'reaches-authority-finite-no-cycle'
  | 'higher-risk-higher-priority-never-lowers'
  | 'reserved-matter-ascends-to-human'
  | 'routing-is-inert';

/** The five safety escalation-model invariants, in constitutional order; frozen. */
export const ESCALATION_MODEL_INVARIANTS: readonly EscalationModelInvariant[] = Object.freeze([
  'applies-governed-triggers-never-defines',
  'reaches-authority-finite-no-cycle',
  'higher-risk-higher-priority-never-lowers',
  'reserved-matter-ascends-to-human',
  'routing-is-inert',
]);

/** The guarantee each safety escalation-model invariant states (ai/safety/escalation-model.md). */
export const ESCALATION_MODEL_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EscalationModelInvariant, string>
> = Object.freeze({
  'applies-governed-triggers-never-defines':
    'Escalation applies the governed triggers and never defines them.',
  'reaches-authority-finite-no-cycle':
    'Every escalation reaches a deciding authority in a finite number of steps, with no cycle.',
  'higher-risk-higher-priority-never-lowers':
    'A higher-risk matter is escalated with higher priority, and priority never lowers protection.',
  'reserved-matter-ascends-to-human':
    'A matter reserved to a human ascends to an accountable human.',
  'routing-is-inert':
    'Routing an escalation never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
