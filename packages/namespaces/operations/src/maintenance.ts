/**
 * Maintenance: how a maintenance activity is modelled, the categories maintenance falls into, and the lifecycle
 * of a single maintenance activity (ai/operations/maintenance.md, OL-AI-OPERATIONS-MAINTENANCE).
 *
 * The Specification enumerates a closed set of maintenance categories by intent (corrective, preventive,
 * adaptive), restated in the invariant "Every maintenance activity falls into a defined category by its
 * intent"; this module models that set. The other facets are definitions only: the maintenance model is a
 * narrated definition, and the maintenance-activity lifecycle (planned, validated, carried out, completed, then
 * recorded) is narrated in a single sentence and restated in the invariants only by its bounds ("from plan to
 * completion"), not as a closed set referred to by identity, so it is not modeled as a classification (the
 * modeling rule recorded in docs/implementation/13-retrieval.md section 4). The categories are unordered and
 * carry no predicate; they may be extended additively by governed change, the standard operational-extensibility
 * property, so the current set is closed at this version. The maintenance phase of the layer's operation is
 * owned by ai/operations/operations-lifecycle.md, and the versioning a maintenance applies by
 * ai/operations/operations-versioning.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A maintenance principle: a permanent rule the maintenance model upholds, each instantiating an operational
 * invariant (ai/operations/maintenance.md, "Principles").
 */
export type MaintenancePrinciple =
  | 'maintenance-upkeeps-operation-it-never-changes-behavior'
  | 'maintenance-is-categorized'
  | 'maintenance-is-governed-and-validated'
  | 'maintenance-follows-a-defined-lifecycle';

/** The maintenance principles, in constitutional order; frozen. */
export const MAINTENANCE_PRINCIPLES: readonly MaintenancePrinciple[] = Object.freeze([
  'maintenance-upkeeps-operation-it-never-changes-behavior',
  'maintenance-is-categorized',
  'maintenance-is-governed-and-validated',
  'maintenance-follows-a-defined-lifecycle',
]);

/** What each maintenance principle requires (ai/operations/maintenance.md, "Principles"). */
export const MAINTENANCE_PRINCIPLE_DESCRIPTIONS: Readonly<Record<MaintenancePrinciple, string>> =
  Object.freeze({
    'maintenance-upkeeps-operation-it-never-changes-behavior':
      'A maintenance activity keeps the running of the layer in good order and never changes the behavior of any namespace.',
    'maintenance-is-categorized':
      'Every maintenance activity falls into a defined category, so its intent is explicit, never ad hoc.',
    'maintenance-is-governed-and-validated':
      'A maintenance activity occurs within the rules owned by ai/governance/ and is bounded by the limits owned by ai/safety/, and never bypasses them.',
    'maintenance-follows-a-defined-lifecycle':
      'A maintenance activity has a defined beginning and end, so it is planned, carried out, and completed rather than left open.',
  });

/**
 * A maintenance category: the intent a maintenance activity falls into, in constitutional listing order
 * (ai/operations/maintenance.md, "Specification"). The set is closed and unordered.
 */
export type MaintenanceCategory = 'corrective' | 'preventive' | 'adaptive';

/** The maintenance categories, in constitutional listing order; frozen. */
export const MAINTENANCE_CATEGORIES: readonly MaintenanceCategory[] = Object.freeze([
  'corrective',
  'preventive',
  'adaptive',
]);

/** What each maintenance category is (ai/operations/maintenance.md, "Specification"). */
export const MAINTENANCE_CATEGORY_DESCRIPTIONS: Readonly<Record<MaintenanceCategory, string>> =
  Object.freeze({
    corrective: 'Corrective maintenance that restores operation after a problem.',
    preventive: 'Preventive maintenance that keeps operation from degrading.',
    adaptive:
      'Adaptive maintenance that keeps operation aligned as the layer evolves under the Evolution namespace.',
  });

/**
 * A maintenance invariant: a guarantee the maintenance model always upholds (ai/operations/maintenance.md,
 * "Invariants").
 */
export type MaintenanceInvariant =
  | 'keeps-operation-in-good-order-never-changes-the-behavior-of-a-namespace'
  | 'every-maintenance-activity-falls-into-a-defined-category-by-its-intent'
  | 'permitted-under-governance-bounded-by-safety-follows-a-lifecycle-from-plan-to-completion'
  | 'a-change-a-maintenance-applies-is-versioned'
  | 'maintaining-operation-is-inert';

/** The maintenance invariants, in constitutional order; frozen. */
export const MAINTENANCE_INVARIANTS: readonly MaintenanceInvariant[] = Object.freeze([
  'keeps-operation-in-good-order-never-changes-the-behavior-of-a-namespace',
  'every-maintenance-activity-falls-into-a-defined-category-by-its-intent',
  'permitted-under-governance-bounded-by-safety-follows-a-lifecycle-from-plan-to-completion',
  'a-change-a-maintenance-applies-is-versioned',
  'maintaining-operation-is-inert',
]);

/** What each maintenance invariant guarantees (ai/operations/maintenance.md, "Invariants"). */
export const MAINTENANCE_INVARIANT_DESCRIPTIONS: Readonly<Record<MaintenanceInvariant, string>> =
  Object.freeze({
    'keeps-operation-in-good-order-never-changes-the-behavior-of-a-namespace':
      'A maintenance activity keeps operation in good order and never changes the behavior of a namespace.',
    'every-maintenance-activity-falls-into-a-defined-category-by-its-intent':
      'Every maintenance activity falls into a defined category by its intent.',
    'permitted-under-governance-bounded-by-safety-follows-a-lifecycle-from-plan-to-completion':
      'A maintenance activity is permitted under governance and bounded by safety, and follows a defined lifecycle from plan to completion.',
    'a-change-a-maintenance-applies-is-versioned':
      'A change a maintenance applies to an operational definition is versioned under ai/operations/operations-versioning.md.',
    'maintaining-operation-is-inert':
      'Maintaining operation never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
  });
