/**
 * Evolution lifecycle: the phases an architectural change passes through, from being proposed to being retired
 * (ai/evolution/evolution-lifecycle.md, OL-AI-EVOLUTION-EVOLUTION-LIFECYCLE).
 *
 * An architectural change passes through a fixed order of phases; each phase precedes the next, and a change
 * never enters the architecture before Approval or is removed before Retirement. This module defines the
 * ordered phases, their principles, and their invariants, plus the pure ordering predicate the document's
 * ordering states. The amendment of each document within a change is owned by ai/CONTRIBUTING.md, and the
 * change model that classifies a change by ai/evolution/change-management.md, referenced not restated
 * (ADR-0020).
 */

/**
 * An evolution-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating an evolution
 * invariant (ai/evolution/evolution-lifecycle.md, "Principles").
 */
export type EvolutionLifecyclePrinciple =
  | 'a-change-has-a-defined-beginning-and-end'
  | 'review-and-approval-precede-introduction'
  | 'introduction-is-additive-and-stabilized'
  | 'retirement-is-orderly';

/** The evolution-lifecycle principles, in constitutional order; frozen. */
export const EVOLUTION_LIFECYCLE_PRINCIPLES: readonly EvolutionLifecyclePrinciple[] = Object.freeze(
  [
    'a-change-has-a-defined-beginning-and-end',
    'review-and-approval-precede-introduction',
    'introduction-is-additive-and-stabilized',
    'retirement-is-orderly',
  ],
);

/** What each evolution-lifecycle principle requires (ai/evolution/evolution-lifecycle.md, "Principles"). */
export const EVOLUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvolutionLifecyclePrinciple, string>
> = Object.freeze({
  'a-change-has-a-defined-beginning-and-end':
    'An architectural change begins with a proposal and ends when it is stabilized or retired; it never proceeds unbounded.',
  'review-and-approval-precede-introduction':
    'A change is reviewed and approved before it is introduced into the architecture, so nothing enters ungoverned.',
  'introduction-is-additive-and-stabilized':
    'A change is introduced additively and stabilized before it is relied on, so the architecture is never left in a half-changed state.',
  'retirement-is-orderly':
    'A superseded part is retired in an orderly way, deprecated and migrated first, so nothing is removed while it is still depended on.',
});

/**
 * An evolution-lifecycle phase, in constitutional order from earliest to latest
 * (ai/evolution/evolution-lifecycle.md, "Specification"). The order is the document's ("each phase precedes the
 * next"); it is total and is exposed by {@link evolutionPhaseAtOrAfter}. A change ends at Stabilization or, for
 * a superseded part, at Retirement.
 */
export type EvolutionLifecyclePhase =
  'proposal' | 'review' | 'approval' | 'introduction' | 'stabilization' | 'retirement';

/** The evolution-lifecycle phases, earliest to latest; frozen. */
export const EVOLUTION_LIFECYCLE_PHASES: readonly EvolutionLifecyclePhase[] = Object.freeze([
  'proposal',
  'review',
  'approval',
  'introduction',
  'stabilization',
  'retirement',
]);

/** What each evolution-lifecycle phase is (ai/evolution/evolution-lifecycle.md, "Specification"). */
export const EVOLUTION_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<EvolutionLifecyclePhase, string>
> = Object.freeze({
  proposal:
    'An architectural change is proposed, framed on the current architecture recorded in ai/architecture/repository-evolution.md and the roadmap owned by ai/evolution/evolution-planning.md; a proposal states the intended change and changes nothing yet.',
  review:
    'The proposal is reviewed against the constitution, the governance change rules owned by ai/governance/change-governance.md, and the compatibility owned by ai/evolution/compatibility-management.md, so that its impact is understood before it proceeds.',
  approval:
    'The change is approved under the governance change rules and the human governance owned by ai/governance/human-oversight.md; an unapproved change does not proceed.',
  introduction:
    'The approved change is introduced into the architecture additively, through the amendment workflow owned by ai/CONTRIBUTING.md, and where it supersedes a part, through migration owned by ai/evolution/migration-model.md; introduction extends the architecture and never erodes the constitution.',
  stabilization:
    'The introduced change is stabilized: it is confirmed consistent with the architecture, its compatibility preserved, and the maturity map updated under ai/architecture/repository-evolution.md; a change is relied on only once stabilized.',
  retirement:
    'A superseded part is retired, after it is deprecated under ai/evolution/deprecation-model.md and its dependents migrated, so nothing is removed while still depended on.',
});

/**
 * An evolution-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/evolution/evolution-lifecycle.md, "Invariants").
 */
export type EvolutionLifecycleInvariant =
  | 'begins-at-proposal-ends-at-stabilization-or-retirement'
  | 'review-and-approval-precede-introduction-nothing-enters-ungoverned'
  | 'introduced-additively-and-stabilized-before-relied-on'
  | 'a-part-is-retired-only-after-deprecated-and-dependents-migrated'
  | 'a-phase-transition-is-inert';

/** The evolution-lifecycle invariants, in constitutional order; frozen. */
export const EVOLUTION_LIFECYCLE_INVARIANTS: readonly EvolutionLifecycleInvariant[] = Object.freeze(
  [
    'begins-at-proposal-ends-at-stabilization-or-retirement',
    'review-and-approval-precede-introduction-nothing-enters-ungoverned',
    'introduced-additively-and-stabilized-before-relied-on',
    'a-part-is-retired-only-after-deprecated-and-dependents-migrated',
    'a-phase-transition-is-inert',
  ],
);

/** What each evolution-lifecycle invariant guarantees (ai/evolution/evolution-lifecycle.md, "Invariants"). */
export const EVOLUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvolutionLifecycleInvariant, string>
> = Object.freeze({
  'begins-at-proposal-ends-at-stabilization-or-retirement':
    'An architectural change begins at Proposal and ends at Stabilization or Retirement.',
  'review-and-approval-precede-introduction-nothing-enters-ungoverned':
    'Review and Approval precede Introduction, and no change enters the architecture ungoverned.',
  'introduced-additively-and-stabilized-before-relied-on':
    'A change is introduced additively and stabilized before it is relied on.',
  'a-part-is-retired-only-after-deprecated-and-dependents-migrated':
    'A part is retired only after it is deprecated and its dependents migrated.',
  'a-phase-transition-is-inert':
    'A phase transition never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const EVOLUTION_LIFECYCLE_PHASE_RANK: Readonly<Record<EvolutionLifecyclePhase, number>> =
  Object.freeze({
    proposal: 0,
    review: 1,
    approval: 2,
    introduction: 3,
    stabilization: 4,
    retirement: 5,
  });

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order, from
 * proposal first to retirement last (ai/evolution/evolution-lifecycle.md, "Specification"). Pure and total: it
 * reads only the fixed order the document declares ("each phase precedes the next") and expresses that order
 * verbatim. It states no policy of its own.
 */
export function evolutionPhaseAtOrAfter(
  a: EvolutionLifecyclePhase,
  b: EvolutionLifecyclePhase,
): boolean {
  return EVOLUTION_LIFECYCLE_PHASE_RANK[a] >= EVOLUTION_LIFECYCLE_PHASE_RANK[b];
}
