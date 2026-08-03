/**
 * Memory quality (ai/memory/memory-quality.md, OL-AI-MEMORY-MEMORY-QUALITY).
 *
 * The quality principles of memory - its freshness, completeness, and traceability - as immutable
 * definitions (ADR-0020). This concern owns the quality properties only; it never owns the measurement
 * or evaluation of memory (owned by the Evaluation namespace) and never assigns a numeric quality score
 * (implementation). Freshness, completeness, and traceability are structural properties that hold or do
 * not; they are never a numeric value.
 */

/**
 * A memory-quality principle (ai/memory/memory-quality.md, "Principles"). Each instantiates a memory
 * invariant owned by ai/memory/README.md.
 */
export type MemoryQualityPrinciple = 'fresh' | 'complete' | 'traceable' | 'property-not-score';

/** The four memory-quality principles, in constitutional order; frozen. */
export const MEMORY_QUALITY_PRINCIPLES: readonly MemoryQualityPrinciple[] = Object.freeze([
  'fresh',
  'complete',
  'traceable',
  'property-not-score',
]);

/** The statement each memory-quality principle makes (ai/memory/memory-quality.md). */
export const MEMORY_QUALITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<MemoryQualityPrinciple, string>
> = Object.freeze({
  fresh:
    'Retained memory reflects the current state of what it records and has not gone stale, so reasoning draws on current context.',
  complete:
    'Retained memory holds what its purpose requires, so the context offered to reasoning is not missing what the task needs.',
  traceable:
    'Each memory can be followed to the execution that formed it and the retention class that holds it, so no memory is relied on without provenance.',
  'property-not-score':
    'Freshness, completeness, and traceability are architectural properties of retained memory, never a numeric quality value.',
});

/**
 * A quality property of memory (ai/memory/memory-quality.md, "Specification"). Memory quality is
 * defined by exactly these structural properties; each holds or does not, and is never a numeric score.
 */
export type MemoryQualityProperty = 'freshness' | 'completeness' | 'traceability';

/** The three quality properties of memory, in constitutional order; frozen. */
export const MEMORY_QUALITY_PROPERTIES: readonly MemoryQualityProperty[] = Object.freeze([
  'freshness',
  'completeness',
  'traceability',
]);

/** What each memory quality property is (ai/memory/memory-quality.md). */
export const MEMORY_QUALITY_PROPERTY_DESCRIPTIONS: Readonly<Record<MemoryQualityProperty, string>> =
  Object.freeze({
    freshness:
      'A memory is fresh when it reflects the current state of what it records rather than a superseded one; freshness informs which memory prevails when memories conflict.',
    completeness:
      'A memory is complete when it holds what its purpose and retention class require, so the context made available to reasoning is not missing what the task needs.',
    traceability:
      'A memory is traceable when it can be followed to the execution that formed it, the type and retention class under which it is held, and its validation, so the whole memory has provenance.',
  });

/**
 * A memory-quality invariant (ai/memory/memory-quality.md, "Invariants"): a guarantee that always holds
 * for memory quality.
 */
export type MemoryQualityInvariant =
  | 'available-memory-is-fresh-complete-traceable'
  | 'properties-not-scores'
  | 'stale-or-incomplete-not-relied-on'
  | 'assessing-is-inert';

/** The four memory-quality invariants, in constitutional order; frozen. */
export const MEMORY_QUALITY_INVARIANTS: readonly MemoryQualityInvariant[] = Object.freeze([
  'available-memory-is-fresh-complete-traceable',
  'properties-not-scores',
  'stale-or-incomplete-not-relied-on',
  'assessing-is-inert',
]);

/** The guarantee each memory-quality invariant states (ai/memory/memory-quality.md). */
export const MEMORY_QUALITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<MemoryQualityInvariant, string>
> = Object.freeze({
  'available-memory-is-fresh-complete-traceable':
    'The memory made available to reasoning is fresh, complete for its purpose, and traceable to the execution that formed it.',
  'properties-not-scores':
    'Freshness, completeness, and traceability are structural properties, never numeric scores.',
  'stale-or-incomplete-not-relied-on':
    'A stale or incomplete memory is not relied on as if it were current or sufficient.',
  'assessing-is-inert':
    'Assessing quality never executes, reasons, retrieves knowledge, expresses, or changes ownership, authority, governance, or business truth.',
});
