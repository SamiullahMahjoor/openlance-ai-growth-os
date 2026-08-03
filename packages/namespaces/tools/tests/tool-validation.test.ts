import { describe, expect, it } from 'vitest';

import {
  TOOL_VALIDATION_CHECKS,
  TOOL_VALIDATION_CHECK_DESCRIPTIONS,
  TOOL_VALIDATION_INVARIANTS,
  TOOL_VALIDATION_INVARIANT_DESCRIPTIONS,
  TOOL_VALIDATION_PRINCIPLES,
  TOOL_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  toolValidationCheckAtOrAfter,
} from '../src/index';

describe('tools / tool validation (ai/tools/tool-validation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_VALIDATION_PRINCIPLES).toEqual([
      'validation-precedes-execution',
      'validation-is-ordered',
      'permission-and-safety-are-checked-first',
      'failure-is-safe',
    ]);
  });

  it('defines exactly the four ordered checks, permission and safety first', () => {
    expect(TOOL_VALIDATION_CHECKS).toEqual([
      'permission-validation',
      'safety-validation',
      'constitutional-validation',
      'compatibility-validation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_VALIDATION_INVARIANTS).toEqual([
      'validated-before-executes-fails-never-executes',
      'checks-applied-in-fixed-order-permission-and-safety-first',
      'validation-defines-what-and-order-never-the-rule-or-hazard',
      'failed-validation-refused-or-replaced-no-unvalidated-tool-acts',
      'validating-a-tool-is-inert',
    ]);
  });

  it('gives every principle, check, and invariant a non-empty description', () => {
    for (const id of TOOL_VALIDATION_PRINCIPLES) {
      expect(TOOL_VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_VALIDATION_CHECKS) {
      expect(TOOL_VALIDATION_CHECK_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_VALIDATION_INVARIANTS) {
      expect(TOOL_VALIDATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('toolValidationCheckAtOrAfter', () => {
    it('holds for a later-or-equal check and is false for an earlier check', () => {
      expect(
        toolValidationCheckAtOrAfter('compatibility-validation', 'permission-validation'),
      ).toBe(true);
      expect(toolValidationCheckAtOrAfter('safety-validation', 'safety-validation')).toBe(true);
      expect(
        toolValidationCheckAtOrAfter('permission-validation', 'compatibility-validation'),
      ).toBe(false);
    });

    it('agrees with the declared check order across the whole set', () => {
      TOOL_VALIDATION_CHECKS.forEach((a, i) => {
        TOOL_VALIDATION_CHECKS.forEach((b, j) => {
          expect(toolValidationCheckAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_VALIDATION_CHECKS)).toBe(true);
    expect(Object.isFrozen(TOOL_VALIDATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_VALIDATION_CHECK_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_VALIDATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
