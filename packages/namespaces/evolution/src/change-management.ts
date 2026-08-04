/**
 * Change management: the model of controlled architectural change, the categories a change falls into, and what
 * makes change controlled rather than uncontrolled (ai/evolution/change-management.md,
 * OL-AI-EVOLUTION-CHANGE-MANAGEMENT).
 *
 * The Specification enumerates a closed set of change categories by scope (additive, amending, superseding),
 * restated in the invariant "Every architectural change is classified into a defined category"; this module
 * models that set. The categories are unordered and carry no predicate; they may be extended additively by
 * governed change, the standard evolution-extensibility property, so the current set is closed at this version.
 * The rules and approval of change are owned by ai/governance/change-governance.md (applied not restated), the
 * amendment workflow by ai/CONTRIBUTING.md, and the escalation of an eroding change by
 * ai/governance/escalation.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A change-management principle: a permanent rule the change model upholds, each instantiating an evolution
 * invariant (ai/evolution/change-management.md, "Principles").
 */
export type ChangeManagementPrinciple =
  | 'change-is-controlled-never-uncontrolled'
  | 'change-applies-the-rules-it-does-not-define-them'
  | 'change-is-categorized'
  | 'change-preserves-the-constitution';

/** The change-management principles, in constitutional order; frozen. */
export const CHANGE_MANAGEMENT_PRINCIPLES: readonly ChangeManagementPrinciple[] = Object.freeze([
  'change-is-controlled-never-uncontrolled',
  'change-applies-the-rules-it-does-not-define-them',
  'change-is-categorized',
  'change-preserves-the-constitution',
]);

/** What each change-management principle requires (ai/evolution/change-management.md, "Principles"). */
export const CHANGE_MANAGEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ChangeManagementPrinciple, string>
> = Object.freeze({
  'change-is-controlled-never-uncontrolled':
    'Every architectural change is classified, governed, and stabilized; the architecture never changes by drift.',
  'change-applies-the-rules-it-does-not-define-them':
    'The rules and approval of change are owned by ai/governance/change-governance.md; this model applies them and never redefines them.',
  'change-is-categorized':
    'Every change falls into a defined category, so its scope and impact are explicit, never ad hoc.',
  'change-preserves-the-constitution':
    'A change extends the architecture and never erodes the constitution; a change that would erode it is not a permissible change.',
});

/**
 * A change category: the scope a change falls into, in constitutional listing order
 * (ai/evolution/change-management.md, "Specification"). The set is closed and unordered.
 */
export type ChangeCategory = 'additive' | 'amending' | 'superseding';

/** The change categories, in constitutional listing order; frozen. */
export const CHANGE_CATEGORIES: readonly ChangeCategory[] = Object.freeze([
  'additive',
  'amending',
  'superseding',
]);

/** What each change category is (ai/evolution/change-management.md, "Specification"). */
export const CHANGE_CATEGORY_DESCRIPTIONS: Readonly<Record<ChangeCategory, string>> = Object.freeze(
  {
    additive:
      'An additive change that adds a document or a namespace without altering existing ones.',
    amending:
      'An amending change that revises an existing document under the constitutional amendment process.',
    superseding: 'A superseding change that replaces a part through migration and deprecation.',
  },
);

/**
 * A change-management invariant: a guarantee the change model always upholds
 * (ai/evolution/change-management.md, "Invariants").
 */
export type ChangeManagementInvariant =
  | 'every-change-is-classified-into-a-defined-category-and-controlled'
  | 'change-applies-the-governance-change-rules-never-redefines-them'
  | 'a-change-preserves-the-constitution-eroding-change-refused-and-escalated'
  | 'a-change-is-applied-through-the-amendment-workflow-kept-compatible-and-stabilized'
  | 'modelling-change-is-inert';

/** The change-management invariants, in constitutional order; frozen. */
export const CHANGE_MANAGEMENT_INVARIANTS: readonly ChangeManagementInvariant[] = Object.freeze([
  'every-change-is-classified-into-a-defined-category-and-controlled',
  'change-applies-the-governance-change-rules-never-redefines-them',
  'a-change-preserves-the-constitution-eroding-change-refused-and-escalated',
  'a-change-is-applied-through-the-amendment-workflow-kept-compatible-and-stabilized',
  'modelling-change-is-inert',
]);

/** What each change-management invariant guarantees (ai/evolution/change-management.md, "Invariants"). */
export const CHANGE_MANAGEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ChangeManagementInvariant, string>
> = Object.freeze({
  'every-change-is-classified-into-a-defined-category-and-controlled':
    'Every architectural change is classified into a defined category and is controlled, never uncontrolled.',
  'change-applies-the-governance-change-rules-never-redefines-them':
    'Change applies the governance change rules and never redefines them.',
  'a-change-preserves-the-constitution-eroding-change-refused-and-escalated':
    'A change preserves the constitution, and a change that would erode it is refused and escalated.',
  'a-change-is-applied-through-the-amendment-workflow-kept-compatible-and-stabilized':
    'A change is applied through the amendment workflow and kept compatible and stabilized.',
  'modelling-change-is-inert':
    'Modelling change never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
