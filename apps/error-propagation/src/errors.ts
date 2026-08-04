import { BaseError } from '@openlance/aios-errors';

/**
 * An error propagation planning failure: the declared propagation topology is not well-formed (it declares one or
 * more duplicate error codes, as determined by the frozen error-code registry). It is an infrastructure error (a
 * wiring/planning problem, not domain logic or input validation), distinguished by its stable
 * `ERROR_PROPAGATION.*` code, and it wraps the originating frozen registry error as its cause.
 *
 * The plan fails closed: on any invalid topology `buildErrorPropagationPlan` and `validateErrorPropagation` return
 * `ErrorPropagationError[]` and build no partial plan or topology. This error owns no new error framework; it is a
 * `BaseError` subtype (ADR-0006), carrying the `Result` channel's failure exactly like every other engineering
 * error.
 */
export class ErrorPropagationError extends BaseError {
  readonly category = 'infrastructure';
}
