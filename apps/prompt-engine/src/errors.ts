import { BaseError } from '@openlance/aios-errors';

/**
 * A prompt-engine operational failure, distinguished by its stable `PROMPT.*` code (a duplicate id, a
 * blank definition, an unknown or cyclic base, a missing variable, a validation failure, an unknown or
 * non-composable definition). It is an infrastructure error and owns no new error framework; it is a
 * `BaseError` subtype (ADR-0006) that carries the `Result` channel's failure exactly like every other
 * engineering error, and is never thrown out of the public API.
 */
export class PromptError extends BaseError {
  readonly category = 'infrastructure';
}
