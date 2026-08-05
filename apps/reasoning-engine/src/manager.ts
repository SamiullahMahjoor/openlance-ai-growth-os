import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { ReasoningConfiguration } from './configuration.js';
import type { ReasoningEngineSettings } from './configuration.js';
import { ReasoningDecomposer } from './decomposer.js';
import type { ReasoningError } from './errors.js';
import { ReasoningEvents } from './events.js';
import { ReasoningFactory } from './factory.js';
import { ReasoningMetrics } from './metrics.js';
import { ReasoningNormalizer } from './normalizer.js';
import { ReasoningPlanner } from './planner.js';
import { ReasoningRegistry } from './registry.js';
import type {
  PremiseInput,
  ReasoningDiagnostics,
  ReasoningId,
  ReasoningPlan,
  ReasoningRequest,
  ReasoningStatistics,
} from './types.js';
import { ReasoningValidator } from './validator.js';

/** The options a {@link ReasoningManager} is constructed from. */
export interface ReasoningManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<ReasoningEngineSettings>;
}

/**
 * The Reasoning Engine facade and DI entry. It composes the registry, factory, planner (decomposer, validator,
 * normalizer), metrics, events, and configuration into one operational subsystem, and exposes the engine's operations:
 * register a premise, reason a request into a governed plan, remove a premise, and read statistics and diagnostics. It
 * drives the frozen reasoning model, consumes the frozen reasoning model, reasons and stops, and reaches into no
 * operational service.
 */
export class ReasoningManager {
  readonly #registry: ReasoningRegistry;
  readonly #factory: ReasoningFactory;
  readonly #planner: ReasoningPlanner;
  readonly #metrics: ReasoningMetrics;
  readonly #events: ReasoningEvents;
  readonly #configuration: ReasoningConfiguration;

  constructor(options: ReasoningManagerOptions) {
    this.#registry = new ReasoningRegistry();
    this.#factory = new ReasoningFactory();
    this.#planner = new ReasoningPlanner(
      new ReasoningDecomposer(),
      new ReasoningValidator(),
      new ReasoningNormalizer(),
    );
    this.#metrics = new ReasoningMetrics();
    this.#events = new ReasoningEvents(options.bus, options.clock);
    this.#configuration = new ReasoningConfiguration(options.settings);
  }

  /** Register a premise; emits a `registered` event, fail closed. */
  async register(input: PremiseInput): Promise<Result<ReasoningId, ReasoningError>> {
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

  /** Remove a registered premise; returns whether one was removed. */
  remove(id: ReasoningId): boolean {
    return this.#registry.unregister(id);
  }

  /**
   * Reason a request into a governed plan; emits a `reasoned` or `failed` event, fail closed. It reasons and stops; it
   * invokes no provider and executes nothing.
   */
  async reason(request: ReasoningRequest): Promise<Result<ReasoningPlan, ReasoningError>> {
    this.#metrics.recordReasoning();
    const result = this.#planner.plan(
      request,
      this.#registry,
      this.#configuration.settings.strictGovernance,
    );
    if (isOk(result)) {
      if (result.value.stage === 'concluded') {
        this.#metrics.recordConcluded();
      } else if (result.value.stage === 'inconclusive') {
        this.#metrics.recordInconclusive();
      } else {
        this.#metrics.recordEscalated();
      }
      await this.#events.reasoned(result.value.task, result.value.stage);
      return result;
    }
    this.#metrics.recordFailure();
    await this.#events.failed(request.task);
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): ReasoningStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): ReasoningDiagnostics {
    const diagnostics: ReasoningDiagnostics = {
      premiseCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
