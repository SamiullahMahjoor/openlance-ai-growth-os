import { BaseError } from '@openlance/aios-errors';

/**
 * A runtime-execution-engine operational failure, distinguished by its stable `EXECUTION.*` code (an unpermitted state
 * transition, a coordination cycle, a blank policy name or entry, or a duplicate policy). It is an infrastructure error
 * and owns no new error framework; it is a `BaseError` subtype (ADR-0006) that carries the `Result` channel's failure. A
 * plan that cannot execute is not an internal error; it is a governed `failed` execution record.
 */
export class ExecutionError extends BaseError {
  readonly category = 'infrastructure';
}
