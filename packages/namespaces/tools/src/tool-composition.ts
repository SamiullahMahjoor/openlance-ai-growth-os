/**
 * Tool composition: chaining of tools and reusable compositions (ai/tools/tool-composition.md,
 * OL-AI-TOOLS-TOOL-COMPOSITION).
 *
 * The Specification narrates the composition model as heterogeneous facets (the composition model,
 * chaining, reusable compositions, governed throughout), not a closed taxonomy the model refers to by
 * identity, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. The execution of each tool in a
 * composition is owned by ai/tools/tool-execution.md and the coordination of agents by
 * ai/agents/agent-coordination.md; an out-of-bound or cyclic composition is refused under
 * ai/safety/refusal-model.md, referenced not restated (ADR-0020).
 */

/**
 * A tool-composition principle: a permanent rule the composition model upholds, each instantiating a tool
 * invariant (ai/tools/tool-composition.md, "Principles").
 */
export type ToolCompositionPrinciple =
  | 'composition-chains-tools-it-does-not-execute-one'
  | 'a-composition-is-bounded-and-acyclic'
  | 'a-composition-is-governed-and-validated-throughout'
  | 'a-composition-is-reusable-and-deterministic';

/** The tool-composition principles, in constitutional order; frozen. */
export const TOOL_COMPOSITION_PRINCIPLES: readonly ToolCompositionPrinciple[] = Object.freeze([
  'composition-chains-tools-it-does-not-execute-one',
  'a-composition-is-bounded-and-acyclic',
  'a-composition-is-governed-and-validated-throughout',
  'a-composition-is-reusable-and-deterministic',
]);

/** What each tool-composition principle requires (ai/tools/tool-composition.md, "Principles"). */
export const TOOL_COMPOSITION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolCompositionPrinciple, string>
> = Object.freeze({
  'composition-chains-tools-it-does-not-execute-one':
    'Composition orders several tools into a sequence; how a single tool executes is owned by ai/tools/tool-execution.md.',
  'a-composition-is-bounded-and-acyclic':
    'A chain of tools is finite and acyclic, so no unbounded chain and no composition cycle are possible.',
  'a-composition-is-governed-and-validated-throughout':
    'Every tool in a composition is selected, validated, and executed under the same rules as a single tool, so a composition never bypasses protection.',
  'a-composition-is-reusable-and-deterministic':
    'A defined composition can be reused, and the same composition over the same inputs orders the same tools the same way.',
});

/**
 * A tool-composition invariant: a guarantee the composition model always upholds
 * (ai/tools/tool-composition.md, "Invariants").
 */
export type ToolCompositionInvariant =
  | 'a-composition-is-finite-acyclic-chain'
  | 'every-tool-selected-validated-executed-same-rules'
  | 'never-escalates-authority-or-bypasses-validation-or-safety'
  | 'same-composition-same-inputs-orders-same-tools'
  | 'composing-tools-is-inert';

/** The tool-composition invariants, in constitutional order; frozen. */
export const TOOL_COMPOSITION_INVARIANTS: readonly ToolCompositionInvariant[] = Object.freeze([
  'a-composition-is-finite-acyclic-chain',
  'every-tool-selected-validated-executed-same-rules',
  'never-escalates-authority-or-bypasses-validation-or-safety',
  'same-composition-same-inputs-orders-same-tools',
  'composing-tools-is-inert',
]);

/** What each tool-composition invariant guarantees (ai/tools/tool-composition.md, "Invariants"). */
export const TOOL_COMPOSITION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolCompositionInvariant, string>
> = Object.freeze({
  'a-composition-is-finite-acyclic-chain':
    'A composition is a finite, acyclic chain of tools, so no unbounded or circular composition is possible.',
  'every-tool-selected-validated-executed-same-rules':
    'Every tool in a composition is selected, validated, and executed under the same rules as a single tool.',
  'never-escalates-authority-or-bypasses-validation-or-safety':
    'A composition never escalates authority or bypasses validation or safety limits.',
  'same-composition-same-inputs-orders-same-tools':
    'The same composition over the same inputs orders the same tools the same way.',
  'composing-tools-is-inert':
    'Composing tools never executes a tool, reasons, decides, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
