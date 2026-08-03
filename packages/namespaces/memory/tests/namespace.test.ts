import { describe, expect, it } from 'vitest';

import {
  MEMORY_CONCERNS,
  MEMORY_CONCERN_DESCRIPTIONS,
  MEMORY_INVARIANTS,
  MEMORY_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('memory / namespace (ai/memory/README.md, ai/memory/memory.md)', () => {
  it('defines exactly the nine memory invariants in constitutional order', () => {
    expect(MEMORY_INVARIANTS).toEqual([
      'deterministic',
      'holds-runtime-state-not-truth',
      'never-invents',
      'never-replaces-knowledge',
      'scoped-and-lifecycled',
      'never-promoted-to-truth',
      'consistent',
      'governed',
      'repeatable-and-scalable',
    ]);
  });

  it('defines exactly the ten memory concerns in inventory order', () => {
    expect(MEMORY_CONCERNS).toEqual([
      'memory-lifecycle',
      'memory-workflow',
      'memory-types',
      'memory-retention',
      'memory-retrieval',
      'memory-consistency',
      'memory-validation',
      'memory-quality',
      'memory-boundaries',
      'memory-evolution',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of MEMORY_INVARIANTS) {
      expect(MEMORY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_CONCERNS) {
      expect(MEMORY_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_CONCERNS)).toBe(true);
    expect(Object.isFrozen(MEMORY_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
