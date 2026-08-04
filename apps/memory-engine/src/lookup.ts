import type { MemoryType } from '@openlance/aios-memory';

import type { MemoryIndexer } from './indexer.js';
import type { MemoryRegistry } from './registry.js';
import type { MemoryId, MemoryRecord, MemoryScope } from './types.js';

/**
 * Memory lookup: deterministic retrieval of retained records by identity, scope, or type, over the
 * engine's own registry and index. It is **not** retrieval of external knowledge: it returns retained
 * records in registration order, keyed structurally, with no retrieval technique.
 */
export class MemoryLookup {
  readonly #registry: MemoryRegistry;
  readonly #indexer: MemoryIndexer;

  constructor(registry: MemoryRegistry, indexer: MemoryIndexer) {
    this.#registry = registry;
    this.#indexer = indexer;
  }

  /** The retained record for an id, or `undefined`. */
  byId(id: MemoryId): MemoryRecord | undefined {
    return this.#registry.get(id);
  }

  /** The retained records for a scope, in registration order. */
  byScope(scope: MemoryScope): readonly MemoryRecord[] {
    return this.#resolve(this.#indexer.idsForScope(scope));
  }

  /** The retained records for a type, in registration order. */
  byType(type: MemoryType): readonly MemoryRecord[] {
    return this.#resolve(this.#indexer.idsForType(type));
  }

  #resolve(ids: readonly MemoryId[]): readonly MemoryRecord[] {
    const records: MemoryRecord[] = [];
    for (const id of ids) {
      const record = this.#registry.get(id);
      if (record !== undefined) {
        records.push(record);
      }
    }
    return records;
  }
}
