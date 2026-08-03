/**
 * Memory boundaries (ai/memory/memory-boundaries.md, OL-AI-MEMORY-MEMORY-BOUNDARIES).
 *
 * What memory never owns, and where memory stops, as immutable definitions (ADR-0020). This concern
 * owns the architectural boundaries of memory only; it never defines the governance rules that bound
 * memory (owned by ai/governance/) nor the concerns of the surrounding namespaces (owned by them). The
 * boundaries are architectural; how they are enforced is the runtime's execution, outside this concern.
 */

/**
 * A memory-boundaries principle (ai/memory/memory-boundaries.md, "Principles"). Each instantiates a
 * memory invariant owned by ai/memory/README.md.
 */
export type MemoryBoundariesPrinciple =
  | 'retains-not-execute-retrieve-reason-express'
  | 'runtime-state-never-truth'
  | 'never-invents-never-persists-beyond-purpose'
  | 'stays-within-governance';

/** The four memory-boundaries principles, in constitutional order; frozen. */
export const MEMORY_BOUNDARIES_PRINCIPLES: readonly MemoryBoundariesPrinciple[] = Object.freeze([
  'retains-not-execute-retrieve-reason-express',
  'runtime-state-never-truth',
  'never-invents-never-persists-beyond-purpose',
  'stays-within-governance',
]);

/** The statement each memory-boundaries principle makes (ai/memory/memory-boundaries.md). */
export const MEMORY_BOUNDARIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryBoundariesPrinciple, string>
> = Object.freeze({
  'retains-not-execute-retrieve-reason-express':
    'Memory holds and offers retained context and stops there; execution, knowledge retrieval, reasoning, and expression belong to other namespaces.',
  'runtime-state-never-truth':
    'Memory retains runtime context and never owns, restates, replaces, or becomes business truth, and knowledge always prevails over it.',
  'never-invents-never-persists-beyond-purpose':
    'Memory holds only what was actually formed, only within its scope and retention.',
  'stays-within-governance':
    'Retention, removal, and change of memory occur within the governing rules, and memory escalates a conflict it cannot resolve rather than invent one.',
});

/**
 * An architectural boundary memory operates within (ai/memory/memory-boundaries.md, "Specification").
 * Memory operates within exactly these six boundaries; each names a concern owned elsewhere that memory
 * never crosses.
 */
export type MemoryBoundary =
  'truth' | 'knowledge' | 'reasoning' | 'execution' | 'governance' | 'implementation';

/** The six architectural boundaries of memory, in constitutional order; frozen. */
export const MEMORY_BOUNDARIES: readonly MemoryBoundary[] = Object.freeze([
  'truth',
  'knowledge',
  'reasoning',
  'execution',
  'governance',
  'implementation',
]);

/** What each memory boundary delimits, and its owner (ai/memory/memory-boundaries.md). */
export const MEMORY_BOUNDARY_DESCRIPTIONS: Readonly<Record<MemoryBoundary, string>> = Object.freeze(
  {
    truth:
      'Memory holds runtime state and never owns, restates, replaces, invents, or amends business truth, which is owned by the knowledge repository and always prevails over memory; nothing in memory is automatically promoted into the knowledge repository.',
    knowledge:
      'Memory offers retained context and never discovers, selects, or loads knowledge; those are owned by ai/retrieval/, and the assembly of the execution context is owned by ai/runtime/context-loading.md.',
    reasoning:
      'Memory provides prior context and never reasons, concludes, or decides; those are owned by ai/reasoning/.',
    execution:
      'Memory is retained and made available within the session and execution lifecycles owned by ai/runtime/, and it never orchestrates, schedules, or executes.',
    governance:
      'Memory applies the governing rules for retention, removal, and change and never defines them; those are owned by ai/governance/, and it escalates a conflict it cannot resolve rather than invent a resolution.',
    implementation:
      'Memory is a model of retained context, never a store, a database, an index, a cache, an embedding, a vector search, a persistence technology, a learning or training process, an algorithm, or code.',
  },
);

/**
 * A memory-boundaries invariant (ai/memory/memory-boundaries.md, "Invariants"): a guarantee that always
 * holds for the boundaries of memory.
 */
export type MemoryBoundariesInvariant =
  | 'holds-runtime-state-not-truth'
  | 'never-retrieves-reasons-executes'
  | 'nothing-beyond-scope-nothing-promoted'
  | 'escalates-never-invents-resolution'
  | 'enforcing-a-boundary-is-inert';

/** The five memory-boundaries invariants, in constitutional order; frozen. */
export const MEMORY_BOUNDARIES_INVARIANTS: readonly MemoryBoundariesInvariant[] = Object.freeze([
  'holds-runtime-state-not-truth',
  'never-retrieves-reasons-executes',
  'nothing-beyond-scope-nothing-promoted',
  'escalates-never-invents-resolution',
  'enforcing-a-boundary-is-inert',
]);

/** The guarantee each memory-boundaries invariant states (ai/memory/memory-boundaries.md). */
export const MEMORY_BOUNDARIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryBoundariesInvariant, string>
> = Object.freeze({
  'holds-runtime-state-not-truth':
    'Memory holds runtime state and never owns, restates, replaces, invents, or amends business truth.',
  'never-retrieves-reasons-executes':
    'Memory never retrieves knowledge, assembles the execution context, reasons, or executes.',
  'nothing-beyond-scope-nothing-promoted':
    'Memory holds nothing beyond its scope and retention, and nothing in memory is automatically promoted into the knowledge repository.',
  'escalates-never-invents-resolution':
    'Memory concludes no conflict by invention; it escalates rather than exceed the governing rules.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
