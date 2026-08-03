/**
 * Memory evolution (ai/memory/memory-evolution.md, OL-AI-MEMORY-MEMORY-EVOLUTION).
 *
 * How retained memory changes over time, including revalidation and replacement, as immutable
 * definitions (ADR-0020). This concern owns memory evolution and replacement only; it never defines any
 * learning, training, or optimization (implementation) nor the evolution of the AI layer's documents
 * (owned by ai/CONTRIBUTING.md and ai/architecture/repository-evolution.md). Applying a concrete change
 * is a runtime evaluation this concern does not own. This concern states how memory changes and the
 * invariants it always satisfies. Memory does not learn, train, or optimize itself.
 */

/**
 * A memory-evolution principle (ai/memory/memory-evolution.md, "Principles"). Each instantiates a memory
 * invariant owned by ai/memory/README.md.
 */
export type MemoryEvolutionPrinciple =
  | 'changes-by-governed-record-not-learning'
  | 'newer-validated-supersedes-older'
  | 'change-never-creates-truth'
  | 'grounded-and-traceable';

/** The four memory-evolution principles, in constitutional order; frozen. */
export const MEMORY_EVOLUTION_PRINCIPLES: readonly MemoryEvolutionPrinciple[] = Object.freeze([
  'changes-by-governed-record-not-learning',
  'newer-validated-supersedes-older',
  'change-never-creates-truth',
  'grounded-and-traceable',
]);

/** The statement each memory-evolution principle makes (ai/memory/memory-evolution.md). */
export const MEMORY_EVOLUTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryEvolutionPrinciple, string>
> = Object.freeze({
  'changes-by-governed-record-not-learning':
    'Retained memory changes because a newer memory is recorded or an older one is removed within the governing rules, never because the memory learns, trains, or optimizes itself.',
  'newer-validated-supersedes-older':
    'Where a newer, validated memory records the current state, it replaces the superseded one, so retained context stays fresh.',
  'change-never-creates-truth':
    'A change to retained memory never creates, amends, or promotes business truth, which is owned by the knowledge repository and always prevails over memory.',
  'grounded-and-traceable':
    'Every changed or replacing memory is validated and traceable, so evolution never introduces an invented memory.',
});

/**
 * A memory-evolution invariant (ai/memory/memory-evolution.md, "Invariants"): a guarantee that always
 * holds for the evolution model.
 */
export type MemoryEvolutionInvariant =
  | 'changes-only-by-governed-record-or-removal'
  | 'newer-validated-supersedes'
  | 'changed-memory-validated-and-traceable'
  | 'no-change-creates-truth'
  | 'evolving-is-inert';

/** The five memory-evolution invariants, in constitutional order; frozen. */
export const MEMORY_EVOLUTION_INVARIANTS: readonly MemoryEvolutionInvariant[] = Object.freeze([
  'changes-only-by-governed-record-or-removal',
  'newer-validated-supersedes',
  'changed-memory-validated-and-traceable',
  'no-change-creates-truth',
  'evolving-is-inert',
]);

/** The guarantee each memory-evolution invariant states (ai/memory/memory-evolution.md). */
export const MEMORY_EVOLUTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryEvolutionInvariant, string>
> = Object.freeze({
  'changes-only-by-governed-record-or-removal':
    'Retained memory changes only by governed record or removal, never by learning, training, or optimization.',
  'newer-validated-supersedes':
    'A newer, validated memory that records the current state supersedes the older one.',
  'changed-memory-validated-and-traceable':
    'A changed or replacing memory is validated and traceable, and never invented.',
  'no-change-creates-truth': 'No change to memory creates, amends, or promotes business truth.',
  'evolving-is-inert':
    'Evolving memory never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
