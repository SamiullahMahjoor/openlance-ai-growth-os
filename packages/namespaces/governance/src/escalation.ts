/**
 * Escalation governance (ai/governance/escalation.md, OL-AI-GOVERNANCE-ESCALATION).
 *
 * When and why AI work escalates, as immutable rule definitions (ADR-0020): the escalation principles
 * and the escalation triggers - the absolute conditions under which a significant action must halt and
 * be raised to a human. This concern owns the triggers and conditions only; it never defines the human
 * role that receives an escalation (owned by ai/governance/human-oversight.md) nor the runtime that
 * routes, queues, or notifies it (operational).
 *
 * It exposes no predicate. Whether a specific action meets an escalation trigger is a runtime
 * evaluation over an Action and a RuntimeState the governance layer does not own, so under the
 * boundary rule (ADR-0020, ADR-0025) it is deferred to the runtime, exactly as the Authority model was
 * in Stage 3 and the ValidationResult in Stage 4. Several triggers reference other governance
 * dimensions (authority, autonomy, risk and trust, validation); this concern references those owners
 * and never derives a relationship to them (ADR-0025), because escalation.md defers each such
 * determination to that owner rather than defining it here. Governance defines when escalation is
 * required; the runtime performs it.
 */

/**
 * An escalation principle: an enduring governance principle for escalation (ai/governance/escalation.md,
 * "Principles"). Each instantiates a constitutional principle owned by ai/README.md.
 */
export type EscalationPrinciple =
  | 'always-valid'
  | 'uncertainty-defaults-to-escalation'
  | 'safe-never-a-failure'
  | 'preserves-accountability';

/** The four escalation principles, in constitutional order; frozen. */
export const ESCALATION_PRINCIPLES: readonly EscalationPrinciple[] = Object.freeze([
  'always-valid',
  'uncertainty-defaults-to-escalation',
  'safe-never-a-failure',
  'preserves-accountability',
]);

/** The statement each escalation principle instantiates (ai/governance/escalation.md). */
export const ESCALATION_PRINCIPLE_DESCRIPTIONS: Readonly<Record<EscalationPrinciple, string>> =
  Object.freeze({
    'always-valid':
      'Halting and raising an action to a human is always permitted and is never overridden by a goal.',
    'uncertainty-defaults-to-escalation':
      'When an action is uncertain, unresolved, or unsupported by governance, the AI escalates or refuses rather than proceed.',
    'safe-never-a-failure':
      'Raising an action to a human is a correct and expected outcome, not an error to be avoided.',
    'preserves-accountability':
      'An escalated action is handed to an accountable human, never dropped or resolved by guessing.',
  });

/**
 * An escalation trigger: an absolute condition under which every AI agent escalates
 * (ai/governance/escalation.md, "Mandates"; named the escalation triggers by that document's summary
 * and by the governance inventory ai/governance/governance.md). The triggers are disjunctive - an agent
 * escalates whenever any one of them holds - not a ranked scale.
 */
export type EscalationTrigger =
  | 'beyond-authority'
  | 'beyond-autonomy'
  | 'failed-validation'
  | 'high-risk'
  | 'unresolved-uncertainty'
  | 'conflict'
  | 'deadlock'
  | 'legal-or-safety-significance';

/**
 * The eight escalation triggers, in constitutional order; frozen. Each is absolute: when any one holds
 * the agent halts the action and raises it for human review, never proceeding by inventing a rule, a
 * fact, or an outcome.
 */
export const ESCALATION_TRIGGERS: readonly EscalationTrigger[] = Object.freeze([
  'beyond-authority',
  'beyond-autonomy',
  'failed-validation',
  'high-risk',
  'unresolved-uncertainty',
  'conflict',
  'deadlock',
  'legal-or-safety-significance',
]);

/** The condition each escalation trigger states (ai/governance/escalation.md). */
export const ESCALATION_TRIGGER_DESCRIPTIONS: Readonly<Record<EscalationTrigger, string>> =
  Object.freeze({
    'beyond-authority':
      "The action would exceed the agent's authority in the Authority Hierarchy owned by ai/README.md.",
    'beyond-autonomy':
      'The action falls outside what autonomy may do, as owned by ai/governance/autonomy-boundaries.md.',
    'failed-validation':
      'The action failed constitutional validation under ai/governance/constitutional-validation.md.',
    'high-risk':
      'The action reaches a governance risk or trust level that requires human review, as owned by ai/governance/risk-management.md.',
    'unresolved-uncertainty':
      'The basis for the action is uncertain, incomplete, or unsupported by governance or by canonical knowledge, and the uncertainty cannot be resolved within the rules.',
    conflict:
      'Two governing rules, two authorities, or a rule and a goal conflict in a way the agent cannot resolve by the authority hierarchy with confidence.',
    deadlock:
      'The action cannot proceed and cannot safely be abandoned, so no governed path forward exists without human judgment.',
    'legal-or-safety-significance':
      'The action carries legal or safety significance that requires human accountability, as required by knowledge/company/legal.md and ai/governance/human-oversight.md.',
  });
