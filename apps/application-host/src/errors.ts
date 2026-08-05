import { BaseError } from '@openlance/aios-errors';

/**
 * An application-host bootstrap failure, distinguished by its stable `AIOS.*` code (a composition failure, or a provider
 * adapter registration failure). It is an infrastructure error and owns no new error framework; it is a `BaseError`
 * subtype (ADR-0006) that carries the `Result` channel's failure and is never thrown out of the public API.
 */
export class AiosError extends BaseError {
  readonly category = 'infrastructure';
}
