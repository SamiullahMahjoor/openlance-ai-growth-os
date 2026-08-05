/**
 * Evaluation normalization: it settles a name (a metric, a benchmark, or a subject reference) to a consistent structural
 * form (collapsing whitespace, trimming, and lowercasing), so names formed from the same text match deterministically. It
 * settles structure only; it never alters meaning or infers content.
 */
export class EvaluationNormalizer {
  /** Normalize a name to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
  }
}
