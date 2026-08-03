/**
 * Retrieval boundaries (ai/retrieval/retrieval-boundaries.md, OL-AI-RETRIEVAL-RETRIEVAL-BOUNDARIES).
 *
 * The architectural limits within which a retrieval operates, and where a retrieval stops, as immutable
 * definitions (ADR-0020). This concern owns the boundaries of retrieval only; it never defines the
 * governance rules that bound a retrieval (owned by ai/governance/) nor the runtime boundaries (owned by
 * ai/runtime/execution-boundaries.md). The boundaries are architectural; how they are enforced is the
 * runtime's execution, outside this concern.
 */

/**
 * A retrieval-boundaries principle (ai/retrieval/retrieval-boundaries.md, "Principles"). Each
 * instantiates a retrieval invariant owned by ai/retrieval/README.md.
 */
export type RetrievalBoundariesPrinciple =
  | 'determines-not-load-or-execute'
  | 'consumes-truth-never-owns'
  | 'stays-within-governance'
  | 'minimal-and-complete';

/** The four retrieval-boundaries principles, in constitutional order; frozen. */
export const RETRIEVAL_BOUNDARIES_PRINCIPLES: readonly RetrievalBoundariesPrinciple[] =
  Object.freeze([
    'determines-not-load-or-execute',
    'consumes-truth-never-owns',
    'stays-within-governance',
    'minimal-and-complete',
  ]);

/** The statement each retrieval-boundaries principle makes (ai/retrieval/retrieval-boundaries.md). */
export const RETRIEVAL_BOUNDARIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RetrievalBoundariesPrinciple, string>
> = Object.freeze({
  'determines-not-load-or-execute':
    "A retrieval produces a validated result and stops; loading and execution are the runtime's.",
  'consumes-truth-never-owns':
    'A retrieval reads the knowledge repository and never writes, restates, or amends business truth.',
  'stays-within-governance':
    'A retrieval determines only knowledge an execution is permitted to consume, and never exceeds that permission.',
  'minimal-and-complete':
    'A retrieval yields the minimum sufficient, dependency-complete set, and never more or less.',
});

/**
 * An architectural boundary a retrieval operates within (ai/retrieval/retrieval-boundaries.md,
 * "Specification"). A retrieval operates within exactly these five boundaries; each names a limit beyond
 * which a retrieval does not proceed.
 */
export type RetrievalBoundary = 'determination' | 'truth' | 'governance' | 'layer' | 'technology';

/** The five architectural boundaries of a retrieval, in constitutional order; frozen. */
export const RETRIEVAL_BOUNDARIES: readonly RetrievalBoundary[] = Object.freeze([
  'determination',
  'truth',
  'governance',
  'layer',
  'technology',
]);

/** What each retrieval boundary delimits (ai/retrieval/retrieval-boundaries.md). */
export const RETRIEVAL_BOUNDARY_DESCRIPTIONS: Readonly<Record<RetrievalBoundary, string>> =
  Object.freeze({
    determination:
      'A retrieval discovers, selects, expands, prioritizes, assembles, and validates a knowledge set, and stops at the validated result; it never loads the set, assembles the execution context, or executes.',
    truth:
      'A retrieval reads the knowledge repository and names knowledge by its canonical owner; it never owns, writes, restates, caches as truth, or amends any business truth, and never promotes any state into the knowledge repository.',
    governance:
      'A retrieval determines only what an execution is permitted to consume, under ai/governance/, and refuses or escalates rather than retrieve what is not permitted.',
    layer:
      'A retrieval consumes the knowledge repository one-directionally; the knowledge repository never consumes retrieval, and a retrieval never reaches into reasoning, memory, prompts, providers, tools, agents, evaluation, safety, operations, or the runtime, and owns none of their concerns.',
    technology:
      'A retrieval is defined as a model of determination, never as a search engine, index, embedding, ranking, database, algorithm, or protocol.',
  });

/**
 * A retrieval-boundaries invariant (ai/retrieval/retrieval-boundaries.md, "Invariants"): a guarantee
 * that always holds for the boundaries of a retrieval.
 */
export type RetrievalBoundariesInvariant =
  | 'produces-validated-result-never-loads'
  | 'never-writes-or-promotes-truth'
  | 'only-governance-permitted'
  | 'consumes-one-directionally'
  | 'enforcing-a-boundary-is-inert';

/** The five retrieval-boundaries invariants, in constitutional order; frozen. */
export const RETRIEVAL_BOUNDARIES_INVARIANTS: readonly RetrievalBoundariesInvariant[] =
  Object.freeze([
    'produces-validated-result-never-loads',
    'never-writes-or-promotes-truth',
    'only-governance-permitted',
    'consumes-one-directionally',
    'enforcing-a-boundary-is-inert',
  ]);

/** The guarantee each retrieval-boundaries invariant states (ai/retrieval/retrieval-boundaries.md). */
export const RETRIEVAL_BOUNDARIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RetrievalBoundariesInvariant, string>
> = Object.freeze({
  'produces-validated-result-never-loads':
    'A retrieval produces a validated result and never loads, assembles the execution context, or executes.',
  'never-writes-or-promotes-truth':
    'A retrieval never writes, restates, or amends business truth, and never promotes state into the knowledge repository.',
  'only-governance-permitted': 'A retrieval determines only governance-permitted knowledge.',
  'consumes-one-directionally': 'Retrieval consumes the knowledge repository one-directionally.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
