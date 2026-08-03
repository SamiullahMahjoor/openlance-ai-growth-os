import { describe, expect, it } from 'vitest';

import {
  EVALUATION_COMPARISON_INVARIANTS,
  EVALUATION_COMPARISON_INVARIANT_DESCRIPTIONS,
  EVALUATION_COMPARISON_PRINCIPLES,
  EVALUATION_COMPARISON_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / comparison (ai/evaluation/evaluation-comparison.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_COMPARISON_PRINCIPLES).toEqual([
      'comparison-is-like-for-like',
      'comparison-is-deterministic',
      'comparison-reports-it-does-not-decide',
      'comparison-rests-on-measured-scores',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_COMPARISON_INVARIANTS).toEqual([
      'compared-only-on-same-metrics-and-conditions-fair',
      'same-outputs-and-scores-same-methodology-same-comparison',
      'comparison-against-benchmark-records-benchmark-version',
      'comparison-reports-relative-standing-never-decides-or-ranks-for-action',
      'comparing-outputs-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVALUATION_COMPARISON_PRINCIPLES) {
      expect(EVALUATION_COMPARISON_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_COMPARISON_INVARIANTS) {
      expect(EVALUATION_COMPARISON_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_COMPARISON_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPARISON_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPARISON_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_COMPARISON_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
