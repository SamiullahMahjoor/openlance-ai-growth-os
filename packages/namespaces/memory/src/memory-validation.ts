/**
 * Memory validation (ai/memory/memory-validation.md, OL-AI-MEMORY-MEMORY-VALIDATION).
 *
 * How remembered information is validated - that a memory is grounded, is runtime state and not truth,
 * and is scoped - as immutable definitions (ADR-0020). This concern owns memory validation only; it
 * never defines a governance validation rule (owned by ai/governance/constitutional-validation.md,
 * which it applies and never restates) nor the consistency of memory (owned by
 * ai/memory/memory-consistency.md). Evaluating a concrete check is a runtime evaluation this concern
 * does not own. This concern states what is validated and the invariants it always satisfies.
 */

/**
 * A memory-validation principle (ai/memory/memory-validation.md, "Principles"). Each instantiates a
 * memory invariant owned by ai/memory/README.md.
 */
export type MemoryValidationPrinciple =
  'grounded' | 'never-business-truth' | 'invalid-not-retained' | 'governed';

/** The four memory-validation principles, in constitutional order; frozen. */
export const MEMORY_VALIDATION_PRINCIPLES: readonly MemoryValidationPrinciple[] = Object.freeze([
  'grounded',
  'never-business-truth',
  'invalid-not-retained',
  'governed',
]);

/** The statement each memory-validation principle makes (ai/memory/memory-validation.md). */
export const MEMORY_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryValidationPrinciple, string>
> = Object.freeze({
  grounded:
    'A memory rests only on what was actually formed by an execution, never on an invented fact.',
  'never-business-truth':
    'A memory records runtime state, and never records, restates, or becomes the truth owned by the knowledge repository.',
  'invalid-not-retained':
    'A memory that cannot be validated as grounded is not retained, and a memory relied on is validated first.',
  governed:
    'Remembered information conforms to the constitutional validation owned by ai/governance/, which this validation applies and never restates.',
});

/**
 * A memory-validation invariant (ai/memory/memory-validation.md, "Invariants"): a guarantee that always
 * holds for the validation model.
 */
export type MemoryValidationInvariant =
  | 'grounded-never-invented'
  | 'runtime-state-never-promoted'
  | 'ungrounded-not-retained'
  | 'defines-check-not-rule'
  | 'validating-is-inert';

/** The five memory-validation invariants, in constitutional order; frozen. */
export const MEMORY_VALIDATION_INVARIANTS: readonly MemoryValidationInvariant[] = Object.freeze([
  'grounded-never-invented',
  'runtime-state-never-promoted',
  'ungrounded-not-retained',
  'defines-check-not-rule',
  'validating-is-inert',
]);

/** The guarantee each memory-validation invariant states (ai/memory/memory-validation.md). */
export const MEMORY_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryValidationInvariant, string>
> = Object.freeze({
  'grounded-never-invented':
    'A retained memory is grounded in what was actually formed, never in an invented fact.',
  'runtime-state-never-promoted':
    'A memory holds runtime state and never business truth, and is never promoted into the knowledge repository.',
  'ungrounded-not-retained':
    'A memory that cannot be validated as grounded and scoped is not retained.',
  'defines-check-not-rule':
    'Validation defines what is checked, never the governance rule, which is owned by ai/governance/.',
  'validating-is-inert':
    'Validating a memory never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
