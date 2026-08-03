/**
 * The Prompts namespace, namespace-wide truth (ai/prompts/README.md, OL-AI-PROMPTS-README;
 * ai/prompts/prompts.md, OL-AI-PROMPTS-PROMPTS).
 *
 * The prompt invariants every prompt concern upholds, and the canonical inventory of the prompt concerns,
 * as immutable definitions (ADR-0020). The namespace is the expression model of the AI layer: it defines
 * how a prompt is layered, composed, assembled, structured, validated, inherited, versioned, and consumed,
 * so that reasoning can be expressed as a governed, transient instruction. It never writes a prompt, never
 * determines the knowledge a prompt points to, never reasons, never executes, and never defines a template
 * language, a syntax, a format, a provider, a model, a framework, or code, and it contains no prompt text
 * (ai/prompts/README.md). Prompt composition is deterministic, repeatable, and scalable: the same intent,
 * referenced context, governing rules, and base prompts and templates compose the same prompt, and the
 * model holds for one prompt or tens of thousands (ai/prompts/prompts.md).
 *
 * ADR-0024 classifies Prompts as category 1 (Pure Domain Model, declared per ADR-0024 §42; not among the
 * ADR's enumerated examples). Its executable surface is four pure ordering predicates over prompt-owned
 * classifications - the layer, lifecycle-phase, assembly-stage, and validation-check orderings - realized
 * per ADR-0020 as an immutable stateless domain model with no IO; the composition of a concrete prompt is
 * the runtime's.
 */

/**
 * A prompt invariant: a permanent guarantee every prompt document upholds and no prompt may violate
 * (ai/prompts/README.md, "Prompt Invariants"). Every prompt concern's principles instantiate these.
 */
export type PromptInvariant =
  | 'transient-never-truth'
  | 'points-never-embeds'
  | 'composed-deterministically'
  | 'governed-and-validated'
  | 'provider-neutral'
  | 'content-is-operational-output'
  | 'single-owned'
  | 'repeatable-and-scalable';

/** The eight prompt invariants, in constitutional order; frozen. */
export const PROMPT_INVARIANTS: readonly PromptInvariant[] = Object.freeze([
  'transient-never-truth',
  'points-never-embeds',
  'composed-deterministically',
  'governed-and-validated',
  'provider-neutral',
  'content-is-operational-output',
  'single-owned',
  'repeatable-and-scalable',
]);

/** The guarantee each prompt invariant states (ai/prompts/README.md, "Prompt Invariants"). */
export const PROMPT_INVARIANT_DESCRIPTIONS: Readonly<Record<PromptInvariant, string>> = Object.freeze({
  'transient-never-truth':
    'A prompt is composed for an execution and is never stored, canonical, or authoritative content.',
  'points-never-embeds':
    'A prompt references business truth by its canonical owner and never copies, caches, or paraphrases it.',
  'composed-deterministically':
    'The same intent, the same referenced context, the same governing rules, and the same base prompts and templates compose the same prompt, and there is no randomness and no hidden step.',
  'governed-and-validated':
    'Every prompt conforms to the governing rules and passes validation before it is expressed, and a prompt that cannot is not expressed.',
  'provider-neutral':
    'Prompt architecture is independent of any provider, model, framework, runtime, or language, and expresses nothing that binds it to one.',
  'content-is-operational-output':
    'A prompt is a produced instruction; nothing in a prompt is automatically promoted into the knowledge repository.',
  'single-owned':
    'Each prompt concern has exactly one owning document, and no prompt concern is owned twice.',
  'repeatable-and-scalable':
    'The same inputs reproduce the same prompt, and the model holds for one prompt or tens of thousands.',
});

/**
 * A prompt concern: one aspect of the prompt model, each owned by exactly one document
 * (ai/prompts/prompts.md, "The Prompt Concerns"). This is the namespace inventory identity; the model of
 * each concern is owned by its named document and this package's corresponding module.
 */
export type PromptConcern =
  | 'prompt-architecture'
  | 'prompt-lifecycle'
  | 'prompt-composition'
  | 'prompt-assembly'
  | 'prompt-templates'
  | 'prompt-context'
  | 'prompt-validation'
  | 'prompt-inheritance'
  | 'prompt-boundaries'
  | 'prompt-versioning';

/** The ten prompt concerns, in inventory order; frozen. */
export const PROMPT_CONCERNS: readonly PromptConcern[] = Object.freeze([
  'prompt-architecture',
  'prompt-lifecycle',
  'prompt-composition',
  'prompt-assembly',
  'prompt-templates',
  'prompt-context',
  'prompt-validation',
  'prompt-inheritance',
  'prompt-boundaries',
  'prompt-versioning',
]);

/** What each prompt concern owns (ai/prompts/prompts.md, "The Prompt Concerns"). */
export const PROMPT_CONCERN_DESCRIPTIONS: Readonly<Record<PromptConcern, string>> = Object.freeze({
  'prompt-architecture':
    'The prompt layering model: the ordered architectural layers and sections a single prompt is organized into.',
  'prompt-lifecycle': 'The phases of a prompt, from definition through expression to retirement.',
  'prompt-composition':
    'The composition model: how the layers, template, inherited parts, and referenced context are combined into one prompt.',
  'prompt-assembly':
    'The ordered assembly stages that produce the final prompt, including prompt normalization.',
  'prompt-templates':
    'The template model: the reusable structural forms a prompt is built from, and prompt reuse and consistency.',
  'prompt-context':
    'Prompt context separation: how referenced context is held in a prompt, separated from instruction, so a prompt points to knowledge and never embeds it.',
  'prompt-validation': 'Validation before a prompt is expressed, and prompt validation ordering.',
  'prompt-inheritance':
    'The inheritance hierarchy and dependency model of prompts, and prompt conflict resolution.',
  'prompt-boundaries': 'What prompts never own, and where prompts stop.',
  'prompt-versioning':
    'Prompt versioning, evolution, change governance consumption, and version compatibility.',
});
