import { describe, expect, it } from 'vitest';

import {
  PROVIDER_CAPABILITIES_INVARIANTS,
  PROVIDER_CAPABILITIES_INVARIANT_DESCRIPTIONS,
  PROVIDER_CAPABILITIES_PRINCIPLES,
  PROVIDER_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider capabilities (ai/providers/provider-capabilities.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_CAPABILITIES_PRINCIPLES).toEqual([
      'declared-ability',
      'describes-not-performs',
      'neutral',
      'bounded',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_CAPABILITIES_INVARIANTS).toEqual([
      'offers-only-declared',
      'names-ability-not-intelligence',
      'neutral-description',
      'same-provider-same-capabilities',
      'describing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROVIDER_CAPABILITIES_PRINCIPLES) {
      expect(PROVIDER_CAPABILITIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_CAPABILITIES_INVARIANTS) {
      expect(PROVIDER_CAPABILITIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_CAPABILITIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_CAPABILITIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_CAPABILITIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_CAPABILITIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
