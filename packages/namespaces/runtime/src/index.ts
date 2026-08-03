/**
 * @packageDocumentation
 * `@openlance/aios-runtime`
 *
 * The immutable, technology-neutral domain model of the AI layer's execution abstraction (Specification
 * authority, ai/runtime/). It states how an AI task is initialized, loaded, validated, run, monitored,
 * recovered, and finalized, as strongly-typed classifications, immutable definitions and invariants, and five
 * pure deterministic algorithms: the execution state-transition relation (transitionAllowed) and the
 * execution-lifecycle, session-lifecycle, workflow-step, and validation-stage orderings, which express the
 * execution specification verbatim.
 *
 * It performs no orchestration, no execution, and no IO: the runtime defines the execution model and never
 * carries it out; the namespace defines no provider, model, framework, language, runtime system, protocol,
 * interface, or code (ADR-0020). Runtime is ADR-0024 category 3 (Runtime Service) - it owns the constitutional
 * role of lifecycle and orchestration - but the package conforming to the frozen, technology-neutral
 * ai/runtime/ spec is realized per ADR-0020 (which governs every namespace in addition to its category,
 * ADR-0024 §42) as an immutable stateless domain model with no IO; the actual orchestration over a concrete
 * task is the operational runtime's. It enforces governance rules in a defined order and sequences the
 * operational namespaces' results, and owns none of them; the models owned by ai/governance/, ai/agents/,
 * ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/, ai/tools/, ai/providers/, and the knowledge
 * repository are referenced in prose and never restated as runtime classifications.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-RUNTIME-README.
 */

export type { RuntimeInvariant, RuntimeConcern } from './namespace.js';
export {
  RUNTIME_INVARIANTS,
  RUNTIME_INVARIANT_DESCRIPTIONS,
  RUNTIME_CONCERNS,
  RUNTIME_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  ExecutionLifecyclePrinciple,
  ExecutionLifecyclePhase,
  ExecutionLifecycleInvariant,
} from './execution-lifecycle.js';
export {
  EXECUTION_LIFECYCLE_PRINCIPLES,
  EXECUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_LIFECYCLE_PHASES,
  EXECUTION_LIFECYCLE_PHASE_DESCRIPTIONS,
  executionPhaseAtOrAfter,
  EXECUTION_LIFECYCLE_INVARIANTS,
  EXECUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './execution-lifecycle.js';

export type {
  SessionLifecyclePrinciple,
  SessionLifecyclePhase,
  SessionLifecycleInvariant,
} from './session-lifecycle.js';
export {
  SESSION_LIFECYCLE_PRINCIPLES,
  SESSION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  SESSION_LIFECYCLE_PHASES,
  SESSION_LIFECYCLE_PHASE_DESCRIPTIONS,
  sessionPhaseAtOrAfter,
  SESSION_LIFECYCLE_INVARIANTS,
  SESSION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './session-lifecycle.js';

export type {
  ExecutionStatePrinciple,
  ExecutionState,
  ExecutionStateInvariant,
} from './execution-states.js';
export {
  EXECUTION_STATE_PRINCIPLES,
  EXECUTION_STATE_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_STATES,
  EXECUTION_STATE_DESCRIPTIONS,
  EXECUTION_STATE_TRANSITIONS,
  transitionAllowed,
  EXECUTION_STATE_INVARIANTS,
  EXECUTION_STATE_INVARIANT_DESCRIPTIONS,
} from './execution-states.js';

export type {
  ExecutionWorkflowPrinciple,
  ExecutionWorkflowStep,
  ExecutionWorkflowInvariant,
} from './execution-workflow.js';
export {
  EXECUTION_WORKFLOW_PRINCIPLES,
  EXECUTION_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_WORKFLOW_STEPS,
  EXECUTION_WORKFLOW_STEP_DESCRIPTIONS,
  workflowStepAtOrAfter,
  EXECUTION_WORKFLOW_INVARIANTS,
  EXECUTION_WORKFLOW_INVARIANT_DESCRIPTIONS,
} from './execution-workflow.js';

export type {
  ContextLoadingPrinciple,
  ContextInput,
  ContextLoadingInvariant,
} from './context-loading.js';
export {
  CONTEXT_LOADING_PRINCIPLES,
  CONTEXT_LOADING_PRINCIPLE_DESCRIPTIONS,
  CONTEXT_INPUTS,
  CONTEXT_INPUT_DESCRIPTIONS,
  CONTEXT_LOADING_INVARIANTS,
  CONTEXT_LOADING_INVARIANT_DESCRIPTIONS,
} from './context-loading.js';

export type {
  KnowledgeResolutionPrinciple,
  KnowledgeResolutionInvariant,
} from './knowledge-resolution.js';
export {
  KNOWLEDGE_RESOLUTION_PRINCIPLES,
  KNOWLEDGE_RESOLUTION_PRINCIPLE_DESCRIPTIONS,
  KNOWLEDGE_RESOLUTION_INVARIANTS,
  KNOWLEDGE_RESOLUTION_INVARIANT_DESCRIPTIONS,
} from './knowledge-resolution.js';

export type {
  ValidationPipelinePrinciple,
  ValidationStage,
  ValidationPipelineInvariant,
} from './validation-pipeline.js';
export {
  VALIDATION_PIPELINE_PRINCIPLES,
  VALIDATION_PIPELINE_PRINCIPLE_DESCRIPTIONS,
  VALIDATION_STAGES,
  VALIDATION_STAGE_DESCRIPTIONS,
  validationStageAtOrAfter,
  VALIDATION_PIPELINE_INVARIANTS,
  VALIDATION_PIPELINE_INVARIANT_DESCRIPTIONS,
} from './validation-pipeline.js';

export type {
  ExecutionBoundaryPrinciple,
  ExecutionBoundary,
  ExecutionBoundaryInvariant,
} from './execution-boundaries.js';
export {
  EXECUTION_BOUNDARY_PRINCIPLES,
  EXECUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_BOUNDARIES,
  EXECUTION_BOUNDARY_DESCRIPTIONS,
  EXECUTION_BOUNDARY_INVARIANTS,
  EXECUTION_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './execution-boundaries.js';

export type { FailureRecoveryPrinciple, FailureRecoveryInvariant } from './failure-recovery.js';
export {
  FAILURE_RECOVERY_PRINCIPLES,
  FAILURE_RECOVERY_PRINCIPLE_DESCRIPTIONS,
  FAILURE_RECOVERY_INVARIANTS,
  FAILURE_RECOVERY_INVARIANT_DESCRIPTIONS,
} from './failure-recovery.js';

export type {
  EventLifecyclePrinciple,
  RuntimeEvent,
  EventLifecycleInvariant,
} from './event-lifecycle.js';
export {
  EVENT_LIFECYCLE_PRINCIPLES,
  EVENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  RUNTIME_EVENTS,
  RUNTIME_EVENT_DESCRIPTIONS,
  EVENT_LIFECYCLE_INVARIANTS,
  EVENT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './event-lifecycle.js';
