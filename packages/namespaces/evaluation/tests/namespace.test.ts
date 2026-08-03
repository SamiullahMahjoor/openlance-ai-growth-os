import { describe, expect, it } from 'vitest';

import {
  EVALUATION_CONCERNS,
  EVALUATION_CONCERN_DESCRIPTIONS,
  EVALUATION_INVARIANTS,
  EVALUATION_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / namespace (ai/evaluation/README.md, ai/evaluation/evaluation.md)', () => {
  it('defines exactly the seven evaluation invariants in constitutional order', () => {
    expect(EVALUATION_INVARIANTS).toEqual([
      'measures-never-performs',
      'observes-one-directionally',
      'deterministic',
      'grounded-and-validated',
      'result-informs-never-decides',
      'owns-no-subject-behavior-or-quality-definition',
      'single-owned-technology-neutral-scalable',
    ]);
  });

  it('defines exactly the ten evaluation concerns in inventory order', () => {
    expect(EVALUATION_CONCERNS).toEqual([
      'evaluation-architecture',
      'evaluation-lifecycle',
      'evaluation-metrics',
      'evaluation-scoring',
      'evaluation-validation',
      'evaluation-benchmarking',
      'evaluation-comparison',
      'evaluation-compatibility',
      'evaluation-boundaries',
      'evaluation-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of EVALUATION_INVARIANTS) {
      expect(EVALUATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_CONCERNS) {
      expect(EVALUATION_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_CONCERNS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
