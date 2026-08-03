/**
 * Decision-making governance (ai/governance/decision-making.md, OL-AI-GOVERNANCE-DECISION-MAKING).
 *
 * How AI decisions are governed - so that every significant decision is authorized, consistent,
 * traceable, and accountable - as immutable rule definitions (ADR-0020): the decision-making
 * principles and mandates. This concern owns the governance of decisions only; it never defines how a
 * decision is computed, scored, or reached (operational, owned by the Reasoning namespace).
 *
 * It exposes no predicate, and it defines no classification. The "decision hierarchy" named in the
 * document summary and the governance inventory is the AI Authority Hierarchy owned by ai/README.md
 * (Authorized mandate); this module references that owner and does not reproduce the hierarchy as an
 * enum, an ordering, or a predicate (referenced-model non-restatement rule; see the design doc section
 * 7a). Whether a specific decision is authorized, owned, governed, reviewable, consistent, validated,
 * or safe is a runtime evaluation over a Decision, a DecisionContext, and an Action that governance
 * does not own, so under the boundary rule (ADR-0020, ADR-0025) it is deferred to the runtime, exactly
 * as prior stages deferred Authority, ValidationResult, the escalation evaluation, the policy-conflict
 * evaluation, and the human-approval workflow. Governance defines decision-making truth; the runtime
 * performs decision execution.
 */

/**
 * A decision-making principle: an enduring governance principle for decision-making
 * (ai/governance/decision-making.md, "Principles"). Each instantiates a constitutional principle owned
 * by ai/README.md.
 */
export type DecisionMakingPrinciple =
  'governed-not-improvised' | 'accountable' | 'consistent' | 'traceable' | 'never-invent';

/** The five decision-making principles, in constitutional order; frozen. */
export const DECISION_MAKING_PRINCIPLES: readonly DecisionMakingPrinciple[] = Object.freeze([
  'governed-not-improvised',
  'accountable',
  'consistent',
  'traceable',
  'never-invent',
]);

/** The statement each decision-making principle instantiates (ai/governance/decision-making.md). */
export const DECISION_MAKING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<DecisionMakingPrinciple, string>
> = Object.freeze({
  'governed-not-improvised':
    'Every significant decision is made under the rules, never outside them.',
  accountable:
    'Every significant decision has an authority that permits it and an accountable owner who answers for it.',
  consistent:
    'The same governed inputs and rules yield the same governed decision, across agents and over time.',
  traceable:
    'A significant decision can be traced to its authority, its owner, the governing rule it followed, and the knowledge it relied on.',
  'never-invent':
    'A decision unsupported by governance or by canonical knowledge is escalated or refused, never fabricated.',
});

/**
 * A decision-making mandate: an absolute rule every significant decision satisfies
 * (ai/governance/decision-making.md, "Mandates"). The mandates are conjunctive - every significant
 * decision satisfies all of them - not a ranked scale.
 */
export type DecisionMakingMandate =
  | 'authorized'
  | 'owned'
  | 'governed-by-policy'
  | 'reviewable'
  | 'consistent'
  | 'validated'
  | 'safe-under-uncertainty';

/**
 * The seven decision-making mandates, in constitutional order; frozen. Every mandate is absolute and
 * every significant decision satisfies all of them.
 */
export const DECISION_MAKING_MANDATES: readonly DecisionMakingMandate[] = Object.freeze([
  'authorized',
  'owned',
  'governed-by-policy',
  'reviewable',
  'consistent',
  'validated',
  'safe-under-uncertainty',
]);

/** The rule each decision-making mandate states (ai/governance/decision-making.md). */
export const DECISION_MAKING_MANDATE_DESCRIPTIONS: Readonly<Record<DecisionMakingMandate, string>> =
  Object.freeze({
    authorized:
      "A significant decision is made only under a defined authority in the AI Authority Hierarchy owned by ai/README.md; a decision above the deciding agent's authority is escalated, not taken.",
    owned:
      'A significant decision has exactly one accountable owner, a role defined under human accountability owned by ai/governance/human-oversight.md; automation never removes that ownership.',
    'governed-by-policy':
      'A significant decision follows a governing rule or policy; where no rule permits it, the decision is escalated under ai/governance/escalation.md, not made by default.',
    reviewable:
      'A significant decision is reviewable by an accountable human, who can determine its authority, owner, governing rule, and the knowledge it relied on; this document requires reviewability and defines no logging or recording system.',
    consistent:
      'Decisions governed by the same rules and inputs do not diverge between agents or over time.',
    validated:
      'A significant decision is validated before it is acted on, under ai/governance/constitutional-validation.md.',
    'safe-under-uncertainty':
      'When the basis for a decision is uncertain, unresolved, or unsupported, the decision defaults to refusal or escalation, never to invention.',
  });
