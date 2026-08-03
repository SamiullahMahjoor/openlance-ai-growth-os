/**
 * Retrieval validation (ai/retrieval/retrieval-validation.md, OL-AI-RETRIEVAL-RETRIEVAL-VALIDATION).
 *
 * What a retrieval result is validated against before it is handed to the runtime for loading, as
 * immutable definitions (ADR-0020). This concern owns retrieval validation only; it never defines a
 * validation rule (owned by ai/governance/ and the knowledge repository, which it applies and never
 * restates) nor the execution validation that precedes execution (owned by
 * ai/runtime/validation-pipeline.md). Validating a concrete result against the concrete repository state
 * is a runtime evaluation this concern does not own; it is deferred to the runtime. This concern states
 * the five dimensions a result is validated against and the invariants it always satisfies.
 */

/**
 * A retrieval-validation principle (ai/retrieval/retrieval-validation.md, "Principles"). Each
 * instantiates a retrieval invariant owned by ai/retrieval/README.md.
 */
export type RetrievalValidationPrinciple =
  | 'validation-precedes-loading'
  | 'against-canonical-sources'
  | 'failed-result-not-loaded'
  | 'deterministic';

/** The four retrieval-validation principles, in constitutional order; frozen. */
export const RETRIEVAL_VALIDATION_PRINCIPLES: readonly RetrievalValidationPrinciple[] =
  Object.freeze([
    'validation-precedes-loading',
    'against-canonical-sources',
    'failed-result-not-loaded',
    'deterministic',
  ]);

/** The statement each retrieval-validation principle makes (ai/retrieval/retrieval-validation.md). */
export const RETRIEVAL_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RetrievalValidationPrinciple, string>
> = Object.freeze({
  'validation-precedes-loading':
    'A retrieval result is validated before it is handed to the runtime; nothing is loaded on an unvalidated result.',
  'against-canonical-sources':
    'The result is validated against the ownership, authority, dependencies, and boundaries owned by the knowledge repository, and against the permissions owned by ai/governance/, never against a restated copy.',
  'failed-result-not-loaded':
    'A retrieval result that fails validation is corrected or refused, never handed off anyway.',
  deterministic:
    'The same result against the same repository state and rules validates the same way.',
});

/**
 * A dimension a retrieval result is validated against (ai/retrieval/retrieval-validation.md,
 * "Specification"). A result is validated against exactly these five dimensions before handoff; each
 * dimension's rule is owned by the source it names and is applied here, never restated. They are
 * conjunctive - a result is validated against all of them.
 */
export type RetrievalValidationDimension =
  'ownership' | 'authority' | 'dependency-completeness' | 'boundaries' | 'governance-permission';

/** The five retrieval validation dimensions, in constitutional order; frozen. */
export const RETRIEVAL_VALIDATION_DIMENSIONS: readonly RetrievalValidationDimension[] =
  Object.freeze([
    'ownership',
    'authority',
    'dependency-completeness',
    'boundaries',
    'governance-permission',
  ]);

/** What each retrieval validation dimension checks, and its owner (ai/retrieval/retrieval-validation.md). */
export const RETRIEVAL_VALIDATION_DIMENSION_DESCRIPTIONS: Readonly<
  Record<RetrievalValidationDimension, string>
> = Object.freeze({
  ownership:
    'Every piece in the result is a single canonical owner of its concern, with no duplicate and no restated source, consistent with knowledge/architecture/ownership-map.md.',
  authority:
    'The result includes the higher-authority knowledge that governs each piece, and its priority order places governing knowledge first, consistent with knowledge/architecture/authority-map.md.',
  'dependency-completeness':
    'Every declared dependency of every piece is present, consistent with knowledge/architecture/dependency-map.md and ai/retrieval/dependency-resolution.md.',
  boundaries:
    'The result stays within the retrieval boundaries owned by ai/retrieval/retrieval-boundaries.md, and contains only knowledge, never business truth restated, a governance rule, or runtime state.',
  'governance-permission':
    'The execution is permitted to consume every piece in the result, under ai/governance/constitutional-validation.md and ai/governance/permission-governance.md, which this validation applies and never restates.',
});

/**
 * A retrieval-validation invariant (ai/retrieval/retrieval-validation.md, "Invariants"): a guarantee
 * that always holds for retrieval validation.
 */
export type RetrievalValidationInvariant =
  | 'no-handoff-before-validation'
  | 'confirms-five-dimensions'
  | 'failed-corrected-or-refused'
  | 'defines-check-not-rule'
  | 'validating-is-inert';

/** The five retrieval-validation invariants, in constitutional order; frozen. */
export const RETRIEVAL_VALIDATION_INVARIANTS: readonly RetrievalValidationInvariant[] =
  Object.freeze([
    'no-handoff-before-validation',
    'confirms-five-dimensions',
    'failed-corrected-or-refused',
    'defines-check-not-rule',
    'validating-is-inert',
  ]);

/** The guarantee each retrieval-validation invariant states (ai/retrieval/retrieval-validation.md). */
export const RETRIEVAL_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RetrievalValidationInvariant, string>
> = Object.freeze({
  'no-handoff-before-validation': 'No retrieval result is handed off before it passes validation.',
  'confirms-five-dimensions':
    'Validation confirms ownership, authority, dependency completeness, boundaries, and governance permission.',
  'failed-corrected-or-refused':
    'A result that fails validation is corrected or refused, never loaded.',
  'defines-check-not-rule':
    'Validation defines what is checked, never the rule; the rules are owned by the knowledge repository and ai/governance/.',
  'validating-is-inert':
    'Validating a result never loads knowledge and never changes ownership, authority, governance, or business truth.',
});
