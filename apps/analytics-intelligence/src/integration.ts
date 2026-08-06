import type { SocialPlan } from '@openlance/aios-social-intelligence';

import type { AnalyticsCapability, AnalyticsRequest } from './types.js';

/** The analytics framing supplied alongside a Social Intelligence output to build an analytics request. */
export interface AnalyticsFraming {
  readonly capability: AnalyticsCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build an analytics request from a Social Intelligence output, consuming the social plan and, through it, the SEO,
 * content, and marketing references by reference through the public `SocialPlan` contract (the social plan id and its own
 * seo, content, and marketing references). Analytics consumes the social, SEO, content, and marketing outputs; it never
 * owns any of them. This is a pure translation; it frames nothing and decides nothing. It is the `Social -> Analytics`
 * step of the growth chain.
 */
export const analyticsRequestFromSocial = (
  plan: SocialPlan,
  framing: AnalyticsFraming,
): AnalyticsRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  marketing: plan.marketing,
  content: plan.content,
  seo: plan.seo,
  social: plan.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
