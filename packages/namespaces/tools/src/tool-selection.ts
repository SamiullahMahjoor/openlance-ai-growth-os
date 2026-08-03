/**
 * Tool selection: how a tool is chosen for a need, deterministically (ai/tools/tool-selection.md,
 * OL-AI-TOOLS-TOOL-SELECTION).
 *
 * The Specification narrates the selection model as heterogeneous facets (the candidate set, deterministic
 * choice, governed and safe selection, selection not execution or reasoning), not a closed taxonomy the
 * model refers to by identity, so this concern is definitions only (principles and invariants), consistent
 * with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The execution of the
 * chosen tool is owned by ai/tools/tool-execution.md and whether a tool is compatible with the need by
 * ai/tools/tool-compatibility.md; the permission to use a tool and the rules and limits a selection respects
 * are owned by ai/agents/agent-permissions.md, ai/governance/, and ai/safety/, referenced not restated
 * (ADR-0020).
 */

/**
 * A tool-selection principle: a permanent rule the selection model upholds, each instantiating a tool
 * invariant (ai/tools/tool-selection.md, "Principles").
 */
export type ToolSelectionPrinciple =
  | 'selection-is-deterministic'
  | 'selection-chooses-from-the-compatible'
  | 'selection-is-governed-and-bounded'
  | 'selection-matches-it-does-not-reason';

/** The tool-selection principles, in constitutional order; frozen. */
export const TOOL_SELECTION_PRINCIPLES: readonly ToolSelectionPrinciple[] = Object.freeze([
  'selection-is-deterministic',
  'selection-chooses-from-the-compatible',
  'selection-is-governed-and-bounded',
  'selection-matches-it-does-not-reason',
]);

/** What each tool-selection principle requires (ai/tools/tool-selection.md, "Principles"). */
export const TOOL_SELECTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolSelectionPrinciple, string>
> = Object.freeze({
  'selection-is-deterministic':
    'The same need and the same available tools under the same rules yield the same choice, with no randomness.',
  'selection-chooses-from-the-compatible':
    'A tool is chosen only from those compatible with the need under ai/tools/tool-compatibility.md, so an unsuitable tool is never chosen.',
  'selection-is-governed-and-bounded':
    'A tool is chosen only where an agent is permitted to use it under ai/governance/ and within the limits owned by ai/safety/, and never one that would exceed them.',
  'selection-matches-it-does-not-reason':
    'Selection is a deterministic match of a need to a tool, not a judgment about the task; the reasoning that formed the need is owned by ai/reasoning/.',
});

/**
 * A tool-selection invariant: a guarantee the selection model always upholds (ai/tools/tool-selection.md,
 * "Invariants").
 */
export type ToolSelectionInvariant =
  | 'same-need-same-tools-same-rules-same-choice'
  | 'chosen-only-from-active-and-compatible'
  | 'chosen-tool-permitted-under-governance-and-safety'
  | 'settled-by-defined-tiebreak-never-ambiguous-or-random'
  | 'choosing-a-tool-is-inert';

/** The tool-selection invariants, in constitutional order; frozen. */
export const TOOL_SELECTION_INVARIANTS: readonly ToolSelectionInvariant[] = Object.freeze([
  'same-need-same-tools-same-rules-same-choice',
  'chosen-only-from-active-and-compatible',
  'chosen-tool-permitted-under-governance-and-safety',
  'settled-by-defined-tiebreak-never-ambiguous-or-random',
  'choosing-a-tool-is-inert',
]);

/** What each tool-selection invariant guarantees (ai/tools/tool-selection.md, "Invariants"). */
export const TOOL_SELECTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolSelectionInvariant, string>
> = Object.freeze({
  'same-need-same-tools-same-rules-same-choice':
    'The same need and the same available tools under the same rules yield the same choice.',
  'chosen-only-from-active-and-compatible':
    'A tool is chosen only from those active and compatible with the need.',
  'chosen-tool-permitted-under-governance-and-safety':
    'A chosen tool is one the agent is permitted to use, under governance and within safety limits.',
  'settled-by-defined-tiebreak-never-ambiguous-or-random':
    'Selection is settled by a defined tiebreak, so it is never ambiguous or random.',
  'choosing-a-tool-is-inert':
    'Choosing a tool never reasons, decides the task, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
