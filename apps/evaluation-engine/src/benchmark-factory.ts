import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { EvaluationError } from './errors.js';
import { EvaluationNormalizer } from './normalizer.js';
import type { Benchmark, BenchmarkInput, BenchmarkValue } from './types.js';

/**
 * The benchmark factory: it validates a `BenchmarkInput` and builds an immutable, normalized `Benchmark` (a named,
 * versioned set of fixed reference standards). It fails closed on a blank name, a blank version, a blank metric entry, or
 * a non-finite value. An empty value set is a valid but inert benchmark. It builds a benchmark record only; it measures
 * and decides nothing.
 */
export class BenchmarkFactory {
  readonly #normalizer = new EvaluationNormalizer();

  /** Validate an input and build a frozen `Benchmark`, failing closed on an invalid input. */
  create(input: BenchmarkInput): Result<Benchmark, EvaluationError> {
    const name = this.#normalizer.normalize(typeof input?.name === 'string' ? input.name : '');
    if (name === '') {
      return err(
        new EvaluationError('EVALUATION.BLANK_BENCHMARK_NAME', 'A benchmark has a blank name.', {}),
      );
    }
    const version = (typeof input?.version === 'string' ? input.version : '').trim();
    if (version === '') {
      return err(
        new EvaluationError(
          'EVALUATION.BLANK_BENCHMARK_VERSION',
          `Benchmark '${name}' has a blank version.`,
          { benchmark: name },
        ),
      );
    }
    const values: BenchmarkValue[] = [];
    for (const value of Array.isArray(input?.values) ? input.values : []) {
      const metric = this.#normalizer.normalize(
        typeof value?.metric === 'string' ? value.metric : '',
      );
      if (metric === '') {
        return err(
          new EvaluationError(
            'EVALUATION.BLANK_BENCHMARK_ENTRY',
            `Benchmark '${name}' has a blank metric entry.`,
            { benchmark: name },
          ),
        );
      }
      if (!Number.isFinite(value?.value)) {
        return err(
          new EvaluationError(
            'EVALUATION.INVALID_BENCHMARK_VALUE',
            `Benchmark '${name}' has a non-finite value for metric '${metric}'.`,
            { benchmark: name, metric },
          ),
        );
      }
      values.push(Object.freeze({ metric, value: value.value }));
    }
    const benchmark: Benchmark = { name, version, values: Object.freeze(values) };
    return ok(Object.freeze(benchmark));
  }
}
