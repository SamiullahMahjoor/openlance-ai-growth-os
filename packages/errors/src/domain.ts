import { BaseError } from './base.js';

/**
 * A domain error: a business or domain rule or expectation was violated. It is the
 * failure kind an operation returns (via `Result`) when the request was understood
 * but is not permitted by the rules that govern it.
 */
export class DomainError extends BaseError {
  readonly category = 'domain';
}
