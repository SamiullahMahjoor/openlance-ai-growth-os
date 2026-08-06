/**
 * @packageDocumentation
 * `@openlance/aios-social-intelligence`
 *
 * The AIOS Social Intelligence subsystem (Phase 5, Stage 4): the fourth AI Growth OS Feature, a deterministic domain
 * subsystem that owns the social-media behavior only (ADR-0052). It is the `SEO -> Social` step of the growth chain: it
 * consumes an SEO Intelligence output and, through it, the content plan and marketing direction (all by reference), plus
 * knowledge by reference, and frames a governed social task: an immutable `SocialPlan` carrying the frozen Agent Engine
 * `AgentRequest` (prompt and provider steps), plus a social-quality `EvaluationRequest` for the frozen Evaluation Engine.
 * It is deterministic and fail-closed; it never owns marketing, content, or brand truth, never executes, publishes,
 * schedules, posts, calls an API, invokes a provider, selects a model, authorizes, or decides, and builds no new platform
 * infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `SOCIAL_MANAGER`.
 */

export { SocialIntelligence } from './manager.js';
export { SOCIAL_MANAGER, socialIntelligenceModule } from './module.js';
export { SocialFramer } from './framing.js';
export { SocialHash } from './hash.js';
export { SocialNormalizer } from './normalizer.js';
export { SocialError } from './errors.js';
export { SOCIAL_CAPABILITIES, isSocialCapability } from './capabilities.js';
export { SOCIAL_AGENT } from './agent.js';
export { socialEvaluationRequest } from './evaluation.js';
export { socialRequestFromSeo } from './integration.js';
export type { SocialFraming } from './integration.js';

export type { SocialCapability, SocialRequest, SocialPlan, SocialStatistics } from './types.js';
