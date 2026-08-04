import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ProviderError } from './errors.js';
import type { Provider, ProviderId } from './types.js';

/**
 * The provider registry: registration, discovery, and deterministic lookup of `Provider` instances by
 * id. It preserves registration order (Map insertion order), so discovery, selection, and routing are
 * deterministic. It owns storage and identity only; it selects, routes to, and invokes nothing.
 */
export class ProviderRegistry {
  readonly #byId = new Map<ProviderId, Provider>();

  /** Register a provider. Fails closed on a duplicate id (`PROVIDER.DUPLICATE_ID`). */
  register(provider: Provider): Result<void, ProviderError> {
    if (this.#byId.has(provider.id)) {
      return err(
        new ProviderError(
          'PROVIDER.DUPLICATE_ID',
          `A provider with id '${provider.id}' is already registered.`,
          { id: provider.id },
        ),
      );
    }
    this.#byId.set(provider.id, provider);
    return ok(undefined);
  }

  /** Whether a provider with the given id is registered. */
  has(id: ProviderId): boolean {
    return this.#byId.has(id);
  }

  /** The registered provider for an id, or `undefined`. */
  get(id: ProviderId): Provider | undefined {
    return this.#byId.get(id);
  }

  /** All registered providers, in registration order. */
  list(): readonly Provider[] {
    return [...this.#byId.values()];
  }

  /** Remove a provider by id; returns whether one was removed (retirement is orderly). */
  unregister(id: ProviderId): boolean {
    return this.#byId.delete(id);
  }
}
