import type { SocialCapability } from './types.js';

/**
 * The social-media capabilities, as behaviors the subsystem frames. Each names a social behavior the AI performs by
 * planning distribution and engagement across social platforms; none authors content, sets marketing strategy, or is a
 * business truth, and none schedules, posts, or publishes (a schedule or calendar is framed as a recommendation, never
 * executed). Frozen, closed.
 */
export const SOCIAL_CAPABILITIES: readonly SocialCapability[] = Object.freeze([
  'platform-strategy',
  'post-planning',
  'campaign-framing',
  'content-calendar',
  'audience-engagement-recommendations',
  'hashtag-planning',
  'posting-schedule-recommendations',
  'community-growth-recommendations',
  'influencer-collaboration-planning',
  'platform-specific-adaptation',
  'campaign-evaluation',
]);

/** Whether a value names a known social capability. Zero-trust: an unrecognized capability is never framed. */
export const isSocialCapability = (value: string): value is SocialCapability =>
  (SOCIAL_CAPABILITIES as readonly string[]).includes(value);
