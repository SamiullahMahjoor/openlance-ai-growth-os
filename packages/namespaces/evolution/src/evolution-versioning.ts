/**
 * Evolution versioning: how the architecture as a whole is versioned across generations, how compatibility is
 * kept across those generations, and how such versioning is governed as constitutional change
 * (ai/evolution/evolution-versioning.md, OL-AI-EVOLUTION-EVOLUTION-VERSIONING).
 *
 * The Specification narrates evolution versioning as heterogeneous facets: version evolution (the core model of
 * generations), compatibility across generations (which defers to ai/evolution/compatibility-management.md,
 * ai/evolution/migration-model.md, and ai/evolution/deprecation-model.md), constitutional evolution governance
 * (which defers to ai/governance/change-governance.md and ai/governance/human-oversight.md), and
 * behavior-preserving (a property). Unlike the clean parallel version-rules / evolution / migration /
 * deprecation aspect sets of ai/evaluation/ and ai/operations/ versioning, these are not a closed homogeneous
 * set the model refers to by identity - the inventory even names "constitutional evolution governance
 * consumption", a deferral rather than an owned aspect - so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * compatibility relationships a version preserves and the document-level version field and workflow are owned
 * elsewhere, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * An evolution-versioning principle: a permanent rule evolution versioning upholds, each instantiating an
 * evolution invariant (ai/evolution/evolution-versioning.md, "Principles").
 */
export type EvolutionVersioningPrinciple =
  | 'the-architecture-is-versioned-across-generations'
  | 'change-is-governed'
  | 'compatibility-spans-generations'
  | 'versioning-changes-the-architecture-not-behavior';

/** The evolution-versioning principles, in constitutional order; frozen. */
export const EVOLUTION_VERSIONING_PRINCIPLES: readonly EvolutionVersioningPrinciple[] =
  Object.freeze([
    'the-architecture-is-versioned-across-generations',
    'change-is-governed',
    'compatibility-spans-generations',
    'versioning-changes-the-architecture-not-behavior',
  ]);

/** What each evolution-versioning principle requires (ai/evolution/evolution-versioning.md, "Principles"). */
export const EVOLUTION_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvolutionVersioningPrinciple, string>
> = Object.freeze({
  'the-architecture-is-versioned-across-generations':
    "The architecture advances through defined generations, so a change of generation is identified and traceable, distinct from a single document's version.",
  'change-is-governed':
    'A change of generation evolves only under the change rules owned by ai/governance/change-governance.md, never arbitrarily.',
  'compatibility-spans-generations':
    'A new generation preserves compatibility with the prior one, or migrates and deprecates the superseded part, so a dependent on an earlier generation is never silently broken.',
  'versioning-changes-the-architecture-not-behavior':
    'Versioning advances the architecture and never changes the behavior of a namespace or the business truth of the knowledge repository.',
});

/**
 * An evolution-versioning invariant: a guarantee evolution versioning always upholds
 * (ai/evolution/evolution-versioning.md, "Invariants").
 */
export type EvolutionVersioningInvariant =
  | 'the-architecture-advances-through-defined-identified-generations'
  | 'a-change-of-generation-evolves-only-under-governed-change-rules-and-human-governance'
  | 'a-new-generation-preserves-compatibility-or-migrates-and-deprecates-never-silent'
  | 'versioning-never-changes-namespace-behavior-or-knowledge-business-truth'
  | 'versioning-the-architecture-is-inert';

/** The evolution-versioning invariants, in constitutional order; frozen. */
export const EVOLUTION_VERSIONING_INVARIANTS: readonly EvolutionVersioningInvariant[] =
  Object.freeze([
    'the-architecture-advances-through-defined-identified-generations',
    'a-change-of-generation-evolves-only-under-governed-change-rules-and-human-governance',
    'a-new-generation-preserves-compatibility-or-migrates-and-deprecates-never-silent',
    'versioning-never-changes-namespace-behavior-or-knowledge-business-truth',
    'versioning-the-architecture-is-inert',
  ]);

/** What each evolution-versioning invariant guarantees (ai/evolution/evolution-versioning.md, "Invariants"). */
export const EVOLUTION_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvolutionVersioningInvariant, string>
> = Object.freeze({
  'the-architecture-advances-through-defined-identified-generations':
    "The architecture advances through defined, identified generations, distinct from a single document's version.",
  'a-change-of-generation-evolves-only-under-governed-change-rules-and-human-governance':
    'A change of generation evolves only under the governed change rules and human governance.',
  'a-new-generation-preserves-compatibility-or-migrates-and-deprecates-never-silent':
    'A new generation preserves compatibility with the prior one, or migrates and deprecates the superseded part, never breaking a dependent silently.',
  'versioning-never-changes-namespace-behavior-or-knowledge-business-truth':
    'Versioning the architecture never changes the behavior of a namespace or the business truth of the knowledge repository.',
  'versioning-the-architecture-is-inert':
    'Versioning the architecture never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
