/**
 * Evaluation validation: how an evaluation is validated, and in what order, before its result is accepted
 * (ai/evaluation/evaluation-validation.md, OL-AI-EVALUATION-EVALUATION-VALIDATION).
 *
 * An evaluation is validated through a fixed order of checks, from well-formedness first to constitutional
 * conformance last; an evaluation that fails any check yields no accepted result. The checks are conjunctive
 * (all must hold) and ordered, and this concern explicitly owns the ordering ("validation ordering"). This
 * module defines the ordered checks, their principles, and their invariants, plus the pure ordering predicate
 * the document's ordering states. The governance rules the constitutional check applies are owned by
 * ai/governance/constitutional-validation.md, applied not restated (ADR-0020).
 */

/**
 * An evaluation-validation principle: a permanent rule evaluation validation upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-validation.md, "Principles").
 */
export type EvaluationValidationPrinciple =
  | 'validation-precedes-acceptance'
  | 'validation-is-ordered'
  | 'grounding-is-required'
  | 'failure-is-inert';

/** The evaluation-validation principles, in constitutional order; frozen. */
export const EVALUATION_VALIDATION_PRINCIPLES: readonly EvaluationValidationPrinciple[] =
  Object.freeze([
    'validation-precedes-acceptance',
    'validation-is-ordered',
    'grounding-is-required',
    'failure-is-inert',
  ]);

/** What each evaluation-validation principle requires (ai/evaluation/evaluation-validation.md, "Principles"). */
export const EVALUATION_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationValidationPrinciple, string>
> = Object.freeze({
  'validation-precedes-acceptance':
    'An evaluation result is validated before it is accepted, and a result that fails validation is not accepted.',
  'validation-is-ordered':
    'The checks are applied in a fixed order, so the same evaluation is validated the same way.',
  'grounding-is-required':
    'An evaluation is validated to rest on defined metrics and, where used, a benchmark, and to measure against the truth the knowledge repository owns, never on invented ground.',
  'failure-is-inert':
    'An evaluation that fails validation yields no accepted result and informs no decision; it is corrected or discarded.',
});

/**
 * An evaluation-validation check, in constitutional order from first-applied to last-applied
 * (ai/evaluation/evaluation-validation.md, "Specification"). The checks are conjunctive (an evaluation that
 * fails any yields no accepted result) and their order is the document's, total, and exposed by
 * {@link evaluationValidationCheckAtOrAfter}.
 */
export type EvaluationValidationCheck =
  | 'well-formedness-validation'
  | 'grounding-validation'
  | 'scoring-validation'
  | 'constitutional-validation';

/** The evaluation-validation checks, first-applied to last-applied; frozen. */
export const EVALUATION_VALIDATION_CHECKS: readonly EvaluationValidationCheck[] = Object.freeze([
  'well-formedness-validation',
  'grounding-validation',
  'scoring-validation',
  'constitutional-validation',
]);

/** What each evaluation-validation check validates (ai/evaluation/evaluation-validation.md, "Specification"). */
export const EVALUATION_VALIDATION_CHECK_DESCRIPTIONS: Readonly<
  Record<EvaluationValidationCheck, string>
> = Object.freeze({
  'well-formedness-validation':
    'The evaluation is validated to be well formed: it has a defined subject output, defined metrics under ai/evaluation/evaluation-metrics.md, and, where a comparison is made, a defined benchmark under ai/evaluation/evaluation-benchmarking.md; this check is first, so a malformed evaluation is rejected early.',
  'grounding-validation':
    'The evaluation is validated to be grounded: its measurements rest on the defined metrics and the truth owned by the knowledge repository, not on invented ground, so a result is never accepted from an ungrounded evaluation.',
  'scoring-validation':
    'The score is validated to be derived from the measured metrics under ai/evaluation/evaluation-scoring.md, so that a score is traceable to its measurements and not assigned by opinion.',
  'constitutional-validation':
    'The evaluation conforms to the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates.',
});

/**
 * An evaluation-validation invariant: a guarantee evaluation validation always upholds
 * (ai/evaluation/evaluation-validation.md, "Invariants").
 */
export type EvaluationValidationInvariant =
  | 'result-validated-before-accepted-fails-not-accepted'
  | 'checks-applied-in-fixed-order-well-formedness-first'
  | 'validated-to-be-grounded-and-score-traceable'
  | 'validation-defines-what-and-order-never-the-rule'
  | 'validating-an-evaluation-is-inert';

/** The evaluation-validation invariants, in constitutional order; frozen. */
export const EVALUATION_VALIDATION_INVARIANTS: readonly EvaluationValidationInvariant[] =
  Object.freeze([
    'result-validated-before-accepted-fails-not-accepted',
    'checks-applied-in-fixed-order-well-formedness-first',
    'validated-to-be-grounded-and-score-traceable',
    'validation-defines-what-and-order-never-the-rule',
    'validating-an-evaluation-is-inert',
  ]);

/** What each evaluation-validation invariant guarantees (ai/evaluation/evaluation-validation.md, "Invariants"). */
export const EVALUATION_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationValidationInvariant, string>
> = Object.freeze({
  'result-validated-before-accepted-fails-not-accepted':
    'An evaluation result is validated before it is accepted, and a result that fails validation is not accepted.',
  'checks-applied-in-fixed-order-well-formedness-first':
    'The checks are applied in a fixed order, well-formedness first.',
  'validated-to-be-grounded-and-score-traceable':
    'An evaluation is validated to be grounded and to have a score traceable to its metrics.',
  'validation-defines-what-and-order-never-the-rule':
    'Validation defines what is checked and in what order, never the governance rule, which is owned by ai/governance/.',
  'validating-an-evaluation-is-inert':
    'Validating an evaluation never reasons, executes, decides, measures, changes behavior, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each validation check in the constitutional order (first-applied = 0). Internal to the
 * ordering predicate; never exported.
 */
const EVALUATION_VALIDATION_CHECK_RANK: Readonly<Record<EvaluationValidationCheck, number>> =
  Object.freeze({
    'well-formedness-validation': 0,
    'grounding-validation': 1,
    'scoring-validation': 2,
    'constitutional-validation': 3,
  });

/**
 * Whether validation check `a` is at or after validation check `b` in the constitutional check order, from
 * well-formedness first to constitutional conformance last (ai/evaluation/evaluation-validation.md,
 * "Specification"). Pure and total: it reads only the fixed order the document defines and expresses that
 * order verbatim. It states no policy of its own.
 */
export function evaluationValidationCheckAtOrAfter(
  a: EvaluationValidationCheck,
  b: EvaluationValidationCheck,
): boolean {
  return EVALUATION_VALIDATION_CHECK_RANK[a] >= EVALUATION_VALIDATION_CHECK_RANK[b];
}
