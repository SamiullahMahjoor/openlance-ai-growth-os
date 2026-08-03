import { describe, expect, it } from 'vitest';

import {
  EVALUATION_VALIDATION_CHECKS,
  EVALUATION_VALIDATION_CHECK_DESCRIPTIONS,
  EVALUATION_VALIDATION_INVARIANTS,
  EVALUATION_VALIDATION_INVARIANT_DESCRIPTIONS,
  EVALUATION_VALIDATION_PRINCIPLES,
  EVALUATION_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  evaluationValidationCheckAtOrAfter,
} from '../src/index';

describe('evaluation / validation (ai/evaluation/evaluation-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_VALIDATION_PRINCIPLES).toEqual([
      'validation-precedes-acceptance',
      'validation-is-ordered',
      'grounding-is-required',
      'failure-is-inert',
    ]);
  });

  it('defines exactly the four ordered checks, well-formedness to constitutional', () => {
    expect(EVALUATION_VALIDATION_CHECKS).toEqual([
      'well-formedness-validation',
      'grounding-validation',
      'scoring-validation',
      'constitutional-validation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_VALIDATION_INVARIANTS).toEqual([
      'result-validated-before-accepted-fails-not-accepted',
      'checks-applied-in-fixed-order-well-formedness-first',
      'validated-to-be-grounded-and-score-traceable',
      'validation-defines-what-and-order-never-the-rule',
      'validating-an-evaluation-is-inert',
    ]);
  });

  it('gives every principle, check, and invariant a non-empty description', () => {
    for (const id of EVALUATION_VALIDATION_PRINCIPLES) {
      expect(EVALUATION_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_VALIDATION_CHECKS) {
      expect(EVALUATION_VALIDATION_CHECK_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_VALIDATION_INVARIANTS) {
      expect(EVALUATION_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('evaluationValidationCheckAtOrAfter', () => {
    it('holds for a later or equal check and is false for an earlier check', () => {
      expect(
        evaluationValidationCheckAtOrAfter(
          'constitutional-validation',
          'well-formedness-validation',
        ),
      ).toBe(true);
      expect(
        evaluationValidationCheckAtOrAfter('grounding-validation', 'grounding-validation'),
      ).toBe(true);
      expect(
        evaluationValidationCheckAtOrAfter(
          'well-formedness-validation',
          'constitutional-validation',
        ),
      ).toBe(false);
    });

    it('agrees with the declared check order across the whole pipeline', () => {
      EVALUATION_VALIDATION_CHECKS.forEach((a, i) => {
        EVALUATION_VALIDATION_CHECKS.forEach((b, j) => {
          expect(evaluationValidationCheckAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VALIDATION_CHECKS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VALIDATION_CHECK_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
