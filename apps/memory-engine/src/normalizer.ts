/**
 * Memory normalization: it settles a record's content to a consistent structural form (collapsing runs of
 * spaces, trimming trailing spaces per line, collapsing blank-line runs, and trimming the ends), so
 * records formed from the same kind of content have the same form. It settles structure only; it never
 * alters meaning, invents content, or promotes anything to truth.
 */
export class MemoryNormalizer {
  /** Normalize a record's content to a consistent structural form. */
  normalize(content: string): string {
    return content
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
