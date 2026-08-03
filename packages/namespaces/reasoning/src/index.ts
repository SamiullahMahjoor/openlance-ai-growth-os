/**
 * @packageDocumentation
 * `@openlance/aios-reasoning`
 *
 * The immutable, technology-neutral domain model of the AI layer's reasoning abstraction (Specification
 * authority, ai/reasoning/). It states how retrieved knowledge is transformed, under governing rules,
 * into governed conclusions, as strongly-typed classifications, immutable definitions and invariants, and
 * three pure deterministic algorithms: the stage-transition relation (transitionAllowed) and the
 * lifecycle-phase and workflow-step orderings, which express the reasoning specification verbatim.
 *
 * It performs no reasoning and no IO: reasoning is deterministic cognition, and the mechanism that carries
 * a concrete reasoning along its stages is the runtime's; the namespace defines no algorithm, chain of
 * thought, hidden reasoning process, method, provider, model, protocol, or code (ADR-0020; the namespace
 * is ADR-0024 category 2, Pure Algorithms, realized here as an immutable stateless domain model with no
 * IO). It consumes retrieved knowledge and governing rules and owns neither the truth nor the rules; it
 * references the models owned by ai/governance/, ai/retrieval/, and the knowledge repository in prose and
 * never restates them as reasoning classifications.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-REASONING-README.
 */

export type { ReasoningInvariant, ReasoningConcern } from './namespace.js';
export {
  REASONING_INVARIANTS,
  REASONING_INVARIANT_DESCRIPTIONS,
  REASONING_CONCERNS,
  REASONING_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  ReasoningLifecyclePrinciple,
  ReasoningLifecyclePhase,
  ReasoningLifecycleInvariant,
} from './reasoning-lifecycle.js';
export {
  REASONING_LIFECYCLE_PRINCIPLES,
  REASONING_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  REASONING_LIFECYCLE_PHASES,
  REASONING_LIFECYCLE_PHASE_DESCRIPTIONS,
  reasoningPhaseAtOrAfter,
  REASONING_LIFECYCLE_INVARIANTS,
  REASONING_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './reasoning-lifecycle.js';

export type {
  ReasoningWorkflowPrinciple,
  ReasoningWorkflowStep,
  ReasoningWorkflowInvariant,
} from './reasoning-workflow.js';
export {
  REASONING_WORKFLOW_PRINCIPLES,
  REASONING_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  REASONING_WORKFLOW_STEPS,
  REASONING_WORKFLOW_STEP_DESCRIPTIONS,
  reasoningStepAtOrAfter,
  REASONING_WORKFLOW_INVARIANTS,
  REASONING_WORKFLOW_INVARIANT_DESCRIPTIONS,
} from './reasoning-workflow.js';

export type {
  ReasoningStagePrinciple,
  ReasoningStage,
  ReasoningStageInvariant,
} from './reasoning-stages.js';
export {
  REASONING_STAGE_PRINCIPLES,
  REASONING_STAGE_PRINCIPLE_DESCRIPTIONS,
  REASONING_STAGES,
  REASONING_STAGE_DESCRIPTIONS,
  REASONING_STAGE_TRANSITIONS,
  transitionAllowed,
  REASONING_STAGE_INVARIANTS,
  REASONING_STAGE_INVARIANT_DESCRIPTIONS,
} from './reasoning-stages.js';

export type {
  ReasoningStrategyPrinciple,
  ReasoningStrategy,
  ReasoningStrategyInvariant,
} from './reasoning-strategies.js';
export {
  REASONING_STRATEGY_PRINCIPLES,
  REASONING_STRATEGY_PRINCIPLE_DESCRIPTIONS,
  REASONING_STRATEGIES,
  REASONING_STRATEGY_DESCRIPTIONS,
  REASONING_STRATEGY_INVARIANTS,
  REASONING_STRATEGY_INVARIANT_DESCRIPTIONS,
} from './reasoning-strategies.js';

export type {
  ReasoningValidationPrinciple,
  ReasoningValidationDimension,
  ReasoningValidationInvariant,
} from './reasoning-validation.js';
export {
  REASONING_VALIDATION_PRINCIPLES,
  REASONING_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  REASONING_VALIDATION_DIMENSIONS,
  REASONING_VALIDATION_DIMENSION_DESCRIPTIONS,
  REASONING_VALIDATION_INVARIANTS,
  REASONING_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './reasoning-validation.js';

export type {
  ReasoningConsistencyPrinciple,
  ReasoningConsistencyInvariant,
} from './reasoning-consistency.js';
export {
  REASONING_CONSISTENCY_PRINCIPLES,
  REASONING_CONSISTENCY_PRINCIPLE_DESCRIPTIONS,
  REASONING_CONSISTENCY_INVARIANTS,
  REASONING_CONSISTENCY_INVARIANT_DESCRIPTIONS,
} from './reasoning-consistency.js';

export type {
  UncertaintyHandlingPrinciple,
  UncertaintyKind,
  UncertaintyHandlingInvariant,
} from './uncertainty-handling.js';
export {
  UNCERTAINTY_HANDLING_PRINCIPLES,
  UNCERTAINTY_HANDLING_PRINCIPLE_DESCRIPTIONS,
  UNCERTAINTY_KINDS,
  UNCERTAINTY_KIND_DESCRIPTIONS,
  UNCERTAINTY_HANDLING_INVARIANTS,
  UNCERTAINTY_HANDLING_INVARIANT_DESCRIPTIONS,
} from './uncertainty-handling.js';

export type {
  ConclusionFormationPrinciple,
  ConclusionFormationInvariant,
} from './conclusion-formation.js';
export {
  CONCLUSION_FORMATION_PRINCIPLES,
  CONCLUSION_FORMATION_PRINCIPLE_DESCRIPTIONS,
  CONCLUSION_FORMATION_INVARIANTS,
  CONCLUSION_FORMATION_INVARIANT_DESCRIPTIONS,
} from './conclusion-formation.js';

export type {
  ReasoningQualityPrinciple,
  ReasoningQualityProperty,
  ReasoningQualityInvariant,
} from './reasoning-quality.js';
export {
  REASONING_QUALITY_PRINCIPLES,
  REASONING_QUALITY_PRINCIPLE_DESCRIPTIONS,
  REASONING_QUALITY_PROPERTIES,
  REASONING_QUALITY_PROPERTY_DESCRIPTIONS,
  REASONING_QUALITY_INVARIANTS,
  REASONING_QUALITY_INVARIANT_DESCRIPTIONS,
} from './reasoning-quality.js';

export type {
  ReasoningBoundaryPrinciple,
  ReasoningBoundary,
  ReasoningBoundaryInvariant,
} from './reasoning-boundaries.js';
export {
  REASONING_BOUNDARY_PRINCIPLES,
  REASONING_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  REASONING_BOUNDARIES,
  REASONING_BOUNDARY_DESCRIPTIONS,
  REASONING_BOUNDARY_INVARIANTS,
  REASONING_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './reasoning-boundaries.js';
