import { BaseError } from '@openlance/aios-errors';

/**
 * A governance-engine operational failure, distinguished by its stable `GOVERNANCE.*` code (a duplicate subject, a blank
 * subject, a blank granted capability, or an invalid autonomy level). It is an infrastructure error and owns no new
 * error framework; it is a `BaseError` subtype (ADR-0006) that carries the `Result` channel's failure, and is never
 * thrown out of the public API. An unauthorized request is not an error; it is a governed `DENY`, `REQUIRE_APPROVAL`, or
 * `ESCALATE` decision.
 */
export class GovernanceError extends BaseError {
  readonly category = 'infrastructure';
}
