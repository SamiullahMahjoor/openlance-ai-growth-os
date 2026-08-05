import { BaseError } from '@openlance/aios-errors';

/**
 * An evaluation-engine operational failure, distinguished by its stable `EVALUATION.*` code (a blank benchmark name or
 * entry, or a duplicate benchmark). It is an infrastructure error and owns no new error framework; it is a `BaseError`
 * subtype (ADR-0006) that carries the `Result` channel's failure. A withheld evaluation is not an engine error; it is a
 * reported assessment verdict.
 */
export class EvaluationError extends BaseError {
  readonly category = 'infrastructure';
}
