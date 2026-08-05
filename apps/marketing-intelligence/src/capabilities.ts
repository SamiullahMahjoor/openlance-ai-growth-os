import type { MarketingCapability } from './types.js';

/**
 * The marketing-intelligence capabilities, as behaviors the subsystem frames. Each names a marketing behavior the AI
 * performs by consuming knowledge; none is a marketing strategy, which is owned by knowledge/marketing/. Frozen, closed.
 */
export const MARKETING_CAPABILITIES: readonly MarketingCapability[] = Object.freeze([
  'market-research',
  'icp-discovery',
  'competitor-analysis',
  'positioning',
  'messaging',
  'offer-strategy',
  'funnel-strategy',
  'campaign-planning',
  'gtm-planning',
  'recommendation',
  'evaluation',
]);

/** Whether a value names a known marketing capability. Zero-trust: an unrecognized capability is never framed. */
export const isMarketingCapability = (value: string): value is MarketingCapability =>
  (MARKETING_CAPABILITIES as readonly string[]).includes(value);
