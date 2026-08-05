/**
 * Tool normalization: it settles a capability, parameter, or requested-capability name to a consistent structural form
 * (collapsing runs of whitespace to a single space and trimming the ends), so a declared name and the name a request
 * asks for match regardless of incidental whitespace. It settles the structure of names only; it never alters an
 * argument value, restates business truth, or infers content.
 */
export class ToolNormalizer {
  /** Normalize a capability, parameter, or requested-capability name to a consistent structural form. */
  normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
