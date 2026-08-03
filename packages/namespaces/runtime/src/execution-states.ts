/**
 * Execution states: the execution state model, the named states an execution may hold and the permitted
 * transitions between them (ai/runtime/execution-states.md, OL-AI-RUNTIME-EXECUTION-STATES).
 *
 * This is the runtime namespace's genuine deterministic algorithm. The state model is a directed graph over
 * the thirteen named states; the permitted transitions are the edges the constitution enumerates. The
 * transition relation is realized as an immutable adjacency map and a pure total predicate over it. It defines
 * the relation only; the mechanism that carries an execution along an edge is the runtime's, and the order
 * that drives transitions is owned by ai/runtime/execution-workflow.md (ADR-0020).
 *
 * Sourcing of the Recovering transitions: ai/runtime/execution-states.md "Specification" enumerates every
 * state's outgoing edges except Recovering's, and explicitly defers "the failure handling behind Recovering"
 * to ai/runtime/failure-recovery.md (its Boundaries). failure-recovery.md "Recovery workflow" states the
 * execution "enters the Recovering state, resumes ... and either continues or, if recovery does not succeed,
 * terminates", and "Termination" states an execution that cannot be recovered "is terminated to the Failed
 * state". So Recovering transitions to Executing (continues) and to Failed (terminates). These edges are
 * constitutionally determined across the two documents, and are required for the execution-states invariant
 * "Every path through the model reaches Closed" to hold; they are not invented here.
 */

/**
 * An execution-states principle: a permanent rule the state model upholds
 * (ai/runtime/execution-states.md, "Principles").
 */
export type ExecutionStatePrinciple =
  | 'an-execution-is-always-in-exactly-one-state'
  | 'transitions-are-defined-not-arbitrary'
  | 'every-execution-reaches-a-terminal-state'
  | 'the-state-model-is-technology-neutral';

/** The execution-states principles, in constitutional order; frozen. */
export const EXECUTION_STATE_PRINCIPLES: readonly ExecutionStatePrinciple[] = Object.freeze([
  'an-execution-is-always-in-exactly-one-state',
  'transitions-are-defined-not-arbitrary',
  'every-execution-reaches-a-terminal-state',
  'the-state-model-is-technology-neutral',
]);

/** What each execution-states principle requires (ai/runtime/execution-states.md, "Principles"). */
export const EXECUTION_STATE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ExecutionStatePrinciple, string>
> = Object.freeze({
  'an-execution-is-always-in-exactly-one-state':
    'An execution is always in exactly one state; its condition is defined at every point in its life.',
  'transitions-are-defined-not-arbitrary':
    'An execution moves only along a permitted transition, never to an undefined state.',
  'every-execution-reaches-a-terminal-state':
    'The model always leads to completion, cancellation, or failure, and then to closure.',
  'the-state-model-is-technology-neutral':
    'The state model describes conditions and transitions, never a mechanism that implements them.',
});

/**
 * An execution state: one named condition an execution may hold, in constitutional listing order
 * (ai/runtime/execution-states.md, "Specification"). The permitted moves between states are given by
 * {@link EXECUTION_STATE_TRANSITIONS}.
 */
export type ExecutionState =
  | 'created'
  | 'initializing'
  | 'loading'
  | 'validating'
  | 'ready'
  | 'executing'
  | 'waiting'
  | 'paused'
  | 'recovering'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'closed';

/** The execution states, in constitutional listing order; frozen. */
export const EXECUTION_STATES: readonly ExecutionState[] = Object.freeze([
  'created',
  'initializing',
  'loading',
  'validating',
  'ready',
  'executing',
  'waiting',
  'paused',
  'recovering',
  'completed',
  'cancelled',
  'failed',
  'closed',
]);

