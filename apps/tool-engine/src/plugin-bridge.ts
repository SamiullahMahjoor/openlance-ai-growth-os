import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { ToolError } from './errors.js';
import { ToolFactory } from './factory.js';
import type { ToolRegistry } from './registry.js';
import type { ToolDefinition, ToolDefinitionInput, ToolId } from './types.js';

/**
 * A tool shipped as a plugin: the frozen `PluginManifest` identity plus the tool it contributes. The bridge adopts such
 * plugins into the engine registry. It consumes the frozen `PluginManifest` type and does not drive the plugin host
 * lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface ToolPlugin {
  readonly manifest: PluginManifest;
  readonly definition: ToolDefinitionInput;
}

/**
 * The tool plugin bridge: it adopts tool-carrying plugins into the engine registry, so a tool may ship as a plugin.
 * Each tool is validated and frozen through the same {@link ToolFactory} as direct registration, so a plugin cannot
 * register a blank, capability-less, or malformed tool. It recreates no plugin host, loader, lifecycle, or
 * compatibility validator.
 */
export class ToolPluginBridge {
  readonly #registry: ToolRegistry;
  readonly #factory: ToolFactory;

  constructor(registry: ToolRegistry) {
    this.#registry = registry;
    this.#factory = new ToolFactory();
  }

  /**
   * Adopt the plugin tools into the registry, atomically: every tool is validated and checked for a conflicting id
   * (against the registry and within the batch) before any is registered, so a mid-batch failure leaves the registry
   * unchanged. Returns the adopted ids, fail closed.
   */
  adopt(plugins: readonly ToolPlugin[]): Result<readonly ToolId[], ToolError> {
    const prepared: ToolDefinition[] = [];
    const seen = new Set<ToolId>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.definition);
      if (isErr(built)) {
        return err(built.error);
      }
      const id = built.value.id;
      if (this.#registry.has(id) || seen.has(id)) {
        return err(
          new ToolError('TOOL.DUPLICATE_ID', `A tool with id '${id}' is already registered.`, {
            id,
          }),
        );
      }
      seen.add(id);
      prepared.push(built.value);
    }
    const adopted: ToolId[] = [];
    for (const tool of prepared) {
      this.#registry.register(tool);
      adopted.push(tool.id);
    }
    return ok(Object.freeze(adopted));
  }
}
