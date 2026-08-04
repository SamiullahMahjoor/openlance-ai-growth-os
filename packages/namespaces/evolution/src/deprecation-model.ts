/**
 * Deprecation model: how a superseded part of the architecture is deprecated and retired, expressed as the
 * deprecation lifecycle, the model by which a replacement supersedes it, and the rules under which it is finally
 * retired (ai/evolution/deprecation-model.md, OL-AI-EVOLUTION-DEPRECATION-MODEL).
 *
 * The Specification enumerates a closed, ordered set of deprecation states through which a part passes, "from
 * active to deprecated to retired", and states "This document owns the deprecation states and their order". This
 * module defines those ordered states, the principles, the invariants, and the pure ordering predicate the
 * document's ordering states. The replacement model and retirement rules are narrated facets of the same
 * concern, definitions only. The migration to a replacement is owned by ai/evolution/migration-model.md, the
 * retirement phase of the evolution lifecycle by ai/evolution/evolution-lifecycle.md, and the recording of a
 * deprecation in the maturity map by ai/architecture/repository-evolution.md, referenced not restated (ADR-0020,
 * ADR-0025).
 */

/**
 * A deprecation-model principle: a permanent rule the deprecation model upholds, each instantiating an
 * evolution invariant (ai/evolution/deprecation-model.md, "Principles").
 */
export type DeprecationModelPrinciple =
  | 'deprecation-precedes-retirement'
  | 'deprecation-is-announced-not-silent'
  | 'a-replacement-is-defined-before-deprecation'
  | 'retirement-follows-defined-rules';

/** The deprecation-model principles, in constitutional order; frozen. */
export const DEPRECATION_MODEL_PRINCIPLES: readonly DeprecationModelPrinciple[] = Object.freeze([
  'deprecation-precedes-retirement',
  'deprecation-is-announced-not-silent',
  'a-replacement-is-defined-before-deprecation',
  'retirement-follows-defined-rules',
]);

/** What each deprecation-model principle requires (ai/evolution/deprecation-model.md, "Principles"). */
export const DEPRECATION_MODEL_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<DeprecationModelPrinciple, string>
> = Object.freeze({
  'deprecation-precedes-retirement':
    'A part is deprecated, and its dependents migrated, before it is retired; nothing is removed while still depended on.',
  'deprecation-is-announced-not-silent':
    'A deprecation is explicit and recorded, so dependents know a part is being wound down and can migrate.',
  'a-replacement-is-defined-before-deprecation':
    'A part is deprecated in favor of a defined replacement, so there is always a path forward, not a gap.',
  'retirement-follows-defined-rules':
    'A part is retired only when its retirement rules are met, so retirement is deliberate and never premature.',
});

/**
 * A deprecation state: one of the states a part passes through as it is wound down, in constitutional order
 * from active to retired (ai/evolution/deprecation-model.md, "Specification"). The order is the document's ("A
 * part passes from active to deprecated to retired ... This document owns the deprecation states and their
 * order"); it is total and is exposed by {@link deprecationStateAtOrAfter}.
 */
export type DeprecationState = 'active' | 'deprecated' | 'retired';

/** The deprecation states, in constitutional order from active to retired; frozen. */
export const DEPRECATION_STATES: readonly DeprecationState[] = Object.freeze([
  'active',
  'deprecated',
  'retired',
]);

/** What each deprecation state is (ai/evolution/deprecation-model.md, "Specification"). */
export const DEPRECATION_STATE_DESCRIPTIONS: Readonly<Record<DeprecationState, string>> =
  Object.freeze({
    active:
      'The first of the deprecation states, which pass from active to deprecated to retired: a part is active before it is superseded, and is marked deprecated once a replacement exists.',
    deprecated:
      'A part is marked deprecated once a replacement exists; it remains available and compatible while its dependents migrate under ai/evolution/migration-model.md, before it is retired.',
    retired:
      'The last of the deprecation states, which pass from active to deprecated to retired: a part is retired only when no dependent remains.',
  });

/**
 * A deprecation-model invariant: a guarantee the deprecation model always upholds
 * (ai/evolution/deprecation-model.md, "Invariants").
 */
export type DeprecationModelInvariant =
  | 'a-part-is-deprecated-and-dependents-migrated-before-it-is-retired'
  | 'a-deprecation-is-explicit-and-recorded-never-silent'
  | 'a-part-is-deprecated-only-in-favor-of-a-defined-replacement'
  | 'a-part-is-retired-only-when-a-replacement-exists-and-no-dependent-remains'
  | 'deprecating-a-part-is-inert';

/** The deprecation-model invariants, in constitutional order; frozen. */
export const DEPRECATION_MODEL_INVARIANTS: readonly DeprecationModelInvariant[] = Object.freeze([
  'a-part-is-deprecated-and-dependents-migrated-before-it-is-retired',
  'a-deprecation-is-explicit-and-recorded-never-silent',
  'a-part-is-deprecated-only-in-favor-of-a-defined-replacement',
  'a-part-is-retired-only-when-a-replacement-exists-and-no-dependent-remains',
  'deprecating-a-part-is-inert',
]);

/** What each deprecation-model invariant guarantees (ai/evolution/deprecation-model.md, "Invariants"). */
export const DEPRECATION_MODEL_INVARIANT_DESCRIPTIONS: Readonly<
  Record<DeprecationModelInvariant, string>
> = Object.freeze({
  'a-part-is-deprecated-and-dependents-migrated-before-it-is-retired':
    'A part is deprecated, and its dependents migrated, before it is retired.',
  'a-deprecation-is-explicit-and-recorded-never-silent':
    'A deprecation is explicit and recorded, never silent.',
  'a-part-is-deprecated-only-in-favor-of-a-defined-replacement':
    'A part is deprecated only in favor of a defined replacement, so there is always a path forward.',
  'a-part-is-retired-only-when-a-replacement-exists-and-no-dependent-remains':
    'A part is retired only when a replacement exists and no dependent remains.',
  'deprecating-a-part-is-inert':
    'Deprecating a part never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});

/**
 * The private rank of each deprecation state in the constitutional order (active = 0). Internal to the ordering
 * predicate; never exported.
 */
const DEPRECATION_STATE_RANK: Readonly<Record<DeprecationState, number>> = Object.freeze({
  active: 0,
  deprecated: 1,
  retired: 2,
});

/**
 * Whether deprecation state `a` is at or after deprecation state `b` in the constitutional order, from active
 * first to retired last (ai/evolution/deprecation-model.md, "Specification", "A part passes from active to
 * deprecated to retired"). Pure and total: it reads only the fixed order the document declares and owns, and
 * expresses that order verbatim. It states no policy of its own.
 */
export function deprecationStateAtOrAfter(a: DeprecationState, b: DeprecationState): boolean {
  return DEPRECATION_STATE_RANK[a] >= DEPRECATION_STATE_RANK[b];
}
