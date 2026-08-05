import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { BenchmarkFactory } from './benchmark-factory.js';
import type { BenchmarkRegistry } from './benchmark-registry.js';
import { EvaluationError } from './errors.js';
import type { Benchmark, BenchmarkInput } from './types.js';

/**
 * A benchmark shipped as a plugin: the frozen `PluginManifest` identity plus the benchmark it contributes. The bridge
 * adopts such plugins into the engine benchmark registry. It consumes the frozen `PluginManifest` type and does not drive
 * the plugin host lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface EvaluationPlugin {
  readonly manifest: PluginManifest;
  readonly benchmark: BenchmarkInput;
}

/**
 * The evaluation plugin bridge: it adopts benchmark-carrying plugins into the engine benchmark registry, so a benchmark
 * may ship as a plugin. Each benchmark is validated and frozen through the same {@link BenchmarkFactory} as direct
 * registration, and adoption is atomic: every benchmark is validated and checked for a conflicting name before any is
 * registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin host, loader, or lifecycle.
 */
export class EvaluationPluginBridge {
  readonly #registry: BenchmarkRegistry;
  readonly #factory = new BenchmarkFactory();

  constructor(registry: BenchmarkRegistry) {
    this.#registry = registry;
  }

  /** Adopt the plugin benchmarks into the registry, atomically; returns the adopted benchmark names, fail closed. */
  adopt(plugins: readonly EvaluationPlugin[]): Result<readonly string[], EvaluationError> {
    const prepared: Benchmark[] = [];
    const seen = new Set<string>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.benchmark);
      if (isErr(built)) {
        return err(built.error);
      }
      const name = built.value.name;
      if (this.#registry.has(name) || seen.has(name)) {
        return err(
          new EvaluationError(
            'EVALUATION.DUPLICATE_BENCHMARK',
            `A benchmark named '${name}' is already registered.`,
            { benchmark: name },
          ),
        );
      }
      seen.add(name);
      prepared.push(built.value);
    }
    const adopted: string[] = [];
    for (const benchmark of prepared) {
      this.#registry.register(benchmark);
      adopted.push(benchmark.name);
    }
    return ok(Object.freeze(adopted));
  }
}
