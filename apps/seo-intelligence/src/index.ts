/**
 * @packageDocumentation
 * `@openlance/aios-seo-intelligence`
 *
 * The AIOS SEO Intelligence subsystem (Phase 5, Stage 3): the third AI Growth OS Feature, a deterministic domain
 * subsystem that owns the SEO behavior only (ADR-0051). It is the `Content -> SEO` step of the growth chain: it consumes
 * a Marketing Intelligence direction and a Content Intelligence output (both by reference, the latter carrying the
 * former), plus knowledge by reference, and frames a governed SEO task: an immutable `SeoPlan` carrying the frozen Agent
 * Engine `AgentRequest` (prompt and provider steps), plus an SEO-quality `EvaluationRequest` for the frozen Evaluation
 * Engine. It is deterministic and fail-closed; it never owns business truth, never executes, invokes a provider, selects
 * a model, retrieves, crawls, indexes, scores, or decides, and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `SEO_MANAGER`.
 */

export { SeoIntelligence } from './manager.js';
export { SEO_MANAGER, seoIntelligenceModule } from './module.js';
export { SeoFramer } from './framing.js';
export { SeoHash } from './hash.js';
export { SeoNormalizer } from './normalizer.js';
export { SeoError } from './errors.js';
export { SEO_CAPABILITIES, isSeoCapability } from './capabilities.js';
export { SEO_AGENT } from './agent.js';
export { seoEvaluationRequest } from './evaluation.js';
export { seoRequestFromContent } from './integration.js';
export type { SeoFraming } from './integration.js';

export type { SeoCapability, SeoRequest, SeoPlan, SeoStatistics } from './types.js';
