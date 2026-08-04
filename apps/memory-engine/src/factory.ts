import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import {
  MEMORY_LIFECYCLE_PHASES,
  MEMORY_RETENTION_CLASSES,
  MEMORY_TYPES,
} from '@openlance/aios-memory';

import { MemoryError } from './errors.js';
import type { MemoryRecord, MemoryRecordInput } from './types.js';

/**
 * The memory record factory: it validates a `MemoryRecordInput` (the `receive` and `classify` steps) and
 * builds an immutable `MemoryRecord`, filling the default lifecycle phase (`retention`). It classifies by
 * the frozen `MEMORY_TYPES` and `MEMORY_RETENTION_CLASSES` and fails closed on a blank id, an invalid
 * type, an invalid retention class, or a blank scope. It builds retained state only; it stores and
 * executes nothing.
 */
export class MemoryFactory {
  /** Validate an input and build a frozen `MemoryRecord`, failing closed on an invalid input. */
  create(input: MemoryRecordInput): Result<MemoryRecord, MemoryError> {
    if (input.id.trim() === '') {
      return err(new MemoryError('MEMORY.BLANK_ID', 'A memory record has a blank id.', {}));
    }
    if (!MEMORY_TYPES.includes(input.type)) {
      return err(
        new MemoryError(
          'MEMORY.INVALID_TYPE',
          `Memory record '${input.id}' has an unknown type '${input.type}'.`,
          { id: input.id, type: input.type },
        ),
      );
    }
    if (!MEMORY_RETENTION_CLASSES.includes(input.retention)) {
      return err(
        new MemoryError(
          'MEMORY.INVALID_RETENTION',
          `Memory record '${input.id}' has an unknown retention class '${input.retention}'.`,
          { id: input.id, retention: input.retention },
        ),
      );
    }
    if (input.scope.trim() === '') {
      return err(
        new MemoryError('MEMORY.BLANK_SCOPE', `Memory record '${input.id}' has a blank scope.`, {
          id: input.id,
        }),
      );
    }
    if (input.phase !== undefined && !MEMORY_LIFECYCLE_PHASES.includes(input.phase)) {
      return err(
        new MemoryError(
          'MEMORY.INVALID_PHASE',
          `Memory record '${input.id}' has an unknown lifecycle phase '${input.phase}'.`,
          { id: input.id, phase: input.phase },
        ),
      );
    }
    const record: MemoryRecord = {
      id: input.id,
      type: input.type,
      retention: input.retention,
      scope: input.scope,
      content: input.content,
      phase: input.phase ?? 'retention',
    };
    return ok(Object.freeze(record));
  }
}
