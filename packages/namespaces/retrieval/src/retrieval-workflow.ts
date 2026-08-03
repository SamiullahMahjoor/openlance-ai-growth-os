/**
 * Retrieval workflow (ai/retrieval/retrieval-workflow.md, OL-AI-RETRIEVAL-RETRIEVAL-WORKFLOW).
 *
 * The required order of a retrieval, and the pure predicate the ordering supports, as an immutable
 * domain model (ADR-0020). This concern owns the ordered retrieval sequence only; it never defines the
 * model of any step (owned by that step's document) nor the execution workflow (owned by
 * ai/runtime/execution-workflow.md). The order is architectural: it defines what happens before what,
 * never how any step is carried out.
 */

/**
 * A retrieval-workflow principle (ai/retrieval/retrieval-workflow.md, "Principles"). Each instantiates a
 * retrieval invariant owned by ai/retrieval/README.md.
 */
export type RetrievalWorkflowPrinciple =
  | 'order-is-fixed-and-deterministic'
  | 'discovery-precedes-selection'
  | 'dependencies-resolved-before-prioritization'
  | 'assembly-then-validation-then-handoff'
  | 'order-holds-at-any-scale';

/** The five retrieval-workflow principles, in constitutional order; frozen. */
export const RETRIEVAL_WORKFLOW_PRINCIPLES: readonly RetrievalWorkflowPrinciple[] = Object.freeze([
  'order-is-fixed-and-deterministic',
  'discovery-precedes-selection',
  'dependencies-resolved-before-prioritization',
  'assembly-then-validation-then-handoff',
  'order-holds-at-any-scale',
]);

/** The statement each retrieval-workflow principle makes (ai/retrieval/retrieval-workflow.md). */
export const RETRIEVAL_WORKFLOW_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RetrievalWorkflowPrinciple, string>
> = Object.freeze({
  'order-is-fixed-and-deterministic':
    'Every retrieval follows the same required order, so the same task and repository state yield the same result.',
  'discovery-precedes-selection':
    'Candidates are discovered before eligible knowledge is selected.',
  'dependencies-resolved-before-prioritization':
    'The set is made dependency-complete before it is ordered.',
  'assembly-then-validation-then-handoff':
    'The result is assembled, then validated, then handed to the runtime.',
  'order-holds-at-any-scale':
    'One task against ten documents and against millions follows the same order.',
});

/**
 * A step in the required order of a retrieval (ai/retrieval/retrieval-workflow.md, "Specification").
 * Every retrieval follows these steps in order; a step never runs before a step that must precede it.
 */
export type RetrievalWorkflowStep =
  | 'receive-request'
  | 'discover'
  | 'select'
  | 'resolve-dependencies'
  | 'prioritize'
  | 'assemble'
  | 'validate'
  | 'produce-result';

/** The eight retrieval workflow steps, in constitutional order; frozen. Each step precedes the next. */
export const RETRIEVAL_WORKFLOW_STEPS: readonly RetrievalWorkflowStep[] = Object.freeze([
  'receive-request',
  'discover',
  'select',
  'resolve-dependencies',
  'prioritize',
  'assemble',
  'validate',
  'produce-result',
]);

/** What each retrieval workflow step does (ai/retrieval/retrieval-workflow.md). */
export const RETRIEVAL_WORKFLOW_STEP_DESCRIPTIONS: Readonly<Record<RetrievalWorkflowStep, string>> =
  Object.freeze({
    'receive-request': 'A retrieval is requested for a resolved task, establishing its scope.',
    discover:
      'The candidate knowledge relevant to the task is discovered from its canonical owners, under ai/retrieval/knowledge-discovery.md.',
    select:
      'The eligible, required, governance-permitted knowledge is selected from the candidates, under ai/retrieval/knowledge-selection.md.',
    'resolve-dependencies':
      'The selected knowledge is expanded to include its declared dependencies, under ai/retrieval/dependency-resolution.md, so the set is dependency-complete.',
    prioritize:
      'The dependency-complete set is ordered by authority and relevance within the loading tiers, under ai/retrieval/context-prioritization.md.',
    assemble:
      'The prioritized set is assembled into the coherent retrieval result, under ai/retrieval/context-assembly.md.',
    validate:
      'The retrieval result is validated for authority, ownership, dependency completeness, boundaries, and governance permission, under ai/retrieval/retrieval-validation.md.',
    'produce-result':
      'The validated retrieval result is handed to the runtime, which loads it under ai/runtime/knowledge-resolution.md.',
  });

const WORKFLOW_STEP_RANK: Readonly<Record<RetrievalWorkflowStep, number>> = {
  'receive-request': 0,
  discover: 1,
  select: 2,
  'resolve-dependencies': 3,
  prioritize: 4,
  assemble: 5,
  validate: 6,
  'produce-result': 7,
};

/**
 * Whether step `a` is at or after step `b` in the required retrieval order, by the constitutional
 * ordering in which a step never runs before a step that must precede it
 * (ai/retrieval/retrieval-workflow.md, "Specification").
 */
export const retrievalStepAtOrAfter = (
  a: RetrievalWorkflowStep,
  b: RetrievalWorkflowStep,
): boolean => WORKFLOW_STEP_RANK[a] >= WORKFLOW_STEP_RANK[b];

/**
 * A retrieval-workflow invariant (ai/retrieval/retrieval-workflow.md, "Invariants"): a guarantee that
 * always holds for the retrieval order.
 */
export type RetrievalWorkflowInvariant =
  | 'discover-through-produce-result-in-order'
  | 'no-handoff-before-validate'
  | 'same-inputs-same-ordered-result'
  | 'order-is-inert';

/** The four retrieval-workflow invariants, in constitutional order; frozen. */
export const RETRIEVAL_WORKFLOW_INVARIANTS: readonly RetrievalWorkflowInvariant[] = Object.freeze([
  'discover-through-produce-result-in-order',
  'no-handoff-before-validate',
  'same-inputs-same-ordered-result',
  'order-is-inert',
]);

/** The guarantee each retrieval-workflow invariant states (ai/retrieval/retrieval-workflow.md). */
export const RETRIEVAL_WORKFLOW_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RetrievalWorkflowInvariant, string>
> = Object.freeze({
  'discover-through-produce-result-in-order':
    'Discover precedes Select, which precedes Resolve dependencies, which precedes Prioritize, which precedes Assemble, which precedes Validate, which precedes Produce result.',
  'no-handoff-before-validate': 'No retrieval result is handed off before it passes Validate.',
  'same-inputs-same-ordered-result':
    'The same task and repository state always produce the same ordered result.',
  'order-is-inert':
    'The order never loads knowledge, assembles the execution context, or changes ownership, authority, governance, or business truth.',
});
