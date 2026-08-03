import { describe, expect, it } from 'vitest';

import {
  EVALUATION_ARCHITECTURE_INVARIANTS,
  EVALUATION_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  EVALUATION_ARCHITECTURE_PRINCIPLES,
  EVALUATION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  EVALUATION_PARTS,
  EVALUATION_PART_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / architecture (ai/evaluation/evaluation-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_ARCHITECTURE_PRINCIPLES).toEqual([
      'an-evaluation-is-an-assessment-not-a-behavior',
      'an-evaluation-has-a-distinct-identity',
      'an-evaluation-is-composed-of-defined-parts',
      'an-evaluations-structure-is-deterministic',
    ]);
  });

  it('defines exactly the four parts an evaluation is composed of', () => {
    expect(EVALUATION_PARTS).toEqual(['identity', 'subject-output', 'metrics', 'benchmark']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_ARCHITECTURE_INVARIANTS).toEqual([
      'every-evaluation-has-a-distinct-stable-identity-never-shared',
      'composed-of-identity-subject-output-metrics-and-benchmark',
      'assesses-output-never-the-behavior-or-quality-definition',
      'same-definition-same-assessment',
      'defining-structure-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of EVALUATION_ARCHITECTURE_PRINCIPLES) {
      expect(EVALUATION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_PARTS) {
      expect(EVALUATION_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_ARCHITECTURE_INVARIANTS) {
      expect(EVALUATION_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_PARTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
