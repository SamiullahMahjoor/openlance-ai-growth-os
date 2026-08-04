import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';
import { MEMORY_WORKFLOW_STEPS, workflowStepAtOrAfter } from '@openlance/aios-memory';
import type { MemoryWorkflowStep } from '@openlance/aios-memory';

import { MemoryConfiguration } from './configuration.js';
import type { MemoryEngineSettings } from './configuration.js';
import { MemoryError } from './errors.js';
import { MemoryEvents } from './events.js';
import { MemoryFactory } from './factory.js';
import { MemoryIndexer } from './indexer.js';
import { MemoryLifecycle } from './lifecycle.js';
import { MemoryLookup } from './lookup.js';
import { MemoryMetrics } from './metrics.js';
import { MemoryNormalizer } from './normalizer.js';
import { MemoryRegistry } from './registry.js';
import { MemoryResolver } from './resolver.js';
import type {
  MemoryDiagnostics,
  MemoryId,
  MemoryRecord,
  MemoryRecordInput,
  MemoryRequest,
  MemoryStatistics,
} from './types.js';
import { MemoryValidator } from './validator.js';

/** The options a {@link MemoryManager} is constructed from. */
export interface MemoryManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<MemoryEngineSettings>;
}

/**
 * The Memory Engine facade and DI entry. It composes the registry, factory, lifecycle, validator,
 * normalizer, indexer, lookup, resolver, metrics, events, and configuration into one operational
 * subsystem, and exposes the engine's operations: form a record (receive, classify, validate, retain),
 * recall retained context for a request, remove a record, and read statistics and diagnostics. It drives
 * the frozen `MEMORY_WORKFLOW_STEPS` order, consumes the frozen memory model, and executes nothing.
 */
export class MemoryManager {
  readonly #registry: MemoryRegistry;
  readonly #factory: MemoryFactory;
  readonly #lifecycle: MemoryLifecycle;
  readonly #validator: MemoryValidator;
  readonly #normalizer: MemoryNormalizer;
  readonly #indexer: MemoryIndexer;
  readonly #resolver: MemoryResolver;
  readonly #metrics: MemoryMetrics;
  readonly #events: MemoryEvents;
  readonly #configuration: MemoryConfiguration;

  constructor(options: MemoryManagerOptions) {
    this.#registry = new MemoryRegistry();
    this.#factory = new MemoryFactory();
    this.#lifecycle = new MemoryLifecycle();
    this.#validator = new MemoryValidator();
    this.#normalizer = new MemoryNormalizer();
    this.#indexer = new MemoryIndexer();
    this.#resolver = new MemoryResolver(
      new MemoryLookup(this.#registry, this.#indexer),
      this.#lifecycle,
    );
    this.#metrics = new MemoryMetrics();
    this.#events = new MemoryEvents(options.bus, options.clock);
    this.#configuration = new MemoryConfiguration(options.settings);
  }

  /** The frozen, ordered memory workflow steps. */
  steps(): readonly MemoryWorkflowStep[] {
    return MEMORY_WORKFLOW_STEPS;
  }

  /** Whether the frozen workflow steps are in constitutional order (consumes `workflowStepAtOrAfter`). */
  stepsInConstitutionalOrder(): boolean {
    return MEMORY_WORKFLOW_STEPS.every((step, index) => {
      const previous = MEMORY_WORKFLOW_STEPS[index - 1];
      return previous === undefined || workflowStepAtOrAfter(step, previous);
    });
  }

  /**
   * Form a retained record: receive, classify (validate structure and build), validate grounding, and
   * retain (register and index). Emits a `formed` or `failed` event, fail closed.
   */
  async form(input: MemoryRecordInput): Promise<Result<MemoryId, MemoryError>> {
    const normalized: MemoryRecordInput = {
      ...input,
      content: this.#normalizer.normalize(input.content),
    };
    const created = this.#factory.create(normalized);
    if (isErr(created)) {
      this.#metrics.recordFailure();
      await this.#events.failed(input.scope);
      return err(created.error);
    }
    const validation = this.#validator.validate(
      created.value,
      this.#configuration.settings.strictGrounding,
    );
    if (isErr(validation)) {
      this.#metrics.recordFailure();
      this.#metrics.recordValidationFailure();
      await this.#events.failed(input.scope);
      return err(validation.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      this.#metrics.recordFailure();
      await this.#events.failed(input.scope);
      return err(registered.error);
    }
    this.#indexer.index(created.value);
    this.#metrics.recordFormation();
    await this.#events.formed(created.value.id, created.value.type);
    return ok(created.value.id);
  }

  /** Recall the recallable retained records for a request; emits a `recalled` event, fail closed. */
  async recall(request: MemoryRequest): Promise<Result<readonly MemoryRecord[], MemoryError>> {
    if (request.scope.trim() === '') {
      this.#metrics.recordFailure();
      await this.#events.failed(request.scope);
      return err(new MemoryError('MEMORY.BLANK_SCOPE', 'A recall request has a blank scope.', {}));
    }
    const records = this.#resolver.resolve(request);
    this.#metrics.recordRecall();
    await this.#events.recalled(request.scope, records.length);
    return ok(records);
  }

  /** Remove a retained record from the registry and index; returns whether one was removed. */
  async remove(id: MemoryId): Promise<boolean> {
    const record = this.#registry.get(id);
    if (record === undefined) {
      return false;
    }
    this.#registry.unregister(id);
    this.#indexer.deindex(record);
    this.#metrics.recordRemoval();
    await this.#events.removed(id);
    return true;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): MemoryStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): MemoryDiagnostics {
    const diagnostics: MemoryDiagnostics = {
      recordCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
