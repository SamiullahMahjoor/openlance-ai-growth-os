import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { AgentComposer } from './composer.js';
import { AgentConfiguration } from './configuration.js';
import type { AgentSettings } from './configuration.js';
import { AgentCoordinator } from './coordinator.js';
import type { AgentError } from './errors.js';
import { AgentEvents } from './events.js';
import { AgentFactory } from './factory.js';
import { AgentMetrics } from './metrics.js';
import { AgentNormalizer } from './normalizer.js';
import { AgentPlanner } from './planner.js';
import { AgentRegistry } from './registry.js';
import type {
  AgentDefinitionInput,
  AgentDiagnostics,
  AgentExecutionPlan,
  AgentId,
  AgentRequest,
  AgentStatistics,
} from './types.js';
import { AgentValidator } from './validator.js';

/** The options an {@link AgentManager} is constructed from. */
export interface AgentManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<AgentSettings>;
}

/**
 * The Agent Engine facade and DI entry. It composes the registry, factory, planner (composer, validator, coordinator,
 * normalizer), metrics, events, and configuration into one operational subsystem, and exposes the engine's operations:
 * register an agent, plan a request into an immutable execution plan, remove an agent, and read statistics and
 * diagnostics. It is the composition owner: it drives the frozen agent model, composes the six engines' contracts,
 * composes and stops, and executes nothing.
 */
export class AgentManager {
  readonly #registry: AgentRegistry;
  readonly #factory: AgentFactory;
  readonly #planner: AgentPlanner;
  readonly #metrics: AgentMetrics;
  readonly #events: AgentEvents;
  readonly #configuration: AgentConfiguration;

  constructor(options: AgentManagerOptions) {
    this.#registry = new AgentRegistry();
    this.#factory = new AgentFactory();
    this.#planner = new AgentPlanner(
      new AgentComposer(),
      new AgentValidator(),
      new AgentCoordinator(),
      new AgentNormalizer(),
    );
    this.#metrics = new AgentMetrics();
    this.#events = new AgentEvents(options.bus, options.clock);
    this.#configuration = new AgentConfiguration(options.settings);
  }

  /** Register an agent; emits a `registered` event, fail closed. */
  async register(input: AgentDefinitionInput): Promise<Result<AgentId, AgentError>> {
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

  /** Remove a registered agent; returns whether one was removed. */
  remove(id: AgentId): boolean {
    return this.#registry.unregister(id);
  }

  /**
   * Compose an immutable execution plan for a request; emits a `planned` or `failed` event, fail closed. It composes and
   * stops; it invokes no engine and executes nothing.
   */
  async plan(request: AgentRequest): Promise<Result<AgentExecutionPlan, AgentError>> {
    this.#metrics.recordPlan();
    const result = this.#planner.plan(
      request,
      this.#registry,
      this.#configuration.settings.maxSteps,
      this.#configuration.settings.maxLinks,
    );
    if (isOk(result)) {
      this.#metrics.recordSuccess();
      await this.#events.planned(result.value.agent, result.value.task);
      return result;
    }
    this.#metrics.recordFailure();
    await this.#events.failed(request.agent);
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): AgentStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): AgentDiagnostics {
    const diagnostics: AgentDiagnostics = {
      agentCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
