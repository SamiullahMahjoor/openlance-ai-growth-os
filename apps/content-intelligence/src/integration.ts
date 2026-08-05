import type { MarketingBrief } from '@openlance/aios-marketing-intelligence';

import type { ContentCapability, ContentRequest } from './types.js';

/** The content framing supplied alongside a Marketing Intelligence output to build a content request. */
export interface ContentFraming {
  readonly capability: ContentCapability;
  readonly objective: string;
  readonly agent: string;
  readonly brandVoice: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build a content request from a Marketing Intelligence output, consuming the marketing direction by reference through
 * its public `MarketingBrief` contract (the brief id). Content consumes the marketing output; it never owns marketing
 * strategy. This is a pure translation; it frames nothing and decides nothing.
 */
export const contentRequestFromMarketing = (
  brief: MarketingBrief,
  framing: ContentFraming,
): ContentRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  marketing: brief.id,
  brandVoice: framing.brandVoice,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
