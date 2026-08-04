import { BaseError } from '@openlance/aios-errors';

/**
 * A composition failure: a substrate service failed to build, or the composed dependency graph failed
 * validation. It is an infrastructure error (the failure is in wiring, not in domain logic or input
 * validation), distinguished by its stable `COMPOSITION.*` code, and it wraps the originating error
 * (a `ConfigError` or a `di` `DependencyError`) as its `cause`.
 *
 * The composition root fails closed: on any composition failure `bootstrap` returns `CompositionError[]`
 * and builds no partial application. This error owns no new error framework; it is a `BaseError` subtype
 * (ADR-0006), carrying the `Result` channel's failure exactly like every other engineering error.
 */
export class CompositionError extends BaseError {
  readonly category = 'infrastructure';
}
