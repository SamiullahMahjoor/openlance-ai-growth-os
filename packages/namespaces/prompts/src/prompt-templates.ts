/**
 * Prompt templates: the reusable structural forms a prompt is built from, and prompt reuse and
 * consistency (ai/prompts/prompt-templates.md, OL-AI-PROMPTS-PROMPT-TEMPLATES).
 *
 * The Specification narrates the template model as heterogeneous facets (the template model, prompt reuse,
 * prompt consistency, referenced places not embedded truth), not a closed taxonomy the model refers to by
 * identity, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. It owns the template model only; it never
 * defines a template language, a syntax, or a format (implementation), and it never defines the layers a
 * template organizes (ai/prompts/prompt-architecture.md). A template holds defined places for referenced
 * context and never embeds business truth (ADR-0020).
 */

/**
 * A prompt-templates principle: a permanent rule the template model upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-templates.md, "Principles").
 */
export type PromptTemplatePrinciple =
  | 'a-template-is-a-reusable-form-not-content'
  | 'templates-provide-reuse'
  | 'templates-provide-consistency'
  | 'templates-hold-references-not-truth';

/** The prompt-templates principles, in constitutional order; frozen. */
export const PROMPT_TEMPLATE_PRINCIPLES: readonly PromptTemplatePrinciple[] = Object.freeze([
  'a-template-is-a-reusable-form-not-content',
  'templates-provide-reuse',
  'templates-provide-consistency',
  'templates-hold-references-not-truth',
]);

/** What each prompt-templates principle requires (ai/prompts/prompt-templates.md, "Principles"). */
export const PROMPT_TEMPLATE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptTemplatePrinciple, string>
> = Object.freeze({
  'a-template-is-a-reusable-form-not-content':
    'A template names a reusable structural form with defined places for parts; it is never prompt text, a language, or a format.',
  'templates-provide-reuse':
    'A template is defined once and used by many prompts, so a common structure is not restated for each prompt.',
  'templates-provide-consistency':
    'Prompts built from the same template share the same structure, so prompt structure is consistent across the namespace.',
  'templates-hold-references-not-truth':
    'A template holds defined places for referenced context, and never embeds business truth, which a prompt points to under ai/prompts/prompt-context.md.',
});

/**
 * A prompt-templates invariant: a guarantee the template model always upholds
 * (ai/prompts/prompt-templates.md, "Invariants").
 */
export type PromptTemplateInvariant =
  | 'a-template-is-a-form-with-places-never-content'
  | 'defined-once-used-by-many'
  | 'same-template-shared-consistent-structure'
  | 'holds-places-never-embeds-truth'
  | 'defining-a-template-is-inert';

/** The prompt-templates invariants, in constitutional order; frozen. */
export const PROMPT_TEMPLATE_INVARIANTS: readonly PromptTemplateInvariant[] = Object.freeze([
  'a-template-is-a-form-with-places-never-content',
  'defined-once-used-by-many',
  'same-template-shared-consistent-structure',
  'holds-places-never-embeds-truth',
  'defining-a-template-is-inert',
]);

/** What each prompt-templates invariant guarantees (ai/prompts/prompt-templates.md, "Invariants"). */
export const PROMPT_TEMPLATE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptTemplateInvariant, string>
> = Object.freeze({
  'a-template-is-a-form-with-places-never-content':
    'A template is a reusable structural form with defined places, never prompt text, a language, or a format.',
  'defined-once-used-by-many':
    'A template is defined once and used by many prompts, providing reuse without restating structure.',
  'same-template-shared-consistent-structure':
    'Prompts built from the same template share a consistent structure.',
  'holds-places-never-embeds-truth':
    'A template holds defined places for referenced context and never embeds business truth.',
  'defining-a-template-is-inert':
    'Defining a template never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});
