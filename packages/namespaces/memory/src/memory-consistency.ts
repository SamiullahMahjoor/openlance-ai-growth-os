/**
 * Memory consistency (ai/memory/memory-consistency.md, OL-AI-MEMORY-MEMORY-CONSISTENCY).
 *
 * How memory is kept internally consistent, and how a conflict is handled, as immutable definitions
 * (ADR-0020). This concern owns memory consistency and conflict handling only; it never owns the
 * validation of remembered information (owned by ai/memory/memory-validation.md) nor the escalation of
 * an unresolved conflict (owned by ai/governance/escalation.md). Detecting a concrete conflict is a
 * runtime evaluation this concern does not own. This concern states what consistency and conflict
 * handling are and the invariants they always satisfy.
 */

/**
 * A memory-consistency principle (ai/memory/memory-consistency.md, "Principles"). Each instantiates a
 * memory invariant owned by ai/memory/README.md.
 */
export type MemoryConsistencyPrinciple =
  | 'no-unsurfaced-contradiction'
  | 'knowledge-prevails-over-memory'
  | 'conflict-is-surfaced-not-buried'
  | 'same-request-yields-consistent-memory';

/** The four memory-consistency principles, in constitutional order; frozen. */
export const MEMORY_CONSISTENCY_PRINCIPLES: readonly MemoryConsistencyPrinciple[] = Object.freeze([
  'no-unsurfaced-contradiction',
  'knowledge-prevails-over-memory',
  'conflict-is-surfaced-not-buried',
  'same-request-yields-consistent-memory',
]);

/** The statement each memory-consistency principle makes (ai/memory/memory-consistency.md). */
export const MEMORY_CONSISTENCY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryConsistencyPrinciple, string>
> = Object.freeze({
  'no-unsurfaced-contradiction':
    'Retained memory does not carry two records that contradict each other without the contradiction being surfaced.',
  'knowledge-prevails-over-memory':
    'Where a memory conflicts with the knowledge repository, the knowledge repository prevails, and the memory yields.',
  'conflict-is-surfaced-not-buried':
    'A conflict encountered in memory is detected and made explicit, so it is resolved rather than relied on.',
  'same-request-yields-consistent-memory':
    'Reasoning is never offered conflicting memories for the same request.',
});

/**
 * A memory-consistency invariant (ai/memory/memory-consistency.md, "Invariants"): a guarantee that
 * always holds for the consistency model.
 */
export type MemoryConsistencyInvariant =
  | 'no-unsurfaced-contradiction-among-records'
  | 'knowledge-prevails-memory-yields'
  | 'unresolved-withheld-and-escalated'
  | 'single-valued-per-request'
  | 'consistency-is-inert';

/** The five memory-consistency invariants, in constitutional order; frozen. */
export const MEMORY_CONSISTENCY_INVARIANTS: readonly MemoryConsistencyInvariant[] = Object.freeze([
  'no-unsurfaced-contradiction-among-records',
  'knowledge-prevails-memory-yields',
  'unresolved-withheld-and-escalated',
  'single-valued-per-request',
  'consistency-is-inert',
]);

/** The guarantee each memory-consistency invariant states (ai/memory/memory-consistency.md). */
export const MEMORY_CONSISTENCY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryConsistencyInvariant, string>
> = Object.freeze({
  'no-unsurfaced-contradiction-among-records':
    'Memory holds no unsurfaced contradiction among its records.',
  'knowledge-prevails-memory-yields':
    'Where a memory conflicts with the knowledge repository, the knowledge repository prevails and the memory yields.',
  'unresolved-withheld-and-escalated':
    'A conflict that cannot be resolved within the rules is withheld from reasoning and escalated, never resolved by invention.',
  'single-valued-per-request':
    'The memory made available for a given request is single-valued, never conflicting.',
  'consistency-is-inert':
    'Maintaining consistency never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
