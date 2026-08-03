/**
 * Memory lifecycle (ai/memory/memory-lifecycle.md, OL-AI-MEMORY-MEMORY-LIFECYCLE).
 *
 * The ordered phases a single memory passes through, from formation to removal, and the pure predicate
 * the constitutional ordering supports, as an immutable domain model (ADR-0020). This concern owns the
 * memory lifecycle only; it defers the ordered operations within it to ai/memory/memory-workflow.md and
 * the session and execution lifecycles a memory is scoped against to ai/runtime/. A lifecycle phase
 * never executes or stores.
 */

/**
 * A memory-lifecycle principle (ai/memory/memory-lifecycle.md, "Principles"). Each instantiates a
 * memory invariant owned by ai/memory/README.md.
 */
export type MemoryLifecyclePrinciple =
  | 'defined-beginning-and-end'
  | 'grounded-at-formation'
  | 'retention-is-scoped'
  | 'yields-to-knowledge-throughout';

/** The four memory-lifecycle principles, in constitutional order; frozen. */
export const MEMORY_LIFECYCLE_PRINCIPLES: readonly MemoryLifecyclePrinciple[] = Object.freeze([
  'defined-beginning-and-end',
  'grounded-at-formation',
  'retention-is-scoped',
  'yields-to-knowledge-throughout',
]);

/** The statement each memory-lifecycle principle makes (ai/memory/memory-lifecycle.md). */
export const MEMORY_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryLifecyclePrinciple, string>
> = Object.freeze({
  'defined-beginning-and-end':
    'A memory begins with formation and ends with removal; nothing persists beyond its defined purpose.',
  'grounded-at-formation':
    'A memory comes into being grounded in what was actually formed, never invented.',
  'retention-is-scoped':
    'A memory is held only within its retention class and purpose, and it is removed when that purpose ends.',
  'yields-to-knowledge-throughout':
    'At every phase, a memory holds runtime state and never business truth, and knowledge always prevails over it.',
});

/**
 * A phase of a single memory (ai/memory/memory-lifecycle.md, "Specification"). A memory passes through
 * these ordered phases, and Formation precedes Retention, which precedes Removal.
 */
export type MemoryLifecyclePhase = 'formation' | 'retention' | 'removal';

/** The three memory lifecycle phases, in constitutional order; frozen. Each phase precedes the next. */
export const MEMORY_LIFECYCLE_PHASES: readonly MemoryLifecyclePhase[] = Object.freeze([
  'formation',
  'retention',
  'removal',
]);

/** What happens in each memory lifecycle phase (ai/memory/memory-lifecycle.md). */
export const MEMORY_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<Record<MemoryLifecyclePhase, string>> =
  Object.freeze({
    formation:
      'A memory is formed from an execution and validated for grounding, and classified by its architectural type and retention class; it comes into being grounded, scoped, and never invented.',
    retention:
      'The memory is held under its retention class, scoped and lifecycled; during retention it is available to reasoning on recall, kept consistent, and may be revalidated or replaced, and it is never promoted to business truth.',
    removal:
      "The memory's retention ends and it is removed within the governing rules, because it expired, was replaced, or its purpose ended; removal leaves the knowledge repository untouched.",
  });

const LIFECYCLE_PHASE_RANK: Readonly<Record<MemoryLifecyclePhase, number>> = {
  formation: 0,
  retention: 1,
  removal: 2,
};

/**
 * Whether phase `a` is at or after phase `b` in the memory lifecycle, by the constitutional ordering in
 * which Formation precedes Retention, which precedes Removal (ai/memory/memory-lifecycle.md,
 * "Specification").
 */
export const lifecyclePhaseAtOrAfter = (
  a: MemoryLifecyclePhase,
  b: MemoryLifecyclePhase,
): boolean => LIFECYCLE_PHASE_RANK[a] >= LIFECYCLE_PHASE_RANK[b];

/**
 * A memory-lifecycle invariant (ai/memory/memory-lifecycle.md, "Invariants"): a guarantee that always
 * holds for the memory lifecycle.
 */
export type MemoryLifecycleInvariant =
  | 'one-lifecycle-per-memory'
  | 'formation-precedes-retention-precedes-removal'
  | 'grounded-and-never-truth'
  | 'retention-activities-preserve-identity'
  | 'lifecycle-is-inert';

/** The five memory-lifecycle invariants, in constitutional order; frozen. */
export const MEMORY_LIFECYCLE_INVARIANTS: readonly MemoryLifecycleInvariant[] = Object.freeze([
  'one-lifecycle-per-memory',
  'formation-precedes-retention-precedes-removal',
  'grounded-and-never-truth',
  'retention-activities-preserve-identity',
  'lifecycle-is-inert',
]);

/** The guarantee each memory-lifecycle invariant states (ai/memory/memory-lifecycle.md). */
export const MEMORY_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-memory':
    'A memory holds exactly one lifecycle, from one formation to one removal.',
  'formation-precedes-retention-precedes-removal':
    'The Formation phase precedes Retention, which precedes Removal.',
  'grounded-and-never-truth':
    'A memory is grounded at Formation and never invented, and it never becomes business truth at any phase.',
  'retention-activities-preserve-identity':
    "During Retention, recall, revalidation, and replacement never change the memory's identity or promote it to truth.",
  'lifecycle-is-inert':
    'The lifecycle never executes, reasons, retrieves knowledge, expresses, or alters ownership, authority, governance, or business truth.',
});
