import type { AnalyticsCapability } from './types.js';

/**
 * The analytics capabilities, as behaviors the subsystem frames. Each names an analytics behavior the AI performs by
 * consuming the upstream growth plans and knowledge; none is marketing strategy, content, an SEO or social behavior, or
 * business truth, and none performs or scores an evaluation. Frozen, closed.
 */
export const ANALYTICS_CAPABILITIES: readonly AnalyticsCapability[] = Object.freeze([
  'kpi-planning',
  'funnel-analysis',
  'attribution-planning',
  'conversion-analysis',
  'event-planning',
  'dashboard-framing',
  'metric-recommendation',
  'performance-interpretation',
  'cohort-analysis',
  'retention-planning',
  'experiment-recommendation',
  'analytics-evaluation',
]);

/** Whether a value names a known analytics capability. Zero-trust: an unrecognized capability is never framed. */
export const isAnalyticsCapability = (value: string): value is AnalyticsCapability =>
  (ANALYTICS_CAPABILITIES as readonly string[]).includes(value);
