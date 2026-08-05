import type { ContentCapability } from './types.js';

/**
 * The content-creation capabilities, as behaviors the subsystem frames. Each names a content behavior the AI performs by
 * consuming a marketing direction and the brand voice; none is a marketing strategy or a brand standard. Frozen, closed.
 */
export const CONTENT_CAPABILITIES: readonly ContentCapability[] = Object.freeze([
  'blog',
  'landing-page',
  'website-copy',
  'product-copy',
  'email-campaign',
  'newsletter',
  'case-study',
  'documentation',
  'knowledge-article',
  'rewrite',
  'tone-adaptation',
]);

/** Whether a value names a known content capability. Zero-trust: an unrecognized capability is never framed. */
export const isContentCapability = (value: string): value is ContentCapability =>
  (CONTENT_CAPABILITIES as readonly string[]).includes(value);
