/**
 * Marketing normalization: it settles free text (an objective, an agent id) to a consistent structural form (collapsing
 * whitespace and trimming), so equivalent text frames the same brief deterministically. Zero-trust: a non-string settles
 * to the empty string, never throwing. It settles structure only; it never alters meaning or infers content.
 */
export class MarketingNormalizer {
  /** Normalize a value to a consistent structural form; a non-string settles to the empty string. */
  normalize(value: unknown): string {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
  }
}
