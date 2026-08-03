import { describe, expect, it } from 'vitest';

import {
  EVALUATION_METRICS_INVARIANTS,
  EVALUATION_METRICS_INVARIANT_DESCRIPTIONS,
  EVALUATION_METRICS_PRINCIPLES,
  EVALUATION_METRICS_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / metrics (ai/evaluation/evaluation-metrics.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_METRICS_PRINCIPLES).toEqual([
      'a-metric-is-a-defined-measurement',
      'a-metric-measures-against-a-definition-it-does-not-own',
      'metrics-are-neutral',
      'measurement-observes-it-never-changes',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_METRICS_INVARIANTS).toEqual([
      'every-metric-names-a-defined-measurement-never-a-vague-impression',
      'a-metric-measures-against-subject-quality-definition-never-redefines',
      'metrics-described-technology-neutral',
      'measuring-observes-never-changes',
      'defining-or-applying-a-metric-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVALUATION_METRICS_PRINCIPLES) {
      expect(EVALUATION_METRICS_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_METRICS_INVARIANTS) {
      expect(EVALUATION_METRICS_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_METRICS_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_METRICS_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_METRICS_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_METRICS_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
