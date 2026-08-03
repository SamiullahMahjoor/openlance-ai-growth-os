import { describe, expect, it } from 'vitest';

import {
  DEPENDENCY_RESOLUTION_INVARIANTS,
  DEPENDENCY_RESOLUTION_INVARIANT_DESCRIPTIONS,
  DEPENDENCY_RESOLUTION_PRINCIPLES,
  DEPENDENCY_RESOLUTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / dependency resolution (ai/retrieval/dependency-resolution.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(DEPENDENCY_RESOLUTION_PRINCIPLES).toEqual([
      'set-is-dependency-complete',
      'declared-not-inferred',
      'transitive-and-terminating',
      'preserves-authority',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(DEPENDENCY_RESOLUTION_INVARIANTS).toEqual([
      'every-declared-dependency-present',
      'follows-only-declared',
      'expansion-terminates',
      'each-owner-once',
      'resolving-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of DEPENDENCY_RESOLUTION_PRINCIPLES) {
      expect(DEPENDENCY_RESOLUTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of DEPENDENCY_RESOLUTION_INVARIANTS) {
      expect(DEPENDENCY_RESOLUTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(DEPENDENCY_RESOLUTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(DEPENDENCY_RESOLUTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(DEPENDENCY_RESOLUTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(DEPENDENCY_RESOLUTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
