import { BaseError } from '@openlance/aios-errors';

/**
 * A content-intelligence framing failure, distinguished by its stable `CONTENT.*` code (an unknown capability, a blank
 * objective, agent, or marketing reference, or an invalid brand-voice or knowledge reference). It is an infrastructure
 * error and owns no new error framework; it is a `BaseError` subtype (ADR-0006) carried on the `Result` channel, and is
 * never thrown out of the public API.
 */
export class ContentError extends BaseError {
  readonly category = 'infrastructure';
}
