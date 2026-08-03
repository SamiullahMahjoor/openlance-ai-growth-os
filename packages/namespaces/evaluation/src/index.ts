/**
 * @packageDocumentation
 * `@openlance/aios-evaluation`
 *
 * The immutable, technology-neutral domain model of the AI layer's assessment abstraction (Specification
 * authority, ai/evaluation/). It states how the output of the AI layer is measured, scored, validated,
 * benchmarked, and compared, so that behavior can be judged, as strongly-typed classifications, immutable
 * definitions and invariants, and two pure deterministic algorithms: the evaluation-lifecycle ordering
 * (evaluationPhaseAtOrAfter) and the validation-check ordering (evaluationValidationCheckAtOrAfter), which
 * express the evaluation specification verbatim.
 *
 * It performs no assessment, no measurement, and no IO: evaluation defines the model and never carries it out;
 * the namespace defines no metric mechanism, test harness, provider, model, framework, language, runtime,
 * protocol, interface, or code (ADR-0020). ADR-0024 does not enumerate Evaluation among its examples; per
 * ADR-0024 §42 its category is declared in the design (docs/implementation/20-evaluation.md) as category 1
 * (Pure Domain Model), the same shape as Governance: it owns the assessment model (truth about how output is
 * judged), not an integration, orchestration, or composition, and the package is realized per ADR-0020 as an
 * immutable stateless domain model with no IO; the assessment of a concrete output is the runtime's. Evaluation
 * observes the subject namespaces one-directionally and owns none of their behavior; the models owned by
 * ai/governance/, ai/safety/, the subject namespaces, and the knowledge repository are referenced in prose and
 * never restated as evaluation classifications (ADR-0025).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-EVALUATION-README.
 */

export type { EvaluationInvariant, EvaluationConcern } from './namespace.js';
export {
  EVALUATION_INVARIANTS,
  EVALUATION_INVARIANT_DESCRIPTIONS,
  EVALUATION_CONCERNS,
  EVALUATION_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  EvaluationArchitecturePrinciple,
  EvaluationPart,
  EvaluationArchitectureInvariant,
} from './evaluation-architecture.js';
export {
  EVALUATION_ARCHITECTURE_PRINCIPLES,
  EVALUATION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_PARTS,
  EVALUATION_PART_DESCRIPTIONS,
  EVALUATION_ARCHITECTURE_INVARIANTS,
  EVALUATION_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './evaluation-architecture.js';

export type {
  EvaluationLifecyclePrinciple,
  EvaluationLifecyclePhase,
  EvaluationLifecycleInvariant,
} from './evaluation-lifecycle.js';
export {
  EVALUATION_LIFECYCLE_PRINCIPLES,
  EVALUATION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_LIFECYCLE_PHASES,
  EVALUATION_LIFECYCLE_PHASE_DESCRIPTIONS,
  evaluationPhaseAtOrAfter,
  EVALUATION_LIFECYCLE_INVARIANTS,
  EVALUATION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './evaluation-lifecycle.js';

export type {
  EvaluationMetricsPrinciple,
  EvaluationMetricsInvariant,
} from './evaluation-metrics.js';
export {
  EVALUATION_METRICS_PRINCIPLES,
  EVALUATION_METRICS_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_METRICS_INVARIANTS,
  EVALUATION_METRICS_INVARIANT_DESCRIPTIONS,
} from './evaluation-metrics.js';

export type {
  EvaluationScoringPrinciple,
  EvaluationScoringInvariant,
} from './evaluation-scoring.js';
export {
  EVALUATION_SCORING_PRINCIPLES,
  EVALUATION_SCORING_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_SCORING_INVARIANTS,
  EVALUATION_SCORING_INVARIANT_DESCRIPTIONS,
} from './evaluation-scoring.js';

export type {
  EvaluationValidationPrinciple,
  EvaluationValidationCheck,
  EvaluationValidationInvariant,
} from './evaluation-validation.js';
export {
  EVALUATION_VALIDATION_PRINCIPLES,
  EVALUATION_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_VALIDATION_CHECKS,
  EVALUATION_VALIDATION_CHECK_DESCRIPTIONS,
  evaluationValidationCheckAtOrAfter,
  EVALUATION_VALIDATION_INVARIANTS,
  EVALUATION_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './evaluation-validation.js';

export type {
  EvaluationBenchmarkingPrinciple,
  EvaluationBenchmarkingInvariant,
} from './evaluation-benchmarking.js';
export {
  EVALUATION_BENCHMARKING_PRINCIPLES,
  EVALUATION_BENCHMARKING_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_BENCHMARKING_INVARIANTS,
  EVALUATION_BENCHMARKING_INVARIANT_DESCRIPTIONS,
} from './evaluation-benchmarking.js';

export type {
  EvaluationComparisonPrinciple,
  EvaluationComparisonInvariant,
} from './evaluation-comparison.js';
export {
  EVALUATION_COMPARISON_PRINCIPLES,
  EVALUATION_COMPARISON_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_COMPARISON_INVARIANTS,
  EVALUATION_COMPARISON_INVARIANT_DESCRIPTIONS,
} from './evaluation-comparison.js';

export type {
  EvaluationCompatibilityPrinciple,
  EvaluationCompatibilityKind,
  EvaluationCompatibilityInvariant,
} from './evaluation-compatibility.js';
export {
  EVALUATION_COMPATIBILITY_PRINCIPLES,
  EVALUATION_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_COMPATIBILITY_KINDS,
  EVALUATION_COMPATIBILITY_KIND_DESCRIPTIONS,
  EVALUATION_COMPATIBILITY_INVARIANTS,
  EVALUATION_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
} from './evaluation-compatibility.js';

export type {
  EvaluationBoundaryPrinciple,
  EvaluationBoundary,
  EvaluationBoundaryInvariant,
} from './evaluation-boundaries.js';
export {
  EVALUATION_BOUNDARY_PRINCIPLES,
  EVALUATION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_BOUNDARIES,
  EVALUATION_BOUNDARY_DESCRIPTIONS,
  EVALUATION_BOUNDARY_INVARIANTS,
  EVALUATION_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './evaluation-boundaries.js';

export type {
  EvaluationVersioningPrinciple,
  EvaluationVersioningAspect,
  EvaluationVersioningInvariant,
} from './evaluation-versioning.js';
export {
  EVALUATION_VERSIONING_PRINCIPLES,
  EVALUATION_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_VERSIONING_ASPECTS,
  EVALUATION_VERSIONING_ASPECT_DESCRIPTIONS,
  EVALUATION_VERSIONING_INVARIANTS,
  EVALUATION_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './evaluation-versioning.js';
