/**
 * Prompt boundaries: what prompts never own, and where a prompt stops
 * (ai/prompts/prompt-boundaries.md, OL-AI-PROMPTS-PROMPT-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries a prompt operates
 * within. This module owns the boundaries; the rules that set them are owned by ai/governance/, and the
 * concerns beyond them by their namespaces. A composition that would cross any boundary does not proceed;
 * it is refused or escalated (ai/governance/escalation.md). The boundaries carry no ordering and no
 * predicate; how a boundary is enforced is the runtime's, and this module is their immutable definition
 * (ADR-0020).
 */

/**
 * A prompt-boundaries principle: a permanent rule the boundaries uphold, each instantiating a prompt
 * invariant (ai/prompts/prompt-boundaries.md, "Principles").
 */
export type PromptBoundaryPrinciple =
  | 'express-not-execute-reason-retrieve-or-persist'
  | 'point-to-truth-never-own-it'
  | 'transient-never-stored-as-truth'
  | 'stay-within-governance';

/** The prompt-boundaries principles, in constitutional order; frozen. */
export const PROMPT_BOUNDARY_PRINCIPLES: readonly PromptBoundaryPrinciple[] = Object.freeze([
  'express-not-execute-reason-retrieve-or-persist',
  'point-to-truth-never-own-it',
  'transient-never-stored-as-truth',
  'stay-within-governance',
]);

/** What each prompt-boundaries principle requires (ai/prompts/prompt-boundaries.md, "Principles"). */
export const PROMPT_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptBoundaryPrinciple, string>
> = Object.freeze({
  'express-not-execute-reason-retrieve-or-persist':
    'A prompt composes and expresses a transient instruction and stops there; execution, reasoning, retrieval, and persistence belong to other namespaces.',
  'point-to-truth-never-own-it':
    'A prompt references business truth and never owns, restates, embeds, stores, or becomes it, and knowledge always governs.',
  'transient-never-stored-as-truth':
    'A composed prompt is an operational output, never canonical content, and is never promoted into the knowledge repository.',
  'stay-within-governance':
    'Composition, validation, and change occur within the governing rules, and a prompt that would exceed them is refused or escalated rather than expressed.',
});

/**
 * A prompt boundary: one architectural boundary a prompt operates within, in constitutional listing order
 * (ai/prompts/prompt-boundaries.md, "Specification"). The set is unordered.
 */
export type PromptBoundary =
  | 'truth'
  | 'reasoning'
  | 'retrieval-and-memory'
  | 'execution'
  | 'governance'
  | 'implementation';

/** The prompt boundaries, in constitutional listing order; frozen. */
export const PROMPT_BOUNDARIES: readonly PromptBoundary[] = Object.freeze([
  'truth',
  'reasoning',
  'retrieval-and-memory',
  'execution',
  'governance',
  'implementation',
]);

/** What each prompt boundary is (ai/prompts/prompt-boundaries.md, "Specification"). */
export const PROMPT_BOUNDARY_DESCRIPTIONS: Readonly<Record<PromptBoundary, string>> = Object.freeze({
  truth:
    'A prompt points to business truth by its canonical owner and never owns, restates, embeds, caches, or becomes it; prompt content is an operational output and is never promoted into the knowledge repository.',
  reasoning:
    'A prompt expresses the governed conclusion reasoning produced and never reasons, concludes, or decides (owned by ai/reasoning/); a prompt is the expression of reasoning, never its performance.',
  'retrieval-and-memory':
    'A prompt references the knowledge retrieval determined and the context memory retained and never discovers, selects, loads, or persists it (owned by ai/retrieval/ and ai/memory/).',
  execution:
    'A prompt is composed and validated within this namespace and is then carried by ai/runtime/ and executed by the Providers namespace; a prompt never orchestrates, schedules, executes, or selects a provider or model.',
  governance:
    'A prompt conforms to the governing rules for composition, validation, and change and never defines them (owned by ai/governance/); a prompt that would exceed them is refused or escalated rather than expressed.',
  implementation:
    'A prompt is a model of a transient instruction, never a template language, a syntax, a format, a provider, a model, a framework, or code, and this namespace holds no prompt text.',
});

/**
 * A prompt-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/prompts/prompt-boundaries.md, "Invariants").
 */
export type PromptBoundaryInvariant =
  | 'points-to-truth-never-owns-it'
  | 'never-executes-reasons-retrieves-persists-or-selects'
  | 'transient-never-stored-or-promoted'
  | 'exceeding-rules-refused-or-escalated'
  | 'enforcing-a-boundary-is-inert';

/** The prompt-boundaries invariants, in constitutional order; frozen. */
export const PROMPT_BOUNDARY_INVARIANTS: readonly PromptBoundaryInvariant[] = Object.freeze([
  'points-to-truth-never-owns-it',
  'never-executes-reasons-retrieves-persists-or-selects',
  'transient-never-stored-or-promoted',
  'exceeding-rules-refused-or-escalated',
  'enforcing-a-boundary-is-inert',
]);

/** What each prompt-boundaries invariant guarantees (ai/prompts/prompt-boundaries.md, "Invariants"). */
export const PROMPT_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptBoundaryInvariant, string>
> = Object.freeze({
  'points-to-truth-never-owns-it':
    'A prompt points to business truth and never owns, restates, embeds, or becomes it.',
  'never-executes-reasons-retrieves-persists-or-selects':
    'A prompt never executes, reasons, retrieves, persists, or selects a provider or model.',
  'transient-never-stored-or-promoted':
    'A prompt is transient and is never stored as truth or promoted into the knowledge repository.',
  'exceeding-rules-refused-or-escalated':
    'A prompt that would exceed the governing rules is refused or escalated, never expressed.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
