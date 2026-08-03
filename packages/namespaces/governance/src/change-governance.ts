/**
 * Change governance (ai/governance/change-governance.md, OL-AI-GOVERNANCE-CHANGE-GOVERNANCE).
 *
 * How AI behavior is allowed to evolve - the rules governing how the AI layer's behavior, policies,
 * and autonomy may change over time - as immutable rule definitions (ADR-0020): the change-governance
 * principles and mandates. This concern owns the governance of behavioral change only; it never defines
 * the document amendment workflow, versioning, or Approval Matrix (owned by ai/CONTRIBUTING.md), and it
 * never carries out a change (operational).
 *
 * It exposes no predicate, and it defines no classification. Every structured thing it touches is owned
 * elsewhere and is referenced, not recreated (referenced-model non-restatement rule; see the design doc
 * section 7a): the Approval Matrix belongs to ai/CONTRIBUTING.md, the autonomy levels to
 * ai/governance/autonomy-boundaries.md, and the governance invariants to ai/governance/README.md.
 * Whether a specific change is approved, reviewed, or traceable is a runtime evaluation over a
 * ChangeRequest, a ChangeApproval, and a ChangeWorkflow that governance does not own, so under the
 * boundary rule (ADR-0020, ADR-0025) it is deferred to the runtime, exactly as prior stages deferred
 * Authority, ValidationResult, the escalation evaluation, the policy-conflict evaluation, the
 * human-approval workflow, and the decision evaluation. Governance defines the constitutional truth
 * governing change; the runtime and the operational namespaces perform change execution.
 */

/**
 * A change-governance principle: an enduring governance principle for change
 * (ai/governance/change-governance.md, "Principles"). Each instantiates a constitutional principle
 * owned by ai/README.md.
 */
export type ChangeGovernancePrinciple =
  | 'governed-never-emergent'
  | 'approval-precedes-change'
  | 'autonomy-expands-deliberately'
  | 'preserves-the-invariants'
  | 'runtime-never-changes-governance';

/** The five change-governance principles, in constitutional order; frozen. */
export const CHANGE_GOVERNANCE_PRINCIPLES: readonly ChangeGovernancePrinciple[] = Object.freeze([
  'governed-never-emergent',
  'approval-precedes-change',
  'autonomy-expands-deliberately',
  'preserves-the-invariants',
  'runtime-never-changes-governance',
]);

/** The statement each change-governance principle instantiates (ai/governance/change-governance.md). */
export const CHANGE_GOVERNANCE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ChangeGovernancePrinciple, string>
> = Object.freeze({
  'governed-never-emergent':
    'AI behavior changes only through a governed, approved decision, never as an unreviewed side effect of running.',
  'approval-precedes-change':
    'A significant change to behavior, policy, or autonomy is approved by an accountable human before it takes effect.',
  'autonomy-expands-deliberately':
    'An increase in autonomy is a deliberate, reviewed decision, never a drift that accumulates without approval.',
  'preserves-the-invariants':
    'No change weakens a governance invariant, crosses a boundary, or removes human accountability.',
  'runtime-never-changes-governance':
    'Execution never amends a rule, changes ownership, or expands autonomy on its own.',
});

/**
 * A change-governance mandate: an absolute rule governing behavioral change
 * (ai/governance/change-governance.md, "Mandates").
 */
export type ChangeGovernanceMandate =
  | 'governed-approval'
  | 'governance-review'
  | 'controlled-autonomy-evolution'
  | 'no-runtime-self-modification'
  | 'invariants-preserved'
  | 'traceable-change';

/** The six change-governance mandates, in constitutional order; frozen. Every mandate is absolute. */
export const CHANGE_GOVERNANCE_MANDATES: readonly ChangeGovernanceMandate[] = Object.freeze([
  'governed-approval',
  'governance-review',
  'controlled-autonomy-evolution',
  'no-runtime-self-modification',
  'invariants-preserved',
  'traceable-change',
]);

/** The rule each change-governance mandate states (ai/governance/change-governance.md). */
export const CHANGE_GOVERNANCE_MANDATE_DESCRIPTIONS: Readonly<
  Record<ChangeGovernanceMandate, string>
> = Object.freeze({
  'governed-approval':
    'A significant change to AI behavior, to a policy, or to an autonomy level is approved by the authority required in the Approval Matrix owned by ai/CONTRIBUTING.md before it takes effect.',
  'governance-review':
    'A significant change is reviewed for consistency with the constitution, the governance mandates, and the invariants before it is approved, and a change that would weaken any of them is rejected.',
  'controlled-autonomy-evolution':
    "An increase in an agent's autonomy level or scope is a deliberate, human-approved change under this document and ai/governance/permission-governance.md, never self-initiated by an agent and never a byproduct of execution.",
  'no-runtime-self-modification':
    'No agent or runtime amends a governance rule, changes the ownership of a concern, grants itself authority, or raises its own autonomy; ownership never changes at runtime, and authority cannot be bypassed.',
  'invariants-preserved':
    'No change removes human accountability, allows execution to precede governance, or otherwise weakens a governance invariant owned by ai/governance/README.md.',
  'traceable-change':
    'A significant change is traceable to its approver, its reason, and the review that permitted it; this document requires traceability and defines no recording system.',
});
