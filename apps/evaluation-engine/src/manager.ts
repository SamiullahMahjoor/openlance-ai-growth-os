import type { EventBus } from '@openlance/aios-events';
import type { Clock, Result } from '@openlance/aios-kernel';
import { err, isErr, ok } from '@openlance/aios-kernel';

import { EvaluationAuditManager } from './audit.js';
import { BenchmarkFactory } from './benchmark-factory.js';
import { BenchmarkRegistry } from './benchmark-registry.js';
import { EvaluationConfiguration } from './configuration.js';
import type { EvaluationSettings } from './configuration.js';
import type { EvaluationError } from './errors.js';
import { EvaluationMetrics } from './eval-metrics.js';
import { EvaluationEvents } from './events.js';
import { Evaluator } from './evaluator.js';
import { EvaluationHash } from './hash.js';
import { EvaluationNormalizer } from './normalizer.js';
import { EvaluationPluginBridge } from './plugin-bridge.js';
import type { EvaluationPlugin } from './plugin-bridge.js';
import type {
  Benchmark,
  BenchmarkInput,
  EvaluationAudit,
  EvaluationDiagnosticsView,
  EvaluationRequest,
  EvaluationResult,
  EvaluationStatistics,
} from './types.js';

/** The options an {@link EvaluationManager} is constructed from. */
export interface EvaluationManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<EvaluationSettings>;
}

/**
 * The Evaluation Engine facade and DI entry. It composes the assessment pipeline (measurement, scoring, comparison,
 * validation) through the evaluator, and the benchmark registry, factory, plugin bridge, audit, counters, and events,
 * into one operational assessment subsystem, and exposes the engine's operations: evaluate a subject output, manage the
 * benchmark extension, and read the immutable audit, statistics, and diagnostics. It applies the frozen evaluation model,
 * measures and reports, and never performs, decides, or changes behavior.
 */
export class EvaluationManager {
  readonly #configuration: EvaluationConfiguration;
  readonly #hash: EvaluationHash;
  readonly #normalizer: EvaluationNormalizer;
  readonly #registry: BenchmarkRegistry;
  readonly #factory: BenchmarkFactory;
  readonly #bridge: EvaluationPluginBridge;
  readonly #evaluator: Evaluator;
  readonly #audit: EvaluationAuditManager;
  readonly #counters: EvaluationMetrics;
  readonly #events: EvaluationEvents;
  readonly #clock: Clock;

  constructor(options: EvaluationManagerOptions) {
    this.#configuration = new EvaluationConfiguration(options.settings);
    this.#hash = new EvaluationHash();
    this.#normalizer = new EvaluationNormalizer();
    this.#registry = new BenchmarkRegistry();
    this.#factory = new BenchmarkFactory();
    this.#bridge = new EvaluationPluginBridge(this.#registry);
    this.#evaluator = new Evaluator(this.#hash);
    this.#audit = new EvaluationAuditManager();
    this.#counters = new EvaluationMetrics();
    this.#events = new EvaluationEvents(options.bus, options.clock);
    this.#clock = options.clock;
  }

  /** Evaluate one subject output; returns an immutable, deterministic result. A repeated identity is not double-counted. It never throws. */
  async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    const result = this.#evaluator.evaluate(request, this.#registry);
    const fresh = this.#audit.record(result.evaluation, result.verdict, this.#clock.now());
    if (fresh) {
      this.#counters.recordEvaluation(result.verdict);
      await this.#events.evaluated(result.evaluation);
      await this.#events.result(result.evaluation, result.verdict);
    } else {
      this.#counters.recordDuplicate();
    }
    return result;
  }

  /** Register a benchmark; fail closed on an invalid or duplicate benchmark. Returns the normalized benchmark name. */
  registerBenchmark(input: BenchmarkInput): Result<string, EvaluationError> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    return ok(created.value.name);
  }

  /** Adopt benchmark-carrying plugins into the registry, atomically; fail closed. */
  adopt(plugins: readonly EvaluationPlugin[]): Result<readonly string[], EvaluationError> {
    return this.#bridge.adopt(plugins);
  }

  /** Remove a registered benchmark; returns whether one was removed. */
  removeBenchmark(name: string): boolean {
    return this.#registry.unregister(this.#normalizer.normalize(name));
  }

  /** All registered benchmarks, in registration order. */
  benchmarks(): readonly Benchmark[] {
    return this.#registry.list();
  }

  /** The immutable audit trail, bounded by the configured history limit. */
  audit(): EvaluationAudit {
    return this.#audit.audit(this.#hash, this.#configuration.settings.historyLimit);
  }

  /** A frozen snapshot of the engine's own statistics. */
  statistics(): EvaluationStatistics {
    return this.#counters.statistics();
  }

  /** A frozen operational view of the engine itself. */
  diagnostics(): EvaluationDiagnosticsView {
    return Object.freeze({
      benchmarkCount: this.#registry.list().length,
      statistics: this.#counters.statistics(),
    });
  }
}
