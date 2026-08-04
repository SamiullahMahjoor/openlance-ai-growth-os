import { BaseError } from '@openlance/aios-errors';

/**
 * An execution-pipeline planning failure: a proposed workflow order contains a step that precedes an earlier one
 * in the frozen constitutional execution order. It is an infrastructure error (a wiring/planning problem, not
 * domain logic or input validation), distinguished by its stable `EXECUTION_PIPELINE.*` code.
 *
 * The pipeline planning fails closed: on any out-of-order step `buildExecutionPipelinePlan` and
 * `validateWorkflowOrder` return `ExecutionPipelineError[]` and build no partial plan or order. This error owns no
 * new error framework; it is a `BaseError` subtype (ADR-0006), carrying the `Result` channel's failure exactly
 * like every other engineering error.
 */
export class ExecutionPipelineError extends BaseError {
  readonly category = 'infrastructure';
}
