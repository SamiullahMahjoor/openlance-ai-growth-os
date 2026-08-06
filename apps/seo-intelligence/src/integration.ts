import type { ContentPlan } from '@openlance/aios-content-intelligence';

import type { SeoCapability, SeoRequest } from './types.js';

/** The SEO framing supplied alongside a Content Intelligence output to build an SEO request. */
export interface SeoFraming {
  readonly capability: SeoCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build an SEO request from a Content Intelligence output, consuming the content plan and its marketing direction by
 * reference through the public `ContentPlan` contract (the content plan id and its own marketing reference). SEO consumes
 * the content and marketing outputs; it never owns content or marketing strategy. This is a pure translation; it frames
 * nothing and decides nothing. It is the `Content -> SEO` step of the growth chain.
 */
export const seoRequestFromContent = (plan: ContentPlan, framing: SeoFraming): SeoRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  marketing: plan.marketing,
  content: plan.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
