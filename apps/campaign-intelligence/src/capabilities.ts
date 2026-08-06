import type { CampaignCapability } from './types.js';

/**
 * The campaign planning capabilities, as behaviors the subsystem frames. Each names a cross-channel campaign planning
 * behavior the AI performs by consuming the upstream growth plans and knowledge; none creates marketing strategy,
 * content, SEO, social, or analytics, and none executes or schedules a campaign. `campaign-orchestration-planning` and
 * `campaign-plan-evaluation` are named distinctly from the frozen Marketing `campaign-planning` and Social
 * `campaign-evaluation` so the disjointness boundary holds. Frozen, closed.
 */
export const CAMPAIGN_CAPABILITIES: readonly CampaignCapability[] = Object.freeze([
  'campaign-orchestration-planning',
  'launch-planning',
  'multi-channel-planning',
  'funnel-planning',
  'audience-sequencing',
  'lifecycle-planning',
  'budget-recommendations',
  'experiment-planning',
  'optimization-planning',
  'campaign-plan-evaluation',
]);

/** Whether a value names a known campaign capability. Zero-trust: an unrecognized capability is never framed. */
export const isCampaignCapability = (value: string): value is CampaignCapability =>
  (CAMPAIGN_CAPABILITIES as readonly string[]).includes(value);
