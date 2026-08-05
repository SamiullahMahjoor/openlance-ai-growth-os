import { BaseError } from '@openlance/aios-errors';

/**
 * A reasoning-engine operational failure, distinguished by its stable `REASONING.*` code (a duplicate id, a blank id,
 * statement, or source, a blank task, an invalid strategy, an unknown premise, a blank part, a hidden assumption, or a
 * missing required governance verdict). It is an infrastructure error and owns no new error framework; it is a
 * `BaseError` subtype (ADR-0006) that carries the `Result` channel's failure, and is never thrown out of the public
 * API. An insufficient or ungoverned reasoning is not an error; it is a governed absence (an `inconclusive` or
 * `escalated` plan).
 */
export class ReasoningError extends BaseError {
  readonly category = 'infrastructure';
}
