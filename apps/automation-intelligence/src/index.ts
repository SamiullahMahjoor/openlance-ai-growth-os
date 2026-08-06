/**
 * @packageDocumentation
 * `@openlance/aios-automation-intelligence`
 *
 * The AIOS Automation Intelligence subsystem (Phase 5, Stage 8): the eighth and final AI Growth OS Feature, a
 * deterministic domain subsystem that owns the automation-planning behavior only (ADR-0056). It is the
 * `Growth Workflows -> Automation` step of the chain: it consumes a Growth Workflows output (a `GrowthWorkflow`, by
 * reference, carrying the six planner references transitively) plus knowledge by reference, and frames a governed
 * automation opportunity: an immutable `AutomationPlan` carrying the frozen Agent Engine `AgentRequest` (prompt and
 * provider steps), plus an automation-quality `EvaluationRequest` for the frozen Evaluation Engine. It is deterministic
 * and fail-closed; it never executes, schedules, or orchestrates automation, never bypasses a governance clearance, never
 * duplicates runtime execution, never invokes a provider, and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `AUTOMATION_MANAGER`.
 */

export { AutomationIntelligence } from './manager.js';
export { AUTOMATION_MANAGER, automationIntelligenceModule } from './module.js';
export { AutomationFramer } from './framing.js';
export { AutomationHash } from './hash.js';
export { AutomationNormalizer } from './normalizer.js';
export { AutomationError } from './errors.js';
export { AUTOMATION_CAPABILITIES, isAutomationCapability } from './capabilities.js';
export { AUTOMATION_AGENT } from './agent.js';
export { automationEvaluationRequest } from './evaluation.js';
export { automationRequestFromWorkflow } from './integration.js';
export type { AutomationFraming } from './integration.js';

export type {
  AutomationCapability,
  AutomationRequest,
  AutomationPlan,
  AutomationStatistics,
} from './types.js';
