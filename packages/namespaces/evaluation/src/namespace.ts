/**
 * The Evaluation namespace, namespace-wide truth (ai/evaluation/README.md, OL-AI-EVALUATION-README;
 * ai/evaluation/evaluation.md, OL-AI-EVALUATION-EVALUATION).
 *
 * The evaluation invariants every evaluation concern upholds, and the canonical inventory of the evaluation
 * concerns, as immutable definitions (ADR-0020). The namespace is the assessment model of the AI layer: it
 * defines how the output of the AI layer is measured, scored, validated, benchmarked, and compared, so that
 * behavior can be judged, deterministically and neutrally, without ever being performed or changed. Evaluation
 * measures behavior; it never performs it: it never reasons, executes, decides, or changes the behavior it
 * assesses, and it never defines a metric mechanism, a test harness, a provider, a model, a framework, or code
 * (ai/evaluation/README.md). It is deterministic and scalable: the same output, metrics, benchmark, and rules
 * yield the same measurement, score, and comparison, and the model holds for one evaluation or many thousands
 * (ai/evaluation/evaluation.md).
 *
 * ADR-0024 does not enumerate Evaluation among its examples; per ADR-0024 §42 its category is declared in the
 * design (docs/implementation/20-evaluation.md) as category 1 (Pure Domain Model), the same shape as
 * Governance: it owns the assessment model (truth about how output is judged), not an integration,
 * orchestration, or composition. Its executable surface is two pure ordering predicates over evaluation-owned
 * classifications - the lifecycle-phase and validation-check orderings - realized per ADR-0020 as an immutable
 * stateless domain model with no IO; the assessment of a concrete output is the runtime's.
 */

/**
 * An evaluation invariant: a permanent guarantee every evaluation document upholds and no evaluation may
 * violate (ai/evaluation/README.md, "Evaluation Invariants"). Every evaluation concern's principles
 * instantiate these.
 */
export type EvaluationInvariant =
  | 'measures-never-performs'
  | 'observes-one-directionally'
  | 'deterministic'
  | 'grounded-and-validated'
  | 'result-informs-never-decides'
  | 'owns-no-subject-behavior-or-quality-definition'
  | 'single-owned-technology-neutral-scalable';

/** The seven evaluation invariants, in constitutional order; frozen. */
export const EVALUATION_INVARIANTS: readonly EvaluationInvariant[] = Object.freeze([
  'measures-never-performs',
  'observes-one-directionally',
  'deterministic',
  'grounded-and-validated',
  'result-informs-never-decides',
  'owns-no-subject-behavior-or-quality-definition',
  'single-owned-technology-neutral-scalable',
]);

/** The guarantee each evaluation invariant states (ai/evaluation/README.md, "Evaluation Invariants"). */
export const EVALUATION_INVARIANT_DESCRIPTIONS: Readonly<Record<EvaluationInvariant, string>> =
  Object.freeze({
    'measures-never-performs':
      'Evaluation assesses behavior and never reasons, executes, decides, or changes it.',
    'observes-one-directionally':
      'Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on it.',
    deterministic:
      'The same output, the same metrics, the same benchmark, and the same rules yield the same measurement, score, and comparison, with no randomness.',
    'grounded-and-validated':
      'An evaluation is validated before its result is accepted, and it measures only what is defined, against the ground the knowledge repository owns.',
    'result-informs-never-decides':
      'A decision, a refusal, or a change of behavior drawn from an evaluation is owned by ai/governance/ and ai/safety/, not by evaluation.',
    'owns-no-subject-behavior-or-quality-definition':
      "The behavior evaluated and the definition of its quality are owned by the subject's namespace.",
    'single-owned-technology-neutral-scalable':
      'Each evaluation concern has exactly one owning document, and the model holds for one evaluation or many thousands.',
  });

/**
 * An evaluation concern: one aspect of the evaluation model, each owned by exactly one document
 * (ai/evaluation/evaluation.md, "The Evaluation Concerns"). This is the namespace inventory identity; the
 * model of each concern is owned by its named document and this package's corresponding module.
 */
export type EvaluationConcern =
  | 'evaluation-architecture'
  | 'evaluation-lifecycle'
  | 'evaluation-metrics'
  | 'evaluation-scoring'
  | 'evaluation-validation'
  | 'evaluation-benchmarking'
  | 'evaluation-comparison'
  | 'evaluation-compatibility'
  | 'evaluation-boundaries'
  | 'evaluation-versioning';

/** The ten evaluation concerns, in inventory order; frozen. */
export const EVALUATION_CONCERNS: readonly EvaluationConcern[] = Object.freeze([
  'evaluation-architecture',
  'evaluation-lifecycle',
  'evaluation-metrics',
  'evaluation-scoring',
  'evaluation-validation',
  'evaluation-benchmarking',
  'evaluation-comparison',
  'evaluation-compatibility',
  'evaluation-boundaries',
  'evaluation-versioning',
]);

/** What each evaluation concern owns (ai/evaluation/evaluation.md, "The Evaluation Concerns"). */
export const EVALUATION_CONCERN_DESCRIPTIONS: Readonly<Record<EvaluationConcern, string>> =
  Object.freeze({
    'evaluation-architecture':
      'The architectural definition of an evaluation: its identity and the parts it is composed of.',
    'evaluation-lifecycle': 'The phases of an evaluation, from framing to a validated result.',
    'evaluation-metrics':
      'The measurement model: what is measured, including quality and grounding dimensions.',
    'evaluation-scoring':
      'The scoring model and the score calculation architecture: how a score is derived from metrics.',
    'evaluation-validation':
      'The validation model and validation ordering: how an evaluation is validated before its result is accepted.',
    'evaluation-benchmarking':
      'The benchmark definition and benchmark architecture: the fixed reference standards an evaluation measures against.',
    'evaluation-comparison':
      'The comparison model and comparison methodology: how outputs or scores are compared.',
    'evaluation-compatibility':
      'The compatibility model: whether an evaluation is compatible with a subject, and whether an evaluation version is compatible with a consumer.',
    'evaluation-boundaries': 'What evaluation never owns, and where an evaluation stops.',
    'evaluation-versioning': 'Evaluation versioning, evolution, migration, and deprecation.',
  });
