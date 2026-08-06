import { BaseError } from '@openlance/aios-errors';

/**
 * A growth-workflow framing failure, distinguished by its stable `WORKFLOW.*` code (an unknown workflow type, a blank
 * objective or agent, a missing planner reference, or an invalid knowledge reference). It is an infrastructure error and
 * owns no new error framework; it is a `BaseError` subtype (ADR-0006) carried on the `Result` channel, and is never
 * thrown out of the public API.
 */
export class GrowthWorkflowError extends BaseError {
  readonly category = 'infrastructure';
}
