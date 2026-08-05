/**
 * Reasoning normalization: it settles a statement, task, part, or assumption to a consistent structural form
 * (collapsing runs of whitespace to a single space and trimming the ends), so reasonings formed from the same kind of
 * input have the same form. It settles structure only; it never alters meaning, restates business truth, or infers
 * content.
 */
export class ReasoningNormalizer {
  /** Normalize a statement, task, part, or assumption to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
