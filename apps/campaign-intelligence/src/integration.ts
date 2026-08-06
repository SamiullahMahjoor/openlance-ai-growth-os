import type { AnalyticsPlan } from '@openlance/aios-analytics-intelligence';

import type { CampaignCapability, CampaignRequest } from './types.js';

/** The campaign framing supplied alongside an Analytics Intelligence output to build a campaign request. */
export interface CampaignFraming {
  readonly capability: CampaignCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build a campaign request from an Analytics Intelligence output, consuming the analytics plan and, through it, the
 * social, SEO, content, and marketing references by reference through the public `AnalyticsPlan` contract (the analytics
 * plan id and its own social, seo, content, and marketing references). Campaign consumes the analytics, social, SEO,
 * content, and marketing outputs; it never owns any of them and never creates any of them. This is a pure translation; it
 * frames nothing and decides nothing. It is the final `Analytics -> Campaign` step of the growth chain.
 */
export const campaignRequestFromAnalytics = (
  plan: AnalyticsPlan,
  framing: CampaignFraming,
): CampaignRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  marketing: plan.marketing,
  content: plan.content,
  seo: plan.seo,
  social: plan.social,
  analytics: plan.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
