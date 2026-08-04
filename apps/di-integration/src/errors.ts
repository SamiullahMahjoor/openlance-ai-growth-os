import { BaseError } from '@openlance/aios-errors';

/**
 * A dependency-injection integration failure: the composed dependency graph failed validation when the namespace
 * wiring was integrated with the composition root. It is an infrastructure error (the failure is in wiring, not
 * in domain logic or input validation), distinguished by its stable `DI_INTEGRATION.*` code, and it wraps the
 * originating `di` `DependencyError` as its cause.
 *
 * The integration fails closed: on any validation failure `integrate` returns `DiIntegrationError[]` and builds no
 * partial result. This error owns no new error framework; it is a `BaseError` subtype (ADR-0006), carrying the
 * `Result` channel's failure exactly like every other engineering error.
 */
export class DiIntegrationError extends BaseError {
  readonly category = 'infrastructure';
}
