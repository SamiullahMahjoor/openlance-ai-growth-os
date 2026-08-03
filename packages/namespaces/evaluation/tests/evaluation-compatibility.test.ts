import { describe, expect, it } from 'vitest';

import {
  EVALUATION_COMPATIBILITY_INVARIANTS,
  EVALUATION_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
  EVALUATION_COMPATIBILITY_KINDS,
  EVALUATION_COMPATIBILITY_KIND_DESCRIPTIONS,
  EVALUATION_COMPATIBILITY_PRINCIPLES,
  EVALUATION_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / compatibility (ai/evaluation/evaluation-compatibility.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_COMPATIBILITY_PRINCIPLES).toEqual([
      'compatibility-is-a-defined-relation',
      'compatibility-rests-on-metrics-and-subject',
      'compatibility-keeps-results-comparable',
      'incompatibility-is-explicit',
    ]);
  });

  it('defines exactly the two kinds of compatibility', () => {
    expect(EVALUATION_COMPATIBILITY_KINDS).toEqual(['subject', 'version']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_COMPATIBILITY_INVARIANTS).toEqual([
      'compatible-with-subject-only-when-metrics-apply',
      'version-compatible-only-when-consumer-expectations-hold',
      'compatible-results-comparable-incompatible-not-compared-as-alike',
      'incompatible-identified-never-used-as-compatible',
      'determining-compatibility-is-inert',
    ]);
  });

  it('gives every principle, kind, and invariant a non-empty description', () => {
    for (const id of EVALUATION_COMPATIBILITY_PRINCIPLES) {
      expect(EVALUATION_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_COMPATIBILITY_KINDS) {
      expect(EVALUATION_COMPATIBILITY_KIND_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_COMPATIBILITY_INVARIANTS) {
      expect(EVALUATION_COMPATIBILITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_KINDS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_KIND_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPATIBILITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
