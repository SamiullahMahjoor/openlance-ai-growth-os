import { describe, expect, it } from 'vitest';

import {
  LOADING_STRATEGY_INVARIANTS,
  LOADING_STRATEGY_INVARIANT_DESCRIPTIONS,
  LOADING_STRATEGY_PRINCIPLES,
  LOADING_STRATEGY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / loading strategy (ai/retrieval/loading-strategy.md)', () => {
  it('defines exactly the seven principles in constitutional order', () => {
    expect(LOADING_STRATEGY_PRINCIPLES).toEqual([
      'minimum-sufficient-knowledge',
      'authority-precedence',
      'ownership-precision',
      'dependency-expansion',
      'context-minimization',
      'relevance',
      'determinism',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(LOADING_STRATEGY_INVARIANTS).toEqual([
      'minimum-sufficient-plus-governing-and-dependencies',
      'includes-governing-and-dependencies',
      'applies-tiers-never-redefines',
      'deterministic',
      'applying-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of LOADING_STRATEGY_PRINCIPLES) {
      expect(LOADING_STRATEGY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of LOADING_STRATEGY_INVARIANTS) {
      expect(LOADING_STRATEGY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(LOADING_STRATEGY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(LOADING_STRATEGY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(LOADING_STRATEGY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(LOADING_STRATEGY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
