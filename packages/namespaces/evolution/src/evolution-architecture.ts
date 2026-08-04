/**
 * Evolution architecture: the structural architecture of evolution, its identity and the parts it is composed
 * of (ai/evolution/evolution-architecture.md, OL-AI-EVOLUTION-EVOLUTION-ARCHITECTURE).
 *
 * Architectural evolution is a distinct, composed discipline that changes the architecture in a controlled way
 * while preserving the constitution. This module defines the closed set of parts the evolution model is
 * composed of, plus the structural principles and invariants. The parts are unordered and carry no predicate;
 * each part is owned by its named document (planning, lifecycle, change management, compatibility management,
 * migration, deprecation, repository growth), and the maturity map is owned by
 * ai/architecture/repository-evolution.md, referenced not restated (ADR-0020).
 */

/**
 * An evolution-architecture principle: a permanent rule the structural model upholds, each instantiating an
 * evolution invariant (ai/evolution/evolution-architecture.md, "Principles").
 */
export type EvolutionArchitecturePrinciple =
  | 'evolution-is-a-discipline-not-a-behavior'
  | 'evolution-has-a-distinct-identity'
  | 'evolution-is-composed-of-defined-parts'
  | 'the-evolution-structure-is-deterministic';

/** The evolution-architecture principles, in constitutional order; frozen. */
export const EVOLUTION_ARCHITECTURE_PRINCIPLES: readonly EvolutionArchitecturePrinciple[] =
  Object.freeze([
    'evolution-is-a-discipline-not-a-behavior',
    'evolution-has-a-distinct-identity',
    'evolution-is-composed-of-defined-parts',
    'the-evolution-structure-is-deterministic',
  ]);

/** What each evolution-architecture principle requires (ai/evolution/evolution-architecture.md, "Principles"). */
export const EVOLUTION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvolutionArchitecturePrinciple, string>
> = Object.freeze({
  'evolution-is-a-discipline-not-a-behavior':
    'Evolution is the architectural means by which the architecture changes in a controlled way; it never produces or performs the behavior of the layer.',
  'evolution-has-a-distinct-identity':
    'The evolution of the architecture is a defined, identifiable discipline, so it can be planned, governed, and reasoned about as one model.',
  'evolution-is-composed-of-defined-parts':
    'The evolution model is composed of planning, lifecycle, change, compatibility, migration, deprecation, and growth parts, each owned by its named document.',
  'the-evolution-structure-is-deterministic':
    'The same architectural change over the same current architecture resolves to the same evolution model, with no randomness.',
});

/**
 * An evolution part: one of the parts the evolution model is composed of, in constitutional listing order
 * (ai/evolution/evolution-architecture.md, "Specification"). The set is closed and unordered. Each part is
 * owned by its named document.
 */
export type EvolutionPart =
  'planning' | 'lifecycle' | 'change' | 'compatibility' | 'migration' | 'deprecation' | 'growth';

/** The parts the evolution model is composed of, in constitutional listing order; frozen. */
export const EVOLUTION_PARTS: readonly EvolutionPart[] = Object.freeze([
  'planning',
  'lifecycle',
  'change',
  'compatibility',
  'migration',
  'deprecation',
  'growth',
]);

/** What each evolution part is (ai/evolution/evolution-architecture.md, "Specification"). */
export const EVOLUTION_PART_DESCRIPTIONS: Readonly<Record<EvolutionPart, string>> = Object.freeze({
  planning:
    'The planning owned by ai/evolution/evolution-planning.md; this document owns that evolution is composed of it.',
  lifecycle:
    'The lifecycle owned by ai/evolution/evolution-lifecycle.md; this document owns that evolution is composed of it.',
  change:
    'The change management owned by ai/evolution/change-management.md; this document owns that evolution is composed of it.',
  compatibility:
    'The compatibility management owned by ai/evolution/compatibility-management.md; this document owns that evolution is composed of it.',
  migration:
    'The migration owned by ai/evolution/migration-model.md; this document owns that evolution is composed of it.',
  deprecation:
    'The deprecation owned by ai/evolution/deprecation-model.md; this document owns that evolution is composed of it.',
  growth:
    'The repository growth owned by ai/evolution/repository-growth.md; this document owns that evolution is composed of it.',
});

/**
 * An evolution-architecture invariant: a guarantee the structural model always upholds
 * (ai/evolution/evolution-architecture.md, "Invariants").
 */
export type EvolutionArchitectureInvariant =
  | 'a-distinct-identifiable-discipline-separate-from-operations-workflow-and-behavior'
  | 'composed-of-planning-lifecycle-change-compatibility-migration-deprecation-and-growth'
  | 'changes-the-architecture-without-eroding-the-constitution-or-owning-knowledge'
  | 'same-change-same-current-architecture-same-evolution-model'
  | 'defining-structure-is-inert';

/** The evolution-architecture invariants, in constitutional order; frozen. */
export const EVOLUTION_ARCHITECTURE_INVARIANTS: readonly EvolutionArchitectureInvariant[] =
  Object.freeze([
    'a-distinct-identifiable-discipline-separate-from-operations-workflow-and-behavior',
    'composed-of-planning-lifecycle-change-compatibility-migration-deprecation-and-growth',
    'changes-the-architecture-without-eroding-the-constitution-or-owning-knowledge',
    'same-change-same-current-architecture-same-evolution-model',
    'defining-structure-is-inert',
  ]);

/** What each evolution-architecture invariant guarantees (ai/evolution/evolution-architecture.md, "Invariants"). */
export const EVOLUTION_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvolutionArchitectureInvariant, string>
> = Object.freeze({
  'a-distinct-identifiable-discipline-separate-from-operations-workflow-and-behavior':
    'Architectural evolution is a distinct, identifiable discipline, separate from operations, the amendment workflow, and the behavior it changes.',
  'composed-of-planning-lifecycle-change-compatibility-migration-deprecation-and-growth':
    'The evolution model is composed of planning, lifecycle, change, compatibility, migration, deprecation, and growth parts, each owned by its named document.',
  'changes-the-architecture-without-eroding-the-constitution-or-owning-knowledge':
    'Evolution changes the architecture without eroding the constitution and without owning the knowledge repository it integrates with.',
  'same-change-same-current-architecture-same-evolution-model':
    'The same architectural change over the same current architecture resolves to the same evolution model, with no randomness.',
  'defining-structure-is-inert':
    'Defining the evolution structure never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
