import { describe, expect, it } from 'vitest';

import {
  RETRIEVAL_BOUNDARIES,
  RETRIEVAL_BOUNDARIES_INVARIANTS,
  RETRIEVAL_BOUNDARIES_INVARIANT_DESCRIPTIONS,
  RETRIEVAL_BOUNDARIES_PRINCIPLES,
  RETRIEVAL_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_BOUNDARY_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / retrieval boundaries (ai/retrieval/retrieval-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(RETRIEVAL_BOUNDARIES_PRINCIPLES).toEqual([
      'determines-not-load-or-execute',
      'consumes-truth-never-owns',
      'stays-within-governance',
      'minimal-and-complete',
    ]);
  });

  it('defines exactly the five architectural boundaries in constitutional order', () => {
    expect(RETRIEVAL_BOUNDARIES).toEqual([
      'determination',
      'truth',
      'governance',
      'layer',
      'technology',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(RETRIEVAL_BOUNDARIES_INVARIANTS).toEqual([
      'produces-validated-result-never-loads',
      'never-writes-or-promotes-truth',
      'only-governance-permitted',
      'consumes-one-directionally',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of RETRIEVAL_BOUNDARIES_PRINCIPLES) {
      expect(RETRIEVAL_BOUNDARIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_BOUNDARIES) {
      expect(RETRIEVAL_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_BOUNDARIES_INVARIANTS) {
      expect(RETRIEVAL_BOUNDARIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RETRIEVAL_BOUNDARIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_BOUNDARIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_BOUNDARIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_BOUNDARIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