/** What each execution state is (ai/runtime/execution-states.md, "Specification"). */
export const EXECUTION_STATE_DESCRIPTIONS: Readonly<Record<ExecutionState, string>> = Object.freeze(
  {
    created: 'The execution exists and is bound to its session, but has not begun.',
    initializing:
      'The execution establishes its scope and grant, and passes the initial constitutional admission check before it proceeds to loading.',
    loading:
      'Governance, the task, and required and contextual knowledge are loaded, and context is assembled.',
    validating:
      'The execution is validated against its permissions and policies before it may run, under ai/runtime/validation-pipeline.md.',
    ready: 'Validation has passed and the execution is prepared to run.',
    executing: 'The validated task is running.',
    waiting: 'The execution is paused pending an external result it depends on, and will resume.',
    paused:
      'The execution is held by governance or by a human decision, and will resume or terminate.',
    recovering: 'A failure is being handled under the failure and recovery model.',
    completed: 'The task finished and produced its result.',
    cancelled: 'The execution was stopped before completion by a governed or human decision.',
    failed: 'The execution ended without completing, after recovery did not succeed.',
    closed:
      'The execution is finalized, its resources are released, and it holds a terminal record.',
  },
);

/**
 * The permitted transitions of the execution state model: for each state, the states it may move to
 * (ai/runtime/execution-states.md, "Specification", and, for Recovering, ai/runtime/failure-recovery.md;
 * see the module note). These edges are the constitution's; the map is the state model's directed graph.
 * Frozen, and every state is a key (a state with no outgoing transition maps to an empty, frozen list).
 */
export const EXECUTION_STATE_TRANSITIONS: Readonly<
  Record<ExecutionState, readonly ExecutionState[]>
> = Object.freeze({
  created: Object.freeze(['initializing'] as const),
  initializing: Object.freeze(['loading'] as const),
  loading: Object.freeze(['validating'] as const),
  validating: Object.freeze(['ready', 'cancelled', 'failed'] as const),
  ready: Object.freeze(['executing'] as const),
  executing: Object.freeze(['waiting', 'paused', 'recovering', 'completed'] as const),
  waiting: Object.freeze(['executing'] as const),
  paused: Object.freeze(['executing'] as const),
  recovering: Object.freeze(['executing', 'failed'] as const),
  completed: Object.freeze(['closed'] as const),
  cancelled: Object.freeze(['closed'] as const),
  failed: Object.freeze(['closed'] as const),
  closed: Object.freeze([] as const),
});

/**
 * An execution-states invariant: a guarantee the state model always upholds
 * (ai/runtime/execution-states.md, "Invariants").
 */
export type ExecutionStateInvariant =
  | 'exactly-one-state-at-all-times'
  | 'executing-entered-only-from-ready-which-only-after-validating-passed'
  | 'every-path-reaches-closed'
  | 'closed-is-terminal'
  | 'a-state-change-is-inert';

/** The execution-states invariants, in constitutional order; frozen. */
export const EXECUTION_STATE_INVARIANTS: readonly ExecutionStateInvariant[] = Object.freeze([
  'exactly-one-state-at-all-times',
  'executing-entered-only-from-ready-which-only-after-validating-passed',
  'every-path-reaches-closed',
  'closed-is-terminal',
  'a-state-change-is-inert',
]);

/** What each execution-states invariant guarantees (ai/runtime/execution-states.md, "Invariants"). */
export const EXECUTION_STATE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ExecutionStateInvariant, string>
> = Object.freeze({
  'exactly-one-state-at-all-times': 'An execution is in exactly one state at all times.',
  'executing-entered-only-from-ready-which-only-after-validating-passed':
    'Executing is entered only from Ready, which is entered only after Validating has passed.',
  'every-path-reaches-closed': 'Every path through the model reaches Closed.',
  'closed-is-terminal': 'Closed is terminal; no execution leaves it.',
  'a-state-change-is-inert':
    'A state change never changes ownership, authority, governance, or business truth.',
});

/**
 * Whether an execution in state `from` may move to state `to`, per the permitted transitions of the state
 * model (ai/runtime/execution-states.md, "Specification"). Pure and total: true exactly when `to` is listed
 * among `from`'s permitted transitions in {@link EXECUTION_STATE_TRANSITIONS}. It reads only the
 * constitution's enumerated edges and states no policy of its own.
 */
export function transitionAllowed(from: ExecutionState, to: ExecutionState): boolean {
  return EXECUTION_STATE_TRANSITIONS[from].includes(to);
}
