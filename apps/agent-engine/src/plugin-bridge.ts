import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { AgentError } from './errors.js';
import { AgentFactory } from './factory.js';
import type { AgentRegistry } from './registry.js';
import type { AgentDefinition, AgentDefinitionInput, AgentId } from './types.js';

/**
 * An agent shipped as a plugin: the frozen `PluginManifest` identity plus the agent it contributes. The bridge adopts
 * such plugins into the engine registry. It consumes the frozen `PluginManifest` type and does not drive the plugin host
 * lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface AgentPlugin {
  readonly manifest: PluginManifest;
  readonly definition: AgentDefinitionInput;
}

/**
 * The agent plugin bridge: it adopts agent-carrying plugins into the engine registry, so an agent may ship as a plugin.
 * Each agent is validated and frozen through the same {@link AgentFactory} as direct registration, and adoption is
 * atomic: every agent is validated and checked for a conflicting id (against the registry and within the batch) before
 * any is registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin host, loader,
 * lifecycle, or compatibility validator.
 */
export class AgentPluginBridge {
  readonly #registry: AgentRegistry;
  readonly #factory: AgentFactory;

  constructor(registry: AgentRegistry) {
    this.#registry = registry;
    this.#factory = new AgentFactory();
  }

  /** Adopt the plugin agents into the registry, atomically; returns the adopted ids, fail closed. */
  adopt(plugins: readonly AgentPlugin[]): Result<readonly AgentId[], AgentError> {
    const prepared: AgentDefinition[] = [];
    const seen = new Set<AgentId>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.definition);
      if (isErr(built)) {
        return err(built.error);
      }
      const id = built.value.id;
      if (this.#registry.has(id) || seen.has(id)) {
        return err(
          new AgentError('AGENT.DUPLICATE_ID', `An agent with id '${id}' is already registered.`, {
            id,
          }),
        );
      }
      seen.add(id);
      prepared.push(built.value);
    }
    const adopted: AgentId[] = [];
    for (const agent of prepared) {
      this.#registry.register(agent);
      adopted.push(agent.id);
    }
    return ok(Object.freeze(adopted));
  }
}
