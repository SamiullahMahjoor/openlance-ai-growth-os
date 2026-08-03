import { describe, expect, it } from 'vitest';

import {
  MEMORY_VALIDATION_INVARIANTS,
  MEMORY_VALIDATION_INVARIANT_DESCRIPTIONS,
  MEMORY_VALIDATION_PRINCIPLES,
  MEMORY_VALIDATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('memory / memory validation (ai/memory/memory-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_VALIDATION_PRINCIPLES).toEqual([
      'grounded',
      'never-business-truth',
      'invalid-not-retained',
      'governed',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_VALIDATION_INVARIANTS).toEqual([
      'grounded-never-invented',
      'runtime-state-never-promoted',
      'ungrounded-not-retained',
      'defines-check-not-rule',
      'validating-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MEMORY_VALIDATION_PRINCIPLES) {
      expect(MEMORY_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_VALIDATION_INVARIANTS) {
      expect(MEMORY_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
