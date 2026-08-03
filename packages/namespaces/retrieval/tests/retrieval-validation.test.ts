import { describe, expect, it } from 'vitest';

import {
  RETRIEVAL_VALIDATION_DIMENSIONS,
  RETRIEVAL_VALIDATION_DIMENSION_DESCRIPTIONS,
  RETRIEVAL_VALIDATION_INVARIANTS,
  RETRIEVAL_VALIDATION_INVARIANT_DESCRIPTIONS,
  RETRIEVAL_VALIDATION_PRINCIPLES,
  RETRIEVAL_VALIDATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / retrieval validation (ai/retrieval/retrieval-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(RETRIEVAL_VALIDATION_PRINCIPLES).toEqual([
      'validation-precedes-loading',
      'against-canonical-sources',
      'failed-result-not-loaded',
      'deterministic',
    ]);
  });

  it('defines exactly the five validation dimensions in constitutional order', () => {
    expect(RETRIEVAL_VALIDATION_DIMENSIONS).toEqual([
      'ownership',
      'authority',
      'dependency-completeness',
      'boundaries',
      'governance-permission',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(RETRIEVAL_VALIDATION_INVARIANTS).toEqual([
      'no-handoff-before-validation',
      'confirms-five-dimensions',
      'failed-corrected-or-refused',
      'defines-check-not-rule',
      'validating-is-inert',
    ]);
  });

  it('gives every principle, dimension, and invariant a non-empty description', () => {
    for (const id of RETRIEVAL_VALIDATION_PRINCIPLES) {
      expect(RETRIEVAL_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_VALIDATION_DIMENSIONS) {
      expect(RETRIEVAL_VALIDATION_DIMENSION_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_VALIDATION_INVARIANTS) {
      expect(RETRIEVAL_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_DIMENSIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_DIMENSION_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
