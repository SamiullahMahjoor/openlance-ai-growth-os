/**
 * Safety normalization: it settles a scope, capability, or token name to a consistent structural form (collapsing runs
 * of whitespace to a single space, trimming the ends, and lowercasing), so a policy entry and a plan element formed from
 * the same text match deterministically. It settles structure only; it never alters meaning, restates a safety rule, or
 * infers content.
 */
export class SafetyNormalizer {
  /** Normalize a scope, capability, or token name to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
  }
}
