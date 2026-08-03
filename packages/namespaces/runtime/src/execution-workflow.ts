/**
 * Execution workflow: the required order of an execution, the ordered sequence of phases from initialization
 * through finalization (ai/runtime/execution-workflow.md, OL-AI-RUNTIME-EXECUTION-WORKFLOW).
 *
 * Every execution follows a fixed order of steps: the order is architectural, defining what happens before
 * what, never how any step is carried out. This module defines the ordered steps, their principles, and their
 * invariants, plus the pure ordering predicate the document's ordering states. The rules validated at each
 * step are owned by ai/governance/ and the states the order moves through by ai/runtime/execution-states.md,
 * referenced not restated (ADR-0020).
 */

/**
 * An execution-workflow principle: a permanent rule the order upholds, each instantiating a runtime invariant
 * (ai/runtime/execution-workflow.md, "Principles").
 */
export type ExecutionWorkflowPrinciple =
  | 'the-order-is-fixed-and-governed'
  | 'governance-is-loaded-and-validated-before-the-task-runs'
  | 'knowledge-is-loaded-before-context-is-assembled'
  | 'validation-precedes-execution'
  | 'the-order-holds-at-any-scale';

/** The execution-workflow principles, in constitutional order; frozen. */
export const EXECUTION_WORKFLOW_PRINCIPLES: readonly ExecutionWorkflowPrinciple[] = Object.freeze([
  'the-order-is-fixed-and-governed',
  'governance-is-loaded-and-validated-before-the-task-runs',
  'knowledge-is-loaded-before-context-is-assembled',
  'validation-precedes-execution',
  'the-order-holds-at-any-scale',
]);

/** What each execution-workflow principle requires (ai/runtime/execution-workflow.md, "Principles"). */
export const EXECUTION_WORKFLOW_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ExecutionWorkflowPrinciple, string>
> = Object.freeze({
  'the-order-is-fixed-and-governed':
    'Every execution follows the same required order, and no step is skipped or reordered to reach execution sooner.',
  'governance-is-loaded-and-validated-before-the-task-runs':
    'Loading and validation always precede execution.',
  'knowledge-is-loaded-before-context-is-assembled':
    'The context an execution runs with is assembled only from knowledge and inputs already loaded.',
  'validation-precedes-execution':
    'Permissions and policies are validated before the task is run, never after.',
  'the-order-holds-at-any-scale':
    'One execution and millions of concurrent executions follow the same order.',
});

/**
 * An execution-workflow step, in constitutional order from first to last (ai/runtime/execution-workflow.md,
 * "Specification"). The order is the document's; it is total and is exposed by {@link workflowStepAtOrAfter}.
 */
export type ExecutionWorkflowStep =
  | 'initialize'
  | 'validate-constitution'
  | 'load-governance'
  | 'resolve-task'
  | 'load-required-knowledge'
  | 'load-contextual-knowledge'
  | 'assemble-execution-context'
  | 'validate-permissions'
  | 'validate-policies'
  | 'execute'
  | 'monitor-state'
  | 'handle-failures'
  | 'return-result'
  | 'finalize-session';

/** The execution-workflow steps, first to last; frozen. */
export const EXECUTION_WORKFLOW_STEPS: readonly ExecutionWorkflowStep[] = Object.freeze([
  'initialize',
  'validate-constitution',
  'load-governance',
  'resolve-task',
  'load-required-knowledge',
  'load-contextual-knowledge',
  'assemble-execution-context',
  'validate-permissions',
  'validate-policies',
  'execute',
  'monitor-state',
  'handle-failures',
  'return-result',
  'finalize-session',
]);

