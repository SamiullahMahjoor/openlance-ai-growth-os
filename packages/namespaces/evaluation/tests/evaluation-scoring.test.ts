import { describe, expect, it } from 'vitest';

import {
  EVALUATION_SCORING_INVARIANTS,
  EVALUATION_SCORING_INVARIANT_DESCRIPTIONS,
  EVALUATION_SCORING_PRINCIPLES,
  EVALUATION_SCORING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / scoring (ai/evaluation/evaluation-scoring.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_SCORING_PRINCIPLES).toEqual([
      'a-score-is-derived-not-invented',
      'scoring-is-deterministic',
      'scoring-is-transparent',
      'a-score-assesses-it-does-not-decide',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_SCORING_INVARIANTS).toEqual([
      'score-derived-from-measured-metrics-never-by-opinion',
      'same-measured-metrics-same-scoring-model-same-score',
      'score-traceable-to-the-metrics-derived-from',
      'score-assesses-never-decides-changes-or-compares',
      'deriving-a-score-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVALUATION_SCORING_PRINCIPLES) {
      expect(EVALUATION_SCORING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_SCORING_INVARIANTS) {
      expect(EVALUATION_SCORING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_SCORING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_SCORING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_SCORING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_SCORING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
