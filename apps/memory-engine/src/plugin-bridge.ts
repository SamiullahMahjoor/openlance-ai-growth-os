import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import type { MemoryError } from './errors.js';
import { MemoryFactory } from './factory.js';
import type { MemoryIndexer } from './indexer.js';
import type { MemoryRegistry } from './registry.js';
import type { MemoryId, MemoryRecordInput } from './types.js';

/**
 * A memory record shipped as a plugin: the frozen `PluginManifest` identity plus the record it
 * contributes. The bridge adopts such plugins into the engine registry and index. It consumes the frozen
 * `PluginManifest` type and does not drive the plugin host lifecycle (discovery, loading, start, and stop
 * remain the plugin-loading / runtime concern).
 */
export interface MemoryPlugin {
  readonly manifest: PluginManifest;
  readonly record: MemoryRecordInput;
}

/**
 * The memory plugin bridge: it adopts record-carrying plugins into the engine registry and index, so a
 * retained record may ship as a plugin. Each record is validated and frozen through the same
 * {@link MemoryFactory} as direct formation, so a plugin cannot register a blank, mistyped, or
 * scope-less record. It recreates no plugin host, loader, lifecycle, or compatibility validator.
 */
export class MemoryPluginBridge {
  readonly #registry: MemoryRegistry;
  readonly #indexer: MemoryIndexer;
  readonly #factory: MemoryFactory;

  constructor(registry: MemoryRegistry, indexer: MemoryIndexer) {
    this.#registry = registry;
    this.#indexer = indexer;
    this.#factory = new MemoryFactory();
  }

  /** Adopt each plugin record into the registry and index; returns the adopted ids, fail closed. */
  adopt(plugins: readonly MemoryPlugin[]): Result<readonly MemoryId[], MemoryError> {
    const adopted: MemoryId[] = [];
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.record);
      if (isErr(built)) {
        return err(built.error);
      }
      const registered = this.#registry.register(built.value);
      if (isErr(registered)) {
        return err(registered.error);
      }
      this.#indexer.index(built.value);
      adopted.push(built.value.id);
    }
    return ok(Object.freeze(adopted));
  }
}
