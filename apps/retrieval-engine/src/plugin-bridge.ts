import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import type { RetrievalError } from './errors.js';
import { RetrievalFactory } from './factory.js';
import type { RetrievalRegistry } from './registry.js';
import type { RetrievalCandidateInput, RetrievalId } from './types.js';

/**
 * A retrieval candidate shipped as a plugin: the frozen `PluginManifest` identity plus the candidate it
 * contributes. The bridge adopts such plugins into the engine registry. It consumes the frozen
 * `PluginManifest` type and does not drive the plugin host lifecycle (discovery, loading, start, and stop
 * remain the plugin-loading / runtime concern).
 */
export interface RetrievalPlugin {
  readonly manifest: PluginManifest;
  readonly candidate: RetrievalCandidateInput;
}

/**
 * The retrieval plugin bridge: it adopts candidate-carrying plugins into the engine registry, so a
 * candidate may ship as a plugin. Each candidate is validated and frozen through the same
 * {@link RetrievalFactory} as direct registration, so a plugin cannot register a blank, owner-less, or
 * topic-less candidate. It recreates no plugin host, loader, lifecycle, or compatibility validator.
 */
export class RetrievalPluginBridge {
  readonly #registry: RetrievalRegistry;
  readonly #factory: RetrievalFactory;

  constructor(registry: RetrievalRegistry) {
    this.#registry = registry;
    this.#factory = new RetrievalFactory();
  }

  /** Adopt each plugin candidate into the registry; returns the adopted ids, fail closed. */
  adopt(plugins: readonly RetrievalPlugin[]): Result<readonly RetrievalId[], RetrievalError> {
    const adopted: RetrievalId[] = [];
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.candidate);
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
