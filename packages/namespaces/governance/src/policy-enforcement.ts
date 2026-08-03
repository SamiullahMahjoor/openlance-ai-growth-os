/**
 * Policy enforcement governance (ai/governance/policy-enforcement.md,
 * OL-AI-GOVERNANCE-POLICY-ENFORCEMENT).
 *
 * How AI policies are enforced, take precedence, and are resolved when they conflict, as immutable
 * rule definitions (ADR-0020): the policy-enforcement principles and mandates. This concern owns the
 * governance of policy application only; it never defines the operational policies of any namespace
 * (those namespaces own them) nor the runtime that applies a policy (operational).
 *
 * It exposes no predicate, and it does not reproduce the precedence ordering in executable code.
 * Policy precedence follows the AI Authority Hierarchy (Charter to Reference) owned by ai/README.md;
 * this module states that rule as constitutional prose and references its owner, but defines no
 * PrecedenceLevel classification, no authority-level enum, and no prevailsOver predicate, because the
 * ordering is owned by ai/README.md, not by governance (referenced-model non-restatement rule; see the
 * design doc section 7a, ADR-0020, ADR-0025). Resolving which of two real policies prevails is a
 * runtime evaluation over a Policy and a PolicyConflict the governance layer does not own, so it is
 * deferred to the runtime, exactly as prior stages deferred Authority, ValidationResult, and the
 * escalation evaluation. Governance defines constitutional policy truth; the runtime performs
 * enforcement.
 */

/**
 * A policy-enforcement principle: an enduring governance principle for policy enforcement
 * (ai/governance/policy-enforcement.md, "Principles"). Each instantiates a constitutional principle
 * owned by ai/README.md.
 */
export type PolicyEnforcementPrinciple =
  | 'policies-precede-runtime'
  | 'precedence-follows-authority'
  | 'enforcement-is-consistent'
  | 'exceptions-are-governed';

/** The four policy-enforcement principles, in constitutional order; frozen. */
export const POLICY_ENFORCEMENT_PRINCIPLES: readonly PolicyEnforcementPrinciple[] = Object.freeze([
  'policies-precede-runtime',
  'precedence-follows-authority',
  'enforcement-is-consistent',
  'exceptions-are-governed',
]);

/** The statement each policy-enforcement principle instantiates (ai/governance/policy-enforcement.md). */
export const POLICY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PolicyEnforcementPrinciple, string>
> = Object.freeze({
  'policies-precede-runtime':
    'A policy is defined and governed before it is applied, never discovered at execution time.',
  'precedence-follows-authority':
    'When policies conflict, the higher authority in the AI Authority Hierarchy prevails.',
  'enforcement-is-consistent':
    'The same policy applied to the same governed situation yields the same governed outcome.',
  'exceptions-are-governed':
    "A deviation from a policy is a governed, accountable decision, never an agent's convenience.",
});

/**
 * A policy-enforcement mandate: an absolute rule of policy enforcement and precedence
 * (ai/governance/policy-enforcement.md, "Mandates").
 */
export type PolicyEnforcementMandate =
  | 'enforced-not-advisory'
  | 'precedence-by-authority'
  | 'business-truth-prevails'
  | 'unresolved-conflict-escalates'
  | 'governed-exceptions-only'
  | 'no-silent-override';

/** The six policy-enforcement mandates, in constitutional order; frozen. Every mandate is absolute. */
export const POLICY_ENFORCEMENT_MANDATES: readonly PolicyEnforcementMandate[] = Object.freeze([
  'enforced-not-advisory',
  'precedence-by-authority',
  'business-truth-prevails',
  'unresolved-conflict-escalates',
  'governed-exceptions-only',
  'no-silent-override',
]);

/**
 * The rule each policy-enforcement mandate states (ai/governance/policy-enforcement.md). The
 * precedence-by-authority mandate states the precedence rule as the constitution words it; the
 * authority ordering it names is owned by ai/README.md and is referenced here, not reproduced in
 * executable code.
 */
export const POLICY_ENFORCEMENT_MANDATE_DESCRIPTIONS: Readonly<
  Record<PolicyEnforcementMandate, string>
> = Object.freeze({
  'enforced-not-advisory':
    'A policy that governs an action is enforced before the action proceeds; a governing policy is never treated as optional.',
  'precedence-by-authority':
    'When two policies conflict, the one at the higher authority level owned by ai/README.md prevails, and the lower conforms; a mandate always prevails over a policy, and a policy over a specification.',
  'business-truth-prevails':
    'Where an AI policy and a business rule owned by the knowledge repository bear on the same matter, the business truth governs, and the AI policy conforms to it, consumed by reference.',
  'unresolved-conflict-escalates':
    'A policy conflict that cannot be resolved by authority with confidence is escalated under ai/governance/escalation.md, never resolved by guessing.',
  'governed-exceptions-only':
    'An exception to a policy is permitted only through an accountable, governed decision under ai/governance/human-oversight.md and ai/governance/change-governance.md; an agent never grants itself an exception.',
  'no-silent-override':
    'No policy, agent, or runtime silently overrides a higher policy or a mandate; authority cannot be bypassed.',
});
