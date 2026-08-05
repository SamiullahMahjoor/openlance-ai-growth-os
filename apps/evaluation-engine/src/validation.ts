import { EVALUATION_VALIDATION_CHECKS } from '@openlance/aios-evaluation';
import type { EvaluationValidationCheck } from '@openlance/aios-evaluation';

import { EvaluationNormalizer } from './normalizer.js';
import { isSubjectKind } from './subjects.js';
import type {
  Benchmark,
  EvaluationRequest,
  MeasuredMetric,
  Score,
  ValidationCheckResult,
  ValidationOutcome,
} from './types.js';

/** The inputs a validation runs over: the request, the measured metrics, the derived score, and the resolved benchmark. */
export interface ValidationInputs {
  readonly request: EvaluationRequest;
  readonly measured: readonly MeasuredMetric[];
  readonly score: Score | null;
  readonly benchmark: Benchmark | null;
  readonly benchmarkRequested: boolean;
}

/**
 * The validator: it validates an evaluation through the frozen, conjunctive validation checks, applied in the frozen
 * order (`EVALUATION_VALIDATION_CHECKS`, well-formedness first to constitutional last) and short-circuiting at the first
 * failing check, so a malformed evaluation is rejected early and an evaluation that fails any check yields no accepted
 * result. It defines what is checked and in what order, never the governance rule, which is owned by ai/governance/. It
 * validates; it decides nothing.
 */
export class Validator {
  readonly #normalizer = new EvaluationNormalizer();

  /** Validate the inputs through the frozen checks, in order; the outcome records each check and the first failure. */
  validate(inputs: ValidationInputs): ValidationOutcome {
    const runners: Record<EvaluationValidationCheck, () => ValidationCheckResult> = {
      'well-formedness-validation': () => this.#wellFormedness(inputs),
      'grounding-validation': () => this.#grounding(inputs),
      'scoring-validation': () => this.#scoring(inputs),
      'constitutional-validation': () => this.#constitutional(inputs),
    };
    const checks: ValidationCheckResult[] = [];
    for (const check of EVALUATION_VALIDATION_CHECKS) {
      const result = runners[check]();
      checks.push(result);
      if (!result.passed) {
        return Object.freeze({
          checks: Object.freeze(checks),
          accepted: false,
          failedCheck: check,
        });
      }
    }
    return Object.freeze({ checks: Object.freeze(checks), accepted: true, failedCheck: null });
  }

  /** Well-formedness: a defined subject output, at least one distinct defined metric, and a defined benchmark where requested. */
  #wellFormedness(inputs: ValidationInputs): ValidationCheckResult {
    const kind = inputs.request.subject?.kind;
    const reference = inputs.request.subject?.reference;
    const names = inputs.measured.map((metric) => metric.metric);
    const kindOk = typeof kind === 'string' && isSubjectKind(kind);
    const referenceOk = typeof reference === 'string' && reference.trim() !== '';
    const metricsOk = names.length > 0 && names.every((name) => name !== '');
    const distinctOk = new Set(names).size === names.length;
    const benchmarkOk = !inputs.benchmarkRequested || inputs.benchmark !== null;
    const passed = kindOk && referenceOk && metricsOk && distinctOk && benchmarkOk;
    return Object.freeze({
      check: 'well-formedness-validation',
      passed,
      detail: passed
        ? 'well formed'
        : 'a defined subject output, at least one distinct defined metric, and a defined benchmark where a comparison is made',
    });
  }

  /** Grounding: every measured metric is grounded, so a result is never accepted from an ungrounded evaluation. */
  #grounding(inputs: ValidationInputs): ValidationCheckResult {
    const passed = inputs.measured.every((metric) => metric.grounded);
    return Object.freeze({
      check: 'grounding-validation',
      passed,
      detail: passed
        ? 'grounded'
        : 'every measurement rests on defined ground, never on invented ground',
    });
  }

  /** Scoring: the score is derived from the measured metrics and traceable to them, never assigned by opinion. */
  #scoring(inputs: ValidationInputs): ValidationCheckResult {
    const passed = inputs.score !== null;
    return Object.freeze({
      check: 'scoring-validation',
      passed,
      detail: passed
        ? 'score traceable to its metrics'
        : 'a score derived from the measured metrics, traceable to them',
    });
  }

  /** Constitutional: the evaluation has a distinct, stable identity and stays within evaluation's boundaries. */
  #constitutional(inputs: ValidationInputs): ValidationCheckResult {
    const identity = this.#normalizer.normalize(
      typeof inputs.request.evaluation === 'string' ? inputs.request.evaluation : '',
    );
    const passed = identity !== '';
    return Object.freeze({
      check: 'constitutional-validation',
      passed,
      detail: passed
        ? 'within evaluation boundaries; the result informs and never decides'
        : 'a distinct, stable evaluation identity',
    });
  }
}
