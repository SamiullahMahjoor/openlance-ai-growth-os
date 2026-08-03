/**
 * Retrieval lifecycle (ai/retrieval/retrieval-lifecycle.md, OL-AI-RETRIEVAL-RETRIEVAL-LIFECYCLE).
 *
 * The ordered phases a single retrieval passes through, from request to result, and the pure predicate
 * the constitutional ordering supports, as an immutable domain model (ADR-0020). This concern owns the
 * retrieval lifecycle only; it defers the ordered steps within it to ai/retrieval/retrieval-workflow.md
 * and the execution lifecycle it serves to ai/runtime/execution-lifecycle.md. A lifecycle phase never
 * loads knowledge or executes.
 */

/**
 * A retrieval-lifecycle principle (ai/retrieval/retrieval-lifecycle.md, "Principles"). Each instantiates
 * a retrieval invariant owned by ai/retrieval/README.md.
 */
export type RetrievalLifecyclePrinciple =
  | 'defined-beginning-and-end'
  | 'determination-precedes-result'
  | 'validation-precedes-handoff'
  | 'produces-determination-not-truth';

/** The four retrieval-lifecycle principles, in constitutional order; frozen. */
export const RETRIEVAL_LIFECYCLE_PRINCIPLES: readonly RetrievalLifecyclePrinciple[] = Object.freeze(
  [
    'defined-beginning-and-end',
    'determination-precedes-result',
    'validation-precedes-handoff',
    'produces-determination-not-truth',
  ],
);

/** The statement each retrieval-lifecycle principle makes (ai/retrieval/retrieval-lifecycle.md). */
export const RETRIEVAL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RetrievalLifecyclePrinciple, string>
> = Object.freeze({
  'defined-beginning-and-end':
    'A retrieval begins with a request and ends with a validated result; it never runs unbounded.',
  'determination-precedes-result':
    'A retrieval determines the knowledge set before it produces a result.',
  'validation-precedes-handoff':
    'A retrieval result is validated before it is handed to the runtime.',
  'produces-determination-not-truth':
    'A retrieval result names the knowledge to load; it never contains or alters the truth itself.',
});

/**
 * A phase of a single retrieval (ai/retrieval/retrieval-lifecycle.md, "Specification"). A retrieval
 * passes through these ordered phases, and each phase completes before the next begins.
 */
export type RetrievalLifecyclePhase =
  'request' | 'determination' | 'assembly' | 'validation' | 'result';

/** The five retrieval lifecycle phases, in constitutional order; frozen. Each phase precedes the next. */
export const RETRIEVAL_LIFECYCLE_PHASES: readonly RetrievalLifecyclePhase[] = Object.freeze([
  'request',
  'determination',
  'assembly',
  'validation',
  'result',
]);

/** What happens in each retrieval lifecycle phase (ai/retrieval/retrieval-lifecycle.md). */
export const RETRIEVAL_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<RetrievalLifecyclePhase, string>
> = Object.freeze({
  request:
    'A retrieval is requested for a resolved task; its scope is the task and the knowledge that task requires.',
  determination:
    'The knowledge set is determined: candidate knowledge is discovered, eligible knowledge is selected, its dependencies are resolved, and the set is prioritized, under the loading strategy.',
  assembly:
    'The determined knowledge is assembled into the coherent retrieval result, under ai/retrieval/context-assembly.md.',
  validation:
    'The retrieval result is validated for authority, ownership, dependency completeness, boundaries, and governance permission, under ai/retrieval/retrieval-validation.md, before it may be handed off.',
  result:
    'The validated retrieval result is produced and handed to the runtime, which loads it under ai/runtime/knowledge-resolution.md.',
});

const LIFECYCLE_PHASE_RANK: Readonly<Record<RetrievalLifecyclePhase, number>> = {
  request: 0,
  determination: 1,
  assembly: 2,
  validation: 3,
  result: 4,
};

/**
 * Whether phase `a` is at or after phase `b` in the retrieval lifecycle, by the constitutional ordering
 * in which each phase completes before the next begins (ai/retrieval/retrieval-lifecycle.md,
 * "Specification").
 */
export const retrievalPhaseAtOrAfter = (
  a: RetrievalLifecyclePhase,
  b: RetrievalLifecyclePhase,
): boolean => LIFECYCLE_PHASE_RANK[a] >= LIFECYCLE_PHASE_RANK[b];

/**
 * A retrieval-lifecycle invariant (ai/retrieval/retrieval-lifecycle.md, "Invariants"): a guarantee that
 * always holds for the retrieval lifecycle.
 */
export type RetrievalLifecycleInvariant =
  | 'one-lifecycle-per-retrieval'
  | 'validation-precedes-result'
  | 'terminates-in-validated-result-or-refusal'
  | 'lifecycle-is-inert';

/** The four retrieval-lifecycle invariants, in constitutional order; frozen. */
export const RETRIEVAL_LIFECYCLE_INVARIANTS: readonly RetrievalLifecycleInvariant[] = Object.freeze(
  [
    'one-lifecycle-per-retrieval',
    'validation-precedes-result',
    'terminates-in-validated-result-or-refusal',
    'lifecycle-is-inert',
  ],
);

/** The guarantee each retrieval-lifecycle invariant states (ai/retrieval/retrieval-lifecycle.md). */
export const RETRIEVAL_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RetrievalLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-retrieval':
    'A retrieval holds exactly one lifecycle, from one request to one result.',
  'validation-precedes-result': 'The Validation phase always precedes the Result phase.',
  'terminates-in-validated-result-or-refusal':
    'A retrieval always terminates in a validated result or in a refusal to produce one.',
  'lifecycle-is-inert':
    'The lifecycle never loads knowledge, assembles the execution context, or changes ownership, authority, governance, or business truth.',
});
