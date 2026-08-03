/**
 * Memory types (ai/memory/memory-types.md, OL-AI-MEMORY-MEMORY-TYPES).
 *
 * The architectural categories into which retained context falls, as immutable definitions (ADR-0020).
 * This concern owns the categories only; it never defines a store, a structure, or a mechanism that
 * holds a type (implementation), nor the retention of a type (owned by ai/memory/memory-retention.md).
 * A category names a kind of retained context by scope and role, never a store.
 */

/**
 * A memory-types principle (ai/memory/memory-types.md, "Principles"). Each instantiates a memory
 * invariant owned by ai/memory/README.md.
 */
export type MemoryTypesPrinciple =
  'architectural-not-stores' | 'scoped-and-lifecycled' | 'runtime-state-not-truth' | 'extensible';

/** The four memory-types principles, in constitutional order; frozen. */
export const MEMORY_TYPES_PRINCIPLES: readonly MemoryTypesPrinciple[] = Object.freeze([
  'architectural-not-stores',
  'scoped-and-lifecycled',
  'runtime-state-not-truth',
  'extensible',
]);

/** The statement each memory-types principle makes (ai/memory/memory-types.md). */
export const MEMORY_TYPES_PRINCIPLE_DESCRIPTIONS: Readonly<Record<MemoryTypesPrinciple, string>> =
  Object.freeze({
    'architectural-not-stores':
      'A category names a kind of retained context by its scope and role; it is never a database, an index, a cache, or a structure.',
    'scoped-and-lifecycled':
      'Each category has a defined scope and purpose, and no memory of any category persists beyond that purpose.',
    'runtime-state-not-truth':
      'Every category retains runtime context and never owns, restates, or becomes business truth.',
    extensible:
      'New architectural categories may be added over time, additively, without changing the ones defined here.',
  });

/**
 * An architectural category of memory (ai/memory/memory-types.md, "Specification"). Retained context
 * falls into exactly these categories, each a kind of retained context distinguished by its scope and
 * role. The set may be extended additively as the memory model grows.
 */
export type MemoryType =
  'working' | 'session' | 'conversational' | 'episodic' | 'procedural' | 'organizational';

/** The six architectural categories of memory, in constitutional order; frozen. */
export const MEMORY_TYPES: readonly MemoryType[] = Object.freeze([
  'working',
  'session',
  'conversational',
  'episodic',
  'procedural',
  'organizational',
]);

/** What each memory category is (ai/memory/memory-types.md). */
export const MEMORY_TYPE_DESCRIPTIONS: Readonly<Record<MemoryType, string>> = Object.freeze({
  working:
    'The category of retained context an execution holds while it is acting, in service of the immediate task; its scope is delimited by the execution.',
  session:
    'The category of retained context that spans a single session across its executions and turns; its scope is delimited by the session.',
  conversational:
    'The category of retained context that carries the exchange between the AI and a counterpart across turns, so a later turn can draw on an earlier one.',
  episodic:
    'The category of retained context that records that a particular event or interaction occurred, so it can be recalled later as a past episode; never a business record.',
  procedural:
    'The category of retained context that retains how a task was carried out, so a later task can proceed consistently; never a governed procedure or policy.',
  organizational:
    'The category of retained context shared across sessions and agents at the level of the operating organization, so common context is available beyond a single session; never business truth.',
});

/**
 * A memory-types invariant (ai/memory/memory-types.md, "Invariants"): a guarantee that always holds for
 * the categories of memory.
 */
export type MemoryTypesInvariant =
  | 'named-by-scope-and-role'
  | 'category-holds-runtime-state'
  | 'category-scoped-and-lifecycled'
  | 'classifying-is-inert';

/** The four memory-types invariants, in constitutional order; frozen. */
export const MEMORY_TYPES_INVARIANTS: readonly MemoryTypesInvariant[] = Object.freeze([
  'named-by-scope-and-role',
  'category-holds-runtime-state',
  'category-scoped-and-lifecycled',
  'classifying-is-inert',
]);

/** The guarantee each memory-types invariant states (ai/memory/memory-types.md). */
export const MEMORY_TYPES_INVARIANT_DESCRIPTIONS: Readonly<Record<MemoryTypesInvariant, string>> =
  Object.freeze({
    'named-by-scope-and-role':
      'A category names a kind of retained context by scope and role, never a store, database, index, or cache.',
    'category-holds-runtime-state':
      'A memory of any category holds runtime state and never business truth, and knowledge always prevails over it.',
    'category-scoped-and-lifecycled':
      'A memory of any category is scoped and lifecycled, and nothing persists beyond its defined purpose.',
    'classifying-is-inert':
      'Classifying a memory by category never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
  });
