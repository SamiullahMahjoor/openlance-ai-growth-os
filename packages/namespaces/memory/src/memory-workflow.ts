/**
 * Memory workflow (ai/memory/memory-workflow.md, OL-AI-MEMORY-MEMORY-WORKFLOW).
 *
 * The required order of memory operations, and the pure predicate the ordering supports, as an
 * immutable domain model (ADR-0020). This concern owns the ordered sequence only; it never defines the
 * model of any operation (owned by that operation's document) nor the execution workflow (owned by
 * ai/runtime/execution-workflow.md). The order is architectural: it defines what happens before what,
 * never how any operation is carried out, and it defines no store, index, or algorithm.
 */

/**
 * A memory-workflow principle (ai/memory/memory-workflow.md, "Principles"). Each instantiates a memory
 * invariant owned by ai/memory/README.md.
 */
export type MemoryWorkflowPrinciple =
  | 'order-is-fixed-and-deterministic'
  | 'validation-precedes-retention'
  | 'reconciliation-precedes-reliance'
  | 'removal-is-governed'
  | 'order-holds-at-any-scale';

/** The five memory-workflow principles, in constitutional order; frozen. */
export const MEMORY_WORKFLOW_PRINCIPLES: readonly MemoryWorkflowPrinciple[] = Object.freeze([
  'order-is-fixed-and-deterministic',
  'validation-precedes-retention',
  'reconciliation-precedes-reliance',
  'removal-is-governed',
  'order-holds-at-any-scale',
]);

/** The statement each memory-workflow principle makes (ai/memory/memory-workflow.md). */
export const MEMORY_WORKFLOW_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryWorkflowPrinciple, string>
> = Object.freeze({
  'order-is-fixed-and-deterministic':
    'Every memory operation follows the same required order, so the same retained memory and the same request yield the same remembered context.',
  'validation-precedes-retention':
    'A memory is validated for grounding before it is retained, so no invented memory is ever held.',
  'reconciliation-precedes-reliance':
    'A conflicting memory is reconciled, with knowledge prevailing, before it is relied on.',
  'removal-is-governed':
    'A memory is removed only within the governing rules, and never silently promoted to truth before removal.',
  'order-holds-at-any-scale': 'One memory and millions follow the same order.',
});

/**
 * A step in the required order of memory operations (ai/memory/memory-workflow.md, "Specification").
 * Every memory operation follows these steps in order; an operation never runs before an operation that
 * must precede it.
 */
export type MemoryWorkflowStep =
  'receive' | 'classify' | 'validate' | 'retain' | 'recall' | 'reconcile' | 'evolve-or-remove';

/** The seven memory workflow steps, in constitutional order; frozen. Each step precedes the next. */
export const MEMORY_WORKFLOW_STEPS: readonly MemoryWorkflowStep[] = Object.freeze([
  'receive',
  'classify',
  'validate',
  'retain',
  'recall',
  'reconcile',
  'evolve-or-remove',
]);

/** What each memory workflow step does (ai/memory/memory-workflow.md). */
export const MEMORY_WORKFLOW_STEP_DESCRIPTIONS: Readonly<Record<MemoryWorkflowStep, string>> =
  Object.freeze({
    receive:
      'A memory operation is requested for an execution or session, to record retained context, to recall it, or to remove it, carried by the runtime.',
    classify:
      'The memory is classified by its architectural type and retention class, so its scope and purpose are established.',
    validate:
      'On recording, the remembered information is validated for grounding, so that memory never invents and never records business truth.',
    retain:
      'The validated memory is retained under its retention class, scoped and lifecycled, and never promoted to the knowledge repository.',
    recall:
      'On request, the relevant and fresh memory is made available to reasoning, without replacing the retrieved knowledge that always prevails over it.',
    reconcile:
      'The memory is kept consistent, and a conflict among memories, or between a memory and the knowledge repository, is handled with the knowledge repository prevailing, or escalated.',
    'evolve-or-remove':
      'Over time the memory is revalidated, replaced, or expired, and it is removed within the governing rules.',
  });

const WORKFLOW_STEP_RANK: Readonly<Record<MemoryWorkflowStep, number>> = {
  receive: 0,
  classify: 1,
  validate: 2,
  retain: 3,
  recall: 4,
  reconcile: 5,
  'evolve-or-remove': 6,
};

/**
 * Whether step `a` is at or after step `b` in the required memory order, by the constitutional ordering
 * in which an operation never runs before an operation that must precede it
 * (ai/memory/memory-workflow.md, "Specification").
 */
export const workflowStepAtOrAfter = (a: MemoryWorkflowStep, b: MemoryWorkflowStep): boolean =>
  WORKFLOW_STEP_RANK[a] >= WORKFLOW_STEP_RANK[b];

/**
 * A memory-workflow invariant (ai/memory/memory-workflow.md, "Invariants"): a guarantee that always
 * holds for the memory order.
 */
export type MemoryWorkflowInvariant =
  | 'classify-and-validate-precede-retain-precede-recall'
  | 'validated-before-retained'
  | 'reconciled-before-relied-on'
  | 'removed-only-under-rules'
  | 'same-inputs-same-context'
  | 'order-is-inert';

/** The six memory-workflow invariants, in constitutional order; frozen. */
export const MEMORY_WORKFLOW_INVARIANTS: readonly MemoryWorkflowInvariant[] = Object.freeze([
  'classify-and-validate-precede-retain-precede-recall',
  'validated-before-retained',
  'reconciled-before-relied-on',
  'removed-only-under-rules',
  'same-inputs-same-context',
  'order-is-inert',
]);

/** The guarantee each memory-workflow invariant states (ai/memory/memory-workflow.md). */
export const MEMORY_WORKFLOW_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryWorkflowInvariant, string>
> = Object.freeze({
  'classify-and-validate-precede-retain-precede-recall':
    'Classify and Validate precede Retain, which precedes Recall.',
  'validated-before-retained':
    'A memory is validated for grounding before it is retained, so no invented memory is retained.',
  'reconciled-before-relied-on':
    'A conflicting memory is reconciled, with knowledge prevailing, before it is relied on.',
  'removed-only-under-rules':
    'A memory is removed only within the governing rules, and never promoted into the knowledge repository.',
  'same-inputs-same-context':
    'The same retained memory and the same request always produce the same remembered context.',
  'order-is-inert':
    'The order never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
