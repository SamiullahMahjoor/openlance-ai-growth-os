import type { EvaluationValidationCheck } from '@openlance/aios-evaluation';

/**
 * A subject namespace whose output an evaluation may assess. Evaluation observes the outputs of the namespaces it
 * evaluates one-directionally; these are exactly the subject namespaces the constitution names.
 */
export type EvaluationSubjectKind =
  'agent' | 'reasoning' | 'retrieval' | 'prompt' | 'provider' | 'tool' | 'memory';

/**
 * The subject output under assessment: a reference to a subject namespace's output, never the subject's internals. The
 * evaluation assesses the output and never reaches into the behavior that produced it, which the subject namespace owns.
 */
export interface SubjectOutput {
  readonly kind: EvaluationSubjectKind;
  readonly reference: string;
}

/**
 * One framed metric measurement: a named, defined measurement of the output, the caller-supplied measured value, and
 * whether it is grounded. The measured value is framed by the caller against the subject's quality definition, which
 * evaluation does not own; evaluation records, scores, validates, and compares it, and defines no metric mechanism.
 */
export interface MetricMeasurement {
  readonly metric: string;
  readonly value: number;
  readonly grounded: boolean;
}

/** A named benchmark value: a fixed reference standard for one metric. */
export interface BenchmarkValue {
  readonly metric: string;
  readonly value: number;
}

/** An immutable, named, versioned benchmark: the fixed reference standards an evaluation measures against. */
export interface Benchmark {
  readonly name: string;
  readonly version: string;
  readonly values: readonly BenchmarkValue[];
}

/** A benchmark's registration input; the factory validates it, normalizes its name, and freezes it. */
export interface BenchmarkInput {
  readonly name: string;
  readonly version: string;
  readonly values?: readonly BenchmarkValue[];
}

/**
 * An immutable evaluation request: the frozen evaluation parts (identity, subject output, framed metrics, and, where a
 * comparison is made, the name of a registered benchmark).
 */
export interface EvaluationRequest {
  readonly evaluation: string;
  readonly subject: SubjectOutput;
  readonly metrics: readonly MetricMeasurement[];
  readonly benchmark?: string;
}

/** A measured metric: the framed measurement recorded in the measurement phase, observed and never changed. */
export interface MeasuredMetric {
  readonly metric: string;
  readonly value: number;
  readonly grounded: boolean;
}

/** An immutable score: derived from the measured metrics by a transparent, traceable calculation. */
export interface Score {
  readonly value: number;
  readonly method: string;
  readonly metrics: readonly string[];
}

/** The relative standing of a measured value against a benchmark value. */
export type Standing = 'above' | 'below' | 'equal';

/** One per-metric comparison entry against a benchmark. */
export interface ComparisonEntry {
  readonly metric: string;
  readonly measured: number;
  readonly benchmark: number;
  readonly standing: Standing;
}

/** An immutable comparison against a benchmark: like-for-like relative standing, recording the benchmark version. */
export interface Comparison {
  readonly benchmark: string;
  readonly version: string;
  readonly entries: readonly ComparisonEntry[];
  readonly standing: Standing;
}

/** One validation-check result, carried in the frozen check order. */
export interface ValidationCheckResult {
  readonly check: EvaluationValidationCheck;
  readonly passed: boolean;
  readonly detail: string;
}

/** The immutable validation outcome: the ordered check results, whether the result is accepted, and the first failure. */
export interface ValidationOutcome {
  readonly checks: readonly ValidationCheckResult[];
  readonly accepted: boolean;
  readonly failedCheck: EvaluationValidationCheck | null;
}

/** The verdict of an evaluation result: an accepted assessment, or a withheld one that informs no decision. */
export type EvaluationVerdict = 'accepted' | 'withheld';

/**
 * An immutable evaluation result: the validated assessment of one subject output. It informs a decision owned by
 * ai/governance/ or a protection owned by ai/safety/, and carries no decision of its own.
 */
export interface EvaluationResult {
  readonly evaluation: string;
  readonly subject: EvaluationSubjectKind | 'unknown';
  readonly verdict: EvaluationVerdict;
  readonly measured: readonly MeasuredMetric[];
  readonly score: Score | null;
  readonly comparison: Comparison | null;
  readonly benchmarkVersion: string | null;
  readonly validation: ValidationOutcome;
  readonly id: string;
}

/** One immutable audit entry: an evaluation the engine processed and its verdict. */
export interface AuditEntry {
  readonly evaluation: string;
  readonly verdict: EvaluationVerdict;
  readonly at: number;
}

/** An immutable evaluation audit trail, in processing order. */
export interface EvaluationAudit {
  readonly entries: readonly AuditEntry[];
  readonly id: string;
}

/** A read-only snapshot of the engine's own counters. */
export interface EvaluationStatistics {
  readonly evaluations: number;
  readonly accepted: number;
  readonly withheld: number;
  readonly duplicates: number;
}

/** A read-only operational view of the engine itself. */
export interface EvaluationDiagnosticsView {
  readonly benchmarkCount: number;
  readonly statistics: EvaluationStatistics;
}

/** Read-only resolution of a registered benchmark by name; the engine resolves a framed benchmark through it. */
export interface BenchmarkResolver {
  get(name: string): Benchmark | undefined;
}
