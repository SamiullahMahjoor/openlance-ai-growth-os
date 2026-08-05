import { transitionAllowed } from '@openlance/aios-runtime';
import type { ExecutionState } from '@openlance/aios-runtime';

import { ExecutionError } from './errors.js';

/**
 * The execution state manager: it drives a single execution through the frozen execution state model
 * (`@openlance/aios-runtime` `EXECUTION_STATES`), validating every move against the frozen `transitionAllowed` relation
 * and recording the ordered state path. It applies the frozen state model; it defines no state and no transition of its
 * own, and an unpermitted transition fails closed (`EXECUTION.ILLEGAL_TRANSITION`), never a silent move. Each instance
 * tracks one execution, so executions never share state.
 */
export class ExecutionStateManager {
  #current: ExecutionState = 'created';
  readonly #path: ExecutionState[] = ['created'];

  /** The current state. */
  get current(): ExecutionState {
    return this.#current;
  }

  /** The frozen state path taken so far (the audit trail). */
  get path(): readonly ExecutionState[] {
    return [...this.#path];
  }

  /** Move to `to` if the frozen model permits it; otherwise fail closed. */
  transition(to: ExecutionState): void {
    if (!transitionAllowed(this.#current, to)) {
      throw new ExecutionError(
        'EXECUTION.ILLEGAL_TRANSITION',
        `A transition from '${this.#current}' to '${to}' is not permitted by the frozen execution state model.`,
        { from: this.#current, to },
      );
    }
    this.#current = to;
    this.#path.push(to);
  }
}
