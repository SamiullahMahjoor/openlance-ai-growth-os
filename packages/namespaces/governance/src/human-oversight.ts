/**
 * Human oversight governance (ai/governance/human-oversight.md, OL-AI-GOVERNANCE-HUMAN-OVERSIGHT).
 *
 * The human role in governing the AI layer - human accountability, authority, approval, override,
 * review, and responsibility - as immutable rule definitions (ADR-0020): the oversight principles and
 * mandates. This concern owns the human role in governance only; it never defines when an action must
 * reach a human (owned by ai/governance/escalation.md), the document approval matrix (owned by
 * ai/CONTRIBUTING.md), any business or legal accountability (owned by the knowledge repository), or the
 * runtime that presents actions to humans and records their decisions (operational).
 *
 * It exposes no predicate. Whether a specific action requires human approval, and whether a human has
 * approved, overridden, or reviewed it, is a runtime evaluation over an Action, an ApprovalRequest, and
 * a HumanActor the governance layer does not own, so under the boundary rule (ADR-0020, ADR-0025) it is
 * deferred to the runtime, exactly as prior stages deferred Authority, ValidationResult, the escalation
 * evaluation, and the policy-conflict evaluation. The approval-triggering conditions named in the
 * human-approval mandate (normative, high risk, legally significant, autonomy-expanding) draw on other
 * constitutional owners (the authority hierarchy in ai/README.md, ai/governance/risk-management.md,
 * ai/governance/autonomy-boundaries.md, and knowledge/company/legal.md); this module references those
 * owners and derives no relationship to them, and recreates none of their models (referenced-model
 * non-restatement rule; see the design doc section 7a). Governance defines oversight truth; the runtime
 * performs oversight workflow.
 */

/**
 * A human-oversight principle: an enduring governance principle for human oversight
 * (ai/governance/human-oversight.md, "Principles"). Each instantiates the constitution's
 * human-governance principle owned by ai/README.md.
 */
export type HumanOversightPrinciple =
  | 'accountability-never-disappears'
  | 'humans-hold-final-authority'
  | 'approval-precedes-significant-change'
  | 'override-is-always-available'
  | 'oversight-is-real-not-nominal';

/** The five human-oversight principles, in constitutional order; frozen. */
export const HUMAN_OVERSIGHT_PRINCIPLES: readonly HumanOversightPrinciple[] = Object.freeze([
  'accountability-never-disappears',
  'humans-hold-final-authority',
  'approval-precedes-significant-change',
  'override-is-always-available',
  'oversight-is-real-not-nominal',
]);

/** The statement each human-oversight principle instantiates (ai/governance/human-oversight.md). */
export const HUMAN_OVERSIGHT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<HumanOversightPrinciple, string>
> = Object.freeze({
  'accountability-never-disappears':
    'Every significant action traces to an accountable human, and no automation or scale removes that accountability.',
  'humans-hold-final-authority':
    'On any significant, normative, high-risk, or legally significant matter, human judgment is final, not agent judgment.',
  'approval-precedes-significant-change':
    'Significant and higher-authority changes require human approval before they take effect.',
  'override-is-always-available':
    'A human may halt, reverse, or override any AI action at any time, and no goal overrides that authority.',
  'oversight-is-real-not-nominal':
    "Human review is meaningful and informed, with enough of the action's basis to judge it, never a rubber stamp.",
});

/**
 * A human-oversight mandate: an absolute rule of the human role in governance
 * (ai/governance/human-oversight.md, "Mandates").
 */
export type HumanOversightMandate =
  | 'accountable-owner'
  | 'human-approval'
  | 'human-override'
  | 'informed-review'
  | 'legal-and-safety-accountability'
  | 'non-delegable-accountability';

/** The six human-oversight mandates, in constitutional order; frozen. Every mandate is absolute. */
export const HUMAN_OVERSIGHT_MANDATES: readonly HumanOversightMandate[] = Object.freeze([
  'accountable-owner',
  'human-approval',
  'human-override',
  'informed-review',
  'legal-and-safety-accountability',
  'non-delegable-accountability',
]);

/** The rule each human-oversight mandate states (ai/governance/human-oversight.md). */
export const HUMAN_OVERSIGHT_MANDATE_DESCRIPTIONS: Readonly<Record<HumanOversightMandate, string>> =
  Object.freeze({
    'accountable-owner':
      'Every significant action and every significant decision has an accountable human owner, as required by ai/governance/decision-making.md.',
    'human-approval':
      'Actions and changes that are normative, high-risk, legally significant, or that expand autonomy require human approval before they proceed, consistent with the Approval Matrix in ai/CONTRIBUTING.md and the risk and autonomy governance in this namespace.',
    'human-override':
      'A human may override or halt any AI action, and the AI complies; an escalation is always resolvable by a human, and escalation is never overridden.',
    'informed-review':
      'A human reviewing a significant action can determine its authority, owner, governing rule, and the knowledge it relied on, as required by ai/governance/decision-making.md and ai/governance/constitutional-validation.md.',
    'legal-and-safety-accountability':
      'Legally or safety-significant matters are decided or confirmed by an accountable human, as required by knowledge/company/legal.md, which this document consumes and never restates.',
    'non-delegable-accountability':
      'Accountability is never delegated to automation; automation may assist a human, but it never becomes the accountable party.',
  });