/** What each execution-workflow step is (ai/runtime/execution-workflow.md, "Specification"). */
export const EXECUTION_WORKFLOW_STEP_DESCRIPTIONS: Readonly<Record<ExecutionWorkflowStep, string>> =
  Object.freeze({
    initialize:
      'The execution is created, bound to its session, and its scope and grant are established.',
    'validate-constitution':
      'The execution is checked against the AI constitution before it proceeds, under ai/governance/constitutional-validation.md.',
    'load-governance':
      'The governance mandates that bind the execution are loaded, owned by ai/governance/.',
    'resolve-task': 'The task to be executed is admitted and resolved to what it requires.',
    'load-required-knowledge':
      'The knowledge the task requires is loaded, orchestrated by ai/runtime/knowledge-resolution.md and found by the Retrieval namespace from the knowledge repository.',
    'load-contextual-knowledge':
      'The knowledge the situation triggers is loaded, under the same orchestration.',
    'assemble-execution-context':
      'The loaded knowledge, memory, and task are assembled into the execution context, owned by ai/runtime/context-loading.md.',
    'validate-permissions':
      'The execution is validated against the permission mandates owned by ai/governance/permission-governance.md, in the order owned by ai/runtime/validation-pipeline.md.',
    'validate-policies':
      'The execution is validated against the policy mandates owned by ai/governance/policy-enforcement.md, in the same order.',
    execute: 'The validated task runs.',
    'monitor-state':
      "The running execution's state is monitored, under ai/runtime/execution-states.md.",
    'handle-failures':
      'Any failure is handled under ai/runtime/failure-recovery.md, and whether execution may continue, escalate, or refuse is decided by ai/governance/.',
    'return-result': 'The result of the execution is returned.',
    'finalize-session':
      'The execution reaches its terminal state, its resources are released, and it is closed within its session, under ai/runtime/session-lifecycle.md.',
  });

/**
 * An execution-workflow invariant: a guarantee the order always upholds (ai/runtime/execution-workflow.md,
 * "Invariants").
 */
export type ExecutionWorkflowInvariant =
  | 'validate-constitution-load-governance-validate-permissions-and-policies-precede-execute'
  | 'knowledge-loaded-before-context-assembled-before-execute'
  | 'no-execution-reaches-execute-without-passing-every-validation-before-it'
  | 'the-order-is-inert';

/** The execution-workflow invariants, in constitutional order; frozen. */
export const EXECUTION_WORKFLOW_INVARIANTS: readonly ExecutionWorkflowInvariant[] = Object.freeze([
  'validate-constitution-load-governance-validate-permissions-and-policies-precede-execute',
  'knowledge-loaded-before-context-assembled-before-execute',
  'no-execution-reaches-execute-without-passing-every-validation-before-it',
  'the-order-is-inert',
]);

/** What each execution-workflow invariant guarantees (ai/runtime/execution-workflow.md, "Invariants"). */
export const EXECUTION_WORKFLOW_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ExecutionWorkflowInvariant, string>
> = Object.freeze({
  'validate-constitution-load-governance-validate-permissions-and-policies-precede-execute':
    'Validate constitution, load governance, and validate permissions and policies all precede Execute.',
  'knowledge-loaded-before-context-assembled-before-execute':
    'Knowledge is loaded before context is assembled, and context is assembled before Execute.',
  'no-execution-reaches-execute-without-passing-every-validation-before-it':
    'No execution reaches Execute without passing every validation step before it.',
  'the-order-is-inert':
    'The order never changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each workflow step in the constitutional order (first = 0). Internal to the ordering
 * predicate; never exported.
 */
const EXECUTION_WORKFLOW_STEP_RANK: Readonly<Record<ExecutionWorkflowStep, number>> = Object.freeze(
  {
    initialize: 0,
    'validate-constitution': 1,
    'load-governance': 2,
    'resolve-task': 3,
    'load-required-knowledge': 4,
    'load-contextual-knowledge': 5,
    'assemble-execution-context': 6,
    'validate-permissions': 7,
    'validate-policies': 8,
    execute: 9,
    'monitor-state': 10,
    'handle-failures': 11,
    'return-result': 12,
    'finalize-session': 13,
  },
);

/**
 * Whether workflow step `a` is at or after workflow step `b` in the constitutional step order
 * (ai/runtime/execution-workflow.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function workflowStepAtOrAfter(a: ExecutionWorkflowStep, b: ExecutionWorkflowStep): boolean {
  return EXECUTION_WORKFLOW_STEP_RANK[a] >= EXECUTION_WORKFLOW_STEP_RANK[b];
}
