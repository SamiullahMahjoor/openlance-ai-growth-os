import { BaseError } from '@openlance/aios-errors';

/**
 * A provider-engine operational failure, distinguished by its stable `PROVIDER.*` code (a duplicate
 * id, a blank descriptor, a missing or mismatched governance clearance, no eligible provider, a
 * cancellation, a passed deadline, or an exhausted failover). It is an infrastructure error and owns
 * no new error framework; it is a `BaseError` subtype (ADR-0006) that carries the `Result` channel's
 * failure exactly like every other engineering error, and is never thrown out of the public API.
 */
export class ProviderError extends BaseError {
  readonly category = 'infrastructure';
}
