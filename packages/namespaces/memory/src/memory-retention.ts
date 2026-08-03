/**
 * Memory retention (ai/memory/memory-retention.md, OL-AI-MEMORY-MEMORY-RETENTION).
 *
 * The retention classifications of memory, ordered by how long a memory is held by purpose, and the
 * pure predicate that ordering supports, as an immutable domain model (ADR-0020). This concern owns the
 * retention classifications, expiration, and governed removal only; it never defines a time period, a
 * storage policy, a database, or a store (implementation), nor the session and execution boundaries a
 * scope is delimited by (owned by ai/runtime/). The classes describe how long a memory is held by
 * purpose, never by a fixed period.
 */

/**
 * A memory-retention principle (ai/memory/memory-retention.md, "Principles"). Each instantiates a
 * memory invariant owned by ai/memory/README.md.
 */
export type MemoryRetentionPrinciple =
  'classified-not-timed' | 'bounded-by-purpose' | 'removal-is-governed' | 'permanence-is-not-truth';

/** The four memory-retention principles, in constitutional order; frozen. */
export const MEMORY_RETENTION_PRINCIPLES: readonly MemoryRetentionPrinciple[] = Object.freeze([
  'classified-not-timed',
  'bounded-by-purpose',
  'removal-is-governed',
  'permanence-is-not-truth',
]);

/** The statement each memory-retention principle makes (ai/memory/memory-retention.md). */
export const MEMORY_RETENTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryRetentionPrinciple, string>
> = Object.freeze({
  'classified-not-timed':
    'Retention is described by architectural class, never by a duration, schedule, or storage policy.',
  'bounded-by-purpose':
    'A memory is retained only as long as its class and purpose require, and nothing persists beyond that purpose.',
  'removal-is-governed':
    'A memory expires and is removed within the governing rules, never arbitrarily and never by promotion into the knowledge repository.',
  'permanence-is-not-truth':
    'Even permanent retained context remains runtime state, and knowledge always prevails over it.',
});

/**
 * A retention class of memory (ai/memory/memory-retention.md, "Specification"). A memory is retained
 * under exactly one class. The classes are ordered by how long a memory is held by purpose: Temporary
 * is the shortest-lived class (within an execution), then Session, then Long-term (across sessions),
 * then Permanent (held indefinitely).
 */
export type MemoryRetentionClass = 'temporary' | 'session' | 'long-term' | 'permanent';

/** The four retention classes, from shortest-lived to indefinitely held; frozen. */
export const MEMORY_RETENTION_CLASSES: readonly MemoryRetentionClass[] = Object.freeze([
  'temporary',
  'session',
  'long-term',
  'permanent',
]);

/** What each retention class holds (ai/memory/memory-retention.md). */
export const MEMORY_RETENTION_CLASS_DESCRIPTIONS: Readonly<Record<MemoryRetentionClass, string>> =
  Object.freeze({
    temporary:
      'Retained context held only for the immediate purpose within an execution, released as soon as that purpose ends; the shortest-lived class, it never outlives the execution.',
    session:
      'Retained context held for the duration of a single session and released at its close, when any state meant to outlive the session is handed on.',
    'long-term':
      'Retained context held across sessions for a bounded, purposeful period, subject to expiration and revalidation, and removed when its purpose ends.',
    permanent:
      'Retained context held indefinitely as durable retained state, subject to governed removal and never overriding a canonical knowledge source; permanence is a retention class, not a claim to truth.',
  });

const RETENTION_RANK: Readonly<Record<MemoryRetentionClass, number>> = {
  temporary: 0,
  session: 1,
  'long-term': 2,
  permanent: 3,
};

/**
 * Whether retention class `a` holds a memory at least as long, by purpose, as class `b`, by the
 * constitutional ordering from the shortest-lived Temporary class to the indefinitely held Permanent
 * class (ai/memory/memory-retention.md, "Specification").
 */
export const retentionAtLeast = (a: MemoryRetentionClass, b: MemoryRetentionClass): boolean =>
  RETENTION_RANK[a] >= RETENTION_RANK[b];

/**
 * A memory-retention invariant (ai/memory/memory-retention.md, "Invariants"): a guarantee that always
 * holds for the retention model.
 */
export type MemoryRetentionInvariant =
  | 'class-not-duration'
  | 'retained-within-class-and-purpose'
  | 'expires-and-removed-only-under-rules'
  | 'permanent-is-runtime-state'
  | 'retention-is-inert';

/** The five memory-retention invariants, in constitutional order; frozen. */
export const MEMORY_RETENTION_INVARIANTS: readonly MemoryRetentionInvariant[] = Object.freeze([
  'class-not-duration',
  'retained-within-class-and-purpose',
  'expires-and-removed-only-under-rules',
  'permanent-is-runtime-state',
  'retention-is-inert',
]);

/** The guarantee each memory-retention invariant states (ai/memory/memory-retention.md). */
export const MEMORY_RETENTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryRetentionInvariant, string>
> = Object.freeze({
  'class-not-duration':
    'Retention is described by architectural class, never by a duration, schedule, or storage policy.',
  'retained-within-class-and-purpose':
    'A memory is retained only within its class and purpose, and nothing persists beyond that purpose.',
  'expires-and-removed-only-under-rules':
    'A memory expires and is removed only within the governing rules, and never by promotion into the knowledge repository.',
  'permanent-is-runtime-state':
    'Even permanent retained context remains runtime state, and knowledge always prevails over it.',
  'retention-is-inert':
    'Classifying retention or removing a memory never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
