import { describe, expect, it } from 'vitest';

import {
  DEPRECATION_MODEL_INVARIANTS,
  DEPRECATION_MODEL_INVARIANT_DESCRIPTIONS,
  DEPRECATION_MODEL_PRINCIPLES,
  DEPRECATION_MODEL_PRINCIPLE_DESCRIPTIONS,
  DEPRECATION_STATES,
  DEPRECATION_STATE_DESCRIPTIONS,
  deprecationStateAtOrAfter,
} from '../src/index';

describe('evolution / deprecation model (ai/evolution/deprecation-model.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(DEPRECATION_MODEL_PRINCIPLES).toEqual([
      'deprecation-precedes-retirement',
      'deprecation-is-announced-not-silent',
      'a-replacement-is-defined-before-deprecation',
      'retirement-follows-defined-rules',
    ]);
  });

  it('defines exactly the three ordered deprecation states, active to retired', () => {
    expect(DEPRECATION_STATES).toEqual(['active', 'deprecated', 'retired']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(DEPRECATION_MODEL_INVARIANTS).toEqual([
      'a-part-is-deprecated-and-dependents-migrated-before-it-is-retired',
      'a-deprecation-is-explicit-and-recorded-never-silent',
      'a-part-is-deprecated-only-in-favor-of-a-defined-replacement',
      'a-part-is-retired-only-when-a-replacement-exists-and-no-dependent-remains',
      'deprecating-a-part-is-inert',
    ]);
  });

  it('gives every principle, state, and invariant a non-empty description', () => {
    for (const id of DEPRECATION_MODEL_PRINCIPLES) {
      expect(DEPRECATION_MODEL_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of DEPRECATION_STATES) {
      expect(DEPRECATION_STATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of DEPRECATION_MODEL_INVARIANTS) {
      expect(DEPRECATION_MODEL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('deprecationStateAtOrAfter', () => {
    it('holds for a later or equal state and is false for an earlier state', () => {
      expect(deprecationStateAtOrAfter('retired', 'active')).toBe(true);
      expect(deprecationStateAtOrAfter('deprecated', 'deprecated')).toBe(true);
      expect(deprecationStateAtOrAfter('active', 'retired')).toBe(false);
    });

    it('agrees with the declared state order across the whole set', () => {
      DEPRECATION_STATES.forEach((a, i) => {
        DEPRECATION_STATES.forEach((b, j) => {
          expect(deprecationStateAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(DEPRECATION_MODEL_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(DEPRECATION_STATES)).toBe(true);
    expect(Object.isFrozen(DEPRECATION_MODEL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(DEPRECATION_MODEL_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(DEPRECATION_STATE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(DEPRECATION_MODEL_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
