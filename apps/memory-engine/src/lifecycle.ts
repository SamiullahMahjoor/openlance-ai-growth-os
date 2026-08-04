import { MEMORY_LIFECYCLE_PHASES, lifecyclePhaseAtOrAfter } from '@openlance/aios-memory';
import type { MemoryLifecyclePhase } from '@openlance/aios-memory';

import type { MemoryRecord } from './types.js';

/**
 * Memory lifecycle evaluation over the frozen memory-lifecycle model. It consumes the frozen ordered
 * `MEMORY_LIFECYCLE_PHASES` and the pure predicate `lifecyclePhaseAtOrAfter`; it defines no phase and
 * re-owns no ordering (ai/memory/memory-lifecycle.md, ADR-0020). A record is recallable while it is
 * retained and not yet removed (Formation precedes Retention precedes Removal).
 */
export class MemoryLifecycle {
  /** The frozen, ordered memory lifecycle phases. */
  phases(): readonly MemoryLifecyclePhase[] {
    return MEMORY_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: MemoryLifecyclePhase, b: MemoryLifecyclePhase): boolean {
    return lifecyclePhaseAtOrAfter(a, b);
  }

  /** Whether a record may be recalled: it has reached Retention and has not been removed. */
  isRecallable(record: MemoryRecord): boolean {
    return (
      lifecyclePhaseAtOrAfter(record.phase, 'retention') &&
      !lifecyclePhaseAtOrAfter(record.phase, 'removal')
    );
  }
}
