/**
 * @packageDocumentation
 * `@openlance/aios-campaign-intelligence`
 *
 * The AIOS Campaign Intelligence subsystem (Phase 5, Stage 6): the sixth AI Growth OS Feature, a deterministic domain
 * subsystem that owns the campaign planning behavior only (ADR-0054). It is the final `Analytics -> Campaign` step of the
 * growth chain: it consumes an Analytics Intelligence output and, through it, the social, SEO, content, and marketing
 * references (all by reference), plus knowledge by reference, and frames a governed campaign task: an immutable
 * `CampaignPlan` carrying the frozen Agent Engine `AgentRequest` (prompt and provider steps), plus a campaign-quality
 * `EvaluationRequest` for the frozen Evaluation Engine. It is deterministic and fail-closed; it never creates marketing
 * strategy, content, SEO, social, or analytics, never executes, schedules, invokes a provider, orchestrates, or decides,
 * and builds no new platform infrastructure.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `CAMPAIGN_MANAGER`.
 */

export { CampaignIntelligence } from './manager.js';
export { CAMPAIGN_MANAGER, campaignIntelligenceModule } from './module.js';
export { CampaignFramer } from './framing.js';
export { CampaignHash } from './hash.js';
export { CampaignNormalizer } from './normalizer.js';
export { CampaignError } from './errors.js';
export { CAMPAIGN_CAPABILITIES, isCampaignCapability } from './capabilities.js';
export { CAMPAIGN_AGENT } from './agent.js';
export { campaignEvaluationRequest } from './evaluation.js';
export { campaignRequestFromAnalytics } from './integration.js';
export type { CampaignFraming } from './integration.js';

export type {
  CampaignCapability,
  CampaignRequest,
  CampaignPlan,
  CampaignStatistics,
} from './types.js';
