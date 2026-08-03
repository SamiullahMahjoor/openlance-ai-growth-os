/**
 * Knowledge resolution: how the runtime orchestrates the loading of knowledge into an execution, in the order
 * the loading strategy requires (ai/runtime/knowledge-resolution.md, OL-AI-RUNTIME-KNOWLEDGE-RESOLUTION).
 *
 * The Specification narrates the orchestration as heterogeneous facets (determine what is required, load in
 * order, load from canonical owners, hand off for assembly), not a closed taxonomy the model refers to by
 * identity, so this concern is definitions only (principles and invariants), consistent with the modeling rule
 * recorded in docs/implementation/13-retrieval.md section 4. The loading order follows the Knowledge Hierarchy
 * and the required/contextual tiers owned by knowledge/README.md and applied by
 * knowledge/architecture/loading-map.md - a knowledge-owned model referenced in prose, never recreated as a
 * runtime classification or predicate (referenced-model non-restatement; ADR-0025). Selection is owned by the
 * Retrieval namespace and context assembly by ai/runtime/context-loading.md (ADR-0020).
 */

/**
 * A knowledge-resolution principle: a permanent rule the orchestration upholds, each instantiating a runtime
 * invariant (ai/runtime/knowledge-resolution.md, "Principles").
 */
export type KnowledgeResolutionPrinciple =
  | 'the-runtime-orchestrates-it-does-not-own-knowledge'
  | 'loading-follows-the-knowledge-loading-strategy'
  | 'top-of-the-hierarchy-downward'
  | 'required-before-contextual'
  | 'loading-is-one-directional';

/** The knowledge-resolution principles, in constitutional order; frozen. */
export const KNOWLEDGE_RESOLUTION_PRINCIPLES: readonly KnowledgeResolutionPrinciple[] =
  Object.freeze([
    'the-runtime-orchestrates-it-does-not-own-knowledge',
    'loading-follows-the-knowledge-loading-strategy',
    'top-of-the-hierarchy-downward',
    'required-before-contextual',
    'loading-is-one-directional',
  ]);

/** What each knowledge-resolution principle requires (ai/runtime/knowledge-resolution.md, "Principles"). */
export const KNOWLEDGE_RESOLUTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<KnowledgeResolutionPrinciple, string>
> = Object.freeze({
  'the-runtime-orchestrates-it-does-not-own-knowledge':
    'The runtime drives the load and owns none of the truth it loads.',
  'loading-follows-the-knowledge-loading-strategy':
    'The order and tiers of loading follow the strategy owned by knowledge/README.md, which the runtime applies and never redefines.',
  'top-of-the-hierarchy-downward':
    'The higher-authority knowledge that governs a task is loaded before the lower-authority knowledge it governs.',
  'required-before-contextual':
    'The knowledge a task requires is loaded before the knowledge its situation merely triggers.',
  'loading-is-one-directional':
    'The runtime reads knowledge from the knowledge repository and never writes, amends, or promotes state into it.',
});

/**
 * A knowledge-resolution invariant: a guarantee the orchestration always upholds
 * (ai/runtime/knowledge-resolution.md, "Invariants").
 */
export type KnowledgeResolutionInvariant =
  | 'knowledge-loaded-from-canonical-owner-never-restated'
  | 'higher-authority-loaded-before-lower'
  | 'required-loaded-before-contextual'
  | 'loading-read-only-across-the-layer-boundary'
  | 'resolving-knowledge-is-inert';

/** The knowledge-resolution invariants, in constitutional order; frozen. */
export const KNOWLEDGE_RESOLUTION_INVARIANTS: readonly KnowledgeResolutionInvariant[] =
  Object.freeze([
    'knowledge-loaded-from-canonical-owner-never-restated',
    'higher-authority-loaded-before-lower',
    'required-loaded-before-contextual',
    'loading-read-only-across-the-layer-boundary',
    'resolving-knowledge-is-inert',
  ]);

/** What each knowledge-resolution invariant guarantees (ai/runtime/knowledge-resolution.md, "Invariants"). */
export const KNOWLEDGE_RESOLUTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<KnowledgeResolutionInvariant, string>
> = Object.freeze({
  'knowledge-loaded-from-canonical-owner-never-restated':
    'Knowledge is always loaded from its canonical owner, never restated or invented.',
  'higher-authority-loaded-before-lower':
    'Higher-authority knowledge is loaded before the lower-authority knowledge it governs.',
  'required-loaded-before-contextual': 'Required knowledge is loaded before contextual knowledge.',
  'loading-read-only-across-the-layer-boundary':
    'Loading is read-only across the layer boundary; the runtime never writes to the knowledge repository.',
  'resolving-knowledge-is-inert':
    'Resolving knowledge never changes ownership, authority, governance, or business truth.',
});
