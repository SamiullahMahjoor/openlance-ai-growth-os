import { describe, expect, it } from 'vitest';

import {
  MEMORY_QUALITY_INVARIANTS,
  MEMORY_QUALITY_INVARIANT_DESCRIPTIONS,
  MEMORY_QUALITY_PRINCIPLES,
  MEMORY_QUALITY_PRINCIPLE_DESCRIPTIONS,
  MEMORY_QUALITY_PROPERTIES,
  MEMORY_QUALITY_PROPERTY_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory quality (ai/memory/memory-quality.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_QUALITY_PRINCIPLES).toEqual([
      'fresh',
      'complete',
      'traceable',
      'property-not-score',
    ]);
  });

  it('defines exactly the three quality properties in constitutional order', () => {
    expect(MEMORY_QUALITY_PROPERTIES).toEqual(['freshness', 'completeness', 'traceability']);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(MEMORY_QUALITY_INVARIANTS).toEqual([
      'available-memory-is-fresh-complete-traceable',
      'properties-not-scores',
      'stale-or-incomplete-not-relied-on',
      'assessing-is-inert',
    ]);
  });

  it('gives every principle, property, and invariant a non-empty description', () => {
    for (const id of MEMORY_QUALITY_PRINCIPLES) {
      expect(MEMORY_QUALITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_QUALITY_PROPERTIES) {
      expect(MEMORY_QUALITY_PROPERTY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_QUALITY_INVARIANTS) {
      expect(MEMORY_QUALITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_QUALITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_QUALITY_PROPERTIES)).toBe(true);
    expect(Object.isFrozen(MEMORY_QUALITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_QUALITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_QUALITY_PROPERTY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_QUALITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
