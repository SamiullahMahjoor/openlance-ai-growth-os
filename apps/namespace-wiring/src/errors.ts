import { BaseError } from '@openlance/aios-errors';

/**
 * A namespace-wiring failure: a namespace source is structurally invalid, or the declared namespace graph fails
 * structural validation. It is an infrastructure error (the failure is in the manifest's structure, not in
 * domain logic or input validation), distinguished by its stable `NAMESPACE_WIRING.*` code.
 *
 * The wiring layer fails closed: on any structural failure `validateNamespaces`/`wireNamespaces` return
 * `NamespaceWiringError[]` and produce no partial manifest. This error owns no new error framework; it is a
 * `BaseError` subtype (ADR-0006), carrying the `Result` channel's failure exactly like every other engineering
 * error.
 */
export class NamespaceWiringError extends BaseError {
  readonly category = 'infrastructure';
}
