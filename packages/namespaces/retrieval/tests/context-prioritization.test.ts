import { describe, expect, it } from 'vitest';

import {
  CONTEXT_PRIORITIZATION_INVARIANTS,
  CONTEXT_PRIORITIZATION_INVARIANT_DESCRIPTIONS,
  CONTEXT_PRIORITIZATION_PRINCIPLES,
  CONTEXT_PRIORITIZATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / context prioritization (ai/retrieval/context-prioritization.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(CONTEXT_PRIORITIZATION_PRINCIPLES).toEqual([
      'authority-orders-first',
      'loading-tiers-frame-priority',
      'relevance-orders-within-a-level',
      'deterministic',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(CONTEXT_PRIORITIZATION_INVARIANTS).toEqual([
      'higher-authority-ordered-above',
      'applies-tiers-never-redefines',
      'deterministic-over-set',
      'orders-only-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of CONTEXT_PRIORITIZATION_PRINCIPLES) {
      expect(CONTEXT_PRIORITIZATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CONTEXT_PRIORITIZATION_INVARIANTS) {
      expect(CONTEXT_PRIORITIZATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CONTEXT_PRIORITIZATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CONTEXT_PRIORITIZATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_PRIORITIZATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_PRIORITIZATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
