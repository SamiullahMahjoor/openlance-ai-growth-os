import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import type { PromptError } from './errors.js';
import { PromptFactory } from './factory.js';
import type { PromptRegistry } from './registry.js';
import type { PromptDefinitionInput, PromptId } from './types.js';

/**
 * A prompt definition shipped as a plugin: the frozen `PluginManifest` identity plus the definition it
 * contributes. The bridge adopts such plugins into the engine registry. It consumes the frozen
 * `PluginManifest` type and does not drive the plugin host lifecycle (discovery, loading, start, and stop
 * remain the plugin-loading / runtime concern).
 */
export interface PromptPlugin {
  readonly manifest: PluginManifest;
  readonly definition: PromptDefinitionInput;
}

/**
 * The prompt plugin bridge: it adopts definition-carrying plugins into the engine registry, so a prompt
 * definition may ship as a plugin. Each definition is validated and frozen through the same
 * {@link PromptFactory} as direct registration, so a plugin cannot register a blank, capability-less, or
 * part-less definition. It recreates no plugin host, loader, lifecycle, or compatibility validator.
 */
export class PromptPluginBridge {
  readonly #registry: PromptRegistry;
  readonly #factory: PromptFactory;

  constructor(registry: PromptRegistry) {
    this.#registry = registry;
    this.#factory = new PromptFactory();
  }

  /** Adopt each plugin definition into the registry; returns the adopted ids, fail closed. */
  adopt(plugins: readonly PromptPlugin[]): Result<readonly PromptId[], PromptError> {
    const adopted: PromptId[] = [];
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.definition);
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
