/**
 * The Memory namespace, namespace-wide truth (ai/memory/README.md, OL-AI-MEMORY-README;
 * ai/memory/memory.md, OL-AI-MEMORY-MEMORY).
 *
 * The memory invariants every memory concern upholds, and the canonical inventory of the memory
 * concerns, as immutable definitions (ADR-0020). The namespace is a Pure Domain Model of the
 * retained-context layer: it states how retained context is formed, held, made available, kept
 * consistent, and removed, and it never executes memory, never stores, and never defines a database,
 * an index, a cache, an embedding, a vector search, a persistence technology, or code
 * (ai/memory/README.md). Memory is deterministic, repeatable, and scalable: the same retained memory
 * and the same request make the same remembered context available, and the model holds for one memory
 * or millions (ai/memory/memory.md). It holds runtime state and never business truth, and knowledge
 * always prevails over memory.
 */

/**
 * A memory invariant: a permanent guarantee every memory document upholds and no memory may violate
 * (ai/memory/README.md, "Memory Invariants"). Every memory concern's principles instantiate these.
 */
export type MemoryInvariant =
  | 'deterministic'
  | 'holds-runtime-state-not-truth'
  | 'never-invents'
  | 'never-replaces-knowledge'
  | 'scoped-and-lifecycled'
  | 'never-promoted-to-truth'
  | 'consistent'
  | 'governed'
  | 'repeatable-and-scalable';

/** The nine memory invariants, in constitutional order; frozen. */
export const MEMORY_INVARIANTS: readonly MemoryInvariant[] = Object.freeze([
  'deterministic',
  'holds-runtime-state-not-truth',
  'never-invents',
  'never-replaces-knowledge',
  'scoped-and-lifecycled',
  'never-promoted-to-truth',
  'consistent',
  'governed',
  'repeatable-and-scalable',
]);

/** The guarantee each memory invariant states (ai/memory/README.md, "Memory Invariants"). */
export const MEMORY_INVARIANT_DESCRIPTIONS: Readonly<Record<MemoryInvariant, string>> =
  Object.freeze({
    deterministic:
      'The same retained memory, the same request, the same retrieved knowledge, and the same governing rules make the same remembered context available, with no randomness and no hidden step.',
    'holds-runtime-state-not-truth':
      'Memory retains context; it never owns, restates, or becomes the truth owned by the knowledge repository.',
    'never-invents':
      'Memory retains and provides what was actually formed; it never fabricates a fact or a memory.',
    'never-replaces-knowledge':
      'Knowledge always prevails over memory, and persistent memory never overrides a canonical knowledge source.',
    'scoped-and-lifecycled':
      'Every memory has a defined type, retention class, and purpose, and nothing persists beyond that purpose.',
    'never-promoted-to-truth':
      'Nothing in memory is automatically promoted into the knowledge repository; a change to business truth is a human-governed knowledge contribution, never a memory side effect.',
    consistent:
      'Memory holds no unsurfaced contradiction, and where memory conflicts with knowledge, knowledge prevails.',
    governed:
      'Retention, removal, replacement, and change of memory occur within the rules owned by ai/governance/.',
    'repeatable-and-scalable':
      'The same memory reproduces the same remembered context, and the model holds for one memory or millions.',
  });

/**
 * A memory concern: one aspect of the memory model, each owned by exactly one document
 * (ai/memory/memory.md, "The Memory Concerns"). This is the namespace inventory identity; the model of
 * each concern is owned by its named document and this package's corresponding module.
 */
export type MemoryConcern =
  | 'memory-lifecycle'
  | 'memory-workflow'
  | 'memory-types'
  | 'memory-retention'
  | 'memory-retrieval'
  | 'memory-consistency'
  | 'memory-validation'
  | 'memory-quality'
  | 'memory-boundaries'
  | 'memory-evolution';

/** The ten memory concerns, in inventory order; frozen. */
export const MEMORY_CONCERNS: readonly MemoryConcern[] = Object.freeze([
  'memory-lifecycle',
  'memory-workflow',
  'memory-types',
  'memory-retention',
  'memory-retrieval',
  'memory-consistency',
  'memory-validation',
  'memory-quality',
  'memory-boundaries',
  'memory-evolution',
]);

/** What each memory concern owns (ai/memory/memory.md, "The Memory Concerns"). */
export const MEMORY_CONCERN_DESCRIPTIONS: Readonly<Record<MemoryConcern, string>> = Object.freeze({
  'memory-lifecycle': 'The phases of memory, from formation to removal.',
  'memory-workflow':
    'The required order of memory operations, from receiving an operation to governed removal.',
  'memory-types':
    'The architectural categories of memory: working, session, conversational, episodic, procedural, and organizational memory.',
  'memory-retention':
    'The retention classifications, temporary, session, long-term, and permanent, governed removal, and memory expiration.',
  'memory-retrieval': 'How retained memory becomes available to reasoning, and memory relevance.',
  'memory-consistency': 'The consistency of memory, and memory conflict handling.',
  'memory-validation':
    'The validation of remembered information: that memory is grounded and never invented.',
  'memory-quality':
    'The quality principles of memory: memory freshness, memory completeness, and memory traceability.',
  'memory-boundaries': 'What memory never owns, and where memory stops.',
  'memory-evolution': 'How memory changes over time, and memory replacement.',
});
