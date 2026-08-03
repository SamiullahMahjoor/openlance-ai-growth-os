/**
 * Memory retrieval (ai/memory/memory-retrieval.md, OL-AI-MEMORY-MEMORY-RETRIEVAL).
 *
 * How retained memory becomes available to reasoning, and what makes a memory relevant, as immutable
 * definitions (ADR-0020). This concern owns memory availability and relevance only; it never owns the
 * retrieval of knowledge (owned by ai/retrieval/) nor defines an index, a ranking, or a search
 * mechanism (implementation). Making a concrete memory available for a concrete request, and assembling
 * the execution context, are runtime evaluations this concern does not own; they are deferred to
 * ai/retrieval/ and ai/runtime/. This concern states what availability and relevance are and the
 * invariants they always satisfy.
 */

/**
 * A memory-retrieval principle (ai/memory/memory-retrieval.md, "Principles"). Each instantiates a memory
 * invariant owned by ai/memory/README.md.
 */
export type MemoryRetrievalPrinciple =
  | 'only-relevant-available'
  | 'availability-is-deterministic'
  | 'offered-never-imposed-as-truth'
  | 'available-memory-is-grounded';

/** The four memory-retrieval principles, in constitutional order; frozen. */
export const MEMORY_RETRIEVAL_PRINCIPLES: readonly MemoryRetrievalPrinciple[] = Object.freeze([
  'only-relevant-available',
  'availability-is-deterministic',
  'offered-never-imposed-as-truth',
  'available-memory-is-grounded',
]);

/** The statement each memory-retrieval principle makes (ai/memory/memory-retrieval.md). */
export const MEMORY_RETRIEVAL_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryRetrievalPrinciple, string>
> = Object.freeze({
  'only-relevant-available':
    'The memory offered to reasoning is the memory pertinent to the task, not all retained context.',
  'availability-is-deterministic':
    'The same retained memory and the same request make the same memory available, with no randomness and no hidden step.',
  'offered-never-imposed-as-truth':
    'Retained memory is made available to reasoning as context, and it never replaces the retrieved knowledge that always prevails over it.',
  'available-memory-is-grounded':
    'Only validated, grounded memory is made available, so reasoning never draws on an invented memory.',
});

/**
 * A memory-retrieval invariant (ai/memory/memory-retrieval.md, "Invariants"): a guarantee that always
 * holds for memory availability.
 */
export type MemoryRetrievalInvariant =
  | 'relevant-grounded-fresh-consistent'
  | 'same-inputs-same-availability'
  | 'offered-as-context-never-replaces-knowledge'
  | 'availability-is-inert';

/** The four memory-retrieval invariants, in constitutional order; frozen. */
export const MEMORY_RETRIEVAL_INVARIANTS: readonly MemoryRetrievalInvariant[] = Object.freeze([
  'relevant-grounded-fresh-consistent',
  'same-inputs-same-availability',
  'offered-as-context-never-replaces-knowledge',
  'availability-is-inert',
]);

/** The guarantee each memory-retrieval invariant states (ai/memory/memory-retrieval.md). */
export const MEMORY_RETRIEVAL_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryRetrievalInvariant, string>
> = Object.freeze({
  'relevant-grounded-fresh-consistent':
    'Only relevant, grounded, fresh, and consistent memory is made available to reasoning.',
  'same-inputs-same-availability':
    'The same retained memory and the same request make the same memory available.',
  'offered-as-context-never-replaces-knowledge':
    'Available memory is offered as context and never replaces the knowledge that always prevails over it.',
  'availability-is-inert':
    'Making memory available never retrieves knowledge, assembles the execution context, reasons, or changes ownership, authority, governance, or business truth.',
});
