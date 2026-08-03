import { describe, expect, it } from 'vitest';

import {
  MEMORY_RETRIEVAL_INVARIANTS,
  MEMORY_RETRIEVAL_INVARIANT_DESCRIPTIONS,
  MEMORY_RETRIEVAL_PRINCIPLES,
  MEMORY_RETRIEVAL_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory retrieval (ai/memory/memory-retrieval.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_RETRIEVAL_PRINCIPLES).toEqual([
      'only-relevant-available',
      'availability-is-deterministic',
      'offered-never-imposed-as-truth',
      'available-memory-is-grounded',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(MEMORY_RETRIEVAL_INVARIANTS).toEqual([
      'relevant-grounded-fresh-consistent',
      'same-inputs-same-availability',
      'offered-as-context-never-replaces-knowledge',
      'availability-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MEMORY_RETRIEVAL_PRINCIPLES) {
      expect(MEMORY_RETRIEVAL_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_RETRIEVAL_INVARIANTS) {
      expect(MEMORY_RETRIEVAL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_RETRIEVAL_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETRIEVAL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETRIEVAL_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETRIEVAL_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
