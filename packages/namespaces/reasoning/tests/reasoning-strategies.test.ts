import { describe, expect, it } from 'vitest';

import {
  REASONING_STRATEGIES,
  REASONING_STRATEGY_DESCRIPTIONS,
  REASONING_STRATEGY_INVARIANTS,
  REASONING_STRATEGY_INVARIANT_DESCRIPTIONS,
  REASONING_STRATEGY_PRINCIPLES,
  REASONING_STRATEGY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / reasoning strategies (ai/reasoning/reasoning-strategies.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_STRATEGY_PRINCIPLES).toEqual([
      'categories-are-architectural-not-methods',
      'categories-are-explicit',
      'categories-are-governed-and-grounded',
      'categories-are-extensible',
    ]);
  });

  it('defines exactly the four architectural categories in constitutional order', () => {
    expect(REASONING_STRATEGIES).toEqual([
      'decomposition',
      'synthesis',
      'comparison',
      'trade-off-analysis',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(REASONING_STRATEGY_INVARIANTS).toEqual([
      'a-category-is-a-kind-not-a-method',
      'which-category-is-explicit',
      'a-category-is-grounded-and-governed',
      'applying-a-category-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of REASONING_STRATEGY_PRINCIPLES) {
      expect(REASONING_STRATEGY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_STRATEGIES) {
      expect(REASONING_STRATEGY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_STRATEGY_INVARIANTS) {
      expect(REASONING_STRATEGY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_STRATEGY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_STRATEGIES)).toBe(true);
    expect(Object.isFrozen(REASONING_STRATEGY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_STRATEGY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_STRATEGY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_STRATEGY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
