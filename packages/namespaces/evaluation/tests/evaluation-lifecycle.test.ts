import { describe, expect, it } from 'vitest';

import {
  EVALUATION_LIFECYCLE_INVARIANTS,
  EVALUATION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  EVALUATION_LIFECYCLE_PHASES,
  EVALUATION_LIFECYCLE_PHASE_DESCRIPTIONS,
  EVALUATION_LIFECYCLE_PRINCIPLES,
  EVALUATION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  evaluationPhaseAtOrAfter,
} from '../src/index';

describe('evaluation / lifecycle (ai/evaluation/evaluation-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_LIFECYCLE_PRINCIPLES).toEqual([
      'an-evaluation-has-a-defined-beginning-and-end',
      'framing-precedes-measurement',
      'validation-precedes-acceptance',
      'an-evaluation-ends-in-a-result-not-an-action',
    ]);
  });

  it('defines exactly the five ordered phases, framing to result', () => {
    expect(EVALUATION_LIFECYCLE_PHASES).toEqual([
      'framing',
      'measurement',
      'scoring',
      'validation',
      'result',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-evaluation',
      'framing-precedes-measurement-precedes-scoring-precedes-validation',
      'result-validated-before-accepted-invalid-yields-no-result',
      'terminates-in-a-result-that-informs-never-acts',
      'a-lifecycle-transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of EVALUATION_LIFECYCLE_PRINCIPLES) {
      expect(EVALUATION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_LIFECYCLE_PHASES) {
      expect(EVALUATION_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_LIFECYCLE_INVARIANTS) {
      expect(EVALUATION_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('evaluationPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(evaluationPhaseAtOrAfter('result', 'framing')).toBe(true);
      expect(evaluationPhaseAtOrAfter('scoring', 'scoring')).toBe(true);
      expect(evaluationPhaseAtOrAfter('framing', 'result')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      EVALUATION_LIFECYCLE_PHASES.forEach((a, i) => {
        EVALUATION_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(evaluationPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
