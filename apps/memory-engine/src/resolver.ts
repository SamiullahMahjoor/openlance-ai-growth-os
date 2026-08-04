import { retentionAtLeast } from '@openlance/aios-memory';

import type { MemoryLifecycle } from './lifecycle.js';
import type { MemoryLookup } from './lookup.js';
import type { MemoryRecord, MemoryRequest } from './types.js';

/**
 * Memory recall resolution: the `recall` workflow step. Given a `MemoryRequest`, it deterministically
 * resolves the recallable retained records for a scope, narrowed by type, lifecycle recallability, and
 * `retentionAtLeast` (consuming the frozen retention ordering). It **makes retained context available**;
 * it retrieves no external knowledge and applies no retrieval technique. Knowledge always prevails over
 * the retained context it surfaces.
 */
export class MemoryResolver {
  readonly #lookup: MemoryLookup;
  readonly #lifecycle: MemoryLifecycle;

  constructor(lookup: MemoryLookup, lifecycle: MemoryLifecycle) {
    this.#lookup = lookup;
    this.#lifecycle = lifecycle;
  }

  /** The recallable retained records for a request, in registration order. */
  resolve(request: MemoryRequest): readonly MemoryRecord[] {
    return this.#lookup
      .byScope(request.scope)
      .filter(
        (record) =>
          (request.type === undefined || record.type === request.type) &&
          this.#lifecycle.isRecallable(record) &&
          (request.minimumRetention === undefined ||
            retentionAtLeast(record.retention, request.minimumRetention)),
      );
  }
}
