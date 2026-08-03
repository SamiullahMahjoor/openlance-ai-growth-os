import { describe, expect, it } from 'vitest';

import {
  PROVIDER_SELECTION_INVARIANTS,
  PROVIDER_SELECTION_INVARIANT_DESCRIPTIONS,
  PROVIDER_SELECTION_PRINCIPLES,
  PROVIDER_SELECTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider selection (ai/providers/provider-selection.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_SELECTION_PRINCIPLES).toEqual([
      'deterministic',
      'chooses-from-compatible',
      'governed-and-bounded',
      'neutral',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_SELECTION_INVARIANTS).toEqual([
      'same-inputs-same-choice',
      'chosen-from-active-and-compatible',
      'permitted-under-governance-and-safety',
      'settled-by-defined-tiebreak',
      'choosing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROVIDER_SELECTION_PRINCIPLES) {
      expect(PROVIDER_SELECTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_SELECTION_INVARIANTS) {
      expect(PROVIDER_SELECTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_SELECTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_SELECTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_SELECTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_SELECTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
