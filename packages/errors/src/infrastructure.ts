import { BaseError } from './base.js';

/**
 * An infrastructure error: a dependency the system relies on failed (for example a
 * store, network, or external process). It is the failure kind that generally
 * represents an unrecoverable fault rather than a rule violation.
 */
export class InfrastructureError extends BaseError {
  readonly category = 'infrastructure';
}
