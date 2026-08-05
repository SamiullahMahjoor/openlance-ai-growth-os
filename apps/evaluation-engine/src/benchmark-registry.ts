import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { EvaluationError } from './errors.js';
import type { Benchmark, BenchmarkResolver } from './types.js';

/**
 * The benchmark registry: registration and deterministic lookup of named benchmarks (the fixed reference standards an
 * evaluation measures against). It preserves registration order, so the set of benchmarks is deterministic, and resolves
 * a benchmark by name for a comparison. It holds reference standards; it holds no subject behavior and no business truth.
 */
export class BenchmarkRegistry implements BenchmarkResolver {
  readonly #byName = new Map<string, Benchmark>();

  /** Register a benchmark. Fails closed on a duplicate name (`EVALUATION.DUPLICATE_BENCHMARK`). */
  register(benchmark: Benchmark): Result<void, EvaluationError> {
    if (this.#byName.has(benchmark.name)) {
      return err(
        new EvaluationError(
          'EVALUATION.DUPLICATE_BENCHMARK',
          `A benchmark named '${benchmark.name}' is already registered.`,
          { benchmark: benchmark.name },
        ),
      );
    }
    this.#byName.set(benchmark.name, benchmark);
    return ok(undefined);
  }

  /** Whether a benchmark with the given name is registered. */
  has(name: string): boolean {
    return this.#byName.has(name);
  }

  /** Resolve a benchmark by name, or `undefined` when none is registered. */
  get(name: string): Benchmark | undefined {
    return this.#byName.get(name);
  }

  /** All registered benchmarks, in registration order, as a frozen array. */
  list(): readonly Benchmark[] {
    return Object.freeze([...this.#byName.values()]);
  }

  /** Remove a benchmark by name; returns whether one was removed. */
  unregister(name: string): boolean {
    return this.#byName.delete(name);
  }
}
