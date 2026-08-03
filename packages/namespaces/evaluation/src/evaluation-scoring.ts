/**
 * Evaluation scoring: how a score is derived from measured metrics (ai/evaluation/evaluation-scoring.md,
 * OL-AI-EVALUATION-EVALUATION-SCORING).
 *
 * The Specification narrates the scoring model as heterogeneous facets (the scoring model, score calculation
 * architecture, traceable derivation, scoring not comparison or decision). It enumerates no closed homogeneous
 * set the model refers to by identity, so this concern is definitions only (principles and invariants),
 * consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. What is measured
 * is owned by ai/evaluation/evaluation-metrics.md, the comparison of scores by
 * ai/evaluation/evaluation-comparison.md, and the decision drawn from a score by ai/governance/, referenced not
 * restated (ADR-0020, ADR-0025).
 */

/**
 * An evaluation-scoring principle: a permanent rule the scoring model upholds, each instantiating an evaluation
 * invariant (ai/evaluation/evaluation-scoring.md, "Principles").
 */
export type EvaluationScoringPrinciple =
  | 'a-score-is-derived-not-invented'
  | 'scoring-is-deterministic'
  | 'scoring-is-transparent'
  | 'a-score-assesses-it-does-not-decide';

/** The evaluation-scoring principles, in constitutional order; frozen. */
export const EVALUATION_SCORING_PRINCIPLES: readonly EvaluationScoringPrinciple[] = Object.freeze([
  'a-score-is-derived-not-invented',
  'scoring-is-deterministic',
  'scoring-is-transparent',
  'a-score-assesses-it-does-not-decide',
]);

/** What each evaluation-scoring principle requires (ai/evaluation/evaluation-scoring.md, "Principles"). */
export const EVALUATION_SCORING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationScoringPrinciple, string>
> = Object.freeze({
  'a-score-is-derived-not-invented':
    'A score is derived from measured metrics by a defined calculation, never assigned by opinion.',
  'scoring-is-deterministic':
    'The same measured metrics under the same scoring model yield the same score, with no randomness.',
  'scoring-is-transparent':
    'The way a score is derived from its metrics is explicit and traceable, so a score can be followed back to the measurements it rests on.',
  'a-score-assesses-it-does-not-decide':
    'A score reports how an output measures; the decision drawn from it is owned by ai/governance/.',
});

/**
 * An evaluation-scoring invariant: a guarantee the scoring model always upholds
 * (ai/evaluation/evaluation-scoring.md, "Invariants").
 */
export type EvaluationScoringInvariant =
  | 'score-derived-from-measured-metrics-never-by-opinion'
  | 'same-measured-metrics-same-scoring-model-same-score'
  | 'score-traceable-to-the-metrics-derived-from'
  | 'score-assesses-never-decides-changes-or-compares'
  | 'deriving-a-score-is-inert';

/** The evaluation-scoring invariants, in constitutional order; frozen. */
export const EVALUATION_SCORING_INVARIANTS: readonly EvaluationScoringInvariant[] = Object.freeze([
  'score-derived-from-measured-metrics-never-by-opinion',
  'same-measured-metrics-same-scoring-model-same-score',
  'score-traceable-to-the-metrics-derived-from',
  'score-assesses-never-decides-changes-or-compares',
  'deriving-a-score-is-inert',
]);

/** What each evaluation-scoring invariant guarantees (ai/evaluation/evaluation-scoring.md, "Invariants"). */
export const EVALUATION_SCORING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationScoringInvariant, string>
> = Object.freeze({
  'score-derived-from-measured-metrics-never-by-opinion':
    'A score is derived from measured metrics by a defined calculation, never assigned by opinion.',
  'same-measured-metrics-same-scoring-model-same-score':
    'The same measured metrics under the same scoring model yield the same score.',
  'score-traceable-to-the-metrics-derived-from':
    'A score is traceable to the metrics it is derived from.',
  'score-assesses-never-decides-changes-or-compares':
    'A score assesses an output and never decides, changes behavior, or compares across outputs.',
  'deriving-a-score-is-inert':
    'Deriving a score never reasons, executes, decides, measures, or changes ownership, authority, governance, or business truth.',
});
