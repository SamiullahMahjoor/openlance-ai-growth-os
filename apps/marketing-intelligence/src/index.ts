/**
 * @packageDocumentation
 * `@openlance/aios-marketing-intelligence`
 *
 * The AIOS Marketing Intelligence subsystem (Phase 5, Stage 1): the first AI Growth OS Feature, a deterministic domain
 * subsystem that owns the marketing-intelligence behavior only (ADR-0049). It consumes knowledge-owned marketing
 * strategy, brand, customer, competitor, product, and company truth by canonical reference, and frames a governed
 * platform task: an immutable `MarketingBrief` carrying the frozen Agent Engine `AgentRequest` (retrieval, prompt, and
 * provider steps), plus a marketing `EvaluationRequest` for the frozen Evaluation Engine. It is deterministic and
 * fail-closed; it never owns, redefines, or writes business truth, never executes, invokes a provider, selects a model,
 * authorizes, or decides, and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `MARKETING_MANAGER`.
 */

export { MarketingIntelligence } from './manager.js';
export { MARKETING_MANAGER, marketingIntelligenceModule } from './module.js';
export { MarketingFramer } from './framing.js';
export { MarketingHash } from './hash.js';
export { MarketingNormalizer } from './normalizer.js';
export { MarketingError } from './errors.js';
export { MARKETING_CAPABILITIES, isMarketingCapability } from './capabilities.js';
export { MARKETING_AGENT } from './agent.js';
export { marketingEvaluationRequest } from './evaluation.js';

export type {
  MarketingCapability,
  MarketingRequest,
  MarketingBrief,
  MarketingStatistics,
} from './types.js';
