import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import type { ProviderError } from './errors.js';
import { ProviderFactory } from './factory.js';
import type { ProviderRegistry } from './registry.js';
import type { Provider, ProviderId } from './types.js';

/**
 * A provider adapter shipped as a plugin: the frozen `PluginManifest` identity plus the `Provider` it
 * contributes. The bridge adopts such plugins into the engine registry. It consumes the frozen
 * `PluginManifest` type and does not drive the plugin host lifecycle (discovery, loading, start, and
 * stop remain the plugin-loading / runtime concern).
 */
export interface ProviderPlugin {
  readonly manifest: PluginManifest;
  readonly provider: Provider;
}

/**
 * The provider plugin bridge: it adopts provider-carrying plugins into the engine registry, so a
 * provider adapter may ship as a plugin. It registers each plugin's provider through the registry,
 * failing closed on the first conflict. It recreates no plugin host, loader, lifecycle, or
 * compatibility validator (all owned by @openlance/aios-plugins).
 */
export class ProviderPluginBridge {
  readonly #registry: ProviderRegistry;
  readonly #factory: ProviderFactory;

  constructor(registry: ProviderRegistry) {
    this.#registry = registry;
    this.#factory = new ProviderFactory();
  }

  /**
   * Adopt each provider-plugin's provider into the registry; returns the adopted ids, fail closed.
   * Each provider is validated and frozen through the same {@link ProviderFactory} as direct
   * registration, so a plugin cannot register a blank, capability-less, or mutable provider.
   */
  adopt(plugins: readonly ProviderPlugin[]): Result<readonly ProviderId[], ProviderError> {
    const adopted: ProviderId[] = [];
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.provider);
      if (isErr(built)) {
        return err(built.error);
      }
      const registered = this.#registry.register(built.value);
      if (isErr(registered)) {
        return err(registered.error);
      }
      adopted.push(built.value.id);
    }
    return ok(Object.freeze(adopted));
  }
}
