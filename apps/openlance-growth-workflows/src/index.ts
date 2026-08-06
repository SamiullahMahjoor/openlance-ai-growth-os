/**
 * @packageDocumentation
 * `@openlance/aios-openlance-growth-workflows`
 *
 * The AIOS OpenLance Growth Workflows subsystem (Phase 5, Stage 7): a deterministic domain subsystem that owns the
 * growth-workflow behavior only (ADR-0055). It composes the six frozen planners (Marketing, Content, SEO, Social,
 * Analytics, Campaign) into reusable OpenLance growth workflows. It is the `Campaign -> Growth Workflows` step of the
 * chain: it consumes a Campaign Intelligence output and, through it, the five earlier planner references (all by
 * reference), plus knowledge by reference, and frames a governed workflow task: an immutable `GrowthWorkflow` carrying
 * the frozen Agent Engine `AgentRequest` (prompt and provider steps), plus a workflow-quality `EvaluationRequest` for the
 * frozen Evaluation Engine. It is deterministic and fail-closed; it never executes, schedules, automates, or orchestrates
 * a workflow, never invokes a provider, and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `WORKFLOW_MANAGER`.
 */

export { OpenLanceGrowthWorkflows } from './manager.js';
export { WORKFLOW_MANAGER, workflowModule } from './module.js';
export { GrowthWorkflowFramer } from './framing.js';
export { GrowthWorkflowHash } from './hash.js';
export { GrowthWorkflowNormalizer } from './normalizer.js';
export { GrowthWorkflowError } from './errors.js';
export {
  WORKFLOW_TYPES,
  WORKFLOW_DEFINITIONS,
  CANONICAL_CHAIN,
  isWorkflowType,
} from './catalogue.js';
export { WORKFLOW_AGENT } from './agent.js';
export { workflowEvaluationRequest } from './evaluation.js';
export { workflowFromCampaign } from './integration.js';
export type { WorkflowFraming } from './integration.js';

export type {
  WorkflowType,
  WorkflowCategory,
  PlannerStage,
  WorkflowMetadata,
  GrowthWorkflowRequest,
  GrowthWorkflow,
  WorkflowStatistics,
} from './types.js';
