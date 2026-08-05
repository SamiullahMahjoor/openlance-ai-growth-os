/**
 * Agent normalization: it settles a task or specialization to a consistent structural form (collapsing runs of
 * whitespace to a single space and trimming the ends), so agents and plans formed from the same kind of input have the
 * same form. It settles structure only; it never alters meaning, restates business truth, or infers content.
 */
export class AgentNormalizer {
  /** Normalize a task or specialization to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
