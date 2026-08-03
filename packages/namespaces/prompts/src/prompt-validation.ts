/**
 * Prompt validation: validation before a prompt is expressed, and prompt validation ordering
 * (ai/prompts/prompt-validation.md, OL-AI-PROMPTS-PROMPT-VALIDATION).
 *
 * A composed prompt is validated through a fixed order of checks, from governance conformance first to
 * grounding last; a prompt that fails any check is not expressed. The checks are conjunctive (all must
 * hold) and ordered, and this concern explicitly owns the ordering ("prompt validation ordering"). This
 * module defines the ordered checks, their principles, and their invariants, plus the pure ordering
 * predicate the document's ordering states. The governance rules the first check applies are owned by
 * ai/governance/constitutional-validation.md, applied not restated (ADR-0020).
 */

/**
 * A prompt-validation principle: a permanent rule prompt validation upholds, each instantiating a prompt
 * invariant (ai/prompts/prompt-validation.md, "Principles").
 */
export type PromptValidationPrinciple =
  | 'validation-precedes-expression'
  | 'validation-is-ordered'
  | 'governance-is-checked-first'
  | 'grounding-is-required';

/** The prompt-validation principles, in constitutional order; frozen. */
export const PROMPT_VALIDATION_PRINCIPLES: readonly PromptValidationPrinciple[] = Object.freeze([
  'validation-precedes-expression',
  'validation-is-ordered',
  'governance-is-checked-first',
  'grounding-is-required',
]);

/** What each prompt-validation principle requires (ai/prompts/prompt-validation.md, "Principles"). */
export const PROMPT_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<PromptValidationPrinciple, string>
> = Object.freeze({
  'validation-precedes-expression':
    'A prompt is validated before it is expressed, and a prompt that fails validation is not expressed.',
  'validation-is-ordered':
    'The checks are applied in a fixed order, so the same prompt is validated the same way.',
  'governance-is-checked-first':
    'A prompt is checked for governance conformance before narrower checks, so an ungoverned prompt is rejected early.',
  'grounding-is-required':
    'A prompt is validated to point to knowledge and never to embed or restate it, so no prompt carries business truth as content.',
});

/**
 * A prompt-validation check, in constitutional order from first-applied to last-applied
 * (ai/prompts/prompt-validation.md, "Specification"). The checks are conjunctive (a prompt that fails any
 * is not expressed) and their order is the document's, total, and exposed by
 * {@link validationCheckAtOrAfter}.
 */
export type PromptValidationCheck =
  | 'governance-conformance'
  | 'boundary-conformance'
  | 'structural-completeness'
  | 'grounding-and-separation';

/** The prompt-validation checks, first-applied to last-applied; frozen. */
export const PROMPT_VALIDATION_CHECKS: readonly PromptValidationCheck[] = Object.freeze([
  'governance-conformance',
  'boundary-conformance',
  'structural-completeness',
  'grounding-and-separation',
]);

/** What each prompt-validation check validates (ai/prompts/prompt-validation.md, "Specification"). */
export const PROMPT_VALIDATION_CHECK_DESCRIPTIONS: Readonly<Record<PromptValidationCheck, string>> =
  Object.freeze({
    'governance-conformance':
      'The prompt is validated to conform to the governing rules, applying the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates; this check is first, so an ungoverned prompt does not proceed.',
    'boundary-conformance':
      'The prompt is validated to stay within the prompt boundaries owned by ai/prompts/prompt-boundaries.md, so it owns nothing beyond prompt architecture.',
    'structural-completeness':
      'The prompt is validated to be complete for its purpose: its required layers are present in order under ai/prompts/prompt-architecture.md, and it was assembled and normalized under ai/prompts/prompt-assembly.md.',
    'grounding-and-separation':
      'The prompt is validated to point to its referenced context rather than embed it, under ai/prompts/prompt-context.md, so a prompt is not a source of truth.',
  });

/**
 * A prompt-validation invariant: a guarantee prompt validation always upholds
 * (ai/prompts/prompt-validation.md, "Invariants").
 */
export type PromptValidationInvariant =
  | 'validated-before-expressed'
  | 'checks-applied-in-fixed-order-governance-first-grounding-last'
  | 'validated-to-point-never-embed'
  | 'validation-defines-what-and-order-never-the-rule'
  | 'validating-is-inert';

/** The prompt-validation invariants, in constitutional order; frozen. */
export const PROMPT_VALIDATION_INVARIANTS: readonly PromptValidationInvariant[] = Object.freeze([
  'validated-before-expressed',
  'checks-applied-in-fixed-order-governance-first-grounding-last',
  'validated-to-point-never-embed',
  'validation-defines-what-and-order-never-the-rule',
  'validating-is-inert',
]);

/** What each prompt-validation invariant guarantees (ai/prompts/prompt-validation.md, "Invariants"). */
export const PROMPT_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<PromptValidationInvariant, string>
> = Object.freeze({
  'validated-before-expressed':
    'A prompt is validated before it is expressed, and a prompt that fails validation is not expressed.',
  'checks-applied-in-fixed-order-governance-first-grounding-last':
    'The checks are applied in a fixed order, governance conformance first and grounding last.',
  'validated-to-point-never-embed':
    'A prompt is validated to point to knowledge and never to embed or restate it.',
  'validation-defines-what-and-order-never-the-rule':
    'Validation defines what is checked and in what order, never the governance rule, which is owned by ai/governance/.',
  'validating-is-inert':
    'Validating a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each validation check in the constitutional order (first-applied = 0). Internal to
 * the ordering predicate; never exported.
 */
const PROMPT_VALIDATION_CHECK_RANK: Readonly<Record<PromptValidationCheck, number>> = Object.freeze({
  'governance-conformance': 0,
  'boundary-conformance': 1,
  'structural-completeness': 2,
  'grounding-and-separation': 3,
});

/**
 * Whether validation check `a` is at or after validation check `b` in the constitutional check order, from
 * governance conformance first to grounding last (ai/prompts/prompt-validation.md, "Specification"). Pure
 * and total: it reads only the fixed order the document defines and expresses that order verbatim. It
 * states no policy of its own.
 */
export function validationCheckAtOrAfter(
  a: PromptValidationCheck,
  b: PromptValidationCheck,
): boolean {
  return PROMPT_VALIDATION_CHECK_RANK[a] >= PROMPT_VALIDATION_CHECK_RANK[b];
}
