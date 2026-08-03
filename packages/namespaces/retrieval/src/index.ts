/**
 * @packageDocumentation
 * `@openlance/aios-retrieval`
 *
 * The immutable, technology-neutral domain model of the AI layer's knowledge-determination abstraction
 * (Specification authority, ai/retrieval/). It states how the minimum sufficient, dependency-complete,
 * authority-correct set of knowledge a task requires is discovered, selected, expanded, prioritized,
 * assembled, and validated, as strongly-typed classifications, immutable definitions and invariants,
 * and pure deterministic predicates that express the retrieval specification verbatim.
 *
 * It performs no execution, no search, no loading, and no IO: retrieval determines the set to load and
 * produces the retrieval result; the runtime loads it and assembles the execution context
 * (ai/runtime/knowledge-resolution.md, ai/runtime/context-loading.md), and retrieval defines no search
 * engine, index, embedding, ranking, database, or algorithm (ADR-0020; the namespace owns the
 * determination boundary to the knowledge repository, ADR-0024 category 4, realized here as an immutable
 * stateless domain model). Runtime evaluations over a concrete task and a concrete repository state -
 * discovering, selecting, resolving, prioritizing, assembling, and validating a concrete result - are
 * deferred to the runtime, exactly as a governance concern defers its runtime evaluation. Retrieval
 * consumes the knowledge repository one-directionally and never owns, writes, or amends business truth.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-RETRIEVAL-README.
 */

export type { RetrievalInvariant, RetrievalConcern } from './namespace.js';
export {
  RETRIEVAL_INVARIANTS,
  RETRIEVAL_INVARIANT_DESCRIPTIONS,
  RETRIEVAL_CONCERNS,
  RETRIEVAL_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  RetrievalLifecyclePrinciple,
  RetrievalLifecyclePhase,
  RetrievalLifecycleInvariant,
} from './retrieval-lifecycle.js';
export {
  RETRIEVAL_LIFECYCLE_PRINCIPLES,
  RETRIEVAL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_LIFECYCLE_PHASES,
  RETRIEVAL_LIFECYCLE_PHASE_DESCRIPTIONS,
  retrievalPhaseAtOrAfter,
  RETRIEVAL_LIFECYCLE_INVARIANTS,
  RETRIEVAL_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './retrieval-lifecycle.js';

export type {
  RetrievalWorkflowPrinciple,
  RetrievalWorkflowStep,
  RetrievalWorkflowInvariant,
} from './retrieval-workflow.js';
export {
  RETRIEVAL_WORKFLOW_PRINCIPLES,
  RETRIEVAL_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_WORKFLOW_STEPS,
  RETRIEVAL_WORKFLOW_STEP_DESCRIPTIONS,
  retrievalStepAtOrAfter,
  RETRIEVAL_WORKFLOW_INVARIANTS,
  RETRIEVAL_WORKFLOW_INVARIANT_DESCRIPTIONS,
} from './retrieval-workflow.js';

export type {
  KnowledgeDiscoveryPrinciple,
  KnowledgeDiscoveryInvariant,
} from './knowledge-discovery.js';
export {
  KNOWLEDGE_DISCOVERY_PRINCIPLES,
  KNOWLEDGE_DISCOVERY_PRINCIPLE_DESCRIPTIONS,
  KNOWLEDGE_DISCOVERY_INVARIANTS,
  KNOWLEDGE_DISCOVERY_INVARIANT_DESCRIPTIONS,
} from './knowledge-discovery.js';

export type {
  KnowledgeSelectionPrinciple,
  KnowledgeSelectionInvariant,
} from './knowledge-selection.js';
export {
  KNOWLEDGE_SELECTION_PRINCIPLES,
  KNOWLEDGE_SELECTION_PRINCIPLE_DESCRIPTIONS,
  KNOWLEDGE_SELECTION_INVARIANTS,
  KNOWLEDGE_SELECTION_INVARIANT_DESCRIPTIONS,
} from './knowledge-selection.js';

export type {
  DependencyResolutionPrinciple,
  DependencyResolutionInvariant,
} from './dependency-resolution.js';
export {
  DEPENDENCY_RESOLUTION_PRINCIPLES,
  DEPENDENCY_RESOLUTION_PRINCIPLE_DESCRIPTIONS,
  DEPENDENCY_RESOLUTION_INVARIANTS,
  DEPENDENCY_RESOLUTION_INVARIANT_DESCRIPTIONS,
} from './dependency-resolution.js';

export type {
  ContextPrioritizationPrinciple,
  ContextPrioritizationInvariant,
} from './context-prioritization.js';
export {
  CONTEXT_PRIORITIZATION_PRINCIPLES,
  CONTEXT_PRIORITIZATION_PRINCIPLE_DESCRIPTIONS,
  CONTEXT_PRIORITIZATION_INVARIANTS,
  CONTEXT_PRIORITIZATION_INVARIANT_DESCRIPTIONS,
} from './context-prioritization.js';

export type { ContextAssemblyPrinciple, ContextAssemblyInvariant } from './context-assembly.js';
export {
  CONTEXT_ASSEMBLY_PRINCIPLES,
  CONTEXT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS,
  CONTEXT_ASSEMBLY_INVARIANTS,
  CONTEXT_ASSEMBLY_INVARIANT_DESCRIPTIONS,
} from './context-assembly.js';

export type { LoadingStrategyPrinciple, LoadingStrategyInvariant } from './loading-strategy.js';
export {
  LOADING_STRATEGY_PRINCIPLES,
  LOADING_STRATEGY_PRINCIPLE_DESCRIPTIONS,
  LOADING_STRATEGY_INVARIANTS,
  LOADING_STRATEGY_INVARIANT_DESCRIPTIONS,
} from './loading-strategy.js';

export type {
  RetrievalBoundariesPrinciple,
  RetrievalBoundary,
  RetrievalBoundariesInvariant,
} from './retrieval-boundaries.js';
export {
  RETRIEVAL_BOUNDARIES_PRINCIPLES,
  RETRIEVAL_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_BOUNDARIES,
  RETRIEVAL_BOUNDARY_DESCRIPTIONS,
  RETRIEVAL_BOUNDARIES_INVARIANTS,
  RETRIEVAL_BOUNDARIES_INVARIANT_DESCRIPTIONS,
} from './retrieval-boundaries.js';

export type {
  RetrievalValidationPrinciple,
  RetrievalValidationDimension,
  RetrievalValidationInvariant,
} from './retrieval-validation.js';
export {
  RETRIEVAL_VALIDATION_PRINCIPLES,
  RETRIEVAL_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_VALIDATION_DIMENSIONS,
  RETRIEVAL_VALIDATION_DIMENSION_DESCRIPTIONS,
  RETRIEVAL_VALIDATION_INVARIANTS,
  RETRIEVAL_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './retrieval-validation.js';
