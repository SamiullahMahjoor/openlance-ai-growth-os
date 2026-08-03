import { describe, expect, it } from 'vitest';

import {
  MEMORY_BOUNDARIES,
  MEMORY_BOUNDARIES_INVARIANTS,
  MEMORY_BOUNDARIES_INVARIANT_DESCRIPTIONS,
  MEMORY_BOUNDARIES_PRINCIPLES,
  MEMORY_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  MEMORY_BOUNDARY_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory boundaries (ai/memory/memory-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_BOUNDARIES_PRINCIPLES).toEqual([
      'retains-not-execute-retrieve-reason-express',
      'runtime-state-never-truth',
      'never-invents-never-persists-beyond-purpose',
      'stays-within-governance',
    ]);
  });

  it('defines exactly the six architectural boundaries in constitutional order', () => {
    expect(MEMORY_BOUNDARIES).toEqual([
      'truth',
      'knowledge',
      'reasoning',
      'execution',
      'governance',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_BOUNDARIES_INVARIANTS).toEqual([
      'holds-runtime-state-not-truth',
      'never-retrieves-reasons-executes',
      'nothing-beyond-scope-nothing-promoted',
      'escalates-never-invents-resolution',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of MEMORY_BOUNDARIES_PRINCIPLES) {
      expect(MEMORY_BOUNDARIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_BOUNDARIES) {
      expect(MEMORY_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_BOUNDARIES_INVARIANTS) {
      expect(MEMORY_BOUNDARIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_BOUNDARIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(MEMORY_BOUNDARIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_BOUNDARIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_BOUNDARIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
