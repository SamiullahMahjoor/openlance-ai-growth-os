import { err, isErr, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { ProviderCapabilities } from './capabilities.js';
import { ProviderConfiguration } from './configuration.js';
import type { ProviderEngineSettings } from './configuration.js';
import { ProviderError } from './errors.js';
import { ProviderEvents } from './events.js';
import { ProviderExecutor } from './executor.js';
import { ProviderFactory } from './factory.js';
import type { GovernanceClearance } from './governance-clearance.js';
import { ProviderHealthMonitor } from './health.js';
import { ProviderLifecycle } from './lifecycle.js';
import { ProviderMetrics } from './metrics.js';
import { ProviderResponseNormalizer } from './normalizer.js';
import { ProviderRegistry } from './registry.js';
import { ProviderRouter } from './routing.js';
import { ProviderSelector } from './selection.js';
import type {
  HealthStatus,
  Provider,
  ProviderDescriptor,
  ProviderDiagnostics,
  ProviderId,
  ProviderNeed,
  ProviderRequest,
  ProviderResponse,
  ProviderStatistics,
} from './types.js';

/** The options a {@link ProviderManager} is constructed from. */
export interface ProviderManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<ProviderEngineSettings>;
}

/**
 * The Provider Engine facade and DI entry. It composes the registry, factory, capabilities, lifecycle,
 * health, router, selector, executor, normalizer, metrics, events, and configuration into one
 * operational subsystem, and exposes the engine's operations: register a provider, check its health,
 * evaluate candidates, select and route for a need, invoke behind a governance clearance, and read
 * statistics and diagnostics. It consumes the frozen models and holds no vendor knowledge.
 */
export class ProviderManager {
  readonly #registry: ProviderRegistry;
  readonly #factory: ProviderFactory;
  readonly #capabilities: ProviderCapabilities;
  readonly #lifecycle: ProviderLifecycle;
  readonly #health: ProviderHealthMonitor;
  readonly #router: ProviderRouter;
  readonly #selector: ProviderSelector;
  readonly #normalizer: ProviderResponseNormalizer;
  readonly #metrics: ProviderMetrics;
  readonly #events: ProviderEvents;
  readonly #configuration: ProviderConfiguration;
  readonly #executor: ProviderExecutor;

  constructor(options: ProviderManagerOptions) {
    this.#registry = new ProviderRegistry();
    this.#factory = new ProviderFactory();
    this.#capabilities = new ProviderCapabilities();
    this.#lifecycle = new ProviderLifecycle();
    this.#health = new ProviderHealthMonitor();
    this.#router = new ProviderRouter(this.#lifecycle, this.#health);
    this.#selector = new ProviderSelector(this.#router);
    this.#normalizer = new ProviderResponseNormalizer();
    this.#metrics = new ProviderMetrics();
    this.#events = new ProviderEvents(options.bus, options.clock);
    this.#configuration = new ProviderConfiguration(options.settings);
    this.#executor = new ProviderExecutor(
      this.#router,
      this.#normalizer,
      this.#metrics,
      options.clock,
    );
  }

  /** Register a provider from a descriptor; emits a `registered` event, fail closed. */
  async register(descriptor: ProviderDescriptor): Promise<Result<ProviderId, ProviderError>> {
    const created = this.#factory.create(descriptor);
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

  /**
   * Retire a provider: remove it from the registry and forget its recorded health, so a later
   * provider registered under the same id inherits no stale status. Returns whether one was removed
   * (retirement is orderly; ai/providers/provider-lifecycle.md).
   */
  unregister(id: ProviderId): boolean {
    this.#health.forget(id);
    return this.#registry.unregister(id);
  }

  /** Probe and record a provider's health; fails closed for an unknown provider. */
  async checkHealth(id: ProviderId): Promise<Result<HealthStatus, ProviderError>> {
    const provider = this.#registry.get(id);
    if (provider === undefined) {
      return err(
        new ProviderError('PROVIDER.UNKNOWN', `No provider is registered with id '${id}'.`, { id }),
      );
    }
    return ok(await this.#health.check(provider));
  }

  /** The candidate providers whose declared capabilities satisfy a need. */
  candidates(need: ProviderNeed): readonly Provider[] {
    return this.#capabilities.matching(this.#registry.list(), need);
  }

  /** The selected provider for a need, or `undefined`. */
  select(need: ProviderNeed): Provider | undefined {
    return this.#selector.select(need, this.#registry.list());
  }

  /** The eligible providers for a need, in fallback order. */
  route(need: ProviderNeed): readonly Provider[] {
    return this.#router.route(need, this.#registry.list());
  }

  /** Invoke a provider for a governed request; emits an `invoked` or `failed` event, fail closed. */
  async invoke(
    clearance: GovernanceClearance,
    need: ProviderNeed,
    request: ProviderRequest,
  ): Promise<Result<ProviderResponse, ProviderError>> {
    const result = await this.#executor.execute(
      clearance,
      need,
      request,
      this.#registry.list(),
      this.#configuration.executionOptions(),
    );
    if (isOk(result)) {
      await this.#events.invoked(result.value.providerId, result.value.capability);
    } else {
      await this.#events.failed(request.capability);
    }
    return result;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): ProviderStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): ProviderDiagnostics {
    const diagnostics: ProviderDiagnostics = {
      providerCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
