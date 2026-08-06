import type { SeoPlan } from '@openlance/aios-seo-intelligence';

import type { SocialCapability, SocialRequest } from './types.js';

/** The social framing supplied alongside an SEO Intelligence output to build a social request. */
export interface SocialFraming {
  readonly capability: SocialCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build a social request from an SEO Intelligence output, consuming the SEO plan and, through it, the content plan and
 * marketing direction by reference through the public `SeoPlan` contract (the SEO plan id and its own content and
 * marketing references). Social consumes the SEO, content, and marketing outputs; it never owns any of them and never
 * authors content. This is a pure translation; it frames nothing and decides nothing. It is the `SEO -> Social` step of
 * the growth chain.
 */
export const socialRequestFromSeo = (plan: SeoPlan, framing: SocialFraming): SocialRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  marketing: plan.marketing,
  content: plan.content,
  seo: plan.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
