import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { MemoryError } from './errors.js';
import type { MemoryId, MemoryRecord } from './types.js';

/**
 * The memory registry: registration, discovery, and deterministic lookup of retained records by id. It
 * preserves registration order (Map insertion order), so discovery and recall are deterministic. It holds
 * retained runtime state, never business truth; a record is removed within the governing rules.
 */
export class MemoryRegistry {
  readonly #byId = new Map<MemoryId, MemoryRecord>();

  /** Register a retained record. Fails closed on a duplicate id (`MEMORY.DUPLICATE_ID`). */
  register(record: MemoryRecord): Result<void, MemoryError> {
    if (this.#byId.has(record.id)) {
      return err(
        new MemoryError(
          'MEMORY.DUPLICATE_ID',
          `A memory record with id '${record.id}' is already registered.`,
          { id: record.id },
        ),
      );
    }
    this.#byId.set(record.id, record);
    return ok(undefined);
  }

  /** Whether a record with the given id is registered. */
  has(id: MemoryId): boolean {
    return this.#byId.has(id);
  }

  /** The registered record for an id, or `undefined`. */
  get(id: MemoryId): MemoryRecord | undefined {
    return this.#byId.get(id);
  }

  /** All registered records, in registration order. */
  list(): readonly MemoryRecord[] {
    return [...this.#byId.values()];
  }

  /** Remove a record by id; returns whether one was removed. */
  unregister(id: MemoryId): boolean {
    return this.#byId.delete(id);
  }
}
