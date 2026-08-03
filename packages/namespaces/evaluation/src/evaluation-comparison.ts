/**
 * Evaluation comparison: how outputs or their scores are compared, like for like
 * (ai/evaluation/evaluation-comparison.md, OL-AI-EVALUATION-EVALUATION-COMPARISON).
 *
 * The Specification narrates the comparison model as heterogeneous facets (the comparison model, comparison
 * methodology, comparison against a benchmark, comparison not decision). It enumerates no closed homogeneous
 * set the model refers to by identity, so this concern is definitions only (principles and invariants),
 * consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The scores a
 * comparison compares are owned by ai/evaluation/evaluation-scoring.md, the metrics by
 * ai/evaluation/evaluation-metrics.md, the benchmark by ai/evaluation/evaluation-benchmarking.md, and the
 * decision drawn from a comparison by ai/governance/, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * An evaluation-comparison principle: a permanent rule the comparison model upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-comparison.md, "Principles").
 */
export type EvaluationComparisonPrinciple =
  | 'comparison-is-like-for-like'
  | 'comparison-is-deterministic'
  | 'comparison-reports-it-does-not-decide'
  | 'comparison-rests-on-measured-scores';

/** The evaluation-comparison principles, in constitutional order; frozen. */
export const EVALUATION_COMPARISON_PRINCIPLES: readonly EvaluationComparisonPrinciple[] =
  Object.freeze([
    'comparison-is-like-for-like',
    'comparison-is-deterministic',
    'comparison-reports-it-does-not-decide',
    'comparison-rests-on-measured-scores',
  ]);

/** What each evaluation-comparison principle requires (ai/evaluation/evaluation-comparison.md, "Principles"). */
export const EVALUATION_COMPARISON_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationComparisonPrinciple, string>
> = Object.freeze({
  'comparison-is-like-for-like':
    'Outputs are compared only on the same metrics and under the same conditions, so a comparison is fair and never compares unlike things.',
  'comparison-is-deterministic':
    'The same outputs and scores under the same methodology yield the same comparison, with no randomness.',
  'comparison-reports-it-does-not-decide':
    'A comparison reports how outputs relate; the decision drawn from it is owned by ai/governance/.',
  'comparison-rests-on-measured-scores':
    'A comparison compares the scores derived under ai/evaluation/evaluation-scoring.md, or the measurements under ai/evaluation/evaluation-metrics.md, and never a judgment outside them.',
});

/**
 * An evaluation-comparison invariant: a guarantee the comparison model always upholds
 * (ai/evaluation/evaluation-comparison.md, "Invariants").
 */
export type EvaluationComparisonInvariant =
  | 'compared-only-on-same-metrics-and-conditions-fair'
  | 'same-outputs-and-scores-same-methodology-same-comparison'
  | 'comparison-against-benchmark-records-benchmark-version'
  | 'comparison-reports-relative-standing-never-decides-or-ranks-for-action'
  | 'comparing-outputs-is-inert';

/** The evaluation-comparison invariants, in constitutional order; frozen. */
export const EVALUATION_COMPARISON_INVARIANTS: readonly EvaluationComparisonInvariant[] =
  Object.freeze([
    'compared-only-on-same-metrics-and-conditions-fair',
    'same-outputs-and-scores-same-methodology-same-comparison',
    'comparison-against-benchmark-records-benchmark-version',
    'comparison-reports-relative-standing-never-decides-or-ranks-for-action',
    'comparing-outputs-is-inert',
  ]);

/** What each evaluation-comparison invariant guarantees (ai/evaluation/evaluation-comparison.md, "Invariants"). */
export const EVALUATION_COMPARISON_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationComparisonInvariant, string>
> = Object.freeze({
  'compared-only-on-same-metrics-and-conditions-fair':
    'Outputs are compared only on the same metrics and under the same conditions, so a comparison is fair.',
  'same-outputs-and-scores-same-methodology-same-comparison':
    'The same outputs and scores under the same methodology yield the same comparison.',
  'comparison-against-benchmark-records-benchmark-version':
    'A comparison against a benchmark records the benchmark version compared against.',
  'comparison-reports-relative-standing-never-decides-or-ranks-for-action':
    'A comparison reports relative standing and never decides, ranks for action, or changes behavior.',
  'comparing-outputs-is-inert':
    'Comparing outputs never reasons, executes, decides, measures, scores, or changes ownership, authority, governance, or business truth.',
});
