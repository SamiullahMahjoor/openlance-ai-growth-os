import { BaseError } from '@openlance/aios-errors';

/**
 * An event flow planning failure: the declared event flow topology is not well-formed (it declares a blank event
 * type or a duplicate event type). It is an infrastructure error (a wiring/planning problem, not domain logic or
 * input validation), distinguished by its stable `EVENT_FLOW.*` code.
 *
 * The plan fails closed: on any invalid topology `buildEventFlowPlan` and `validateEventFlow` return
 * `EventFlowError[]` and build no partial plan or realized events. This error owns no new error framework; it is a
 * `BaseError` subtype (ADR-0006), carrying the `Result` channel's failure exactly like every other engineering
 * error.
 */
export class EventFlowError extends BaseError {
  readonly category = 'infrastructure';
}
