import { BaseError } from '@openlance/aios-errors';

/**
 * A campaign-intelligence framing failure, distinguished by its stable `CAMPAIGN.*` code (an unknown capability, a blank
 * objective or agent, a missing marketing, content, SEO, social, or analytics reference, or an invalid knowledge
 * reference). It is an infrastructure error and owns no new error framework; it is a `BaseError` subtype (ADR-0006)
 * carried on the `Result` channel, and is never thrown out of the public API.
 */
export class CampaignError extends BaseError {
  readonly category = 'infrastructure';
}
