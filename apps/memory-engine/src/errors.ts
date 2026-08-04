import { BaseError } from '@openlance/aios-errors';

/**
 * A memory-engine operational failure, distinguished by its stable `MEMORY.*` code (a duplicate id, a
 * blank id or scope, an invalid type or retention class, an ungrounded record, or a blank recall scope).
 * It is an infrastructure error and owns no new error framework; it is a `BaseError` subtype (ADR-0006)
 * that carries the `Result` channel's failure exactly like every other engineering error, and is never
 * thrown out of the public API.
 */
export class MemoryError extends BaseError {
  readonly category = 'infrastructure';
}
