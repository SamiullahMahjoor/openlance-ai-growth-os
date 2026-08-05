import { EXECUTION_LIFECYCLE_PHASES, executionPhaseAtOrAfter } from '@openlance/aios-runtime';
import type { ExecutionLifecyclePhase, ExecutionState } from '@openlance/aios-runtime';

/** Which frozen lifecycle phase each frozen execution state belongs to (ai/runtime/execution-lifecycle.md). */
const PHASE_OF_STATE: Readonly<Record<ExecutionState, ExecutionLifecyclePhase>> = Object.freeze({
  created: 'initialization',
  initializing: 'initialization',
  loading: 'loading',
  validating: 'validation',
  ready: 'validation',
  executing: 'execution',
  waiting: 'execution',
  paused: 'execution',
  recovering: 'execution',
  completed: 'finalization',
  cancelled: 'finalization',
  failed: 'finalization',
  closed: 'finalization',
});

/**
 * The execution lifecycle manager: it maps a frozen execution state to its frozen `EXECUTION_LIFECYCLE_PHASE` and exposes
 * the frozen phase order (`executionPhaseAtOrAfter`), so the runtime can reason about which phase an execution is in and
 * that validation always precedes execution. It applies the frozen lifecycle; it defines no phase and no order of its
 * own.
 */
export class ExecutionLifecycleManager {
  /** The frozen lifecycle phases, in constitutional order. */
  phases(): readonly ExecutionLifecyclePhase[] {
    return EXECUTION_LIFECYCLE_PHASES;
  }

  /** The frozen lifecycle phase a state belongs to. */
  phaseOf(state: ExecutionState): ExecutionLifecyclePhase {
    return PHASE_OF_STATE[state];
  }

  /** Whether the phase of state `a` is at or after the phase of state `b` in the frozen order. */
  atOrAfter(a: ExecutionState, b: ExecutionState): boolean {
    return executionPhaseAtOrAfter(PHASE_OF_STATE[a], PHASE_OF_STATE[b]);
  }
}
