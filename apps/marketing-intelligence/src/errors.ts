import { BaseError } from '@openlance/aios-errors';

/**
 * A marketing-intelligence framing failure, distinguished by its stable `MARKETING.*` code (an unknown capability, a
 * blank objective or agent, or an ungrounded request). It is an infrastructure error and owns no new error framework; it
 * is a `BaseError` subtype (ADR-0006) carried on the `Result` channel, and is never thrown out of the public API.
 */
export class MarketingError extends BaseError {
  readonly category = 'infrastructure';
}
