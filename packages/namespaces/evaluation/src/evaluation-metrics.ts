/**
 * Evaluation metrics: what is measured when an output is evaluated, including quality and grounding
 * dimensions (ai/evaluation/evaluation-metrics.md, OL-AI-EVALUATION-EVALUATION-METRICS).
 *
 * The Specification narrates the measurement model as heterogeneous facets (the measurement model, quality
 * dimensions, grounding dimension, neutral and observing). The quality and grounding dimensions are introduced
 * with "including" (non-exhaustive) and are not enumerated as a closed dimension set restated in the
 * invariants, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. The quality a metric measures against is
 * owned by the subject namespaces (for example ai/reasoning/reasoning-quality.md, ai/memory/memory-quality.md)
 * and the truth grounding is measured against by the knowledge repository, referenced not restated. How a score
 * is derived from metrics is owned by ai/evaluation/evaluation-scoring.md (ADR-0020, ADR-0025).
 */

/**
 * An evaluation-metrics principle: a permanent rule the measurement model upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-metrics.md, "Principles").
 */
export type EvaluationMetricsPrinciple =
  | 'a-metric-is-a-defined-measurement'
  | 'a-metric-measures-against-a-definition-it-does-not-own'
  | 'metrics-are-neutral'
  | 'measurement-observes-it-never-changes';

/** The evaluation-metrics principles, in constitutional order; frozen. */
export const EVALUATION_METRICS_PRINCIPLES: readonly EvaluationMetricsPrinciple[] = Object.freeze([
  'a-metric-is-a-defined-measurement',
  'a-metric-measures-against-a-definition-it-does-not-own',
  'metrics-are-neutral',
  'measurement-observes-it-never-changes',
]);

/** What each evaluation-metrics principle requires (ai/evaluation/evaluation-metrics.md, "Principles"). */
export const EVALUATION_METRICS_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationMetricsPrinciple, string>
> = Object.freeze({
  'a-metric-is-a-defined-measurement':
    'Every metric names a defined quantity or quality of an output, so what is measured is explicit, never vague.',
  'a-metric-measures-against-a-definition-it-does-not-own':
    "A metric measures a subject's quality against the definition owned by the subject's namespace, and never redefines it.",
  'metrics-are-neutral':
    'A metric is defined in technology-neutral terms, so it means the same thing across subjects and evaluations.',
  'measurement-observes-it-never-changes':
    'Measuring an output observes it and never alters the output or the behavior that produced it.',
});

/**
 * An evaluation-metrics invariant: a guarantee the measurement model always upholds
 * (ai/evaluation/evaluation-metrics.md, "Invariants").
 */
export type EvaluationMetricsInvariant =
  | 'every-metric-names-a-defined-measurement-never-a-vague-impression'
  | 'a-metric-measures-against-subject-quality-definition-never-redefines'
  | 'metrics-described-technology-neutral'
  | 'measuring-observes-never-changes'
  | 'defining-or-applying-a-metric-is-inert';

/** The evaluation-metrics invariants, in constitutional order; frozen. */
export const EVALUATION_METRICS_INVARIANTS: readonly EvaluationMetricsInvariant[] = Object.freeze([
  'every-metric-names-a-defined-measurement-never-a-vague-impression',
  'a-metric-measures-against-subject-quality-definition-never-redefines',
  'metrics-described-technology-neutral',
  'measuring-observes-never-changes',
  'defining-or-applying-a-metric-is-inert',
]);

/** What each evaluation-metrics invariant guarantees (ai/evaluation/evaluation-metrics.md, "Invariants"). */
export const EVALUATION_METRICS_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationMetricsInvariant, string>
> = Object.freeze({
  'every-metric-names-a-defined-measurement-never-a-vague-impression':
    'Every metric names a defined measurement of an output, never a vague impression.',
  'a-metric-measures-against-subject-quality-definition-never-redefines':
    "A metric measures against a quality definition owned by the subject's namespace and never redefines it.",
  'metrics-described-technology-neutral': 'Metrics are described in technology-neutral terms.',
  'measuring-observes-never-changes':
    'Measuring an output observes it and never changes it or the behavior that produced it.',
  'defining-or-applying-a-metric-is-inert':
    'Defining or applying a metric never reasons, executes, decides, scores, or changes ownership, authority, governance, or business truth.',
});
