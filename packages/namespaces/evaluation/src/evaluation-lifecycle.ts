/**
 * Evaluation lifecycle: the phases of an evaluation, from framing to a validated result
 * (ai/evaluation/evaluation-lifecycle.md, OL-AI-EVALUATION-EVALUATION-LIFECYCLE).
 *
 * An evaluation passes through a fixed order of phases; each phase completes before the next begins, except
 * where validation returns the evaluation for correction. This module defines the ordered phases, their
 * principles, and their invariants, plus the pure ordering predicate the document's ordering states. The
 * measurement and scoring within the phases are owned by ai/evaluation/evaluation-metrics.md and
 * ai/evaluation/evaluation-scoring.md, referenced not restated (ADR-0020).
 */

/**
 * An evaluation-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating an evaluation
 * invariant (ai/evaluation/evaluation-lifecycle.md, "Principles").
 */
export type EvaluationLifecyclePrinciple =
  | 'an-evaluation-has-a-defined-beginning-and-end'
  | 'framing-precedes-measurement'
  | 'validation-precedes-acceptance'
  | 'an-evaluation-ends-in-a-result-not-an-action';

/** The evaluation-lifecycle principles, in constitutional order; frozen. */
export const EVALUATION_LIFECYCLE_PRINCIPLES: readonly EvaluationLifecyclePrinciple[] =
  Object.freeze([
    'an-evaluation-has-a-defined-beginning-and-end',
    'framing-precedes-measurement',
    'validation-precedes-acceptance',
    'an-evaluation-ends-in-a-result-not-an-action',
  ]);

/** What each evaluation-lifecycle principle requires (ai/evaluation/evaluation-lifecycle.md, "Principles"). */
export const EVALUATION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationLifecyclePrinciple, string>
> = Object.freeze({
  'an-evaluation-has-a-defined-beginning-and-end':
    'An evaluation begins with framing and ends with a validated result; it never runs unbounded.',
  'framing-precedes-measurement':
    'What is assessed, by which metrics and against which benchmark, is established before the output is measured.',
  'validation-precedes-acceptance':
    'An evaluation result is validated before it is accepted, and an invalid evaluation yields no accepted result.',
  'an-evaluation-ends-in-a-result-not-an-action':
    'An evaluation terminates in a measured, validated result that informs others; it never acts on the result itself.',
});

/**
 * An evaluation-lifecycle phase, in constitutional order from earliest to latest
 * (ai/evaluation/evaluation-lifecycle.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link evaluationPhaseAtOrAfter}.
 */
export type EvaluationLifecyclePhase =
  'framing' | 'measurement' | 'scoring' | 'validation' | 'result';

/** The evaluation-lifecycle phases, earliest to latest; frozen. */
export const EVALUATION_LIFECYCLE_PHASES: readonly EvaluationLifecyclePhase[] = Object.freeze([
  'framing',
  'measurement',
  'scoring',
  'validation',
  'result',
]);

/** What each evaluation-lifecycle phase is (ai/evaluation/evaluation-lifecycle.md, "Specification"). */
export const EVALUATION_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<EvaluationLifecyclePhase, string>
> = Object.freeze({
  framing:
    'The evaluation is framed on the subject output to assess, the metrics to measure under ai/evaluation/evaluation-metrics.md, and, where used, the benchmark to measure against under ai/evaluation/evaluation-benchmarking.md; framing establishes what is being assessed and against what.',
  measurement:
    'The subject output is measured against the framed metrics under ai/evaluation/evaluation-metrics.md, producing the measured values the rest of the evaluation rests on; measurement observes the output and never changes it.',
  scoring:
    'The measured values are combined into a score under ai/evaluation/evaluation-scoring.md, and, where a comparison is called for, compared under ai/evaluation/evaluation-comparison.md; this phase derives the assessment from the measurements.',
  validation:
    'The evaluation and its result are validated under ai/evaluation/evaluation-validation.md, for grounding and conformance, before the result is accepted; an evaluation that fails validation yields no accepted result.',
  result:
    'The validated result is produced and reported to whoever acts on it; the result informs a decision owned by ai/governance/ or a protection owned by ai/safety/, and this phase produces the assessment and never acts on it.',
});

/**
 * An evaluation-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/evaluation/evaluation-lifecycle.md, "Invariants").
 */
export type EvaluationLifecycleInvariant =
  | 'one-lifecycle-per-evaluation'
  | 'framing-precedes-measurement-precedes-scoring-precedes-validation'
  | 'result-validated-before-accepted-invalid-yields-no-result'
  | 'terminates-in-a-result-that-informs-never-acts'
  | 'a-lifecycle-transition-is-inert';

/** The evaluation-lifecycle invariants, in constitutional order; frozen. */
export const EVALUATION_LIFECYCLE_INVARIANTS: readonly EvaluationLifecycleInvariant[] =
  Object.freeze([
    'one-lifecycle-per-evaluation',
    'framing-precedes-measurement-precedes-scoring-precedes-validation',
    'result-validated-before-accepted-invalid-yields-no-result',
    'terminates-in-a-result-that-informs-never-acts',
    'a-lifecycle-transition-is-inert',
  ]);

/** What each evaluation-lifecycle invariant guarantees (ai/evaluation/evaluation-lifecycle.md, "Invariants"). */
export const EVALUATION_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-evaluation':
    'An evaluation holds exactly one lifecycle, from one framing to one validated result.',
  'framing-precedes-measurement-precedes-scoring-precedes-validation':
    'Framing precedes Measurement, which precedes Scoring, which precedes Validation.',
  'result-validated-before-accepted-invalid-yields-no-result':
    'An evaluation result is validated before it is accepted, and an invalid evaluation yields no accepted result.',
  'terminates-in-a-result-that-informs-never-acts':
    'An evaluation terminates in a result that informs others and never acts on the result itself.',
  'a-lifecycle-transition-is-inert':
    'A lifecycle transition never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const EVALUATION_LIFECYCLE_PHASE_RANK: Readonly<Record<EvaluationLifecyclePhase, number>> =
  Object.freeze({
    framing: 0,
    measurement: 1,
    scoring: 2,
    validation: 3,
    result: 4,
  });

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/evaluation/evaluation-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function evaluationPhaseAtOrAfter(
  a: EvaluationLifecyclePhase,
  b: EvaluationLifecyclePhase,
): boolean {
  return EVALUATION_LIFECYCLE_PHASE_RANK[a] >= EVALUATION_LIFECYCLE_PHASE_RANK[b];
}
