/**
 * @packageDocumentation
 * `@openlance/aios-evaluation-engine`
 *
 * The AIOS Evaluation Engine (Platform Completion, PC-1): the Runtime's operational assessment subsystem, the operational
 * realization of the frozen `ai/evaluation/` assessment model. It consumes an immutable `EvaluationRequest` (an evaluation
 * identity, a subject namespace's output by reference, framed metric measurements, and an optional benchmark), runs the
 * frozen lifecycle (framing, measurement, scoring, validation, result) and the conjunctive validation order
 * (well-formedness, grounding, scoring, constitutional), and produces an immutable, content-hashed `EvaluationResult`
 * that informs a decision it never makes. It is deterministic, fail-closed, zero-trust, and idempotent; it never
 * performs, decides, or changes behavior, never defines a metric mechanism, and holds no vendor knowledge (ADR-0046).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI. It registers through the frozen composition-root seam (ADR-0026) under `EVALUATION_MANAGER`.
 */

export { EvaluationManager } from './manager.js';
export type { EvaluationManagerOptions } from './manager.js';
export { EVALUATION_MANAGER, evaluationEngineModule } from './module.js';

export { Evaluator } from './evaluator.js';
export { Measurer } from './measurement.js';
export { Scorer } from './scoring.js';
export { Comparator } from './comparison.js';
export { Validator } from './validation.js';
export type { ValidationInputs } from './validation.js';
export { BenchmarkRegistry } from './benchmark-registry.js';
export { BenchmarkFactory } from './benchmark-factory.js';
export { EvaluationPluginBridge } from './plugin-bridge.js';
export type { EvaluationPlugin } from './plugin-bridge.js';
export { EvaluationAuditManager } from './audit.js';
export { EvaluationMetrics } from './eval-metrics.js';
export { EvaluationConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { EvaluationSettings } from './configuration.js';
export { EvaluationNormalizer } from './normalizer.js';
export { EvaluationHash } from './hash.js';
export { EvaluationEvents, EVALUATION_EVENT_TYPES } from './events.js';
export { EvaluationError } from './errors.js';
export { SUBJECT_KINDS, isSubjectKind } from './subjects.js';

export type {
  Benchmark,
  BenchmarkInput,
  BenchmarkResolver,
  BenchmarkValue,
  Comparison,
  ComparisonEntry,
  EvaluationAudit,
  AuditEntry,
  EvaluationDiagnosticsView,
  EvaluationRequest,
  EvaluationResult,
  EvaluationStatistics,
  EvaluationSubjectKind,
  EvaluationVerdict,
  MeasuredMetric,
  MetricMeasurement,
  Score,
  Standing,
  SubjectOutput,
  ValidationCheckResult,
  ValidationOutcome,
} from './types.js';
