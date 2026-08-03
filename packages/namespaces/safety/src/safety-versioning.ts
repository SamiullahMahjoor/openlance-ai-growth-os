/**
 * Safety versioning (ai/safety/safety-versioning.md, OL-AI-SAFETY-SAFETY-VERSIONING).
 *
 * How the safety model changes over time, stays compatible, and is migrated and, where it rises to the
 * constitution, amended, without a change ever lowering protection, as immutable definitions (ADR-0020).
 * This concern owns safety versioning only; it never defines the document amendment workflow (owned by
 * ai/CONTRIBUTING.md) nor the repository evolution map (owned by ai/architecture/repository-evolution.md).
 * Governed change is owned by ai/governance/change-governance.md, referenced and never restated.
 * Applying a concrete change is a runtime evaluation this concern does not own. This concern states how
 * safety is versioned and the invariants it always satisfies.
 */

/**
 * A safety-versioning principle (ai/safety/safety-versioning.md, "Principles"). Each instantiates a
 * safety invariant owned by ai/safety/README.md.
 */
export type SafetyVersioningPrinciple =
  | 'change-never-lowers-protection'
  | 'versioned'
  | 'change-is-governed'
  | 'compatibility-preserved-or-migrated';

/** The four safety-versioning principles, in constitutional order; frozen. */
export const SAFETY_VERSIONING_PRINCIPLES: readonly SafetyVersioningPrinciple[] = Object.freeze([
  'change-never-lowers-protection',
  'versioned',
  'change-is-governed',
  'compatibility-preserved-or-migrated',
]);

/** The statement each safety-versioning principle makes (ai/safety/safety-versioning.md). */
export const SAFETY_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<SafetyVersioningPrinciple, string>
> = Object.freeze({
  'change-never-lowers-protection':
    'Safety evolves only in ways that preserve or strengthen protection; a change that would weaken it is not made outside a sanctioned constitutional amendment.',
  versioned: 'Each safety definition carries a version, so a change is identified and traceable.',
  'change-is-governed':
    'The safety model evolves only under the change rules owned by ai/governance/, never arbitrarily.',
  'compatibility-preserved-or-migrated':
    'A compatible change preserves existing protection; an incompatible one is migrated deliberately, so no protection is silently broken.',
});

/**
 * A safety-versioning invariant (ai/safety/safety-versioning.md, "Invariants"): a guarantee that always
 * holds for safety versioning.
 */
export type SafetyVersioningInvariant =
  | 'change-never-lowers-protection-outside-amendment'
  | 'each-definition-versioned'
  | 'incompatible-versioned-and-migrated'
  | 'deprecated-protects-until-migrated'
  | 'versioning-is-inert';

/** The five safety-versioning invariants, in constitutional order; frozen. */
export const SAFETY_VERSIONING_INVARIANTS: readonly SafetyVersioningInvariant[] = Object.freeze([
  'change-never-lowers-protection-outside-amendment',
  'each-definition-versioned',
  'incompatible-versioned-and-migrated',
  'deprecated-protects-until-migrated',
  'versioning-is-inert',
]);

/** The guarantee each safety-versioning invariant states (ai/safety/safety-versioning.md). */
export const SAFETY_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<SafetyVersioningInvariant, string>
> = Object.freeze({
  'change-never-lowers-protection-outside-amendment':
    'A change to safety never lowers protection outside a sanctioned constitutional amendment.',
  'each-definition-versioned':
    'Each safety definition carries a version, so a change is explicit and traceable.',
  'incompatible-versioned-and-migrated':
    'An incompatible change is versioned and migrated, never applied silently.',
  'deprecated-protects-until-migrated':
    'A deprecated safety definition continues to protect until every dependent is migrated.',
  'versioning-is-inert':
    'Versioning safety never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
