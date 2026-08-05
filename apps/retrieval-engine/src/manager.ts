import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { RetrievalConfiguration } from './configuration.js';
import type { RetrievalEngineSettings } from './configuration.js';
import type { RetrievalError } from './errors.js';
import { RetrievalEvents } from './events.js';
import { RetrievalExecutor } from './executor.js';
import { RetrievalFactory } from './factory.js';
import { RetrievalFilter } from './filter.js';
import { RetrievalMetrics } from './metrics.js';
import { RetrievalRanker } from './ranker.js';
import { RetrievalRegistry } from './registry.js';
import { RetrievalResolver } from './resolver.js';
import type {
  RetrievalCandidateInput,
  RetrievalDiagnostics,
  RetrievalId,
  RetrievalRequest,
  RetrievalResult,
  RetrievalStatistics,
} from './types.js';
import { RetrievalValidator, VALIDATION_ERROR_CODES } from './validator.js';

/** The options a {@link RetrievalManager} is constructed from. */
export interface RetrievalManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<RetrievalEngineSettings>;
}

/**
 * The Retrieval Engine facade and DI entry. It composes the registry, factory, filter, resolver, ranker,
 * validator, executor, metrics, events, and configuration into one operational subsystem, and exposes the
 * engine's operations: register a candidate, retrieve the validated knowledge set for a request, remove a
 * candidate, and read statistics and diagnostics. It drives the frozen retrieval workflow, consumes the
 * frozen retrieval model, determines and stops, and reaches into no operational service.
 */
export class RetrievalManager {
  readonly #registry: RetrievalRegistry;
  readonly #factory: RetrievalFactory;
  readonly #executor: RetrievalExecutor;
  readonly #metrics: RetrievalMetrics;
  readonly #events: RetrievalEvents;
  readonly #configuration: RetrievalConfiguration;

  constructor(options: RetrievalManagerOptions) {
    this.#registry = new RetrievalRegistry();
    this.#factory = new RetrievalFactory();
    this.#executor = new RetrievalExecutor(
      new RetrievalFilter(),
      new RetrievalResolver(),
      new RetrievalRanker(),
      new RetrievalValidator(),
    );
    this.#metrics = new RetrievalMetrics();
    this.#events = new RetrievalEvents(options.bus, options.clock);
    this.#configuration = new RetrievalConfiguration(options.settings);
  }

  /** Register a retrieval candidate; emits a `registered` event, fail closed. */
  async register(input: RetrievalCandidateInput): Promise<Result<RetrievalId, RetrievalError>> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    this.#metrics.recordRegistration();
    await this.#events.registered(created.value.id);
    return ok(created.value.id);
  }

  /** Remove a registered candidate; returns whether one was removed. */
  remove(id: RetrievalId): boolean {
    return this.#registry.unregister(id);
  }

  /**
   * Determine the validated knowledge set for a request; emits a `retrieved` or `failed` event, fail
   * closed. It determines and stops; it loads nothing.
   */
  async retrieve(request: RetrievalRequest): Promise<Result<RetrievalResult, RetrievalError>> {
    this.#metrics.recordRetrieval();
    const result = this.#executor.execute(
      request,
      this.#registry,
      this.#configuration.settings.strictPermission,
    );
    if (isOk(result)) {
      this.#metrics.recordSuccess();
      await this.#events.retrieved(request.scope, result.value.candidates.length);
      return result;
    }
    this.#metrics.recordFailure();
    if (VALIDATION_ERROR_CODES.has(result.error.code)) {
      this.#metrics.recordValidationFailure();
    }
    await this.#events.failed(request.scope);
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): RetrievalStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): RetrievalDiagnostics {
    const diagnostics: RetrievalDiagnostics = {
      candidateCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
