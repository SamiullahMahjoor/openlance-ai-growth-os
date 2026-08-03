/**
 * Evaluation benchmarking: how a benchmark is defined, the fixed reference standard an output is measured
 * against (ai/evaluation/evaluation-benchmarking.md, OL-AI-EVALUATION-EVALUATION-BENCHMARKING).
 *
 * The Specification narrates the benchmark model as heterogeneous facets (benchmark definition, benchmark
 * architecture, stability and versioning, reference not comparison or measurement). It enumerates no closed
 * homogeneous set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * metrics a benchmark is expressed in are owned by ai/evaluation/evaluation-metrics.md, the comparison against
 * a benchmark by ai/evaluation/evaluation-comparison.md, and the versioning of a benchmark by
 * ai/evaluation/evaluation-versioning.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * An evaluation-benchmarking principle: a permanent rule the benchmark model upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-benchmarking.md, "Principles").
 */
export type EvaluationBenchmarkingPrinciple =
  | 'a-benchmark-is-a-fixed-reference-standard'
  | 'a-benchmark-is-defined-not-performed'
  | 'a-benchmark-is-versioned-and-stable'
  | 'a-benchmark-uses-metrics-it-does-not-own';

/** The evaluation-benchmarking principles, in constitutional order; frozen. */
export const EVALUATION_BENCHMARKING_PRINCIPLES: readonly EvaluationBenchmarkingPrinciple[] =
  Object.freeze([
    'a-benchmark-is-a-fixed-reference-standard',
    'a-benchmark-is-defined-not-performed',
    'a-benchmark-is-versioned-and-stable',
    'a-benchmark-uses-metrics-it-does-not-own',
  ]);

/** What each evaluation-benchmarking principle requires (ai/evaluation/evaluation-benchmarking.md, "Principles"). */
export const EVALUATION_BENCHMARKING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationBenchmarkingPrinciple, string>
> = Object.freeze({
  'a-benchmark-is-a-fixed-reference-standard':
    'A benchmark is a defined, stable standard an output is measured against, so evaluations share a common reference.',
  'a-benchmark-is-defined-not-performed':
    'A benchmark defines what good measures against; it never produces an output and never changes one.',
  'a-benchmark-is-versioned-and-stable':
    'A benchmark is stable so that results against it are comparable over time, and it changes only through governed versioning.',
  'a-benchmark-uses-metrics-it-does-not-own':
    'A benchmark is expressed in the metrics owned by ai/evaluation/evaluation-metrics.md, and never redefines them.',
});

/**
 * An evaluation-benchmarking invariant: a guarantee the benchmark model always upholds
 * (ai/evaluation/evaluation-benchmarking.md, "Invariants").
 */
export type EvaluationBenchmarkingInvariant =
  | 'benchmark-is-a-fixed-stable-reference-defined-in-metrics-it-does-not-own'
  | 'benchmark-defines-what-good-measures-against-never-produces-or-changes'
  | 'benchmark-changes-only-through-governed-versioning-result-records-version'
  | 'benchmark-uses-metrics-it-does-not-own-never-redefines'
  | 'defining-a-benchmark-is-inert';

/** The evaluation-benchmarking invariants, in constitutional order; frozen. */
export const EVALUATION_BENCHMARKING_INVARIANTS: readonly EvaluationBenchmarkingInvariant[] =
  Object.freeze([
    'benchmark-is-a-fixed-stable-reference-defined-in-metrics-it-does-not-own',
    'benchmark-defines-what-good-measures-against-never-produces-or-changes',
    'benchmark-changes-only-through-governed-versioning-result-records-version',
    'benchmark-uses-metrics-it-does-not-own-never-redefines',
    'defining-a-benchmark-is-inert',
  ]);

/** What each evaluation-benchmarking invariant guarantees (ai/evaluation/evaluation-benchmarking.md, "Invariants"). */
export const EVALUATION_BENCHMARKING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationBenchmarkingInvariant, string>
> = Object.freeze({
  'benchmark-is-a-fixed-stable-reference-defined-in-metrics-it-does-not-own':
    'A benchmark is a fixed, stable reference standard defined in the metrics owned by ai/evaluation/evaluation-metrics.md.',
  'benchmark-defines-what-good-measures-against-never-produces-or-changes':
    'A benchmark defines what good measures against and never produces or changes an output.',
  'benchmark-changes-only-through-governed-versioning-result-records-version':
    'A benchmark changes only through governed versioning, and a result records the benchmark version it used.',
  'benchmark-uses-metrics-it-does-not-own-never-redefines':
    'A benchmark uses metrics it does not own and never redefines them.',
  'defining-a-benchmark-is-inert':
    'Defining a benchmark never reasons, executes, decides, measures, compares, or changes ownership, authority, governance, or business truth.',
});
