/**
 * Evaluation architecture: the architectural definition of an evaluation, its identity and the parts it is
 * composed of (ai/evaluation/evaluation-architecture.md, OL-AI-EVALUATION-EVALUATION-ARCHITECTURE).
 *
 * An evaluation is a uniquely identified assessment composed of a subject output, defined metrics, and, where
 * used, a benchmark, that measures against a quality defined elsewhere. This module defines the closed set of
 * parts an evaluation is composed of, plus the structural principles and invariants. The parts are unordered
 * and carry no predicate; the metrics and benchmark parts are owned by ai/evaluation/evaluation-metrics.md and
 * ai/evaluation/evaluation-benchmarking.md, the subject output and its quality by the subject namespaces,
 * referenced not restated (ADR-0020).
 */

/**
 * An evaluation-architecture principle: a permanent rule the structural model upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-architecture.md, "Principles").
 */
export type EvaluationArchitecturePrinciple =
  | 'an-evaluation-is-an-assessment-not-a-behavior'
  | 'an-evaluation-has-a-distinct-identity'
  | 'an-evaluation-is-composed-of-defined-parts'
  | 'an-evaluations-structure-is-deterministic';

/** The evaluation-architecture principles, in constitutional order; frozen. */
export const EVALUATION_ARCHITECTURE_PRINCIPLES: readonly EvaluationArchitecturePrinciple[] =
  Object.freeze([
    'an-evaluation-is-an-assessment-not-a-behavior',
    'an-evaluation-has-a-distinct-identity',
    'an-evaluation-is-composed-of-defined-parts',
    'an-evaluations-structure-is-deterministic',
  ]);

/** What each evaluation-architecture principle requires (ai/evaluation/evaluation-architecture.md, "Principles"). */
export const EVALUATION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationArchitecturePrinciple, string>
> = Object.freeze({
  'an-evaluation-is-an-assessment-not-a-behavior':
    'An evaluation is the architectural means by which an output is judged; it never produces the output and never changes it.',
  'an-evaluation-has-a-distinct-identity':
    'Every evaluation is uniquely identified, so it can be defined, validated, versioned, and its result attributed as one evaluation.',
  'an-evaluation-is-composed-of-defined-parts':
    'An evaluation is composed of its identity, the subject output it assesses, the metrics it measures, and the benchmark it measures against, each owned by its named document.',
  'an-evaluations-structure-is-deterministic':
    'The same evaluation definition over the same output resolves to the same assessment, with no randomness.',
});

/**
 * An evaluation part: one of the parts an evaluation is composed of, in constitutional listing order
 * (ai/evaluation/evaluation-architecture.md, "Specification"). The set is closed and unordered; the benchmark
 * is used where a comparison is made. Each part is owned by its named document.
 */
export type EvaluationPart = 'identity' | 'subject-output' | 'metrics' | 'benchmark';

/** The parts an evaluation is composed of, in constitutional listing order; frozen. */
export const EVALUATION_PARTS: readonly EvaluationPart[] = Object.freeze([
  'identity',
  'subject-output',
  'metrics',
  'benchmark',
]);

/** What each evaluation part is (ai/evaluation/evaluation-architecture.md, "Specification"). */
export const EVALUATION_PART_DESCRIPTIONS: Readonly<Record<EvaluationPart, string>> = Object.freeze(
  {
    identity:
      'An evaluation has a distinct, stable identity that uniquely identifies it as an assessment, so that it can be defined, validated, versioned, and its result recorded as one evaluation; identity is never shared.',
    'subject-output':
      'The subject output an evaluation assesses; the evaluation assesses the output of a subject namespace and never the behavior that produced it, which the subject namespace owns.',
    metrics:
      'The metrics an evaluation measures, owned by ai/evaluation/evaluation-metrics.md; this document owns that an evaluation is composed of them.',
    benchmark:
      'The benchmark an evaluation measures against, where used, owned by ai/evaluation/evaluation-benchmarking.md; this document owns that an evaluation is composed of it.',
  },
);

/**
 * An evaluation-architecture invariant: a guarantee the structural model always upholds
 * (ai/evaluation/evaluation-architecture.md, "Invariants").
 */
export type EvaluationArchitectureInvariant =
  | 'every-evaluation-has-a-distinct-stable-identity-never-shared'
  | 'composed-of-identity-subject-output-metrics-and-benchmark'
  | 'assesses-output-never-the-behavior-or-quality-definition'
  | 'same-definition-same-assessment'
  | 'defining-structure-is-inert';

/** The evaluation-architecture invariants, in constitutional order; frozen. */
export const EVALUATION_ARCHITECTURE_INVARIANTS: readonly EvaluationArchitectureInvariant[] =
  Object.freeze([
    'every-evaluation-has-a-distinct-stable-identity-never-shared',
    'composed-of-identity-subject-output-metrics-and-benchmark',
    'assesses-output-never-the-behavior-or-quality-definition',
    'same-definition-same-assessment',
    'defining-structure-is-inert',
  ]);

/** What each evaluation-architecture invariant guarantees (ai/evaluation/evaluation-architecture.md, "Invariants"). */
export const EVALUATION_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationArchitectureInvariant, string>
> = Object.freeze({
  'every-evaluation-has-a-distinct-stable-identity-never-shared':
    'Every evaluation has a distinct, stable identity that is never shared.',
  'composed-of-identity-subject-output-metrics-and-benchmark':
    'An evaluation is composed of its identity, subject output, metrics, and, where used, a benchmark, each owned by its named document.',
  'assesses-output-never-the-behavior-or-quality-definition':
    "An evaluation assesses an output and never the behavior that produced it, nor the definition of that behavior's quality.",
  'same-definition-same-assessment':
    'The same evaluation definition over the same output resolves to the same assessment, with no randomness.',
  'defining-structure-is-inert':
    "Defining an evaluation's structure never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.",
});
