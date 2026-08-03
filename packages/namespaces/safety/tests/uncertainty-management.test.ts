import { describe, expect, it } from 'vitest';

import {
  UNCERTAINTY_MANAGEMENT_INVARIANTS,
  UNCERTAINTY_MANAGEMENT_INVARIANT_DESCRIPTIONS,
  UNCERTAINTY_MANAGEMENT_PRINCIPLES,
  UNCERTAINTY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / uncertainty management (ai/safety/uncertainty-management.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(UNCERTAINTY_MANAGEMENT_PRINCIPLES).toEqual([
      'surfaced-never-hidden',
      'low-confidence-raises-protection',
      'incompleteness-is-risk',
      'unresolved-escalates',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(UNCERTAINTY_MANAGEMENT_INVARIANTS).toEqual([
      'bearing-uncertainty-surfaced-never-hidden',
      'lower-confidence-raises-protection',
      'incompleteness-treated-as-hazard',
      'conflict-resolved-by-authority-and-least-harm-or-escalated',
      'managing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of UNCERTAINTY_MANAGEMENT_PRINCIPLES) {
      expect(UNCERTAINTY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of UNCERTAINTY_MANAGEMENT_INVARIANTS) {
      expect(UNCERTAINTY_MANAGEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(UNCERTAINTY_MANAGEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_MANAGEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_MANAGEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
