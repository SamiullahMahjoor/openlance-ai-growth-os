import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { ReasoningError } from './errors.js';
import { ReasoningFactory } from './factory.js';
import type { ReasoningRegistry } from './registry.js';
import type { Premise, PremiseInput, ReasoningId } from './types.js';

/**
 * A premise shipped as a plugin: the frozen `PluginManifest` identity plus the premise it contributes. The bridge
 * adopts such plugins into the engine registry. It consumes the frozen `PluginManifest` type and does not drive the
 * plugin host lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface ReasoningPlugin {
  readonly manifest: PluginManifest;
  readonly premise: PremiseInput;
}

/**
 * The reasoning plugin bridge: it adopts premise-carrying plugins into the engine registry, so a premise may ship as a
 * plugin. Each premise is validated and frozen through the same {@link ReasoningFactory} as direct registration, and
 * adoption is atomic: every premise is validated and checked for a conflicting id (against the registry and within the
 * batch) before any is registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin host,
 * loader, lifecycle, or compatibility validator.
 */
export class ReasoningPluginBridge {
  readonly #registry: ReasoningRegistry;
  readonly #factory: ReasoningFactory;

  constructor(registry: ReasoningRegistry) {
    this.#registry = registry;
    this.#factory = new ReasoningFactory();
  }

  /** Adopt the plugin premises into the registry, atomically; returns the adopted ids, fail closed. */
  adopt(plugins: readonly ReasoningPlugin[]): Result<readonly ReasoningId[], ReasoningError> {
    const prepared: Premise[] = [];
    const seen = new Set<ReasoningId>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.premise);
      if (isErr(built)) {
        return err(built.error);
      }
      const id = built.value.id;
      if (this.#registry.has(id) || seen.has(id)) {
        return err(
          new ReasoningError(
            'REASONING.DUPLICATE_ID',
            `A premise with id '${id}' is already registered.`,
            { id },
          ),
        );
      }
      seen.add(id);
      prepared.push(built.value);
    }
    const adopted: ReasoningId[] = [];
    for (const premise of prepared) {
      this.#registry.register(premise);
      adopted.push(premise.id);
    }
    return ok(Object.freeze(adopted));
  }
}
