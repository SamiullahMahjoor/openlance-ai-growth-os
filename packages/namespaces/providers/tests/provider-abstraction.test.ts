import { describe, expect, it } from 'vitest';

import {
  PROVIDER_ABSTRACTION_INVARIANTS,
  PROVIDER_ABSTRACTION_INVARIANT_DESCRIPTIONS,
  PROVIDER_ABSTRACTION_PRINCIPLES,
  PROVIDER_ABSTRACTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider abstraction (ai/providers/provider-abstraction.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_ABSTRACTION_PRINCIPLES).toEqual([
      'uniform',
      'neutral',
      'endures-while-providers-are-transient',
      'carries-no-intelligence',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_ABSTRACTION_INVARIANTS).toEqual([
      'one-uniform-neutral-abstraction',
      'names-no-vendor-model-technology',
      'source-change-changes-nothing',
      'no-intelligence-of-its-own',
      'presenting-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROVIDER_ABSTRACTION_PRINCIPLES) {
      expect(PROVIDER_ABSTRACTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_ABSTRACTION_INVARIANTS) {
      expect(PROVIDER_ABSTRACTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_ABSTRACTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ABSTRACTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ABSTRACTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ABSTRACTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
