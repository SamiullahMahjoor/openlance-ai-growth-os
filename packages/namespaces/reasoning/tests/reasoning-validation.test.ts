import { describe, expect, it } from 'vitest';

import {
  REASONING_VALIDATION_DIMENSIONS,
  REASONING_VALIDATION_DIMENSION_DESCRIPTIONS,
  REASONING_VALIDATION_INVARIANTS,
  REASONING_VALIDATION_INVARIANT_DESCRIPTIONS,
  REASONING_VALIDATION_PRINCIPLES,
  REASONING_VALIDATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / reasoning validation (ai/reasoning/reasoning-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_VALIDATION_PRINCIPLES).toEqual([
      'reasoning-is-grounded',
      'assumptions-are-explicit',
      'evidence-is-sufficient',
      'insufficiency-is-safe',
    ]);
  });

  it('defines exactly the four conjunctive validation dimensions in constitutional order', () => {
    expect(REASONING_VALIDATION_DIMENSIONS).toEqual([
      'assumption-identification',
      'grounding',
      'evidence-sufficiency',
      'governed-validation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(REASONING_VALIDATION_INVARIANTS).toEqual([
      'every-assumption-is-identified',
      'every-step-is-grounded',
      'conclusion-only-on-sufficient-evidence',
      'validation-defines-what-is-checked-never-the-rule',
      'validating-is-inert',
    ]);
  });

  it('gives every principle, dimension, and invariant a non-empty description', () => {
    for (const id of REASONING_VALIDATION_PRINCIPLES) {
      expect(REASONING_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_VALIDATION_DIMENSIONS) {
      expect(REASONING_VALIDATION_DIMENSION_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_VALIDATION_INVARIANTS) {
      expect(REASONING_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_VALIDATION_DIMENSIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_VALIDATION_DIMENSION_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
