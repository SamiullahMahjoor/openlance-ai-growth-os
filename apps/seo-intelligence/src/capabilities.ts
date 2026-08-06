import type { SeoCapability } from './types.js';

/**
 * The SEO capabilities, as behaviors the subsystem frames. Each names an SEO behavior the AI performs by consuming a
 * marketing direction, a content plan, and knowledge by reference; none is marketing strategy, content creation, or a
 * social behavior, and none is business truth. Frozen, closed.
 */
export const SEO_CAPABILITIES: readonly SeoCapability[] = Object.freeze([
  'keyword-research',
  'search-intent-analysis',
  'topical-clustering',
  'semantic-clustering',
  'content-gap-analysis',
  'technical-seo-planning',
  'on-page-optimization-planning',
  'internal-linking-strategy',
  'schema-recommendations',
  'serp-opportunity-analysis',
  'backlink-opportunity-recommendations',
  'seo-roadmap-planning',
  'seo-evaluation',
]);

/** Whether a value names a known SEO capability. Zero-trust: an unrecognized capability is never framed. */
export const isSeoCapability = (value: string): value is SeoCapability =>
  (SEO_CAPABILITIES as readonly string[]).includes(value);
