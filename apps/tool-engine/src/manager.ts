import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { ToolConfiguration } from './configuration.js';
import type { ToolEngineSettings } from './configuration.js';
import type { ToolError } from './errors.js';
import { ToolEvents } from './events.js';
import { ToolExecutor } from './executor.js';
import { ToolFactory } from './factory.js';
import { ToolMetrics } from './metrics.js';
import { ToolNormalizer } from './normalizer.js';
import { ToolRegistry } from './registry.js';
import { ToolResolver } from './resolver.js';
import { ToolSelector } from './selector.js';
import type {
  ToolDefinitionInput,
  ToolDiagnostics,
  ToolId,
  ToolRequest,
  ToolResponse,
  ToolStatistics,
} from './types.js';
import { ToolValidator, VALIDATION_ERROR_CODES } from './validator.js';

/** The options a {@link ToolManager} is constructed from. */
export interface ToolManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<ToolEngineSettings>;
}

/**
 * The Tool Engine facade and DI entry. It composes the registry, factory, selector, resolver, validator, executor,
 * metrics, events, and configuration into one operational subsystem, and exposes the engine's operations: register a
 * tool, prepare the validated execution for a request, remove a tool, and read statistics and diagnostics. It drives
 * the frozen tool model, consumes the frozen tool model, prepares and stops, and reaches into no operational service.
 */
export class ToolManager {
  readonly #registry: ToolRegistry;
  readonly #factory: ToolFactory;
  readonly #executor: ToolExecutor;
  readonly #metrics: ToolMetrics;
  readonly #events: ToolEvents;
  readonly #configuration: ToolConfiguration;

  constructor(options: ToolManagerOptions) {
    this.#registry = new ToolRegistry();
    this.#factory = new ToolFactory();
    this.#executor = new ToolExecutor(
      new ToolSelector(),
      new ToolResolver(),
      new ToolValidator(),
      new ToolNormalizer(),
    );
    this.#metrics = new ToolMetrics();
    this.#events = new ToolEvents(options.bus, options.clock);
    this.#configuration = new ToolConfiguration(options.settings);
  }

  /** Register a tool; emits a `registered` event, fail closed. */
  async register(input: ToolDefinitionInput): Promise<Result<ToolId, ToolError>> {
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

  /** Remove a registered tool; returns whether one was removed. */
  remove(id: ToolId): boolean {
    return this.#registry.unregister(id);
  }

  /**
   * Prepare the validated execution for a request; emits a `prepared` or `failed` event, fail closed. It prepares and
   * stops; it carries nothing out.
   */
  async prepare(request: ToolRequest): Promise<Result<ToolResponse, ToolError>> {
    this.#metrics.recordPreparation();
    const result = this.#executor.prepare(
      request,
      this.#registry,
      this.#configuration.settings.strictPermission,
    );
    if (isOk(result)) {
      this.#metrics.recordSuccess();
      await this.#events.prepared(result.value.execution.capability, result.value.execution.tool);
      return result;
    }
    this.#metrics.recordFailure();
    if (VALIDATION_ERROR_CODES.has(result.error.code)) {
      this.#metrics.recordValidationFailure();
    }
    await this.#events.failed(request.capability);
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): ToolStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): ToolDiagnostics {
    const diagnostics: ToolDiagnostics = {
      toolCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
