import { Comparator } from './comparison.js';
import type { EvaluationHash } from './hash.js';
import { Measurer } from './measurement.js';
import { EvaluationNormalizer } from './normalizer.js';
import { Scorer } from './scoring.js';
import { isSubjectKind } from './subjects.js';
import type {
  BenchmarkResolver,
  EvaluationRequest,
  EvaluationResult,
  EvaluationVerdict,
} from './types.js';
import { Validator } from './validation.js';

/**
 * The evaluator: it runs one evaluation through the frozen lifecycle - framing, measurement, scoring, optional
 * comparison, validation, result - deterministically and never throwing, and produces one immutable, content-hashed
 * `EvaluationResult`. It is fail-closed: an evaluation that fails validation yields a `withheld` result whose score and
 * comparison are withheld and whose failing check is recorded. It observes the subject output and never changes it,
 * reasons about nothing, and decides nothing; the result informs a decision owned by ai/governance/ or ai/safety/. The
 * result and its id are a pure function of the request and the registered benchmarks, with no wall clock.
 */
export class Evaluator {
  readonly #measurer = new Measurer();
  readonly #scorer = new Scorer();
  readonly #comparator = new Comparator();
  readonly #validator = new Validator();
  readonly #normalizer = new EvaluationNormalizer();
  readonly #hash: EvaluationHash;

  constructor(hash: EvaluationHash) {
    this.#hash = hash;
  }

  /** Evaluate one request against the registered benchmarks; returns an immutable, deterministic result. */
  evaluate(request: EvaluationRequest, benchmarks: BenchmarkResolver): EvaluationResult {
    // Zero trust: a whole-request null/undefined (or primitive) never throws; it settles to an empty request and withholds.
    const safe = request ?? ({} as EvaluationRequest);
    const measured = this.#measurer.measure(safe.metrics);
    const benchmarkName = this.#normalizer.normalize(
      typeof safe.benchmark === 'string' ? safe.benchmark : '',
    );
    const benchmarkRequested = benchmarkName !== '';
    const benchmark = benchmarkRequested ? (benchmarks.get(benchmarkName) ?? null) : null;
    const score = this.#scorer.derive(measured);
    const comparison =
      benchmark !== null && score !== null ? this.#comparator.compare(measured, benchmark) : null;
    const validation = this.#validator.validate({
      request: safe,
      measured,
      score,
      benchmark,
      benchmarkRequested,
    });

    const accepted = validation.accepted;
    const verdict: EvaluationVerdict = accepted ? 'accepted' : 'withheld';
    const kind = safe.subject?.kind;
    const subject = typeof kind === 'string' && isSubjectKind(kind) ? kind : 'unknown';
    const identity = typeof safe.evaluation === 'string' ? safe.evaluation : '';
    const acceptedScore = accepted ? score : null;
    const acceptedComparison = accepted ? comparison : null;
    const benchmarkVersion = acceptedComparison !== null ? acceptedComparison.version : null;

    const canonical = JSON.stringify([
      identity,
      subject,
      verdict,
      measured.map((metric) => [metric.metric, metric.value, metric.grounded]),
      acceptedScore === null
        ? null
        : [acceptedScore.value, acceptedScore.method, acceptedScore.metrics],
      acceptedComparison === null
        ? null
        : acceptedComparison.entries.map((entry) => [
            entry.metric,
            entry.measured,
            entry.benchmark,
            entry.standing,
          ]),
      benchmarkVersion,
      validation.checks.map((check) => [check.check, check.passed]),
      validation.failedCheck,
    ]);

    return Object.freeze({
      evaluation: identity,
      subject,
      verdict,
      measured,
      score: acceptedScore,
      comparison: acceptedComparison,
      benchmarkVersion,
      validation,
      id: this.#hash.hash(canonical),
    });
  }
}
