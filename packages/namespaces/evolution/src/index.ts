/**
 * @packageDocumentation
 * `@openlance/aios-evolution`
 *
 * The immutable, technology-neutral domain model of the AI layer's evolution abstraction (Specification
 * authority, ai/evolution/). It states how the architecture of the AI Operating System itself changes over
 * time - proposed, reviewed, approved, introduced, stabilized, and retired, with compatibility preserved,
 * migration and deprecation controlled, and growth additive - as strongly-typed classifications, immutable
 * definitions and invariants, and two pure deterministic algorithms: the evolution-lifecycle-phase ordering
 * (evolutionPhaseAtOrAfter) and the deprecation-state ordering (deprecationStateAtOrAfter), which express the
 * evolution specification verbatim.
 *
 * Evolution is the final namespace of the AI layer. It performs no behavior and no IO: evolution defines how
 * the architecture changes and never executes, reasons, retrieves, stores truth, evaluates, operates, or
 * governs; the namespace defines no deployment, migration tool, version-control system, provider, framework,
 * language, or code (ADR-0020). ADR-0024 does not enumerate Evolution among its examples; per ADR-0024 §42 its
 * category is declared in the design (docs/implementation/22-evolution.md) as category 1 (Pure Domain Model),
 * the same shape as Governance: it owns the model of controlled architectural change (truth about how the
 * architecture changes), not an integration, orchestration, or composition, and the package is realized per
 * ADR-0020 as an immutable stateless domain model with no IO; the carrying out of a concrete change is the
 * amendment workflow's and the runtime's. It defers the amendment workflow to ai/CONTRIBUTING.md, the change
 * rules to ai/governance/, the maturity map to ai/architecture/repository-evolution.md, and business truth to
 * the knowledge repository - all referenced in prose and never restated as evolution classifications
 * (ADR-0025).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-EVOLUTION-README.
 */

export type { EvolutionInvariant, EvolutionConcern } from './namespace.js';
export {
  EVOLUTION_INVARIANTS,
  EVOLUTION_INVARIANT_DESCRIPTIONS,
  EVOLUTION_CONCERNS,
  EVOLUTION_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  EvolutionArchitecturePrinciple,
  EvolutionPart,
  EvolutionArchitectureInvariant,
} from './evolution-architecture.js';
export {
  EVOLUTION_ARCHITECTURE_PRINCIPLES,
  EVOLUTION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_PARTS,
  EVOLUTION_PART_DESCRIPTIONS,
  EVOLUTION_ARCHITECTURE_INVARIANTS,
  EVOLUTION_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './evolution-architecture.js';

export type {
  EvolutionLifecyclePrinciple,
  EvolutionLifecyclePhase,
  EvolutionLifecycleInvariant,
} from './evolution-lifecycle.js';
export {
  EVOLUTION_LIFECYCLE_PRINCIPLES,
  EVOLUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_LIFECYCLE_PHASES,
  EVOLUTION_LIFECYCLE_PHASE_DESCRIPTIONS,
  evolutionPhaseAtOrAfter,
  EVOLUTION_LIFECYCLE_INVARIANTS,
  EVOLUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './evolution-lifecycle.js';

export type {
  EvolutionPlanningPrinciple,
  EvolutionPlanningInvariant,
} from './evolution-planning.js';
export {
  EVOLUTION_PLANNING_PRINCIPLES,
  EVOLUTION_PLANNING_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_PLANNING_INVARIANTS,
  EVOLUTION_PLANNING_INVARIANT_DESCRIPTIONS,
} from './evolution-planning.js';

export type {
  ChangeManagementPrinciple,
  ChangeCategory,
  ChangeManagementInvariant,
} from './change-management.js';
export {
  CHANGE_MANAGEMENT_PRINCIPLES,
  CHANGE_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  CHANGE_CATEGORIES,
  CHANGE_CATEGORY_DESCRIPTIONS,
  CHANGE_MANAGEMENT_INVARIANTS,
  CHANGE_MANAGEMENT_INVARIANT_DESCRIPTIONS,
} from './change-management.js';

export type {
  CompatibilityManagementPrinciple,
  CompatibilityManagementInvariant,
} from './compatibility-management.js';
export {
  COMPATIBILITY_MANAGEMENT_PRINCIPLES,
  COMPATIBILITY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  COMPATIBILITY_MANAGEMENT_INVARIANTS,
  COMPATIBILITY_MANAGEMENT_INVARIANT_DESCRIPTIONS,
} from './compatibility-management.js';

export type { MigrationModelPrinciple, MigrationModelInvariant } from './migration-model.js';
export {
  MIGRATION_MODEL_PRINCIPLES,
  MIGRATION_MODEL_PRINCIPLE_DESCRIPTIONS,
  MIGRATION_MODEL_INVARIANTS,
  MIGRATION_MODEL_INVARIANT_DESCRIPTIONS,
} from './migration-model.js';

export type {
  DeprecationModelPrinciple,
  DeprecationState,
  DeprecationModelInvariant,
} from './deprecation-model.js';
export {
  DEPRECATION_MODEL_PRINCIPLES,
  DEPRECATION_MODEL_PRINCIPLE_DESCRIPTIONS,
  DEPRECATION_STATES,
  DEPRECATION_STATE_DESCRIPTIONS,
  deprecationStateAtOrAfter,
  DEPRECATION_MODEL_INVARIANTS,
  DEPRECATION_MODEL_INVARIANT_DESCRIPTIONS,
} from './deprecation-model.js';

export type { RepositoryGrowthPrinciple, RepositoryGrowthInvariant } from './repository-growth.js';
export {
  REPOSITORY_GROWTH_PRINCIPLES,
  REPOSITORY_GROWTH_PRINCIPLE_DESCRIPTIONS,
  REPOSITORY_GROWTH_INVARIANTS,
  REPOSITORY_GROWTH_INVARIANT_DESCRIPTIONS,
} from './repository-growth.js';

export type {
  EvolutionBoundaryPrinciple,
  EvolutionBoundary,
  EvolutionBoundaryInvariant,
} from './evolution-boundaries.js';
export {
  EVOLUTION_BOUNDARY_PRINCIPLES,
  EVOLUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_BOUNDARIES,
  EVOLUTION_BOUNDARY_DESCRIPTIONS,
  EVOLUTION_BOUNDARY_INVARIANTS,
  EVOLUTION_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './evolution-boundaries.js';

export type {
  EvolutionVersioningPrinciple,
  EvolutionVersioningInvariant,
} from './evolution-versioning.js';
export {
  EVOLUTION_VERSIONING_PRINCIPLES,
  EVOLUTION_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_VERSIONING_INVARIANTS,
  EVOLUTION_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './evolution-versioning.js';
