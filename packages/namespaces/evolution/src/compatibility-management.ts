/**
 * Compatibility management: how compatibility is preserved as the architecture evolves, expressed as the
 * compatibility relationships between parts of the architecture, the guarantees compatibility provides, and how
 * those guarantees are preserved across change (ai/evolution/compatibility-management.md,
 * OL-AI-EVOLUTION-COMPATIBILITY-MANAGEMENT).
 *
 * The Specification narrates the compatibility model as heterogeneous facets (compatibility relationships,
 * compatibility guarantees, compatibility preservation, no silent break). It enumerates no closed homogeneous
 * set the model refers to by identity, so this concern is definitions only (principles and invariants),
 * consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The migration of
 * an incompatible change is owned by ai/evolution/migration-model.md, the deprecation of a superseded part by
 * ai/evolution/deprecation-model.md, the dependency direction by ai/architecture/dependency-map.md, and a
 * namespace's own internal compatibility by that namespace, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A compatibility-management principle: a permanent rule the compatibility model upholds, each instantiating an
 * evolution invariant (ai/evolution/compatibility-management.md, "Principles").
 */
export type CompatibilityManagementPrinciple =
  | 'compatibility-is-a-defined-relationship'
  | 'compatibility-is-preserved-by-default'
  | 'a-guarantee-is-honored-across-change'
  | 'compatibility-spans-the-architecture';

/** The compatibility-management principles, in constitutional order; frozen. */
export const COMPATIBILITY_MANAGEMENT_PRINCIPLES: readonly CompatibilityManagementPrinciple[] =
  Object.freeze([
    'compatibility-is-a-defined-relationship',
    'compatibility-is-preserved-by-default',
    'a-guarantee-is-honored-across-change',
    'compatibility-spans-the-architecture',
  ]);

/** What each compatibility-management principle requires (ai/evolution/compatibility-management.md, "Principles"). */
export const COMPATIBILITY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<CompatibilityManagementPrinciple, string>
> = Object.freeze({
  'compatibility-is-a-defined-relationship':
    'Compatibility between parts of the architecture is a defined relation, so whether a change preserves it is determined, never assumed.',
  'compatibility-is-preserved-by-default':
    'A change preserves compatibility unless it is deliberately an incompatible, superseding change, which is migrated and deprecated.',
  'a-guarantee-is-honored-across-change':
    'A compatibility guarantee, once made, is honored until it is deliberately retired through migration and deprecation, so nothing that depends on it breaks silently.',
  'compatibility-spans-the-architecture':
    "Compatibility management governs compatibility between namespaces and across generations of the architecture, above any single namespace's own internal compatibility.",
});

/**
 * A compatibility-management invariant: a guarantee the compatibility model always upholds
 * (ai/evolution/compatibility-management.md, "Invariants").
 */
export type CompatibilityManagementInvariant =
  | 'compatibility-between-parts-is-a-defined-relationship-never-assumed'
  | 'a-change-preserves-compatibility-or-is-migrated-and-deprecated-never-silent'
  | 'a-guarantee-is-honored-until-deliberately-retired'
  | 'governs-compatibility-across-the-architecture-above-internal-compatibility'
  | 'managing-compatibility-is-inert';

/** The compatibility-management invariants, in constitutional order; frozen. */
export const COMPATIBILITY_MANAGEMENT_INVARIANTS: readonly CompatibilityManagementInvariant[] =
  Object.freeze([
    'compatibility-between-parts-is-a-defined-relationship-never-assumed',
    'a-change-preserves-compatibility-or-is-migrated-and-deprecated-never-silent',
    'a-guarantee-is-honored-until-deliberately-retired',
    'governs-compatibility-across-the-architecture-above-internal-compatibility',
    'managing-compatibility-is-inert',
  ]);

/** What each compatibility-management invariant guarantees (ai/evolution/compatibility-management.md, "Invariants"). */
export const COMPATIBILITY_MANAGEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<CompatibilityManagementInvariant, string>
> = Object.freeze({
  'compatibility-between-parts-is-a-defined-relationship-never-assumed':
    'Compatibility between parts of the architecture is a defined relationship, never assumed.',
  'a-change-preserves-compatibility-or-is-migrated-and-deprecated-never-silent':
    'A change preserves compatibility, or is an incompatible change that is migrated and deprecated, never introduced silently.',
  'a-guarantee-is-honored-until-deliberately-retired':
    'A compatibility guarantee is honored until deliberately retired through migration and deprecation.',
  'governs-compatibility-across-the-architecture-above-internal-compatibility':
    "Compatibility management governs compatibility across the architecture, above any single namespace's internal compatibility.",
  'managing-compatibility-is-inert':
    'Managing compatibility never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
