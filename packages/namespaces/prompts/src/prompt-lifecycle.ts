/**
 * Prompt lifecycle: the phases of a prompt, from definition through expression to retirement
 * (ai/prompts/prompt-lifecycle.md, OL-AI-PROMPTS-PROMPT-LIFECYCLE).
 *
 * A prompt passes through a fixed order of phases, from being defined to being composed, validated,
 * expressed, and retired. This module defines the ordered phases, their principles, and their invariants,
 * plus the pure ordering predicate the document's ordering states. Each phase completes before the next
 * begins, except where validation returns a prompt to composition for correction; the ordered assembly
 * stages within composition are owned by ai/prompts/prompt-assembly.md and the execution the prompt serves
 * by ai/runtime/, referenced not restated (ADR-0020).
 */

/**
 * A prompt-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-lifecycle.md, "Principles").
 */
export type PromptLifecyclePrinciple =
  | 'defined-beginning-and-end'
  | 'definition-precedes-composition'
  | 'validation-precedes-expression'
  | 'every-prompt-is-transient';

/** The prompt-lifecycle principles, in constitutional order; frozen. */
export const PROMPT_LIFECYCLE_PRINCIPLES: readonly PromptLifecyclePrinciple[] = Object.freeze([
  'defined-beginning-and-end',
  'definition-precedes-composition',
  'validation-precedes-expression',
  'every-prompt-is-transient',
]);

/** What each prompt-lifecycle principle requires (ai/prompts/prompt-lifecycle.md, "Principles"). */
export const PROMPT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptLifecyclePrinciple, string>
> = Object.freeze({
  'defined-beginning-and-end':
    'A prompt begins as a definition and ends when it is expressed and retired; a prompt is transient and is never stored as truth.',
  'definition-precedes-composition':
    "A prompt's structure and derivation are established before it is composed for an execution.",
  'validation-precedes-expression':
    'A prompt is validated before it is expressed, and an invalid prompt is not expressed.',
  'every-prompt-is-transient':
    'A composed prompt exists for its execution and is retired afterward, never promoted into the knowledge repository.',
});

/**
 * A prompt-lifecycle phase, in constitutional order from earliest to latest
 * (ai/prompts/prompt-lifecycle.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link promptPhaseAtOrAfter}.
 */
export type PromptLifecyclePhase =
  | 'definition'
  | 'composition'
  | 'validation'
  | 'expression'
  | 'retirement';

/** The prompt-lifecycle phases, earliest to latest; frozen. */
export const PROMPT_LIFECYCLE_PHASES: readonly PromptLifecyclePhase[] = Object.freeze([
  'definition',
  'composition',
  'validation',
  'expression',
  'retirement',
]);

/** What each prompt-lifecycle phase is (ai/prompts/prompt-lifecycle.md, "Specification"). */
export const PROMPT_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<Record<PromptLifecyclePhase, string>> =
  Object.freeze({
    definition:
      "The prompt's architecture is defined: its layers under ai/prompts/prompt-architecture.md, the template it uses under ai/prompts/prompt-templates.md, and the base prompts it derives from under ai/prompts/prompt-inheritance.md; definition establishes the durable structure a prompt is composed from, and holds no execution-specific content.",
    composition:
      'For an execution, the defined structure is composed with the governed intent and the referenced context into a prompt, under ai/prompts/prompt-composition.md and ai/prompts/prompt-assembly.md; the context is referenced under ai/prompts/prompt-context.md and never embedded.',
    validation:
      'The composed prompt is validated under ai/prompts/prompt-validation.md for governance conformance, boundary conformance, completeness, and grounding, before it is expressed.',
    expression:
      'The validated prompt is expressed as a transient instruction, carried by ai/runtime/ and executed by the Providers namespace; this namespace owns the prompt up to expression and never executes it.',
    retirement:
      'After the execution, the composed prompt is retired; it is transient and is never stored as truth or promoted into the knowledge repository, though a durable definition, template, or base prompt persists as architecture, not as a prompt.',
  });

/**
 * A prompt-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/prompts/prompt-lifecycle.md, "Invariants").
 */
export type PromptLifecycleInvariant =
  | 'one-lifecycle-per-prompt'
  | 'phases-occur-in-order'
  | 'validated-before-expressed'
  | 'transient-retired-never-promoted'
  | 'lifecycle-is-inert';

/** The prompt-lifecycle invariants, in constitutional order; frozen. */
export const PROMPT_LIFECYCLE_INVARIANTS: readonly PromptLifecycleInvariant[] = Object.freeze([
  'one-lifecycle-per-prompt',
  'phases-occur-in-order',
  'validated-before-expressed',
  'transient-retired-never-promoted',
  'lifecycle-is-inert',
]);

/** What each prompt-lifecycle invariant guarantees (ai/prompts/prompt-lifecycle.md, "Invariants"). */
export const PROMPT_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-prompt':
    'A prompt holds exactly one lifecycle, from one definition to expression and retirement.',
  'phases-occur-in-order':
    'The Definition phase precedes Composition, which precedes Validation, which precedes Expression.',
  'validated-before-expressed':
    'A prompt is validated before it is expressed, and an invalid prompt is not expressed.',
  'transient-retired-never-promoted':
    'A composed prompt is transient and is retired after its execution, never stored as truth or promoted into the knowledge repository.',
  'lifecycle-is-inert':
    'The lifecycle never executes, reasons, retrieves knowledge, persists, or alters ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const PROMPT_LIFECYCLE_PHASE_RANK: Readonly<Record<PromptLifecyclePhase, number>> = Object.freeze({
  definition: 0,
  composition: 1,
  validation: 2,
  expression: 3,
  retirement: 4,
});

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/prompts/prompt-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function promptPhaseAtOrAfter(a: PromptLifecyclePhase, b: PromptLifecyclePhase): boolean {
  return PROMPT_LIFECYCLE_PHASE_RANK[a] >= PROMPT_LIFECYCLE_PHASE_RANK[b];
}
