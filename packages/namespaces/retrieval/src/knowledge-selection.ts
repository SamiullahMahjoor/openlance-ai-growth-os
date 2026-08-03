/**
 * Knowledge selection (ai/retrieval/knowledge-selection.md, OL-AI-RETRIEVAL-KNOWLEDGE-SELECTION).
 *
 * How the candidate knowledge discovered for a task is judged eligible and selected as required, by
 * relevance and by governance permission, as immutable definitions (ADR-0020). This concern owns
 * selection only; it never defines the permission rules that make knowledge eligible (owned by
 * ai/governance/, which selection applies and never restates) nor resolves the dependencies of the
 * selected set (owned by ai/retrieval/dependency-resolution.md). Selecting from concrete candidates for
 * a concrete task is a runtime evaluation this concern does not own; it is deferred to the runtime. This
 * concern states what selection is and the invariants it always satisfies.
 */

/**
 * A knowledge-selection principle (ai/retrieval/knowledge-selection.md, "Principles"). Each instantiates
 * a retrieval invariant owned by ai/retrieval/README.md.
 */
export type KnowledgeSelectionPrinciple =
  'by-relevance-and-eligibility' | 'minimal' | 'governance-permits-or-denies' | 'deterministic';

/** The four knowledge-selection principles, in constitutional order; frozen. */
export const KNOWLEDGE_SELECTION_PRINCIPLES: readonly KnowledgeSelectionPrinciple[] = Object.freeze(
  ['by-relevance-and-eligibility', 'minimal', 'governance-permits-or-denies', 'deterministic'],
);

/** The statement each knowledge-selection principle makes (ai/retrieval/knowledge-selection.md). */
export const KNOWLEDGE_SELECTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<KnowledgeSelectionPrinciple, string>
> = Object.freeze({
  'by-relevance-and-eligibility':
    'A candidate is selected only if it is relevant to the task and eligible under governance.',
  minimal:
    'Only the knowledge a task requires is selected; knowledge that is merely available is not.',
  'governance-permits-or-denies':
    'Whether a candidate may be selected is subject to the permissions owned by ai/governance/, which selection applies and never redefines.',
  deterministic:
    'The same candidates for the same task and repository state are selected identically, by defined criteria, with no heuristic ranking.',
});

/**
 * A knowledge-selection invariant (ai/retrieval/knowledge-selection.md, "Invariants"): a guarantee that
 * always holds for selection.
 */
export type KnowledgeSelectionInvariant =
  | 'only-relevant-eligible-permitted'
  | 'selection-is-minimal'
  | 'deterministic-over-candidates'
  | 'selecting-is-inert';

/** The four knowledge-selection invariants, in constitutional order; frozen. */
export const KNOWLEDGE_SELECTION_INVARIANTS: readonly KnowledgeSelectionInvariant[] = Object.freeze(
  [
    'only-relevant-eligible-permitted',
    'selection-is-minimal',
    'deterministic-over-candidates',
    'selecting-is-inert',
  ],
);

/** The guarantee each knowledge-selection invariant states (ai/retrieval/knowledge-selection.md). */
export const KNOWLEDGE_SELECTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<KnowledgeSelectionInvariant, string>
> = Object.freeze({
  'only-relevant-eligible-permitted':
    'Only relevant, eligible, governance-permitted knowledge is selected.',
  'selection-is-minimal': 'Selection is minimal; knowledge that is not required is not selected.',
  'deterministic-over-candidates':
    'Selection is deterministic over the same candidates, task, and repository state.',
  'selecting-is-inert':
    'Selecting knowledge never loads it, never changes ownership, authority, governance, or business truth.',
});
