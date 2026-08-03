/**
 * Execution lifecycle: the lifecycle of a single execution, from creation to closure, and the phases it
 * passes through (ai/runtime/execution-lifecycle.md, OL-AI-RUNTIME-EXECUTION-LIFECYCLE).
 *
 * An execution passes through five ordered lifecycle phases; each phase completes before the next begins,
 * except where failure handling returns an execution to an earlier condition under
 * ai/runtime/failure-recovery.md. This module defines the ordered phases, their principles, and their
 * invariants, plus the pure ordering predicate the document's ordering states. The named states are owned by
 * ai/runtime/execution-states.md and the ordered steps by ai/runtime/execution-workflow.md, referenced not
 * restated (ADR-0020).
 */

/**
 * An execution-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating a runtime
 * invariant (ai/runtime/execution-lifecycle.md, "Principles").
 */
export type ExecutionLifecyclePrinciple =
  | 'every-execution-has-a-defined-beginning-and-end'
  | 'governance-precedes-execution'
  | 'every-execution-terminates'
  | 'resources-are-released';

/** The execution-lifecycle principles, in constitutional order; frozen. */
export const EXECUTION_LIFECYCLE_PRINCIPLES: readonly ExecutionLifecyclePrinciple[] = Object.freeze(
  [
    'every-execution-has-a-defined-beginning-and-end',
    'governance-precedes-execution',
    'every-execution-terminates',
    'resources-are-released',
  ],
);

/** What each execution-lifecycle principle requires (ai/runtime/execution-lifecycle.md, "Principles"). */
export const EXECUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ExecutionLifecyclePrinciple, string>
> = Object.freeze({
  'every-execution-has-a-defined-beginning-and-end':
    'An execution is created, runs, and is closed; it never runs unbounded.',
  'governance-precedes-execution':
    'An execution reaches its running phase only after it has been validated against governance.',
  'every-execution-terminates':
    'An execution always reaches a terminal phase, whether it completes, is cancelled, or fails, and never remains suspended forever.',
  'resources-are-released':
    'Closing an execution releases what it held, so no execution leaks its hold on the runtime.',
});

/**
 * An execution-lifecycle phase, in constitutional order from earliest to latest
 * (ai/runtime/execution-lifecycle.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link executionPhaseAtOrAfter}.
 */
export type ExecutionLifecyclePhase =
  'initialization' | 'loading' | 'validation' | 'execution' | 'finalization';

/** The execution-lifecycle phases, earliest to latest; frozen. */
export const EXECUTION_LIFECYCLE_PHASES: readonly ExecutionLifecyclePhase[] = Object.freeze([
  'initialization',
  'loading',
  'validation',
  'execution',
  'finalization',
]);

/** What each execution-lifecycle phase is (ai/runtime/execution-lifecycle.md, "Specification"). */
export const EXECUTION_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<ExecutionLifecyclePhase, string>
> = Object.freeze({
  initialization:
    'The execution is created and prepared; it is bound to its session, its task is admitted, and its scope and grant are established.',
  loading:
    'The governance that binds the execution, the task, and the knowledge the task requires are loaded, and the execution context is assembled, drawing on ai/runtime/knowledge-resolution.md and ai/runtime/context-loading.md.',
  validation:
    'The execution is validated against governance before it may run, in the order owned by ai/runtime/validation-pipeline.md and against the rules owned by ai/governance/.',
  execution:
    'The validated task runs, and its progress is monitored; failures in this phase are handled under ai/runtime/failure-recovery.md, and whether execution may continue is decided by governance.',
  finalization:
    'The result is returned, the execution reaches its terminal state, its resources are released, and it is closed within its session.',
});

/**
 * An execution-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/runtime/execution-lifecycle.md, "Invariants").
 */
export type ExecutionLifecycleInvariant =
  | 'one-lifecycle-per-execution'
  | 'validation-always-precedes-execution'
  | 'always-reaches-finalization'
  | 'finalization-always-releases-resources'
  | 'lifecycle-is-inert';

/** The execution-lifecycle invariants, in constitutional order; frozen. */
export const EXECUTION_LIFECYCLE_INVARIANTS: readonly ExecutionLifecycleInvariant[] = Object.freeze(
  [
    'one-lifecycle-per-execution',
    'validation-always-precedes-execution',
    'always-reaches-finalization',
    'finalization-always-releases-resources',
    'lifecycle-is-inert',
  ],
);

/** What each execution-lifecycle invariant guarantees (ai/runtime/execution-lifecycle.md, "Invariants"). */
export const EXECUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ExecutionLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-execution':
    'An execution holds exactly one lifecycle, from one creation to one closure.',
  'validation-always-precedes-execution':
    'The Validation phase always precedes the Execution phase.',
  'always-reaches-finalization':
    'An execution always reaches Finalization, by completion, cancellation, or failure.',
  'finalization-always-releases-resources':
    "Finalization always releases the execution's resources.",
  'lifecycle-is-inert':
    'The lifecycle never changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const EXECUTION_LIFECYCLE_PHASE_RANK: Readonly<Record<ExecutionLifecyclePhase, number>> =
  Object.freeze({
    initialization: 0,
    loading: 1,
    validation: 2,
    execution: 3,
    finalization: 4,
  });

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/runtime/execution-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function executionPhaseAtOrAfter(
  a: ExecutionLifecyclePhase,
  b: ExecutionLifecyclePhase,
): boolean {
  return EXECUTION_LIFECYCLE_PHASE_RANK[a] >= EXECUTION_LIFECYCLE_PHASE_RANK[b];
}
