import type { MemoryType } from '@openlance/aios-memory';

import type { MemoryId, MemoryRecord, MemoryScope } from './types.js';

/**
 * The memory indexer: a deterministic, structural index over retained records, keyed by scope and by
 * type, so recall can find retained context without scanning. It is **not** retrieval: it holds only
 * structural keys (scope, type) over the engine's own retained records, in insertion order, and applies
 * no retrieval technique, and loads no external knowledge.
 */
export class MemoryIndexer {
  readonly #byScope = new Map<MemoryScope, MemoryId[]>();
  readonly #byType = new Map<MemoryType, MemoryId[]>();

  /** Add a record to the scope and type indexes. */
  index(record: MemoryRecord): void {
    this.#add(this.#byScope, record.scope, record.id);
    this.#add(this.#byType, record.type, record.id);
  }

  /** Remove a record from the scope and type indexes. */
  deindex(record: MemoryRecord): void {
    this.#remove(this.#byScope, record.scope, record.id);
    this.#remove(this.#byType, record.type, record.id);
  }

  /** The record ids indexed under a scope, in insertion order (a defensive copy). */
  idsForScope(scope: MemoryScope): readonly MemoryId[] {
    return [...(this.#byScope.get(scope) ?? [])];
  }

  /** The record ids indexed under a type, in insertion order (a defensive copy). */
  idsForType(type: MemoryType): readonly MemoryId[] {
    return [...(this.#byType.get(type) ?? [])];
  }

  #add<K>(map: Map<K, MemoryId[]>, key: K, id: MemoryId): void {
    const ids = map.get(key) ?? [];
    if (!ids.includes(id)) {
      ids.push(id);
    }
    map.set(key, ids);
  }

  #remove<K>(map: Map<K, MemoryId[]>, key: K, id: MemoryId): void {
    const ids = map.get(key);
    if (ids !== undefined) {
      map.set(
        key,
        ids.filter((existing) => existing !== id),
      );
    }
  }
}
