/**
 * Prompt composition: how the layers, template, inherited parts, and referenced context are combined into
 * one prompt (ai/prompts/prompt-composition.md, OL-AI-PROMPTS-PROMPT-COMPOSITION).
 *
 * The Specification narrates the composition model as heterogeneous facets (the parts of a composition,
 * the composition pipeline, precedence and conflict, the governed and separated result); the parts are
 * each owned by another concern (layers by architecture, template by templates, inherited parts by
 * inheritance, referenced context by context), and precedence and conflict are deferred to
 * ai/prompts/prompt-inheritance.md. It is therefore not a closed taxonomy the model refers to by identity,
 * so this concern is definitions only (principles and invariants), consistent with the modeling rule
 * recorded in docs/implementation/13-retrieval.md section 4. The ordered stages that carry composition out
 * are owned by ai/prompts/prompt-assembly.md; the composition of a concrete prompt is the runtime's
 * (ADR-0020).
 */

/**
 * A prompt-composition principle: a permanent rule prompt composition upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-composition.md, "Principles").
 */
export type PromptCompositionPrinciple =
  | 'composition-is-deterministic'
  | 'combines-parts-never-invents'
  | 'preserves-separation'
  | 'governed-and-bounded';

/** The prompt-composition principles, in constitutional order; frozen. */
export const PROMPT_COMPOSITION_PRINCIPLES: readonly PromptCompositionPrinciple[] = Object.freeze([
  'composition-is-deterministic',
  'combines-parts-never-invents',
  'preserves-separation',
  'governed-and-bounded',
]);

/** What each prompt-composition principle requires (ai/prompts/prompt-composition.md, "Principles"). */
export const PROMPT_COMPOSITION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptCompositionPrinciple, string>
> = Object.freeze({
  'composition-is-deterministic':
    'The same layers, template, inherited parts, and referenced context compose the same prompt, with no randomness and no hidden step.',
  'combines-parts-never-invents':
    'A prompt is composed only from its defined layers, template, inherited parts, and referenced context, and never from invented content.',
  'preserves-separation':
    'Referenced context is composed as reference, kept separate from instruction, so a prompt points to knowledge and never embeds it.',
  'governed-and-bounded':
    'A prompt is composed within the governing rules and the prompt boundaries, and a composition that would exceed them is not produced.',
});

/**
 * A prompt-composition invariant: a guarantee prompt composition always upholds
 * (ai/prompts/prompt-composition.md, "Invariants").
 */
export type PromptCompositionInvariant =
  | 'same-parts-compose-same-prompt'
  | 'composed-only-from-defined-parts'
  | 'context-composed-as-reference'
  | 'exceeding-rules-or-boundaries-yields-no-prompt'
  | 'composing-is-inert';

/** The prompt-composition invariants, in constitutional order; frozen. */
export const PROMPT_COMPOSITION_INVARIANTS: readonly PromptCompositionInvariant[] = Object.freeze([
  'same-parts-compose-same-prompt',
  'composed-only-from-defined-parts',
  'context-composed-as-reference',
  'exceeding-rules-or-boundaries-yields-no-prompt',
  'composing-is-inert',
]);

/** What each prompt-composition invariant guarantees (ai/prompts/prompt-composition.md, "Invariants"). */
export const PROMPT_COMPOSITION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptCompositionInvariant, string>
> = Object.freeze({
  'same-parts-compose-same-prompt':
    'The same layers, template, inherited parts, and referenced context compose the same prompt.',
  'composed-only-from-defined-parts':
    'A prompt is composed only from its defined parts, and never from invented content.',
  'context-composed-as-reference':
    'Referenced context is composed as reference, separated from instruction, and never embedded.',
  'exceeding-rules-or-boundaries-yields-no-prompt':
    'A composition that would exceed the governing rules or the prompt boundaries yields no prompt.',
  'composing-is-inert':
    'Composing a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});
