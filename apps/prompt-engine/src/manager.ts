import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { PromptAssembler } from './assembler.js';
import { PromptCompiler } from './compiler.js';
import { PromptConfiguration } from './configuration.js';
import type { PromptEngineSettings } from './configuration.js';
import { PromptError } from './errors.js';
import { PromptEvents } from './events.js';
import { PromptFactory } from './factory.js';
import { PromptLifecycle } from './lifecycle.js';
import { PromptMetrics } from './metrics.js';
import { PromptNormalizer } from './normalizer.js';
import { PromptRegistry } from './registry.js';
import { PromptTemplateResolver } from './template-resolver.js';
import type {
  CompiledPrompt,
  CompositionInput,
  PromptDefinitionInput,
  PromptDiagnostics,
  PromptId,
  PromptStatistics,
} from './types.js';
import { PromptValidator, VALIDATION_ERROR_CODES } from './validator.js';
import { PromptVariableResolver } from './variable-resolver.js';

/** The options a {@link PromptManager} is constructed from. */
export interface PromptManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<PromptEngineSettings>;
}

/**
 * The Prompt Engine facade and DI entry. It composes the registry, factory, lifecycle, template and
 * variable resolvers, assembler, normalizer, validator, compiler, metrics, events, and configuration into
 * one operational subsystem, and exposes the engine's operations: register a definition, retire it,
 * compile a prompt into an execution-ready `ProviderRequest`, and read statistics and diagnostics. It
 * consumes the frozen prompt model and the Provider Engine request contract, and executes nothing.
 */
export class PromptManager {
  readonly #registry: PromptRegistry;
  readonly #factory: PromptFactory;
  readonly #lifecycle: PromptLifecycle;
  readonly #compiler: PromptCompiler;
  readonly #metrics: PromptMetrics;
  readonly #events: PromptEvents;
  readonly #configuration: PromptConfiguration;

  constructor(options: PromptManagerOptions) {
    this.#registry = new PromptRegistry();
    this.#factory = new PromptFactory();
    this.#lifecycle = new PromptLifecycle();
    this.#compiler = new PromptCompiler(
      new PromptTemplateResolver(),
      new PromptVariableResolver(),
      new PromptAssembler(),
      new PromptNormalizer(),
      new PromptValidator(),
    );
    this.#metrics = new PromptMetrics();
    this.#events = new PromptEvents(options.bus, options.clock);
    this.#configuration = new PromptConfiguration(options.settings);
  }

  /** Register a prompt definition; emits a `registered` event, fail closed. */
  async register(input: PromptDefinitionInput): Promise<Result<PromptId, PromptError>> {
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

  /** Retire a definition (remove the durable architecture); returns whether one was removed. */
  unregister(id: PromptId): boolean {
    return this.#registry.unregister(id);
  }

  /**
   * Compile a registered definition into an execution-ready `ProviderRequest`; emits a `compiled` or
   * `failed` event, fail closed. It refuses an unknown id (`PROMPT.UNKNOWN`) or a definition that has
   * passed expression (`PROMPT.NOT_COMPOSABLE`).
   */
  async compile(
    id: PromptId,
    input: CompositionInput,
  ): Promise<Result<CompiledPrompt, PromptError>> {
    this.#metrics.recordCompilation();
    const definition = this.#registry.get(id);
    if (definition === undefined) {
      this.#metrics.recordFailure();
      await this.#events.failed(id, '');
      return err(
        new PromptError('PROMPT.UNKNOWN', `No prompt definition is registered with id '${id}'.`, {
          id,
        }),
      );
    }
    if (!this.#lifecycle.isComposable(definition)) {
      this.#metrics.recordFailure();
      await this.#events.failed(id, definition.capability);
      return err(
        new PromptError(
          'PROMPT.NOT_COMPOSABLE',
          `Prompt definition '${id}' has passed expression and is not composable.`,
          { id, phase: definition.phase },
        ),
      );
    }
    const result = this.#compiler.compile(
      definition,
      input,
      this.#registry,
      this.#configuration.settings.strictVariables,
    );
    if (isOk(result)) {
      this.#metrics.recordSuccess();
      await this.#events.compiled(definition.id, definition.capability);
      return result;
    }
    this.#metrics.recordFailure();
    if (VALIDATION_ERROR_CODES.has(result.error.code)) {
      this.#metrics.recordValidationFailure();
    }
    await this.#events.failed(definition.id, definition.capability);
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): PromptStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): PromptDiagnostics {
    const diagnostics: PromptDiagnostics = {
      definitionCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
