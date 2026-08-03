import { describe, expect, it } from 'vitest';

import {
  REASONING_BOUNDARIES,
  REASONING_BOUNDARY_DESCRIPTIONS,
  REASONING_BOUNDARY_INVARIANTS,
  REASONING_BOUNDARY_INVARIANT_DESCRIPTIONS,
  REASONING_BOUNDARY_PRINCIPLES,
  REASONING_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / reasoning boundaries (ai/reasoning/reasoning-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_BOUNDARY_PRINCIPLES).toEqual([
      'reasoning-transforms-it-does-not-execute-load-or-express',
      'reasoning-consumes-it-never-owns',
      'reasoning-is-explicit-it-is-never-hidden',
      'reasoning-stays-within-governance',
    ]);
  });

  it('defines exactly the five architectural boundaries in constitutional order', () => {
    expect(REASONING_BOUNDARIES).toEqual([
      'transformation',
      'knowledge',
      'governance',
      'expression',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(REASONING_BOUNDARY_INVARIANTS).toEqual([
      'produces-a-conclusion-never-executes-loads-retrieves-or-expresses',
      'never-owns-restates-invents-or-amends-truth-or-a-rule',
      'holds-no-hidden-step-and-is-never-an-algorithm',
      'concludes-only-within-the-rules-and-escalates',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of REASONING_BOUNDARY_PRINCIPLES) {
      expect(REASONING_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_BOUNDARIES) {
      expect(REASONING_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_BOUNDARY_INVARIANTS) {
      expect(REASONING_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(REASONING_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
