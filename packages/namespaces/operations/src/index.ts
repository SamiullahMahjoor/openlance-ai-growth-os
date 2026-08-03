/**
 * @packageDocumentation
 * `@openlance/aios-operations`
 *
 * The immutable, technology-neutral domain model of the AI layer's operations abstraction (Specification
 * authority, ai/operations/). It states how the running of the layer is observed, monitored, kept healthy,
 * diagnosed, maintained, and evolved, so that the layer runs reliably without its behavior ever being changed
 * by the act of operating it, as strongly-typed classifications, immutable definitions and invariants, and two
 * pure deterministic algorithms: the operations-lifecycle-phase ordering (operationsPhaseAtOrAfter) and the
 * health-state ordering (healthStateAtOrAfter), which express the operations specification verbatim.
 *
 * It performs no operation, no monitoring, and no IO: operations defines the operational model and never
 * carries it out; the namespace defines no monitoring tool, dashboard, log, alerting platform, deployment
 * system, infrastructure product, provider, framework, language, runtime, protocol, interface, or code
 * (ADR-0020). ADR-0024 enumerates Operations as category 5 (Composition Root) - it owns the constitutional role
 * of building the application, creating the dependency graph, and performing dependency-injection composition -
 * but the package conforming to the frozen, technology-neutral ai/operations/ spec is realized per ADR-0020
 * (which governs every namespace in addition to its category, ADR-0024 Consequences) as an immutable stateless
 * domain model with no IO and no dependency injection; the actual composition-root wiring over a concrete
 * application is the operational implementation's, built later, outside this constitutional-conformance package.
 * It operates the runtime it runs, observes evaluation and safety signals, and owns none of them; the models
 * owned by ai/runtime/, ai/governance/, ai/safety/, ai/evaluation/, the subject namespaces, the Evolution
 * namespace, and the knowledge repository are referenced in prose and never restated as operations
 * classifications (ADR-0025).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-OPERATIONS-README.
 */

export type { OperationsInvariant, OperationsConcern } from './namespace.js';
export {
  OPERATIONS_INVARIANTS,
  OPERATIONS_INVARIANT_DESCRIPTIONS,
  OPERATIONS_CONCERNS,
  OPERATIONS_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  OperationsArchitecturePrinciple,
  OperationsPart,
  OperationsArchitectureInvariant,
} from './operations-architecture.js';
export {
  OPERATIONS_ARCHITECTURE_PRINCIPLES,
  OPERATIONS_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  OPERATIONS_PARTS,
  OPERATIONS_PART_DESCRIPTIONS,
  OPERATIONS_ARCHITECTURE_INVARIANTS,
  OPERATIONS_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './operations-architecture.js';

export type {
  OperationsLifecyclePrinciple,
  OperationsLifecyclePhase,
  OperationsLifecycleInvariant,
} from './operations-lifecycle.js';
export {
  OPERATIONS_LIFECYCLE_PRINCIPLES,
  OPERATIONS_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  OPERATIONS_LIFECYCLE_PHASES,
  OPERATIONS_LIFECYCLE_PHASE_DESCRIPTIONS,
  operationsPhaseAtOrAfter,
  OPERATIONS_LIFECYCLE_INVARIANTS,
  OPERATIONS_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './operations-lifecycle.js';

export type { ObservabilityPrinciple, ObservabilityInvariant } from './observability.js';
export {
  OBSERVABILITY_PRINCIPLES,
  OBSERVABILITY_PRINCIPLE_DESCRIPTIONS,
  OBSERVABILITY_INVARIANTS,
  OBSERVABILITY_INVARIANT_DESCRIPTIONS,
} from './observability.js';

export type { MonitoringPrinciple, MonitoringInvariant } from './monitoring.js';
export {
  MONITORING_PRINCIPLES,
  MONITORING_PRINCIPLE_DESCRIPTIONS,
  MONITORING_INVARIANTS,
  MONITORING_INVARIANT_DESCRIPTIONS,
} from './monitoring.js';

export type {
  IncidentManagementPrinciple,
  IncidentManagementInvariant,
} from './incident-management.js';
export {
  INCIDENT_MANAGEMENT_PRINCIPLES,
  INCIDENT_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  INCIDENT_MANAGEMENT_INVARIANTS,
  INCIDENT_MANAGEMENT_INVARIANT_DESCRIPTIONS,
} from './incident-management.js';

export type {
  HealthManagementPrinciple,
  HealthState,
  HealthManagementInvariant,
} from './health-management.js';
export {
  HEALTH_MANAGEMENT_PRINCIPLES,
  HEALTH_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  HEALTH_STATES,
  HEALTH_STATE_DESCRIPTIONS,
  healthStateAtOrAfter,
  HEALTH_MANAGEMENT_INVARIANTS,
  HEALTH_MANAGEMENT_INVARIANT_DESCRIPTIONS,
} from './health-management.js';

export type { DiagnosticsPrinciple, DiagnosticsInvariant } from './diagnostics.js';
export {
  DIAGNOSTICS_PRINCIPLES,
  DIAGNOSTICS_PRINCIPLE_DESCRIPTIONS,
  DIAGNOSTICS_INVARIANTS,
  DIAGNOSTICS_INVARIANT_DESCRIPTIONS,
} from './diagnostics.js';

export type {
  MaintenancePrinciple,
  MaintenanceCategory,
  MaintenanceInvariant,
} from './maintenance.js';
export {
  MAINTENANCE_PRINCIPLES,
  MAINTENANCE_PRINCIPLE_DESCRIPTIONS,
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_CATEGORY_DESCRIPTIONS,
  MAINTENANCE_INVARIANTS,
  MAINTENANCE_INVARIANT_DESCRIPTIONS,
} from './maintenance.js';

export type {
  OperationsBoundaryPrinciple,
  OperationsBoundary,
  OperationsBoundaryInvariant,
} from './operations-boundaries.js';
export {
  OPERATIONS_BOUNDARY_PRINCIPLES,
  OPERATIONS_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  OPERATIONS_BOUNDARIES,
  OPERATIONS_BOUNDARY_DESCRIPTIONS,
  OPERATIONS_BOUNDARY_INVARIANTS,
  OPERATIONS_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './operations-boundaries.js';

export type {
  OperationsVersioningPrinciple,
  OperationsVersioningAspect,
  OperationsVersioningInvariant,
} from './operations-versioning.js';
export {
  OPERATIONS_VERSIONING_PRINCIPLES,
  OPERATIONS_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  OPERATIONS_VERSIONING_ASPECTS,
  OPERATIONS_VERSIONING_ASPECT_DESCRIPTIONS,
  OPERATIONS_VERSIONING_INVARIANTS,
  OPERATIONS_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './operations-versioning.js';
