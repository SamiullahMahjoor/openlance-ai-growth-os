/**
 * Tool architecture: the architectural definition of a tool, its identity and the parts it is composed of
 * (ai/tools/tool-architecture.md, OL-AI-TOOLS-TOOL-ARCHITECTURE).
 *
 * A tool is a uniquely identified capability composed of its identity and its declared capabilities,
 * standing for an interaction with something outside the agent's reasoning. This module defines the closed
 * set of parts a tool is composed of, plus the structural principles and invariants. The parts are
 * unordered and carry no predicate; the capabilities part is owned by ai/tools/tool-capabilities.md, the
 * lifecycle by ai/tools/tool-lifecycle.md, and the execution model by ai/tools/tool-execution.md,
 * referenced not restated (ADR-0020).
 */

/**
 * A tool-architecture principle: a permanent rule the structural model upholds, each instantiating a tool
 * invariant (ai/tools/tool-architecture.md, "Principles").
 */
export type ToolArchitecturePrinciple =
  | 'a-tool-is-a-capability-not-an-actor'
  | 'a-tool-has-a-distinct-identity'
  | 'a-tool-is-composed-of-defined-parts'
  | 'a-tools-structure-is-deterministic';

/** The tool-architecture principles, in constitutional order; frozen. */
export const TOOL_ARCHITECTURE_PRINCIPLES: readonly ToolArchitecturePrinciple[] = Object.freeze([
  'a-tool-is-a-capability-not-an-actor',
  'a-tool-has-a-distinct-identity',
  'a-tool-is-composed-of-defined-parts',
  'a-tools-structure-is-deterministic',
]);

/** What each tool-architecture principle requires (ai/tools/tool-architecture.md, "Principles"). */
export const TOOL_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolArchitecturePrinciple, string>
> = Object.freeze({
  'a-tool-is-a-capability-not-an-actor':
    'A tool is the architectural means by which an agent interacts outside its reasoning; it never acts on its own and never reasons.',
  'a-tool-has-a-distinct-identity':
    'Every tool is uniquely identified, so it can be registered, declared, selected, composed, and held to its declared capabilities as one tool.',
  'a-tool-is-composed-of-defined-parts':
    'A tool is composed of its identity and its declared capabilities, each owned by its named document.',
  'a-tools-structure-is-deterministic':
    'The same tool definition resolves to the same identity and parts, with no randomness.',
});

/**
 * A tool part: one of the parts a tool is composed of, in constitutional listing order
 * (ai/tools/tool-architecture.md, "Specification"). The set is closed and unordered; each part is owned by
 * its named document (identity here, capabilities by ai/tools/tool-capabilities.md).
 */
export type ToolPart = 'identity' | 'capabilities';

/** The parts a tool is composed of, in constitutional listing order; frozen. */
export const TOOL_PARTS: readonly ToolPart[] = Object.freeze(['identity', 'capabilities']);

/** What each tool part is (ai/tools/tool-architecture.md, "Specification"). */
export const TOOL_PART_DESCRIPTIONS: Readonly<Record<ToolPart, string>> = Object.freeze({
  identity:
    'A tool has a distinct, stable identity that uniquely identifies it as a capability for external interaction, so it can be registered, discovered, selected, composed, and held to its declared capabilities as one tool; how an identity is registered and discovered is owned by ai/tools/tool-lifecycle.md.',
  capabilities:
    'A tool is composed of the capabilities it declares under ai/tools/tool-capabilities.md; this document owns that a tool is composed of them, and the capability model is owned there.',
});

/**
 * A tool-architecture invariant: a guarantee the structural model always upholds
 * (ai/tools/tool-architecture.md, "Invariants").
 */
export type ToolArchitectureInvariant =
  | 'every-tool-has-a-distinct-stable-identity-never-shared'
  | 'composed-of-identity-and-declared-capabilities'
  | 'stands-for-external-interaction-never-the-system'
  | 'same-definition-same-structure'
  | 'defining-structure-is-inert';

/** The tool-architecture invariants, in constitutional order; frozen. */
export const TOOL_ARCHITECTURE_INVARIANTS: readonly ToolArchitectureInvariant[] = Object.freeze([
  'every-tool-has-a-distinct-stable-identity-never-shared',
  'composed-of-identity-and-declared-capabilities',
  'stands-for-external-interaction-never-the-system',
  'same-definition-same-structure',
  'defining-structure-is-inert',
]);

/** What each tool-architecture invariant guarantees (ai/tools/tool-architecture.md, "Invariants"). */
export const TOOL_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolArchitectureInvariant, string>
> = Object.freeze({
  'every-tool-has-a-distinct-stable-identity-never-shared':
    'Every tool has a distinct, stable identity that is never shared.',
  'composed-of-identity-and-declared-capabilities':
    'A tool is composed of its identity and its declared capabilities, each owned by its named document.',
  'stands-for-external-interaction-never-the-system':
    'A tool stands for an external interaction and is never the outside system or its effect.',
  'same-definition-same-structure':
    'The same tool definition resolves to the same structure, with no randomness.',
  'defining-structure-is-inert':
    "Defining a tool's structure never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.",
});
