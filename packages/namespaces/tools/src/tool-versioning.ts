/**
 * Tool versioning: how a tool definition is versioned, evolves, migrates, and is deprecated
 * (ai/tools/tool-versioning.md, OL-AI-TOOLS-TOOL-VERSIONING).
 *
 * The Specification enumerates a closed set of the four aspects of tool versioning: version rules,
 * evolution, migration, and deprecation. This module owns tool versioning; the compatibility a version
 * preserves is owned by ai/tools/tool-compatibility.md, the permission to change by
 * ai/governance/change-governance.md (applied not restated), and the amendment workflow by
 * ai/CONTRIBUTING.md. The aspects carry no ordering and no predicate; this module is their immutable
 * definition (ADR-0020).
 */

/**
 * A tool-versioning principle: a permanent rule tool versioning upholds, each instantiating a tool
 * invariant (ai/tools/tool-versioning.md, "Principles").
 */
export type ToolVersioningPrinciple =
  | 'a-tool-definition-is-versioned'
  | 'change-is-governed'
  | 'compatibility-is-preserved-or-migrated'
  | 'churn-is-absorbed-here-not-in-the-foundations';

/** The tool-versioning principles, in constitutional order; frozen. */
export const TOOL_VERSIONING_PRINCIPLES: readonly ToolVersioningPrinciple[] = Object.freeze([
  'a-tool-definition-is-versioned',
  'change-is-governed',
  'compatibility-is-preserved-or-migrated',
  'churn-is-absorbed-here-not-in-the-foundations',
]);

/** What each tool-versioning principle requires (ai/tools/tool-versioning.md, "Principles"). */
export const TOOL_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolVersioningPrinciple, string>
> = Object.freeze({
  'a-tool-definition-is-versioned':
    'A tool and its declared capabilities carry a version, so a change is identified and traceable.',
  'change-is-governed':
    'A tool definition evolves only under the change rules owned by ai/governance/, never arbitrarily.',
  'compatibility-is-preserved-or-migrated':
    'A change that preserves compatibility is absorbed; a change that breaks it is versioned and migrated, so no consumer is silently broken.',
  'churn-is-absorbed-here-not-in-the-foundations':
    'Tool change is absorbed by the tool model, so no foundational document is amended by operational churn.',
});

/**
 * A tool-versioning aspect: one of the aspects of how a tool definition is versioned and evolves, in
 * constitutional listing order (ai/tools/tool-versioning.md, "Specification"). The set is unordered.
 */
export type ToolVersioningAspect = 'version-rules' | 'evolution' | 'migration' | 'deprecation';

/** The four aspects of tool versioning, in constitutional listing order; frozen. */
export const TOOL_VERSIONING_ASPECTS: readonly ToolVersioningAspect[] = Object.freeze([
  'version-rules',
  'evolution',
  'migration',
  'deprecation',
]);

/** What each tool-versioning aspect is (ai/tools/tool-versioning.md, "Specification"). */
export const TOOL_VERSIONING_ASPECT_DESCRIPTIONS: Readonly<Record<ToolVersioningAspect, string>> =
  Object.freeze({
    'version-rules':
      'A tool definition or a capability declaration carries a version that identifies it, so a change is explicit and traceable, and the consumers that depend on it can be determined through the compatibility owned by ai/tools/tool-compatibility.md.',
    evolution:
      'A tool definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the tool model grows and new tools are absorbed without redesign; evolution never rewrites business truth and never alters the outside system a tool interacts with.',
    migration:
      'A change that breaks compatibility, judged under ai/tools/tool-compatibility.md, is issued as a new version and migrated deliberately: consumers and compositions are moved to it in a controlled way, so there is never a window in which a consumer relies on an incompatible tool.',
    deprecation:
      'A superseded tool definition or version is deprecated rather than abruptly removed, and it continues to serve compatible consumers until each is migrated, after which the tool is retired under ai/tools/tool-lifecycle.md; deprecation never breaks a consumer or a composition that has not yet migrated.',
  });

/**
 * A tool-versioning invariant: a guarantee tool versioning always upholds (ai/tools/tool-versioning.md,
 * "Invariants").
 */
export type ToolVersioningInvariant =
  | 'a-tool-definition-carries-a-version'
  | 'evolves-only-under-governed-change'
  | 'compatibility-breaking-change-versioned-and-migrated-never-silent'
  | 'deprecated-tool-serves-compatible-consumers-until-migrated'
  | 'versioning-a-tool-is-inert';

/** The tool-versioning invariants, in constitutional order; frozen. */
export const TOOL_VERSIONING_INVARIANTS: readonly ToolVersioningInvariant[] = Object.freeze([
  'a-tool-definition-carries-a-version',
  'evolves-only-under-governed-change',
  'compatibility-breaking-change-versioned-and-migrated-never-silent',
  'deprecated-tool-serves-compatible-consumers-until-migrated',
  'versioning-a-tool-is-inert',
]);

/** What each tool-versioning invariant guarantees (ai/tools/tool-versioning.md, "Invariants"). */
export const TOOL_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolVersioningInvariant, string>
> = Object.freeze({
  'a-tool-definition-carries-a-version':
    'A tool definition carries a version, so a change to it is explicit and traceable.',
  'evolves-only-under-governed-change':
    'A tool definition evolves only under the governed change rules.',
  'compatibility-breaking-change-versioned-and-migrated-never-silent':
    'A change that breaks compatibility is versioned and migrated, never applied silently.',
  'deprecated-tool-serves-compatible-consumers-until-migrated':
    'A deprecated tool continues to serve compatible consumers until each is migrated.',
  'versioning-a-tool-is-inert':
    'Versioning a tool never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
