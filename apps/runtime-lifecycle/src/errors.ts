import { BaseError } from '@openlance/aios-errors';

/**
 * A runtime-lifecycle planning failure: a proposed lifecycle path contains a transition the frozen execution
 * state model does not permit. It is an infrastructure error (a wiring/planning problem, not domain logic or
 * input validation), distinguished by its stable `RUNTIME_LIFECYCLE.*` code.
 *
 * The lifecycle planning fails closed: on any forbidden transition `buildRuntimeLifecyclePlan` and
 * `validateLifecyclePath` return `RuntimeLifecycleError[]` and build no partial plan or path. This error owns no
 * new error framework; it is a `BaseError` subtype (ADR-0006), carrying the `Result` channel's failure exactly
 * like every other engineering error.
 */
export class RuntimeLifecycleError extends BaseError {
  readonly category = 'infrastructure';
}
