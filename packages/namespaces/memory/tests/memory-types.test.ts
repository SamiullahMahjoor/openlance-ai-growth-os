import { describe, expect, it } from 'vitest';

import {
  MEMORY_TYPES,
  MEMORY_TYPES_INVARIANTS,
  MEMORY_TYPES_INVARIANT_DESCRIPTIONS,
  MEMORY_TYPES_PRINCIPLES,
  MEMORY_TYPES_PRINCIPLE_DESCRIPTIONS,
  MEMORY_TYPE_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory types (ai/memory/memory-types.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_TYPES_PRINCIPLES).toEqual([
      'architectural-not-stores',
      'scoped-and-lifecycled',
      'runtime-state-not-truth',
      'extensible',
    ]);
  });

  it('defines exactly the six architectural categories in constitutional order', () => {
    expect(MEMORY_TYPES).toEqual([
      'working',
      'session',
      'conversational',
      'episodic',
      'procedural',
      'organizational',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(MEMORY_TYPES_INVARIANTS).toEqual([
      'named-by-scope-and-role',
      'category-holds-runtime-state',
      'category-scoped-and-lifecycled',
      'classifying-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of MEMORY_TYPES_PRINCIPLES) {
      expect(MEMORY_TYPES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_TYPES) {
      expect(MEMORY_TYPE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_TYPES_INVARIANTS) {
      expect(MEMORY_TYPES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_TYPES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_TYPES)).toBe(true);
    expect(Object.isFrozen(MEMORY_TYPES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_TYPES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_TYPE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_TYPES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
