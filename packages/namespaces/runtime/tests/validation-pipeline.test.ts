import { describe, expect, it } from 'vitest';

import {
  VALIDATION_PIPELINE_INVARIANTS,
  VALIDATION_PIPELINE_INVARIANT_DESCRIPTIONS,
  VALIDATION_PIPELINE_PRINCIPLES,
  VALIDATION_PIPELINE_PRINCIPLE_DESCRIPTIONS,
  VALIDATION_STAGES,
  VALIDATION_STAGE_DESCRIPTIONS,
  validationStageAtOrAfter,
} from '../src/index';

describe('runtime / validation pipeline (ai/runtime/validation-pipeline.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(VALIDATION_PIPELINE_PRINCIPLES).toEqual([
      'validation-precedes-execution',
      'the-runtime-orders-governance-rules',
      'higher-validations-first',
      'a-failed-validation-stops-execution',
      'the-pipeline-never-invents-a-rule',
    ]);
  });

  it('defines exactly the three ordered stages, constitutional to policy', () => {
    expect(VALIDATION_STAGES).toEqual([
      'constitutional-validation',
      'permission-validation',
      'policy-validation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(VALIDATION_PIPELINE_INVARIANTS).toEqual([
      'the-full-pipeline-completes-before-execute',
      'constitutional-before-permission-before-policy',
      'fails-any-required-validation-never-reaches-execute',
      'the-pipeline-defines-order-only-never-a-rule',
      'running-the-pipeline-is-inert',
    ]);
  });

  it('gives every principle, stage, and invariant a non-empty description', () => {
    for (const id of VALIDATION_PIPELINE_PRINCIPLES) {
      expect(VALIDATION_PIPELINE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of VALIDATION_STAGES) {
      expect(VALIDATION_STAGE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of VALIDATION_PIPELINE_INVARIANTS) {
      expect(VALIDATION_PIPELINE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('validationStageAtOrAfter', () => {
    it('holds for a later-or-equal stage and is false for an earlier stage', () => {
      expect(validationStageAtOrAfter('policy-validation', 'constitutional-validation')).toBe(true);
      expect(validationStageAtOrAfter('permission-validation', 'permission-validation')).toBe(true);
      expect(validationStageAtOrAfter('constitutional-validation', 'policy-validation')).toBe(
        false,
      );
    });

    it('agrees with the declared stage order across the whole pipeline', () => {
      VALIDATION_STAGES.forEach((a, i) => {
        VALIDATION_STAGES.forEach((b, j) => {
          expect(validationStageAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(VALIDATION_PIPELINE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(VALIDATION_STAGES)).toBe(true);
    expect(Object.isFrozen(VALIDATION_PIPELINE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_PIPELINE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_STAGE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_PIPELINE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
