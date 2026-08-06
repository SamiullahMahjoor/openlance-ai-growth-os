/**
 * Analytics normalization: it settles free text (an objective, an agent id, a reference) to a consistent structural form
 * (collapsing whitespace and trimming), so equivalent text frames the same plan deterministically. Zero-trust: a
 * non-string settles to the empty string, never throwing. It settles structure only; it never alters meaning.
 */
export class AnalyticsNormalizer {
  /** Normalize a value to a consistent structural form; a non-string settles to the empty string. */
  normalize(value: unknown): string {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
  }
}
