import { describe, expect, it } from 'vitest';

import {
  EVALUATION_BENCHMARKING_INVARIANTS,
  EVALUATION_BENCHMARKING_INVARIANT_DESCRIPTIONS,
  EVALUATION_BENCHMARKING_PRINCIPLES,
  EVALUATION_BENCHMARKING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / benchmarking (ai/evaluation/evaluation-benchmarking.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_BENCHMARKING_PRINCIPLES).toEqual([
      'a-benchmark-is-a-fixed-reference-standard',
      'a-benchmark-is-defined-not-performed',
      'a-benchmark-is-versioned-and-stable',
      'a-benchmark-uses-metrics-it-does-not-own',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_BENCHMARKING_INVARIANTS).toEqual([
      'benchmark-is-a-fixed-stable-reference-defined-in-metrics-it-does-not-own',
      'benchmark-defines-what-good-measures-against-never-produces-or-changes',
      'benchmark-changes-only-through-governed-versioning-result-records-version',
      'benchmark-uses-metrics-it-does-not-own-never-redefines',
      'defining-a-benchmark-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVALUATION_BENCHMARKING_PRINCIPLES) {
      expect(EVALUATION_BENCHMARKING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_BENCHMARKING_INVARIANTS) {
      expect(EVALUATION_BENCHMARKING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_BENCHMARKING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BENCHMARKING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BENCHMARKING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BENCHMARKING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
