/**
 * Governance normalization: it settles a subject or capability name to a consistent structural form (collapsing runs of
 * whitespace to a single space and trimming the ends), so grants and decisions formed from the same kind of input have
 * the same form. It settles structure only; it never alters meaning, restates a governance rule, or infers content.
 */
export class GovernanceNormalizer {
  /** Normalize a subject or capability name to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
