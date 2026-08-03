import { describe, expect, it } from 'vitest';

import {
  MEMORY_CONSISTENCY_INVARIANTS,
  MEMORY_CONSISTENCY_INVARIANT_DESCRIPTIONS,
  MEMORY_CONSISTENCY_PRINCIPLES,
  MEMORY_CONSISTENCY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory consistency (ai/memory/memory-consistency.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_CONSISTENCY_PRINCIPLES).toEqual([
      'no-unsurfaced-contradiction',
      'knowledge-prevails-over-memory',
      'conflict-is-surfaced-not-buried',
      'same-request-yields-consistent-memory',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_CONSISTENCY_INVARIANTS).toEqual([
      'no-unsurfaced-contradiction-among-records',
      'knowledge-prevails-memory-yields',
      'unresolved-withheld-and-escalated',
      'single-valued-per-request',
      'consistency-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MEMORY_CONSISTENCY_PRINCIPLES) {
      expect(MEMORY_CONSISTENCY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_CONSISTENCY_INVARIANTS) {
      expect(MEMORY_CONSISTENCY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_CONSISTENCY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_CONSISTENCY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_CONSISTENCY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_CONSISTENCY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
