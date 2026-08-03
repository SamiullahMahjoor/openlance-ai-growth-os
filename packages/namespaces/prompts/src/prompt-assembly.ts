/**
 * Prompt assembly: the ordered assembly stages that produce the final prompt, including prompt
 * normalization (ai/prompts/prompt-assembly.md, OL-AI-PROMPTS-PROMPT-ASSEMBLY).
 *
 * Every prompt is assembled through a fixed order of stages: the order is architectural, defining what
 * happens before what, never how any stage is carried out, and it defines no format or template language.
 * This module defines the ordered stages, their principles, and their invariants, plus the pure ordering
 * predicate the document's ordering states. The composition model the stages apply is owned by
 * ai/prompts/prompt-composition.md and the assembly of the execution context by
 * ai/runtime/context-loading.md, referenced not restated (ADR-0020).
 */

/**
 * A prompt-assembly principle: a permanent rule the assembly order upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-assembly.md, "Principles").
 */
export type PromptAssemblyPrinciple =
  | 'order-is-fixed-and-deterministic'
  | 'resolution-precedes-combination'
  | 'normalization-precedes-validation'
  | 'order-holds-at-any-scale';

/** The prompt-assembly principles, in constitutional order; frozen. */
export const PROMPT_ASSEMBLY_PRINCIPLES: readonly PromptAssemblyPrinciple[] = Object.freeze([
  'order-is-fixed-and-deterministic',
  'resolution-precedes-combination',
  'normalization-precedes-validation',
  'order-holds-at-any-scale',
]);

/** What each prompt-assembly principle requires (ai/prompts/prompt-assembly.md, "Principles"). */
export const PROMPT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptAssemblyPrinciple, string>
> = Object.freeze({
  'order-is-fixed-and-deterministic':
    'Every prompt is assembled through the same ordered stages, so the same parts produce the same prompt.',
  'resolution-precedes-combination':
    'Inherited parts and conflicts are resolved before the layers are combined, so composition acts on settled parts.',
  'normalization-precedes-validation':
    'The assembled prompt is normalized to a consistent form before it is validated, so validation acts on a stable prompt.',
  'order-holds-at-any-scale':
    'One prompt and tens of thousands are assembled through the same stages.',
});

/**
 * A prompt-assembly stage, in constitutional order from first to last (ai/prompts/prompt-assembly.md,
 * "Specification"). The order is the document's; it is total and is exposed by
 * {@link assemblyStageAtOrAfter}.
 */
export type PromptAssemblyStage =
  | 'resolve-inheritance'
  | 'gather-layers-and-template'
  | 'reference-context'
  | 'compose'
  | 'normalize'
  | 'finalize-for-validation';

/** The prompt-assembly stages, first to last; frozen. */
export const PROMPT_ASSEMBLY_STAGES: readonly PromptAssemblyStage[] = Object.freeze([
  'resolve-inheritance',
  'gather-layers-and-template',
  'reference-context',
  'compose',
  'normalize',
  'finalize-for-validation',
]);

/** What each prompt-assembly stage is (ai/prompts/prompt-assembly.md, "Specification"). */
export const PROMPT_ASSEMBLY_STAGE_DESCRIPTIONS: Readonly<Record<PromptAssemblyStage, string>> =
  Object.freeze({
    'resolve-inheritance':
      'The base prompts a prompt derives from are resolved, and conflicts among inherited parts are settled, under ai/prompts/prompt-inheritance.md.',
    'gather-layers-and-template':
      'The ordered layers owned by ai/prompts/prompt-architecture.md are gathered into the reusable template owned by ai/prompts/prompt-templates.md.',
    'reference-context':
      'The referenced context is placed as reference, separated from instruction, under ai/prompts/prompt-context.md, so the prompt points to knowledge and never embeds it.',
    compose:
      'The resolved parts, layers, template, and referenced context are combined into one prompt under ai/prompts/prompt-composition.md, in the layer order.',
    normalize:
      'The composed prompt is normalized to a consistent structural form, so that prompts assembled from the same kind of parts have the same form; normalization settles structure only, and never alters referenced context or invents content.',
    'finalize-for-validation':
      'The normalized prompt is produced as the final prompt, ready for validation under ai/prompts/prompt-validation.md, before it is expressed.',
  });

/**
 * A prompt-assembly invariant: a guarantee the assembly order always upholds
 * (ai/prompts/prompt-assembly.md, "Invariants").
 */
export type PromptAssemblyInvariant =
  | 'stages-occur-in-order'
  | 'same-parts-same-assembled-prompt'
  | 'normalization-settles-structure-only'
  | 'normalized-and-finalized-before-validation-never-expressed'
  | 'order-is-inert';

/** The prompt-assembly invariants, in constitutional order; frozen. */
export const PROMPT_ASSEMBLY_INVARIANTS: readonly PromptAssemblyInvariant[] = Object.freeze([
  'stages-occur-in-order',
  'same-parts-same-assembled-prompt',
  'normalization-settles-structure-only',
  'normalized-and-finalized-before-validation-never-expressed',
  'order-is-inert',
]);

/** What each prompt-assembly invariant guarantees (ai/prompts/prompt-assembly.md, "Invariants"). */
export const PROMPT_ASSEMBLY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptAssemblyInvariant, string>
> = Object.freeze({
  'stages-occur-in-order':
    'Resolve inheritance precedes Compose, which precedes Normalize, which precedes Finalize for validation.',
  'same-parts-same-assembled-prompt': 'The same parts always produce the same assembled prompt.',
  'normalization-settles-structure-only':
    'Normalization settles structure only and never alters referenced context or invents content.',
  'normalized-and-finalized-before-validation-never-expressed':
    'A prompt is normalized and finalized before validation, and never expressed from this namespace.',
  'order-is-inert':
    'The order never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each assembly stage in the constitutional order (first = 0). Internal to the
 * ordering predicate; never exported.
 */
const PROMPT_ASSEMBLY_STAGE_RANK: Readonly<Record<PromptAssemblyStage, number>> = Object.freeze({
  'resolve-inheritance': 0,
  'gather-layers-and-template': 1,
  'reference-context': 2,
  compose: 3,
  normalize: 4,
  'finalize-for-validation': 5,
});

/**
 * Whether assembly stage `a` is at or after assembly stage `b` in the constitutional stage order
 * (ai/prompts/prompt-assembly.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function assemblyStageAtOrAfter(a: PromptAssemblyStage, b: PromptAssemblyStage): boolean {
  return PROMPT_ASSEMBLY_STAGE_RANK[a] >= PROMPT_ASSEMBLY_STAGE_RANK[b];
}
