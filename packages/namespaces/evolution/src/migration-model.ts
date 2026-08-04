/**
 * Migration model: how the architecture is migrated from a superseded structure to a replacement, expressed as
 * the migration architecture, the phases a migration passes through, and the safety that keeps a migration from
 * breaking the architecture (ai/evolution/migration-model.md, OL-AI-EVOLUTION-MIGRATION-MODEL).
 *
 * The Specification narrates the migration model as heterogeneous facets (migration architecture, migration
 * phases, migration safety, deliberate and halting). Per the modeling rule recorded in
 * docs/implementation/13-retrieval.md section 4, none is modeled as a classification: the migration phases are
 * narrated in a single sentence (introduce the replacement, move dependents, deprecate the superseded part,
 * retire it), two of which defer to ai/evolution/deprecation-model.md and the lifecycle's retirement, and the
 * invariants restate them only generically ("defined phases"), not as a closed set referred to by identity. So
 * this concern is definitions only. The compatibility a migration preserves is owned by
 * ai/evolution/compatibility-management.md, the deprecation of the superseded part by
 * ai/evolution/deprecation-model.md, and the escalation of an unsafe migration by ai/governance/escalation.md,
 * referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A migration-model principle: a permanent rule the migration model upholds, each instantiating an evolution
 * invariant (ai/evolution/migration-model.md, "Principles").
 */
export type MigrationModelPrinciple =
  | 'migration-moves-it-does-not-break'
  | 'migration-is-phased'
  | 'migration-is-safe-by-construction'
  | 'migration-is-deliberate-and-reversible-until-committed';

/** The migration-model principles, in constitutional order; frozen. */
export const MIGRATION_MODEL_PRINCIPLES: readonly MigrationModelPrinciple[] = Object.freeze([
  'migration-moves-it-does-not-break',
  'migration-is-phased',
  'migration-is-safe-by-construction',
  'migration-is-deliberate-and-reversible-until-committed',
]);

/** What each migration-model principle requires (ai/evolution/migration-model.md, "Principles"). */
export const MIGRATION_MODEL_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MigrationModelPrinciple, string>
> = Object.freeze({
  'migration-moves-it-does-not-break':
    'A migration moves the architecture from a superseded part to a replacement without breaking what depends on it.',
  'migration-is-phased':
    'A migration proceeds through defined phases, so it is never an abrupt, all-at-once switch that could leave the architecture inconsistent.',
  'migration-is-safe-by-construction':
    'At every phase, the architecture remains consistent and its dependents keep working, so a migration never opens a window in which something is broken.',
  'migration-is-deliberate-and-reversible-until-committed':
    'A migration is planned and, until it is committed, can be halted without harm, so an unsafe migration is never forced.',
});

/**
 * A migration-model invariant: a guarantee the migration model always upholds (ai/evolution/migration-model.md,
 * "Invariants").
 */
export type MigrationModelInvariant =
  | 'moves-to-a-replacement-without-breaking-what-depends-on-it'
  | 'proceeds-through-defined-phases-never-abrupt'
  | 'at-every-phase-stays-consistent-superseded-works-until-dependents-moved'
  | 'a-migration-that-cannot-preserve-safety-does-not-proceed-and-is-escalated'
  | 'migrating-the-architecture-is-inert';

/** The migration-model invariants, in constitutional order; frozen. */
export const MIGRATION_MODEL_INVARIANTS: readonly MigrationModelInvariant[] = Object.freeze([
  'moves-to-a-replacement-without-breaking-what-depends-on-it',
  'proceeds-through-defined-phases-never-abrupt',
  'at-every-phase-stays-consistent-superseded-works-until-dependents-moved',
  'a-migration-that-cannot-preserve-safety-does-not-proceed-and-is-escalated',
  'migrating-the-architecture-is-inert',
]);

/** What each migration-model invariant guarantees (ai/evolution/migration-model.md, "Invariants"). */
export const MIGRATION_MODEL_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MigrationModelInvariant, string>
> = Object.freeze({
  'moves-to-a-replacement-without-breaking-what-depends-on-it':
    'A migration moves the architecture to a replacement without breaking what depends on it.',
  'proceeds-through-defined-phases-never-abrupt':
    'A migration proceeds through defined phases and never as an abrupt, all-at-once switch.',
  'at-every-phase-stays-consistent-superseded-works-until-dependents-moved':
    'At every phase the architecture stays consistent, and the superseded part works until its dependents are moved.',
  'a-migration-that-cannot-preserve-safety-does-not-proceed-and-is-escalated':
    'A migration that cannot preserve safety does not proceed and is escalated.',
  'migrating-the-architecture-is-inert':
    'Migrating the architecture never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
