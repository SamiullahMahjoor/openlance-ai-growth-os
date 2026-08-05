import { BaseError } from '@openlance/aios-errors';

/**
 * An operations-engine operational failure, distinguished by its stable `OPERATIONS.*` code (an illegal incident or
 * maintenance transition, a blank policy name or entry, or a duplicate policy). It is an infrastructure error and owns no
 * new error framework; it is a `BaseError` subtype (ADR-0006) that carries the `Result` channel's failure. An unhealthy
 * or incident-bearing layer is not an engine error; it is a reported operational state.
 */
export class OperationsError extends BaseError {
  readonly category = 'infrastructure';
}
