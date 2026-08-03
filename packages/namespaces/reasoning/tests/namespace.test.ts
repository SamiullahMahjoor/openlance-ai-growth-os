import { describe, expect, it } from 'vitest';

import {
  REASONING_CONCERNS,
  REASONING_CONCERN_DESCRIPTIONS,
  REASONING_INVARIANTS,
  REASONING_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / namespace (ai/reasoning/README.md, ai/reasoning/reasoning.md)', () => {
  it('defines exactly the eight reasoning invariants in constitutional order', () => {
    expect(REASONING_INVARIANTS).toEqual([
      'deterministic',
      'explicit-never-hidden',
      'consumes-never-owns',
      'governed',
      'internally-consistent',
      'grounded',
      'sufficient-before-concludes',
      'repeatable-and-scalable',
    ]);
  });

  it('defines exactly the ten reasoning concerns in inventory order', () => {
    expect(REASONING_CONCERNS).toEqual([
      'reasoning-lifecycle',
      'reasoning-workflow',
      'reasoning-stages',
      'reasoning-strategies',
      'reasoning-validation',
      'reasoning-consistency',
      'uncertainty-handling',
      'conclusion-formation',
      'reasoning-quality',
      'reasoning-boundaries',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of REASONING_INVARIANTS) {
      expect(REASONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_CONCERNS) {
      expect(REASONING_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_CONCERNS)).toBe(true);
    expect(Object.isFrozen(REASONING_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
