/**
 * Tool capabilities: capability declaration and capability inheritance (ai/tools/tool-capabilities.md,
 * OL-AI-TOOLS-TOOL-CAPABILITIES).
 *
 * The Specification narrates the capability model as heterogeneous facets (capability declaration,
 * capability inheritance, neutral description, capabilities against need), not a closed taxonomy the model
 * refers to by identity, so this concern is definitions only (principles and invariants), consistent with
 * the modeling rule recorded in docs/implementation/13-retrieval.md section 4. Capability inheritance
 * resolves overlaps by higher authority, then single owner, then specificity - applying the Authority
 * Hierarchy owned by ai/README.md and the ownership owned by ai/architecture/ - and is stated as prose,
 * never recreated as an executable precedence (referenced-model non-restatement; ADR-0025). Whether a
 * capability matches a need is owned by ai/tools/tool-compatibility.md and the interaction it carries out by
 * ai/tools/tool-execution.md (ADR-0020).
 */

/**
 * A tool-capabilities principle: a permanent rule the capability model upholds, each instantiating a tool
 * invariant (ai/tools/tool-capabilities.md, "Principles").
 */
export type ToolCapabilitiesPrinciple =
  | 'a-capability-is-a-declared-ability'
  | 'a-capability-describes-it-does-not-act'
  | 'capabilities-are-neutral'
  | 'capability-inheritance-is-single-and-acyclic';

/** The tool-capabilities principles, in constitutional order; frozen. */
export const TOOL_CAPABILITIES_PRINCIPLES: readonly ToolCapabilitiesPrinciple[] = Object.freeze([
  'a-capability-is-a-declared-ability',
  'a-capability-describes-it-does-not-act',
  'capabilities-are-neutral',
  'capability-inheritance-is-single-and-acyclic',
]);

/** What each tool-capabilities principle requires (ai/tools/tool-capabilities.md, "Principles"). */
export const TOOL_CAPABILITIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolCapabilitiesPrinciple, string>
> = Object.freeze({
  'a-capability-is-a-declared-ability':
    'A tool declares what it can do, so its abilities are explicit and never assumed.',
  'a-capability-describes-it-does-not-act':
    'A capability names an ability of the tool; the interaction it carries out is performed only on execution, under ai/tools/tool-execution.md.',
  'capabilities-are-neutral':
    'A capability is described in technology-neutral terms, so it is comparable across tools without naming any provider, technology, or outside system.',
  'capability-inheritance-is-single-and-acyclic':
    'A capability inherited from a base tool resolves through a single, acyclic inheritance, so capabilities never conflict or cycle.',
});

/**
 * A tool-capabilities invariant: a guarantee the capability model always upholds
 * (ai/tools/tool-capabilities.md, "Invariants").
 */
export type ToolCapabilitiesInvariant =
  | 'offers-only-declared-capabilities-never-selected-for-undeclared'
  | 'a-capability-names-an-ability-never-performs-the-interaction'
  | 'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity'
  | 'capabilities-described-technology-neutral'
  | 'declaring-capabilities-is-inert';

/** The tool-capabilities invariants, in constitutional order; frozen. */
export const TOOL_CAPABILITIES_INVARIANTS: readonly ToolCapabilitiesInvariant[] = Object.freeze([
  'offers-only-declared-capabilities-never-selected-for-undeclared',
  'a-capability-names-an-ability-never-performs-the-interaction',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity',
  'capabilities-described-technology-neutral',
  'declaring-capabilities-is-inert',
]);

/** What each tool-capabilities invariant guarantees (ai/tools/tool-capabilities.md, "Invariants"). */
export const TOOL_CAPABILITIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolCapabilitiesInvariant, string>
> = Object.freeze({
  'offers-only-declared-capabilities-never-selected-for-undeclared':
    'A tool offers only its declared capabilities, and is never selected for an undeclared one.',
  'a-capability-names-an-ability-never-performs-the-interaction':
    'A capability names an ability of the tool and never performs the interaction, which occurs on execution.',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity':
    'Capability inheritance is single and acyclic, and overlapping capabilities resolve by authority, then owner, then specificity.',
  'capabilities-described-technology-neutral':
    'Capabilities are described in technology-neutral terms.',
  'declaring-capabilities-is-inert':
    'Declaring capabilities never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
