/**
 * @packageDocumentation
 * `@openlance/aios-analytics-intelligence`
 *
 * The AIOS Analytics Intelligence subsystem (Phase 5, Stage 5): the fifth AI Growth OS Feature, a deterministic domain
 * subsystem that owns the analytics behavior only (ADR-0053). It is the `Social -> Analytics` step of the growth chain:
 * it consumes a Social Intelligence output and, through it, the SEO, content, and marketing references (all by
 * reference), plus knowledge by reference, and frames a governed analytics task: an immutable `AnalyticsPlan` carrying
 * the frozen Agent Engine `AgentRequest` (prompt and provider steps), plus an analytics-quality `EvaluationRequest` for
 * the frozen Evaluation Engine. It is deterministic and fail-closed; it never owns business truth, never executes,
 * invokes a provider, selects a model, evaluates, decides, orchestrates, or schedules, and builds no new platform
 * infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `ANALYTICS_MANAGER`.
 */

export { AnalyticsIntelligence } from './manager.js';
export { ANALYTICS_MANAGER, analyticsIntelligenceModule } from './module.js';
export { AnalyticsFramer } from './framing.js';
export { AnalyticsHash } from './hash.js';
export { AnalyticsNormalizer } from './normalizer.js';
export { AnalyticsError } from './errors.js';
export { ANALYTICS_CAPABILITIES, isAnalyticsCapability } from './capabilities.js';
export { ANALYTICS_AGENT } from './agent.js';
export { analyticsEvaluationRequest } from './evaluation.js';
export { analyticsRequestFromSocial } from './integration.js';
export type { AnalyticsFraming } from './integration.js';

export type {
  AnalyticsCapability,
  AnalyticsRequest,
  AnalyticsPlan,
  AnalyticsStatistics,
} from './types.js';
