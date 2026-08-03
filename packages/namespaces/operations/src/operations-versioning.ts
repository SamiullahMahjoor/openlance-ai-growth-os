/**
 * Operations versioning: how an operational definition is versioned, evolves, migrates, and is deprecated
 * (ai/operations/operations-versioning.md, OL-AI-OPERATIONS-OPERATIONS-VERSIONING).
 *
 * The Specification enumerates a closed set of the four aspects of operations versioning as it lists them:
 * version rules, operational evolution, migration, and compatibility-and-deprecation (the fourth bullet,
 * "Compatibility and deprecation", is one aspect in the document, modeled verbatim as enumerated rather than
 * split). This module owns operations versioning; the maintenance that applies a change is owned by
 * ai/operations/maintenance.md, the permission to change by ai/governance/change-governance.md (applied not
 * restated), the amendment workflow by ai/CONTRIBUTING.md, and the runtime behavior a runtime-artifact version
 * runs by ai/runtime/. The aspects carry no ordering and no predicate; this module is their immutable
 * definition (ADR-0020, ADR-0025).
 */

/**
 * An operations-versioning principle: a permanent rule operations versioning upholds, each instantiating an
 * operational invariant (ai/operations/operations-versioning.md, "Principles").
 */
export type OperationsVersioningPrinciple =
  | 'an-operational-definition-is-versioned'
  | 'change-is-governed'
  | 'compatibility-is-preserved-or-migrated'
  | 'versioning-changes-operation-not-behavior';

/** The operations-versioning principles, in constitutional order; frozen. */
export const OPERATIONS_VERSIONING_PRINCIPLES: readonly OperationsVersioningPrinciple[] =
  Object.freeze([
    'an-operational-definition-is-versioned',
    'change-is-governed',
    'compatibility-is-preserved-or-migrated',
    'versioning-changes-operation-not-behavior',
  ]);

/** What each operations-versioning principle requires (ai/operations/operations-versioning.md, "Principles"). */
export const OPERATIONS_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<OperationsVersioningPrinciple, string>
> = Object.freeze({
  'an-operational-definition-is-versioned':
    'An operational definition and a runtime-artifact version the layer runs carry a version, so a change is identified and traceable.',
  'change-is-governed':
    'An operational definition evolves only under the change rules owned by ai/governance/, never arbitrarily.',
  'compatibility-is-preserved-or-migrated':
    'A change that keeps operating consistent is absorbed; a change that breaks it is versioned and migrated, so operation is never silently disrupted.',
  'versioning-changes-operation-not-behavior':
    'Versioning changes how the layer is operated and never changes the behavior of any namespace.',
});

/**
 * An operations-versioning aspect: one of the aspects of how an operational definition is versioned and
 * evolves, in constitutional listing order (ai/operations/operations-versioning.md, "Specification"). The set
 * is unordered.
 */
export type OperationsVersioningAspect =
  'version-rules' | 'evolution' | 'migration' | 'compatibility-and-deprecation';

/** The four aspects of operations versioning, in constitutional listing order; frozen. */
export const OPERATIONS_VERSIONING_ASPECTS: readonly OperationsVersioningAspect[] = Object.freeze([
  'version-rules',
  'evolution',
  'migration',
  'compatibility-and-deprecation',
]);

/** What each operations-versioning aspect is (ai/operations/operations-versioning.md, "Specification"). */
export const OPERATIONS_VERSIONING_ASPECT_DESCRIPTIONS: Readonly<
  Record<OperationsVersioningAspect, string>
> = Object.freeze({
  'version-rules':
    'An operational definition, a signal under ai/operations/observability.md, a health model under ai/operations/health-management.md, an incident classification under ai/operations/incident-management.md, and a runtime-artifact version the layer runs carry a version that identifies it, so a change is explicit and traceable.',
  evolution:
    'An operational definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the operational model grows without redesign; evolution changes how the layer is operated and never changes the behavior of a namespace or rewrites business truth.',
  migration:
    'A change that breaks operating consistency is issued as a new version and migrated deliberately, applied through maintenance under ai/operations/maintenance.md, so there is never a window in which the layer is operated inconsistently.',
  'compatibility-and-deprecation':
    'A change is compatible when the operation stays consistent under it; an incompatible change is versioned and migrated, and a superseded operational definition or runtime-artifact version is deprecated rather than abruptly removed, remaining available until each dependent is migrated, so deprecation never disrupts operation silently.',
});

/**
 * An operations-versioning invariant: a guarantee operations versioning always upholds
 * (ai/operations/operations-versioning.md, "Invariants").
 */
export type OperationsVersioningInvariant =
  | 'an-operational-definition-and-runtime-artifact-version-carry-a-version'
  | 'evolves-only-under-the-governed-change-rules'
  | 'a-change-that-breaks-operating-consistency-is-versioned-and-migrated-never-silent'
  | 'versioning-changes-how-the-layer-is-operated-never-the-behavior-of-a-namespace'
  | 'versioning-an-operational-definition-is-inert';

/** The operations-versioning invariants, in constitutional order; frozen. */
export const OPERATIONS_VERSIONING_INVARIANTS: readonly OperationsVersioningInvariant[] =
  Object.freeze([
    'an-operational-definition-and-runtime-artifact-version-carry-a-version',
    'evolves-only-under-the-governed-change-rules',
    'a-change-that-breaks-operating-consistency-is-versioned-and-migrated-never-silent',
    'versioning-changes-how-the-layer-is-operated-never-the-behavior-of-a-namespace',
    'versioning-an-operational-definition-is-inert',
  ]);

/** What each operations-versioning invariant guarantees (ai/operations/operations-versioning.md, "Invariants"). */
export const OPERATIONS_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<OperationsVersioningInvariant, string>
> = Object.freeze({
  'an-operational-definition-and-runtime-artifact-version-carry-a-version':
    'An operational definition and a runtime-artifact version carry a version, so a change is explicit and traceable.',
  'evolves-only-under-the-governed-change-rules':
    'An operational definition evolves only under the governed change rules.',
  'a-change-that-breaks-operating-consistency-is-versioned-and-migrated-never-silent':
    'A change that breaks operating consistency is versioned and migrated, never applied silently.',
  'versioning-changes-how-the-layer-is-operated-never-the-behavior-of-a-namespace':
    'Versioning changes how the layer is operated and never changes the behavior of a namespace.',
  'versioning-an-operational-definition-is-inert':
    'Versioning an operational definition never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});
