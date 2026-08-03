/**
 * Tool compatibility: whether a tool is compatible with a need, and whether a tool version is compatible
 * with a consumer (ai/tools/tool-compatibility.md, OL-AI-TOOLS-TOOL-COMPATIBILITY).
 *
 * The Specification enumerates a closed set of the two kinds of compatibility the model owns: capability
 * compatibility (a tool against a need) and version compatibility (a version against a consumer). This
 * module owns the compatibility relation; the evolution and version rules are owned by
 * ai/tools/tool-versioning.md and the declaration of capabilities by ai/tools/tool-capabilities.md,
 * referenced not restated. The kinds carry no ordering and no predicate; this module is their immutable
 * definition, and interchangeability and explicit incompatibility are stated in the principles and
 * invariants (ADR-0020).
 */

/**
 * A tool-compatibility principle: a permanent rule the compatibility model upholds, each instantiating a
 * tool invariant (ai/tools/tool-compatibility.md, "Principles").
 */
export type ToolCompatibilityPrinciple =
  | 'compatibility-is-a-defined-relation'
  | 'compatibility-rests-on-declared-capabilities'
  | 'compatibility-is-neutral'
  | 'incompatibility-is-explicit';

/** The tool-compatibility principles, in constitutional order; frozen. */
export const TOOL_COMPATIBILITY_PRINCIPLES: readonly ToolCompatibilityPrinciple[] = Object.freeze([
  'compatibility-is-a-defined-relation',
  'compatibility-rests-on-declared-capabilities',
  'compatibility-is-neutral',
  'incompatibility-is-explicit',
]);

/** What each tool-compatibility principle requires (ai/tools/tool-compatibility.md, "Principles"). */
export const TOOL_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolCompatibilityPrinciple, string>
> = Object.freeze({
  'compatibility-is-a-defined-relation':
    'A tool is compatible with a need, or a version with a consumer, by a defined relation, never by assumption.',
  'compatibility-rests-on-declared-capabilities':
    "A tool is compatible with a need when its declared capabilities, owned by ai/tools/tool-capabilities.md, satisfy the need's requirements.",
  'compatibility-is-neutral':
    'Compatibility is judged in technology-neutral terms, so any compatible tool is interchangeable with another for the need.',
  'incompatibility-is-explicit':
    'An incompatible tool or version is identified as such, so an unsuitable tool is never used and a broken version is never assumed compatible.',
});

/**
 * A tool-compatibility kind: one of the two compatibility relations the model owns, in constitutional
 * listing order (ai/tools/tool-compatibility.md, "Specification"). The set is unordered.
 */
export type ToolCompatibilityKind = 'capability' | 'version';

/** The two kinds of tool compatibility, in constitutional listing order; frozen. */
export const TOOL_COMPATIBILITY_KINDS: readonly ToolCompatibilityKind[] = Object.freeze([
  'capability',
  'version',
]);

/** What each tool-compatibility kind is (ai/tools/tool-compatibility.md, "Specification"). */
export const TOOL_COMPATIBILITY_KIND_DESCRIPTIONS: Readonly<Record<ToolCompatibilityKind, string>> =
  Object.freeze({
    capability:
      "A tool is compatible with a need when the capabilities it declares under ai/tools/tool-capabilities.md satisfy the need's requirements; selection under ai/tools/tool-selection.md chooses only among compatible tools, and this document owns what compatible means and never chooses.",
    version:
      "A tool version is compatible with a consumer when the consumer's requirements still hold against that version; a change that keeps them holding is compatible, and a change that breaks them is incompatible and is versioned and migrated under ai/tools/tool-versioning.md.",
  });

/**
 * A tool-compatibility invariant: a guarantee the compatibility model always upholds
 * (ai/tools/tool-compatibility.md, "Invariants").
 */
export type ToolCompatibilityInvariant =
  | 'compatible-with-need-only-when-capabilities-satisfy-requirements'
  | 'version-compatible-only-when-consumer-requirements-hold'
  | 'compatible-tools-interchangeable-for-need'
  | 'incompatible-identified-never-used-as-compatible'
  | 'determining-compatibility-is-inert';

/** The tool-compatibility invariants, in constitutional order; frozen. */
export const TOOL_COMPATIBILITY_INVARIANTS: readonly ToolCompatibilityInvariant[] = Object.freeze([
  'compatible-with-need-only-when-capabilities-satisfy-requirements',
  'version-compatible-only-when-consumer-requirements-hold',
  'compatible-tools-interchangeable-for-need',
  'incompatible-identified-never-used-as-compatible',
  'determining-compatibility-is-inert',
]);

/** What each tool-compatibility invariant guarantees (ai/tools/tool-compatibility.md, "Invariants"). */
export const TOOL_COMPATIBILITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolCompatibilityInvariant, string>
> = Object.freeze({
  'compatible-with-need-only-when-capabilities-satisfy-requirements':
    "A tool is compatible with a need only when its declared capabilities satisfy the need's requirements.",
  'version-compatible-only-when-consumer-requirements-hold':
    "A version is compatible with a consumer only when the consumer's requirements still hold against it.",
  'compatible-tools-interchangeable-for-need':
    'Tools compatible with the same need are interchangeable for it.',
  'incompatible-identified-never-used-as-compatible':
    'An incompatible tool or version is identified as such and never used as if compatible.',
  'determining-compatibility-is-inert':
    'Determining compatibility never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
