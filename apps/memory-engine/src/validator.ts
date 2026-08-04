import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { MemoryError } from './errors.js';
import type { MemoryRecord } from './types.js';

/**
 * Memory validation: the `validate` workflow step. It validates that a record is grounded (its content is
 * present, never invented as empty) before it is retained ("validation-precedes-retention"), gated by the
 * `strictGrounding` setting, and fails closed. It applies, never restates, governance; it stores, reasons,
 * and retrieves nothing.
 */
export class MemoryValidator {
  /** Validate grounding before retention, failing closed when strict and the content is empty. */
  validate(record: MemoryRecord, strictGrounding: boolean): Result<void, MemoryError> {
    if (strictGrounding && record.content.trim() === '') {
      return err(
        new MemoryError(
          'MEMORY.NOT_GROUNDED',
          `Memory record '${record.id}' is not grounded: its content is empty.`,
          { id: record.id },
        ),
      );
    }
    return ok(undefined);
  }
}
