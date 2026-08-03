/**
 * Prompt architecture: the prompt layering model, the ordered architectural layers and sections a single
 * prompt is organized into (ai/prompts/prompt-architecture.md, OL-AI-PROMPTS-PROMPT-ARCHITECTURE).
 *
 * A prompt is organized into a fixed order of layers, from the most authoritative to the most specific,
 * each holding one kind of part, so that instruction is separated from referenced context. This module
 * defines the ordered layers, their principles, and their invariants, plus the pure ordering predicate the
 * document's ordering states. A layer names a structural role, never prompt text, a format, or a template
 * language; how the layers are combined is owned by ai/prompts/prompt-composition.md and how one prompt
 * derives its layers from another by ai/prompts/prompt-inheritance.md, referenced not restated (ADR-0020).
 */

/**
 * A prompt-architecture principle: a permanent rule the layering model upholds, each instantiating a
 * prompt invariant (ai/prompts/prompt-architecture.md, "Principles").
 */
export type PromptArchitecturePrinciple =
  | 'layers-are-architectural-not-content'
  | 'layers-are-ordered-and-separated'
  | 'layers-descend-from-constitution-to-task'
  | 'layers-are-extensible';

/** The prompt-architecture principles, in constitutional order; frozen. */
export const PROMPT_ARCHITECTURE_PRINCIPLES: readonly PromptArchitecturePrinciple[] = Object.freeze([
  'layers-are-architectural-not-content',
  'layers-are-ordered-and-separated',
  'layers-descend-from-constitution-to-task',
  'layers-are-extensible',
]);

/** What each prompt-architecture principle requires (ai/prompts/prompt-architecture.md, "Principles"). */
export const PROMPT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptArchitecturePrinciple, string>
> = Object.freeze({
  'layers-are-architectural-not-content':
    'A layer names a structural part of a prompt by its role; it is never prompt text, a format, or a template language.',
  'layers-are-ordered-and-separated':
    'A prompt is organized into layers in a fixed order, and each layer holds one kind of part, so instruction is separated from referenced context.',
  'layers-descend-from-constitution-to-task':
    'The most authoritative layers come first, and the most specific, task-level layers come last, so higher authority is expressed before narrower intent.',
  'layers-are-extensible':
    'New architectural layers or sections may be added over time, additively, without changing the ones defined here.',
});

/**
 * A prompt layer, in constitutional order from the most authoritative to the most specific
 * (ai/prompts/prompt-architecture.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link promptLayerAtOrAfter}. Each layer holds one kind of part.
 */
export type PromptLayer = 'governing' | 'role' | 'intent' | 'context' | 'task';

/** The prompt layers, most authoritative to most specific; frozen. */
export const PROMPT_LAYERS: readonly PromptLayer[] = Object.freeze([
  'governing',
  'role',
  'intent',
  'context',
  'task',
]);

/** What each prompt layer is (ai/prompts/prompt-architecture.md, "Specification"). */
export const PROMPT_LAYER_DESCRIPTIONS: Readonly<Record<PromptLayer, string>> = Object.freeze({
  governing:
    'The layer that carries the governing constraints a prompt must express, derived from the rules owned by ai/governance/; it comes first, so every prompt is bounded before it instructs.',
  role: 'The layer that establishes the acting role the prompt is composed for, derived from the agent definition owned by the Agents namespace; it never defines the agent, which is owned outside this namespace.',
  intent:
    'The layer that expresses the governed intent or conclusion the prompt conveys, derived from the reasoning owned by ai/reasoning/; it carries what is to be done, never how it was reasoned.',
  context:
    'The layer that holds the referenced context the prompt points to, owned in its separation by ai/prompts/prompt-context.md; it references knowledge by its canonical owner and never embeds it.',
  task: 'The most specific layer, expressing the immediate task instruction; it is the narrowest layer and comes last.',
});

/**
 * A prompt-architecture invariant: a guarantee the layering model always upholds
 * (ai/prompts/prompt-architecture.md, "Invariants").
 */
export type PromptArchitectureInvariant =
  | 'organized-into-ordered-layers-governing-to-task'
  | 'each-layer-one-kind-context-separated'
  | 'a-layer-names-a-role-never-content'
  | 'defining-layering-is-inert';

/** The prompt-architecture invariants, in constitutional order; frozen. */
export const PROMPT_ARCHITECTURE_INVARIANTS: readonly PromptArchitectureInvariant[] = Object.freeze([
  'organized-into-ordered-layers-governing-to-task',
  'each-layer-one-kind-context-separated',
  'a-layer-names-a-role-never-content',
  'defining-layering-is-inert',
]);

/** What each prompt-architecture invariant guarantees (ai/prompts/prompt-architecture.md, "Invariants"). */
export const PROMPT_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptArchitectureInvariant, string>
> = Object.freeze({
  'organized-into-ordered-layers-governing-to-task':
    'A prompt is organized into ordered layers, from the governing layer to the task layer.',
  'each-layer-one-kind-context-separated':
    'Each layer holds one kind of part, and referenced context is separated from instruction.',
  'a-layer-names-a-role-never-content':
    'A layer names a structural role, never prompt text, a format, or a template language.',
  'defining-layering-is-inert':
    'Defining the layering never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each layer in the constitutional order (most authoritative = 0). Internal to the
 * ordering predicate; never exported.
 */
const PROMPT_LAYER_RANK: Readonly<Record<PromptLayer, number>> = Object.freeze({
  governing: 0,
  role: 1,
  intent: 2,
  context: 3,
  task: 4,
});

/**
 * Whether prompt layer `a` is at or after prompt layer `b` in the constitutional layer order, from the
 * most authoritative (governing) to the most specific (task) (ai/prompts/prompt-architecture.md,
 * "Specification"). Pure and total: it reads only the fixed order the document defines and expresses that
 * order verbatim. It states no policy of its own.
 */
export function promptLayerAtOrAfter(a: PromptLayer, b: PromptLayer): boolean {
  return PROMPT_LAYER_RANK[a] >= PROMPT_LAYER_RANK[b];
}
