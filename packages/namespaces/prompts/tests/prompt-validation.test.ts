import { describe, expect, it } from 'vitest';

import {
  PROMPT_VALIDATION_CHECKS,
  PROMPT_VALIDATION_CHECK_DESCRIPTIONS,
  PROMPT_VALIDATION_INVARIANTS,
  PROMPT_VALIDATION_INVARIANT_DESCRIPTIONS,
  PROMPT_VALIDATION_PRINCIPLES,
  PROMPT_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  validationCheckAtOrAfter,
} from '../src/index';

describe('prompts / prompt validation (ai/prompts/prompt-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_VALIDATION_PRINCIPLES).toEqual([
      'validation-precedes-expression',
      'validation-is-ordered',
      'governance-is-checked-first',
      'grounding-is-required',
    ]);
  });

  it('defines exactly the four ordered checks, governance first and grounding last', () => {
    expect(PROMPT_VALIDATION_CHECKS).toEqual([
      'governance-conformance',
      'boundary-conformance',
      'structural-completeness',
      'grounding-and-separation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_VALIDATION_INVARIANTS).toEqual([
      'validated-before-expressed',
      'checks-applied-in-fixed-order-governance-first-grounding-last',
      'validated-to-point-never-embed',
      'validation-defines-what-and-order-never-the-rule',
      'validating-is-inert',
    ]);
  });

  it('gives every principle, check, and invariant a non-empty description', () => {
    for (const id of PROMPT_VALIDATION_PRINCIPLES) {
      expect(PROMPT_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_VALIDATION_CHECKS) {
      expect(PROMPT_VALIDATION_CHECK_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_VALIDATION_INVARIANTS) {
      expect(PROMPT_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('validationCheckAtOrAfter', () => {
    it('holds for a later-or-equal check and is false for an earlier check', () => {
      expect(validationCheckAtOrAfter('grounding-and-separation', 'governance-conformance')).toBe(
        true,
      );
      expect(validationCheckAtOrAfter('boundary-conformance', 'boundary-conformance')).toBe(true);
      expect(validationCheckAtOrAfter('governance-conformance', 'grounding-and-separation')).toBe(
        false,
      );
    });

    it('agrees with the declared check order across the whole set', () => {
      PROMPT_VALIDATION_CHECKS.forEach((a, i) => {
        PROMPT_VALIDATION_CHECKS.forEach((b, j) => {
          expect(validationCheckAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_VALIDATION_CHECKS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VALIDATION_CHECK_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
