import type { IntegratedApplication } from '@openlance/aios-di-integration';
import { err, map, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { EXECUTION_LIFECYCLE_PHASES, transitionAllowed } from '@openlance/aios-runtime';
import type { ExecutionLifecyclePhase, ExecutionState } from '@openlance/aios-runtime';

import { RuntimeLifecycleError } from './errors.js';

/**
 * The immutable runtime lifecycle plan: a reference view onto the frozen runtime lifecycle model, bound to the
 * DI-integrated application, plus the model's validated admission path. Descriptive planning metadata only: it
 * holds no runtime state, has no current state, drives no transition, and carries nothing out. Stage 5 (the
 * execution pipeline) consumes it.
 */
export interface RuntimeLifecyclePlan {
  readonly integrated: IntegratedApplication;
  readonly initialState: ExecutionState;
  readonly phases: readonly ExecutionLifecyclePhase[];
  readonly admissionPath: readonly ExecutionState[];
  readonly validated: true;
}

/**
 * The initial execution state, referenced from the frozen runtime model (ai/runtime/execution-states.md: Created
 * "exists ... but has not begun"; the first of the frozen `EXECUTION_STATES`). It is a reference to the model's
 * state, not a new state.
 */
const INITIAL_STATE: ExecutionState = 'created';

/**
 * The constitution's deterministic admission sequence: an execution "moves forward from Created through
 * Initializing, Loading, Validating" (ai/runtime/execution-states.md, "Specification"), the single-successor
 * prefix before the first governed branch at Validating. It is not trusted: {@link buildRuntimeLifecyclePlan}
 * proves every edge against the frozen `transitionAllowed` (via {@link validateLifecyclePath}) before admitting
 * it to a plan, so model drift fails closed. It is planning metadata, not a re-declaration of the state model.
 */
const ADMISSION_PATH: readonly ExecutionState[] = Object.freeze([
  'created',
  'initializing',
  'loading',
  'validating',
]);

/**
 * Validate that a proposed sequence of execution states is a permitted path through the frozen state model,
 * failing closed. Pure: it delegates entirely to the frozen `transitionAllowed` for each consecutive pair, and
 * aggregates one `RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION` error per pair the model does not permit. It
 * re-declares no state or transition, drives nothing, and holds no state. On any forbidden pair it returns the
 * aggregated errors and no validated path; otherwise it returns the frozen path. Pure; no IO.
 */
export function validateLifecyclePath(
  states: readonly ExecutionState[],
): Result<readonly ExecutionState[], RuntimeLifecycleError[]> {
  const errors: RuntimeLifecycleError[] = [];
  let previous: ExecutionState | undefined;
  for (const state of states) {
    if (previous !== undefined && !transitionAllowed(previous, state)) {
      errors.push(
        new RuntimeLifecycleError(
          'RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION',
          `The transition from '${previous}' to '${state}' is not permitted by the execution state model.`,
          { from: previous, to: state },
        ),
      );
    }
    previous = state;
  }
  return errors.length > 0 ? err(errors) : ok(Object.freeze([...states]));
}

/**
 * Build the immutable runtime lifecycle plan from a DI-integrated application, failing closed. It references the
 * frozen model's initial state and lifecycle phases, proves the model's deterministic admission sequence against
 * the frozen transition relation (via {@link validateLifecyclePath}), and returns an immutable
 * {@link RuntimeLifecyclePlan} binding the consumed `IntegratedApplication` to the validated lifecycle entry. It
 * holds no runtime state, drives no transition, activates nothing, schedules nothing, and instantiates no runtime
 * engine; it simply proves the application is constitutionally ready to enter the execution pipeline (Stage 5),
 * which consumes the plan. On a forbidden admission transition it returns `RuntimeLifecycleError[]` and builds no
 * partial plan. Pure; no IO.
 */
export function buildRuntimeLifecyclePlan(
  integrated: IntegratedApplication,
): Result<RuntimeLifecyclePlan, RuntimeLifecycleError[]> {
  return map(validateLifecyclePath(ADMISSION_PATH), (admissionPath) =>
    Object.freeze({
      integrated,
      initialState: INITIAL_STATE,
      phases: EXECUTION_LIFECYCLE_PHASES,
      admissionPath,
      validated: true,
    }),
  );
}
