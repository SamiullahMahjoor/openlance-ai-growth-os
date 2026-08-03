/**
 * The Operations namespace, namespace-wide truth (ai/operations/README.md, OL-AI-OPERATIONS-README;
 * ai/operations/operations.md, OL-AI-OPERATIONS-OPERATIONS).
 *
 * The operational invariants every operations concern upholds, and the canonical inventory of the operational
 * concerns, as immutable definitions (ADR-0020). The namespace is the running-the-layer model of the AI layer:
 * it defines how the running of the layer is observed, monitored, kept healthy, diagnosed, maintained, and
 * evolved, so that the layer runs reliably without its behavior ever being changed by the act of operating it.
 * Operations operates the layer; it never changes its behavior: it never reasons, executes runtime behavior,
 * decides a matter reserved to governance, or changes the behavior of any namespace, and it never defines a
 * monitoring tool, dashboard, log, alerting platform, deployment system, infrastructure product, provider,
 * framework, or code (ai/operations/README.md). It is deterministic and scalable: the same operational state,
 * signals, and rules yield the same operational assessment, health state, incident classification, and
 * maintenance determination, and the model holds for a single agent or a whole enterprise
 * (ai/operations/operations.md).
 *
 * ADR-0024 enumerates Operations as category 5 (Composition Root): it "builds the complete application, creates
 * the dependency graph, and performs dependency-injection composition." That names the operational ROLE. The
 * package conforming to the frozen, technology-neutral ai/operations/ spec is nonetheless realized per ADR-0020
 * as an immutable, stateless domain model with no IO, no services, and no dependency injection: ADR-0020's
 * Decision applies to "Every technology-neutral constitutional namespace" and ADR-0024's Consequences say the
 * category constrains the package "in addition to ADR-0020"; ai/operations/README.md states operations "defines
 * the operational model, never how operations is implemented, tooled, or deployed, and never contains code." So
 * this package owns the operational model as an immutable specification model; the actual composition-root
 * wiring is a future operational implementation, outside this package. Its executable surface is two pure
 * ordering predicates over operations-owned classifications - the operations-lifecycle-phase and health-state
 * orderings (design: docs/implementation/21-operations.md section 2).
 */

/**
 * An operational invariant: a permanent guarantee every operations document upholds and no operation may
 * violate (ai/operations/README.md, "Operational Invariants"). Every operations concern's principles
 * instantiate these.
 */
export type OperationsInvariant =
  | 'operates-never-changes-behavior'
  | 'observes-owns-no-behavior'
  | 'deterministic'
  | 'changes-no-governance-or-constitutional-behavior'
  | 'defers-protection-and-judgment'
  | 'technology-neutral'
  | 'single-owned-and-scalable';

/** The seven operational invariants, in constitutional order; frozen. */
export const OPERATIONS_INVARIANTS: readonly OperationsInvariant[] = Object.freeze([
  'operates-never-changes-behavior',
  'observes-owns-no-behavior',
  'deterministic',
  'changes-no-governance-or-constitutional-behavior',
  'defers-protection-and-judgment',
  'technology-neutral',
  'single-owned-and-scalable',
]);

/** The guarantee each operational invariant states (ai/operations/README.md, "Operational Invariants"). */
export const OPERATIONS_INVARIANT_DESCRIPTIONS: Readonly<Record<OperationsInvariant, string>> =
  Object.freeze({
    'operates-never-changes-behavior':
      'Operating observes, monitors, and maintains the running of the layer, and never reasons, executes runtime behavior, or alters what a namespace does.',
    'observes-owns-no-behavior':
      'The behavior operated is owned by its namespace, and operations owns the operational model only.',
    deterministic:
      'The same operational state, the same signals, and the same rules yield the same operational assessment, health state, incident classification, and maintenance determination, with no randomness.',
    'changes-no-governance-or-constitutional-behavior':
      'Operations runs the layer within the rules owned by ai/governance/, and never amends a rule or a behavior.',
    'defers-protection-and-judgment':
      'A protective response is owned by ai/safety/, and output judgment by ai/evaluation/; operations observes their signals and defers to them.',
    'technology-neutral':
      'It owns no monitoring tool, log, dashboard, infrastructure, deployment system, or operational software.',
    'single-owned-and-scalable':
      'Each operational concern has exactly one owning document, and the operational model holds for a single agent or a whole enterprise.',
  });

/**
 * An operational concern: one aspect of the operational model, each owned by exactly one document
 * (ai/operations/operations.md, "The Operational Concerns"). This is the namespace inventory identity; the
 * model of each concern is owned by its named document and this package's corresponding module.
 */
export type OperationsConcern =
  | 'operations-architecture'
  | 'operations-lifecycle'
  | 'observability'
  | 'monitoring'
  | 'incident-management'
  | 'health-management'
  | 'diagnostics'
  | 'maintenance'
  | 'operations-boundaries'
  | 'operations-versioning';

/** The ten operational concerns, in inventory order; frozen. */
export const OPERATIONS_CONCERNS: readonly OperationsConcern[] = Object.freeze([
  'operations-architecture',
  'operations-lifecycle',
  'observability',
  'monitoring',
  'incident-management',
  'health-management',
  'diagnostics',
  'maintenance',
  'operations-boundaries',
  'operations-versioning',
]);

/** What each operational concern owns (ai/operations/operations.md, "The Operational Concerns"). */
export const OPERATIONS_CONCERN_DESCRIPTIONS: Readonly<Record<OperationsConcern, string>> =
  Object.freeze({
    'operations-architecture':
      'The operational identity and structural composition: what an operation is and the parts it is composed of.',
    'operations-lifecycle':
      "The operational lifecycle: startup, steady-state, maintenance, and retirement of the layer's operation.",
    observability:
      'Operational visibility: the signals the running layer makes available and the operational awareness they provide.',
    monitoring:
      'The monitoring model, monitoring relationships, and monitoring boundaries: how signals are watched against expectations.',
    'incident-management':
      'The incident lifecycle, incident classification, and incident response architecture.',
    'health-management': 'The health model, health states, and operational health assessment.',
    diagnostics: 'The diagnostic model, investigation architecture, and diagnostic relationships.',
    maintenance:
      'The maintenance model, maintenance categories, and the maintenance lifecycle of a maintenance activity.',
    'operations-boundaries': 'What operations never owns, and where operating stops.',
    'operations-versioning': 'Operational evolution, migration, compatibility, and deprecation.',
  });
