import { describe, expect, it } from 'vitest';

import {
  MEMORY_EVOLUTION_INVARIANTS,
  MEMORY_EVOLUTION_INVARIANT_DESCRIPTIONS,
  MEMORY_EVOLUTION_PRINCIPLES,
  MEMORY_EVOLUTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory evolution (ai/memory/memory-evolution.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_EVOLUTION_PRINCIPLES).toEqual([
      'changes-by-governed-record-not-learning',
      'newer-validated-supersedes-older',
      'change-never-creates-truth',
      'grounded-and-traceable',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_EVOLUTION_INVARIANTS).toEqual([
      'changes-only-by-governed-record-or-removal',
      'newer-validated-supersedes',
      'changed-memory-validated-and-traceable',
      'no-change-creates-truth',
      'evolving-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MEMORY_EVOLUTION_PRINCIPLES) {
      expect(MEMORY_EVOLUTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_EVOLUTION_INVARIANTS) {
      expect(MEMORY_EVOLUTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_EVOLUTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_EVOLUTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_EVOLUTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_EVOLUTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
