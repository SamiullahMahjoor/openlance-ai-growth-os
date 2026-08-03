/**
 * The Retrieval namespace, namespace-wide truth (ai/retrieval/README.md, OL-AI-RETRIEVAL-README;
 * ai/retrieval/retrieval.md, OL-AI-RETRIEVAL-RETRIEVAL).
 *
 * The retrieval invariants every retrieval concern upholds, and the canonical inventory of the
 * retrieval concerns, as immutable definitions (ADR-0020). The namespace is a Pure Domain Model of the
 * knowledge-determination layer: it states how the minimum sufficient, dependency-complete,
 * authority-correct set of knowledge a task requires is discovered, selected, expanded, prioritized,
 * assembled, and validated, and it never loads it, never assembles the execution context, never owns
 * the knowledge itself, and never defines a search engine, index, embedding, ranking, database,
 * algorithm, or code (ai/retrieval/README.md). Retrieval is deterministic and scalable: the same task
 * against the same repository state determines the same knowledge set, whether the repository holds ten
 * documents or millions (ai/retrieval/retrieval.md). It consumes the knowledge repository
 * one-directionally and produces the retrieval result the runtime loads.
 */

/**
 * A retrieval invariant: a permanent guarantee every retrieval document upholds and no retrieval may
 * violate (ai/retrieval/README.md, "Retrieval Invariants"). Every retrieval concern's principles
 * instantiate these.
 */
export type RetrievalInvariant =
  | 'consumes-never-owns'
  | 'cross-layer-one-directional'
  | 'determines-runtime-loads'
  | 'authority-and-ownership-aware'
  | 'dependency-complete'
  | 'minimal'
  | 'validated-before-loading'
  | 'deterministic'
  | 'scales-without-redesign';

/** The nine retrieval invariants, in constitutional order; frozen. */
export const RETRIEVAL_INVARIANTS: readonly RetrievalInvariant[] = Object.freeze([
  'consumes-never-owns',
  'cross-layer-one-directional',
  'determines-runtime-loads',
  'authority-and-ownership-aware',
  'dependency-complete',
  'minimal',
  'validated-before-loading',
  'deterministic',
  'scales-without-redesign',
]);

/** The guarantee each retrieval invariant states (ai/retrieval/README.md, "Retrieval Invariants"). */
export const RETRIEVAL_INVARIANT_DESCRIPTIONS: Readonly<Record<RetrievalInvariant, string>> =
  Object.freeze({
    'consumes-never-owns':
      'Retrieval reads the knowledge repository and never owns, writes, or amends any business truth.',
    'cross-layer-one-directional':
      'Retrieval consumes the knowledge repository; the knowledge repository never consumes retrieval.',
    'determines-runtime-loads':
      'Retrieval produces the set to load and the retrieval result; the runtime loads it and assembles the execution context.',
    'authority-and-ownership-aware':
      'Every piece is drawn from its single canonical owner, and higher-authority knowledge is included with the lower-authority knowledge it governs.',
    'dependency-complete':
      'The retrieved set includes the declared dependencies of every piece in it, so no source is loaded without the sources it depends on.',
    minimal:
      'Retrieval determines the least knowledge sufficient for the task, plus the higher-authority and dependency sources that govern it, and no more.',
    'validated-before-loading':
      'The retrieval result is validated for authority, ownership, dependency completeness, boundaries, and governance permission before it is handed to the runtime.',
    deterministic:
      'The same task against the same repository state determines the same knowledge set.',
    'scales-without-redesign':
      'The model determines the set identically whether the repository holds ten documents or millions.',
  });

/**
 * A retrieval concern: one aspect of the retrieval model, each owned by exactly one document
 * (ai/retrieval/retrieval.md, "The Retrieval Concerns"). This is the namespace inventory identity; the
 * model of each concern is owned by its named document and this package's corresponding module.
 */
export type RetrievalConcern =
  | 'retrieval-lifecycle'
  | 'retrieval-workflow'
  | 'knowledge-discovery'
  | 'knowledge-selection'
  | 'context-assembly'
  | 'context-prioritization'
  | 'dependency-resolution'
  | 'loading-strategy'
  | 'retrieval-boundaries'
  | 'retrieval-validation';

/** The ten retrieval concerns, in inventory order; frozen. */
export const RETRIEVAL_CONCERNS: readonly RetrievalConcern[] = Object.freeze([
  'retrieval-lifecycle',
  'retrieval-workflow',
  'knowledge-discovery',
  'knowledge-selection',
  'context-assembly',
  'context-prioritization',
  'dependency-resolution',
  'loading-strategy',
  'retrieval-boundaries',
  'retrieval-validation',
]);

/** What each retrieval concern owns (ai/retrieval/retrieval.md, "The Retrieval Concerns"). */
export const RETRIEVAL_CONCERN_DESCRIPTIONS: Readonly<Record<RetrievalConcern, string>> =
  Object.freeze({
    'retrieval-lifecycle':
      'The lifecycle of a retrieval, from request to result, and the phases it passes through.',
    'retrieval-workflow':
      'The required order of a retrieval: the ordered sequence from discovery through validated result.',
    'knowledge-discovery':
      'How the candidate knowledge relevant to a task is discovered from the canonical owners in the knowledge repository.',
    'knowledge-selection':
      'How discovered knowledge is judged eligible and selected as required for a task, by relevance and by governance permission.',
    'context-assembly':
      'How the selected, dependency-complete, prioritized knowledge is assembled into the coherent retrieval result the runtime loads.',
    'context-prioritization':
      'How the knowledge in the retrieval result is prioritized and ordered, by authority and by relevance, within the loading tiers.',
    'dependency-resolution':
      'How the selected knowledge is expanded to include its declared dependencies, so the retrieved set is dependency-complete.',
    'loading-strategy':
      'The architectural principles by which retrieval determines the minimum sufficient set to load, applying the knowledge loading strategy.',
    'retrieval-boundaries':
      'The architectural boundaries of a retrieval: what a retrieval may and may not do, and where it stops.',
    'retrieval-validation':
      'How a retrieval result is validated before it is handed to the runtime for loading.',
  });
