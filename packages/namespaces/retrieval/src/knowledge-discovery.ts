/**
 * Knowledge discovery (ai/retrieval/knowledge-discovery.md, OL-AI-RETRIEVAL-KNOWLEDGE-DISCOVERY).
 *
 * How the candidate knowledge relevant to a task is discovered from the canonical owners in the
 * knowledge repository, as immutable definitions (ADR-0020). This concern owns discovery only; it never
 * owns the truth it discovers (owned by the knowledge repository), never selects among candidates
 * (owned by ai/retrieval/knowledge-selection.md), and never defines a search engine, index, or
 * discovery mechanism (implementation). Discovering concrete candidates over a concrete task and
 * repository is a runtime evaluation this concern does not own; it is deferred to the runtime. This
 * concern states what discovery is and the invariants it always satisfies.
 */

/**
 * A knowledge-discovery principle (ai/retrieval/knowledge-discovery.md, "Principles"). Each instantiates
 * a retrieval invariant owned by ai/retrieval/README.md.
 */
export type KnowledgeDiscoveryPrinciple =
  'by-ownership' | 'reads-never-authors' | 'authority-aware' | 'complete-over-canonical-sources';

/** The four knowledge-discovery principles, in constitutional order; frozen. */
export const KNOWLEDGE_DISCOVERY_PRINCIPLES: readonly KnowledgeDiscoveryPrinciple[] = Object.freeze(
  ['by-ownership', 'reads-never-authors', 'authority-aware', 'complete-over-canonical-sources'],
);

/** The statement each knowledge-discovery principle makes (ai/retrieval/knowledge-discovery.md). */
export const KNOWLEDGE_DISCOVERY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<KnowledgeDiscoveryPrinciple, string>
> = Object.freeze({
  'by-ownership':
    'Candidate knowledge is discovered through its canonical owners, so every candidate is traceable to the one document that owns it.',
  'reads-never-authors':
    'Discovery finds what exists in the knowledge repository and never creates, restates, or infers knowledge that is not there.',
  'authority-aware':
    'Discovery finds not only the knowledge a task names but the higher-authority knowledge that governs it, so nothing relevant is missed.',
  'complete-over-canonical-sources':
    'Discovery draws only from the canonical knowledge repository, never from a copy, a cache treated as truth, or invented content.',
});

/**
 * A knowledge-discovery invariant (ai/retrieval/knowledge-discovery.md, "Invariants"): a guarantee that
 * always holds for discovery.
 */
export type KnowledgeDiscoveryInvariant =
  | 'candidate-is-canonical-owner'
  | 'yields-candidates-only'
  | 'read-only-across-layer'
  | 'discovering-is-inert';

/** The four knowledge-discovery invariants, in constitutional order; frozen. */
export const KNOWLEDGE_DISCOVERY_INVARIANTS: readonly KnowledgeDiscoveryInvariant[] = Object.freeze(
  [
    'candidate-is-canonical-owner',
    'yields-candidates-only',
    'read-only-across-layer',
    'discovering-is-inert',
  ],
);

/** The guarantee each knowledge-discovery invariant states (ai/retrieval/knowledge-discovery.md). */
export const KNOWLEDGE_DISCOVERY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<KnowledgeDiscoveryInvariant, string>
> = Object.freeze({
  'candidate-is-canonical-owner':
    'Every candidate is a single canonical owner of a concern, never a duplicate or a restatement.',
  'yields-candidates-only':
    'Discovery yields candidates only; it never selects, loads, or alters them.',
  'read-only-across-layer':
    'Discovery is read-only across the layer boundary and never writes to the knowledge repository.',
  'discovering-is-inert':
    'Discovering candidates never changes ownership, authority, governance, or business truth.',
});
