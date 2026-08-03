/**
 * Prompt inheritance: the inheritance hierarchy and dependency model of prompts, and prompt conflict
 * resolution (ai/prompts/prompt-inheritance.md, OL-AI-PROMPTS-PROMPT-INHERITANCE).
 *
 * The Specification narrates the hierarchy, the dependency model, conflict resolution, and unresolvable
 * conflict; the conflict-resolution precedence (higher authority, then single owner, then greater
 * specificity) applies the Authority Hierarchy owned by ai/README.md and the ownership owned by
 * ai/architecture/ownership-map.md, and the document states it "mirrors the conflict resolution of the
 * knowledge repository and never invents a resolution." By the referenced-model non-restatement rule
 * (docs/implementation/10-governance.md section 7a) and the boundary rule, that precedence is recorded as
 * prose in the principles and invariants and is NOT recreated as an executable ordering: its inputs
 * (authority, ownership) are not prompt-owned, so no conflict-tier classification and no precedence
 * predicate are grounded. This concern is therefore definitions only. Composition of the resolved parts is
 * owned by ai/prompts/prompt-composition.md; an unresolvable conflict is escalated under
 * ai/governance/escalation.md (ADR-0020, ADR-0025).
 */

/**
 * A prompt-inheritance principle: a permanent rule prompt inheritance upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-inheritance.md, "Principles").
 */
export type PromptInheritancePrinciple =
  | 'inheritance-is-derivation-not-duplication'
  | 'hierarchy-descends-general-to-specific'
  | 'a-derived-prompt-depends-on-its-base'
  | 'conflicts-resolve-by-authority-then-owner-then-specificity';

/** The prompt-inheritance principles, in constitutional order; frozen. */
export const PROMPT_INHERITANCE_PRINCIPLES: readonly PromptInheritancePrinciple[] = Object.freeze([
  'inheritance-is-derivation-not-duplication',
  'hierarchy-descends-general-to-specific',
  'a-derived-prompt-depends-on-its-base',
  'conflicts-resolve-by-authority-then-owner-then-specificity',
]);

/** What each prompt-inheritance principle requires (ai/prompts/prompt-inheritance.md, "Principles"). */
export const PROMPT_INHERITANCE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptInheritancePrinciple, string>
> = Object.freeze({
  'inheritance-is-derivation-not-duplication':
    'A prompt derives shared parts from a base prompt rather than restating them, so common structure is defined once.',
  'hierarchy-descends-general-to-specific':
    'A base prompt holds the more general parts, and a derived prompt adds the more specific, so specificity increases down the hierarchy.',
  'a-derived-prompt-depends-on-its-base':
    'A prompt depends on the base prompts and shared definitions it derives from, and that dependency is explicit and traceable.',
  'conflicts-resolve-by-authority-then-owner-then-specificity':
    'Where inherited parts conflict, the higher authority wins; where authority is equal, the single owner governs; where still unresolved, the more specific derived part governs, and an unresolvable conflict is escalated rather than guessed.',
});

/**
 * A prompt-inheritance invariant: a guarantee prompt inheritance always upholds
 * (ai/prompts/prompt-inheritance.md, "Invariants").
 */
export type PromptInheritanceInvariant =
  | 'derived-inherits-shared-parts-not-restates'
  | 'derived-depends-explicitly-on-base'
  | 'conflict-resolves-by-authority-then-owner-then-specificity'
  | 'unresolvable-conflict-escalated-never-guessed'
  | 'resolving-inheritance-is-inert';

/** The prompt-inheritance invariants, in constitutional order; frozen. */
export const PROMPT_INHERITANCE_INVARIANTS: readonly PromptInheritanceInvariant[] = Object.freeze([
  'derived-inherits-shared-parts-not-restates',
  'derived-depends-explicitly-on-base',
  'conflict-resolves-by-authority-then-owner-then-specificity',
  'unresolvable-conflict-escalated-never-guessed',
  'resolving-inheritance-is-inert',
]);

/** What each prompt-inheritance invariant guarantees (ai/prompts/prompt-inheritance.md, "Invariants"). */
export const PROMPT_INHERITANCE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptInheritanceInvariant, string>
> = Object.freeze({
  'derived-inherits-shared-parts-not-restates':
    'A derived prompt inherits shared parts from its base rather than restating them.',
  'derived-depends-explicitly-on-base':
    'A derived prompt depends explicitly and traceably on the base prompts it derives from.',
  'conflict-resolves-by-authority-then-owner-then-specificity':
    'A conflict among parts resolves by higher authority, then single owner, then greater specificity.',
  'unresolvable-conflict-escalated-never-guessed':
    'An unresolvable conflict is escalated, never guessed, and yields no composed prompt.',
  'resolving-inheritance-is-inert':
    'Resolving inheritance never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});
