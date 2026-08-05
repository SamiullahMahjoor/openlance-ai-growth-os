import { BaseError } from '@openlance/aios-errors';

/**
 * A retrieval-engine operational failure, distinguished by its stable `RETRIEVAL.*` code (a duplicate id,
 * a blank id or owner, an invalid authority, no topics, no eligible candidate, an unknown dependency, a
 * dependency cycle, a missing required permission, or a failed validation dimension). It is an
 * infrastructure error and owns no new error framework; it is a `BaseError` subtype (ADR-0006) that
 * carries the `Result` channel's failure, and is never thrown out of the public API.
 */
export class RetrievalError extends BaseError {
  readonly category = 'infrastructure';
}
