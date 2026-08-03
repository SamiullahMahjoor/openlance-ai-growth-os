/**
 * Prompt versioning: how a prompt definition is versioned and evolves, change governance consumption, and
 * version compatibility (ai/prompts/prompt-versioning.md, OL-AI-PROMPTS-PROMPT-VERSIONING).
 *
 * The Specification narrates prompt versioning, prompt evolution, version compatibility, and change
 * governance and conflict; what change is permitted, reviewed, and approved is owned by
 * ai/governance/change-governance.md (applied not restated), and conflict resolution by
 * ai/prompts/prompt-inheritance.md. It is not a closed taxonomy the model refers to by identity, so this
 * concern is definitions only (principles and invariants), consistent with the modeling rule recorded in
 * docs/implementation/13-retrieval.md section 4. Versioning applies to prompt architecture, never to
 * business truth (versioned by the knowledge repository) and never to a transient composed prompt
 * (ADR-0020).
 */

/**
 * A prompt-versioning principle: a permanent rule prompt versioning upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-versioning.md, "Principles").
 */
export type PromptVersioningPrinciple =
  | 'a-prompt-definition-is-versioned'
  | 'change-is-governed'
  | 'compatibility-is-preserved-or-versioned'
  | 'versioning-governs-definitions-not-truth';

/** The prompt-versioning principles, in constitutional order; frozen. */
export const PROMPT_VERSIONING_PRINCIPLES: readonly PromptVersioningPrinciple[] = Object.freeze([
  'a-prompt-definition-is-versioned',
  'change-is-governed',
  'compatibility-is-preserved-or-versioned',
  'versioning-governs-definitions-not-truth',
]);

/** What each prompt-versioning principle requires (ai/prompts/prompt-versioning.md, "Principles"). */
export const PROMPT_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptVersioningPrinciple, string>
> = Object.freeze({
  'a-prompt-definition-is-versioned':
    'A durable prompt definition, layer, template, or base prompt carries a version, so a change is identified and traceable.',
  'change-is-governed':
    'A prompt definition evolves only under the change rules owned by ai/governance/, never arbitrarily and never as a side effect of composing a prompt.',
  'compatibility-is-preserved-or-versioned':
    'A change that a derived prompt can still depend on preserves compatibility; a change that a derived prompt cannot is a new version, so a dependent prompt is never silently broken.',
  'versioning-governs-definitions-not-truth':
    'Versioning applies to prompt architecture, never to business truth, which is versioned by the knowledge repository, and never to a composed prompt, which is transient.',
});

/**
 * A prompt-versioning invariant: a guarantee prompt versioning always upholds
 * (ai/prompts/prompt-versioning.md, "Invariants").
 */
export type PromptVersioningInvariant =
  | 'a-durable-definition-carries-a-version'
  | 'evolves-only-under-governed-change'
  | 'incompatible-change-is-a-new-version'
  | 'versioning-applies-to-architecture-not-truth-or-transient-prompt'
  | 'versioning-is-inert';

/** The prompt-versioning invariants, in constitutional order; frozen. */
export const PROMPT_VERSIONING_INVARIANTS: readonly PromptVersioningInvariant[] = Object.freeze([
  'a-durable-definition-carries-a-version',
  'evolves-only-under-governed-change',
  'incompatible-change-is-a-new-version',
  'versioning-applies-to-architecture-not-truth-or-transient-prompt',
  'versioning-is-inert',
]);

/** What each prompt-versioning invariant guarantees (ai/prompts/prompt-versioning.md, "Invariants"). */
export const PROMPT_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptVersioningInvariant, string>
> = Object.freeze({
  'a-durable-definition-carries-a-version':
    'A durable prompt definition carries a version, so a change to it is explicit and traceable.',
  'evolves-only-under-governed-change':
    'A prompt definition evolves only under the governed change rules, never arbitrarily and never as a side effect of composition.',
  'incompatible-change-is-a-new-version':
    'A change that a dependent prompt cannot absorb is a new version, so no dependent prompt is broken silently.',
  'versioning-applies-to-architecture-not-truth-or-transient-prompt':
    'Versioning applies to prompt architecture, never to business truth and never to a transient composed prompt.',
  'versioning-is-inert':
    'Versioning a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});
