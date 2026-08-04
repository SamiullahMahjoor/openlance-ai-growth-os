/**
 * Prompt normalization: it settles the composed prompt to a consistent structural form (collapsing
 * runs of spaces, trimming trailing spaces per line, collapsing blank-line runs, and trimming the ends),
 * so prompts assembled from the same kind of parts have the same form. It settles structure only; it
 * never alters referenced content or invents content, and it defines no format or template language.
 */
export class PromptNormalizer {
  /** Normalize composed content to a consistent structural form. */
  normalize(content: string): string {
    return content
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
