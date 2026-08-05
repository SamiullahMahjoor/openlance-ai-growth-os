/**
 * @packageDocumentation
 * `@openlance/aios-content-intelligence`
 *
 * The AIOS Content Intelligence subsystem (Phase 5, Stage 2): the second AI Growth OS Feature, a deterministic domain
 * subsystem that owns the content-creation behavior only (ADR-0050). It consumes a Marketing Intelligence output and the
 * brand voice by reference, and frames a governed content-generation task: an immutable `ContentPlan` carrying the frozen
 * Agent Engine `AgentRequest` (prompt and provider steps), plus a content-quality `EvaluationRequest` for the frozen
 * Evaluation Engine. It is deterministic and fail-closed; it never owns marketing strategy or brand truth, never
 * executes, invokes a provider, selects a model, authorizes, or decides, and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `CONTENT_MANAGER`.
 */

export { ContentIntelligence } from './manager.js';
export { CONTENT_MANAGER, contentIntelligenceModule } from './module.js';
export { ContentFramer } from './framing.js';
export { ContentHash } from './hash.js';
export { ContentNormalizer } from './normalizer.js';
export { ContentError } from './errors.js';
export { CONTENT_CAPABILITIES, isContentCapability } from './capabilities.js';
export { CONTENT_AGENT } from './agent.js';
export { contentEvaluationRequest } from './evaluation.js';
export { contentRequestFromMarketing } from './integration.js';
export type { ContentFraming } from './integration.js';

export type { ContentCapability, ContentRequest, ContentPlan, ContentStatistics } from './types.js';
