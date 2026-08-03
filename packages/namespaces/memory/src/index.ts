/**
 * @packageDocumentation
 * `@openlance/aios-memory`
 *
 * The immutable, technology-neutral domain model of the AI layer's retained-context abstraction
 * (Specification authority, ai/memory/). It states how retained context is formed, held, made
 * available, kept consistent, validated, kept fresh, bounded, and evolved, as strongly-typed
 * classifications, immutable definitions and invariants, and pure deterministic predicates that express
 * the memory specification verbatim.
 *
 * It performs no execution, no storage, no orchestration, and no IO: memory is retained and made
 * available within the session and execution lifecycles owned by ai/runtime/, and it defines no store,
 * database, index, cache, embedding, vector search, or persistence technology (ADR-0020; the namespace
 * owns the retained-context boundary abstraction, ADR-0024, realized here as an immutable stateless
 * domain model). Runtime evaluations over a concrete request and a concrete retained memory - making a
 * memory available, detecting a conflict, applying a change - are deferred to the runtime, exactly as a
 * governance concern defers its runtime evaluation. Memory holds runtime state and never business
 * truth, and knowledge always prevails over memory.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-MEMORY-README.
 */

export type { MemoryInvariant, MemoryConcern } from './namespace.js';
export {
  MEMORY_INVARIANTS,
  MEMORY_INVARIANT_DESCRIPTIONS,
  MEMORY_CONCERNS,
  MEMORY_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  MemoryLifecyclePrinciple,
  MemoryLifecyclePhase,
  MemoryLifecycleInvariant,
} from './memory-lifecycle.js';
export {
  MEMORY_LIFECYCLE_PRINCIPLES,
  MEMORY_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  MEMORY_LIFECYCLE_PHASES,
  MEMORY_LIFECYCLE_PHASE_DESCRIPTIONS,
  lifecyclePhaseAtOrAfter,
  MEMORY_LIFECYCLE_INVARIANTS,
  MEMORY_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './memory-lifecycle.js';

export type {
  MemoryWorkflowPrinciple,
  MemoryWorkflowStep,
  MemoryWorkflowInvariant,
} from './memory-workflow.js';
export {
  MEMORY_WORKFLOW_PRINCIPLES,
  MEMORY_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  MEMORY_WORKFLOW_STEPS,
  MEMORY_WORKFLOW_STEP_DESCRIPTIONS,
  workflowStepAtOrAfter,
  MEMORY_WORKFLOW_INVARIANTS,
  MEMORY_WORKFLOW_INVARIANT_DESCRIPTIONS,
} from './memory-workflow.js';

export type { MemoryTypesPrinciple, MemoryType, MemoryTypesInvariant } from './memory-types.js';
export {
  MEMORY_TYPES_PRINCIPLES,
  MEMORY_TYPES_PRINCIPLE_DESCRIPTIONS,
  MEMORY_TYPES,
  MEMORY_TYPE_DESCRIPTIONS,
  MEMORY_TYPES_INVARIANTS,
  MEMORY_TYPES_INVARIANT_DESCRIPTIONS,
} from './memory-types.js';

export type {
  MemoryRetentionPrinciple,
  MemoryRetentionClass,
  MemoryRetentionInvariant,
} from './memory-retention.js';
export {
  MEMORY_RETENTION_PRINCIPLES,
  MEMORY_RETENTION_PRINCIPLE_DESCRIPTIONS,
  MEMORY_RETENTION_CLASSES,
  MEMORY_RETENTION_CLASS_DESCRIPTIONS,
  retentionAtLeast,
  MEMORY_RETENTION_INVARIANTS,
  MEMORY_RETENTION_INVARIANT_DESCRIPTIONS,
} from './memory-retention.js';

export type { MemoryRetrievalPrinciple, MemoryRetrievalInvariant } from './memory-retrieval.js';
export {
  MEMORY_RETRIEVAL_PRINCIPLES,
  MEMORY_RETRIEVAL_PRINCIPLE_DESCRIPTIONS,
  MEMORY_RETRIEVAL_INVARIANTS,
  MEMORY_RETRIEVAL_INVARIANT_DESCRIPTIONS,
} from './memory-retrieval.js';

export type {
  MemoryConsistencyPrinciple,
  MemoryConsistencyInvariant,
} from './memory-consistency.js';
export {
  MEMORY_CONSISTENCY_PRINCIPLES,
  MEMORY_CONSISTENCY_PRINCIPLE_DESCRIPTIONS,
  MEMORY_CONSISTENCY_INVARIANTS,
  MEMORY_CONSISTENCY_INVARIANT_DESCRIPTIONS,
} from './memory-consistency.js';

export type { MemoryValidationPrinciple, MemoryValidationInvariant } from './memory-validation.js';
export {
  MEMORY_VALIDATION_PRINCIPLES,
  MEMORY_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  MEMORY_VALIDATION_INVARIANTS,
  MEMORY_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './memory-validation.js';

export type {
  MemoryQualityPrinciple,
  MemoryQualityProperty,
  MemoryQualityInvariant,
} from './memory-quality.js';
export {
  MEMORY_QUALITY_PRINCIPLES,
  MEMORY_QUALITY_PRINCIPLE_DESCRIPTIONS,
  MEMORY_QUALITY_PROPERTIES,
  MEMORY_QUALITY_PROPERTY_DESCRIPTIONS,
  MEMORY_QUALITY_INVARIANTS,
  MEMORY_QUALITY_INVARIANT_DESCRIPTIONS,
} from './memory-quality.js';

export type {
  MemoryBoundariesPrinciple,
  MemoryBoundary,
  MemoryBoundariesInvariant,
} from './memory-boundaries.js';
export {
  MEMORY_BOUNDARIES_PRINCIPLES,
  MEMORY_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  MEMORY_BOUNDARIES,
  MEMORY_BOUNDARY_DESCRIPTIONS,
  MEMORY_BOUNDARIES_INVARIANTS,
  MEMORY_BOUNDARIES_INVARIANT_DESCRIPTIONS,
} from './memory-boundaries.js';

export type { MemoryEvolutionPrinciple, MemoryEvolutionInvariant } from './memory-evolution.js';
export {
  MEMORY_EVOLUTION_PRINCIPLES,
  MEMORY_EVOLUTION_PRINCIPLE_DESCRIPTIONS,
  MEMORY_EVOLUTION_INVARIANTS,
  MEMORY_EVOLUTION_INVARIANT_DESCRIPTIONS,
} from './memory-evolution.js';
