import { describe, expect, it } from 'vitest';

import {
  REPOSITORY_GROWTH_INVARIANTS,
  REPOSITORY_GROWTH_INVARIANT_DESCRIPTIONS,
  REPOSITORY_GROWTH_PRINCIPLES,
  REPOSITORY_GROWTH_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / repository growth (ai/evolution/repository-growth.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REPOSITORY_GROWTH_PRINCIPLES).toEqual([
      'growth-is-additive',
      'growth-applies-the-rules-it-does-not-own-them',
      'growth-preserves-structure',
      'growth-is-future-proof',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(REPOSITORY_GROWTH_INVARIANTS).toEqual([
      'grows-by-adding-documents-and-namespaces-never-enlarging-or-redesigning',
      'applies-the-growth-rules-and-future-expansion-never-redefines-them',
      'every-addition-follows-the-same-process-reference-and-specification-pattern',
      'additive-uniform-growth-scales-without-redesign-structure-change-is-constitutional',
      'modelling-growth-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of REPOSITORY_GROWTH_PRINCIPLES) {
      expect(REPOSITORY_GROWTH_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REPOSITORY_GROWTH_INVARIANTS) {
      expect(REPOSITORY_GROWTH_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REPOSITORY_GROWTH_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REPOSITORY_GROWTH_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REPOSITORY_GROWTH_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REPOSITORY_GROWTH_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
