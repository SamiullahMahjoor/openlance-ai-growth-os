/**
 * Prompt context: how referenced context is held in a prompt, separated from instruction, so a prompt
 * points to knowledge and never embeds it (ai/prompts/prompt-context.md, OL-AI-PROMPTS-PROMPT-CONTEXT).
 *
 * The Specification narrates context separation as heterogeneous facets (reference not embedding,
 * separation from instruction, sources of context, no promotion); the sources of context are owned by
 * ai/retrieval/ and ai/memory/, and the layer context is held in is owned by
 * ai/prompts/prompt-architecture.md. It is not a closed taxonomy the model refers to by identity, so this
 * concern is definitions only (principles and invariants), consistent with the modeling rule recorded in
 * docs/implementation/13-retrieval.md section 4. It owns context separation only; it never determines which
 * knowledge to load, and never owns the retained context or its persistence (ADR-0020).
 */

/**
 * A prompt-context principle: a permanent rule context separation upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-context.md, "Principles").
 */
export type PromptContextPrinciple =
  | 'points-to-knowledge-never-embeds'
  | 'context-separated-from-instruction'
  | 'context-consumed-never-owned'
  | 'context-is-deterministic';

/** The prompt-context principles, in constitutional order; frozen. */
export const PROMPT_CONTEXT_PRINCIPLES: readonly PromptContextPrinciple[] = Object.freeze([
  'points-to-knowledge-never-embeds',
  'context-separated-from-instruction',
  'context-consumed-never-owned',
  'context-is-deterministic',
]);

/** What each prompt-context principle requires (ai/prompts/prompt-context.md, "Principles"). */
export const PROMPT_CONTEXT_PRINCIPLE_DESCRIPTIONS: Readonly<Record<PromptContextPrinciple, string>> =
  Object.freeze({
    'points-to-knowledge-never-embeds':
      'Context enters a prompt as a reference to its canonical owner, never as a copy, cache, or paraphrase of business truth.',
    'context-separated-from-instruction':
      'The referenced context is held in its own layer, distinct from the intent and the task, so instruction never mixes with truth.',
    'context-consumed-never-owned':
      'A prompt references the knowledge retrieval determined and the context memory retained, and owns none of it.',
    'context-is-deterministic':
      'The same referenced context enters a prompt the same way, with no invented context.',
  });

/**
 * A prompt-context invariant: a guarantee context separation always upholds
 * (ai/prompts/prompt-context.md, "Invariants").
 */
export type PromptContextInvariant =
  | 'context-enters-as-reference-never-embedded'
  | 'referenced-context-held-separately'
  | 'references-determined-and-retained-owns-none'
  | 'never-promoted-into-knowledge-repository'
  | 'separating-context-is-inert';

/** The prompt-context invariants, in constitutional order; frozen. */
export const PROMPT_CONTEXT_INVARIANTS: readonly PromptContextInvariant[] = Object.freeze([
  'context-enters-as-reference-never-embedded',
  'referenced-context-held-separately',
  'references-determined-and-retained-owns-none',
  'never-promoted-into-knowledge-repository',
  'separating-context-is-inert',
]);

/** What each prompt-context invariant guarantees (ai/prompts/prompt-context.md, "Invariants"). */
export const PROMPT_CONTEXT_INVARIANT_DESCRIPTIONS: Readonly<Record<PromptContextInvariant, string>> =
  Object.freeze({
    'context-enters-as-reference-never-embedded':
      'Context enters a prompt as a reference to its canonical owner, never as embedded, copied, or restated truth.',
    'referenced-context-held-separately':
      'Referenced context is held separately from instruction, in its own layer.',
    'references-determined-and-retained-owns-none':
      'A prompt references the knowledge retrieval determined and the context memory retained, and owns none of it.',
    'never-promoted-into-knowledge-repository':
      'Referenced context is never promoted from a prompt into the knowledge repository.',
    'separating-context-is-inert':
      'Separating context never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
  });
