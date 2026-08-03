import { describe, expect, it } from 'vitest';

import {
  EVALUATION_BOUNDARIES,
  EVALUATION_BOUNDARY_DESCRIPTIONS,
  EVALUATION_BOUNDARY_INVARIANTS,
  EVALUATION_BOUNDARY_INVARIANT_DESCRIPTIONS,
  EVALUATION_BOUNDARY_PRINCIPLES,
  EVALUATION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / boundaries (ai/evaluation/evaluation-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_BOUNDARY_PRINCIPLES).toEqual([
      'evaluation-measures-it-does-not-perform-decide-or-change',
      'evaluation-observes-one-directionally',
      'evaluation-owns-no-subject-behavior-or-quality-definition',
      'evaluation-carries-no-truth-of-its-own',
    ]);
  });

  it('defines exactly the six architectural boundaries', () => {
    expect(EVALUATION_BOUNDARIES).toEqual([
      'behavior',
      'decision',
      'subject',
      'one-directional',
      'truth',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_BOUNDARY_INVARIANTS).toEqual([
      'assesses-an-output-never-produces-changes-or-decides',
      'observes-one-directionally-no-subject-depends-on-it',
      'never-redefines-subject-quality-or-reaches-into-behavior',
      'references-truth-as-ground-never-owns-or-restates',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of EVALUATION_BOUNDARY_PRINCIPLES) {
      expect(EVALUATION_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_BOUNDARIES) {
      expect(EVALUATION_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_BOUNDARY_INVARIANTS) {
      expect(EVALUATION_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
