import { describe, expect, it } from 'vitest';

import {
  PROVIDER_FALLBACK_INVARIANTS,
  PROVIDER_FALLBACK_INVARIANT_DESCRIPTIONS,
  PROVIDER_FALLBACK_PRINCIPLES,
  PROVIDER_FALLBACK_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider fallback (ai/providers/provider-fallback.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_FALLBACK_PRINCIPLES).toEqual([
      'recovers-never-lowers-protection',
      'bounded-and-acyclic',
      'reapplies-selection-rules',
      'terminates-safely',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_FALLBACK_INVARIANTS).toEqual([
      'alternate-only-compatible-governed-safe',
      'chain-finite-and-acyclic',
      'no-provider-tried-twice',
      'exhaustion-hands-to-safe-degradation',
      'falling-back-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROVIDER_FALLBACK_PRINCIPLES) {
      expect(PROVIDER_FALLBACK_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_FALLBACK_INVARIANTS) {
      expect(PROVIDER_FALLBACK_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_FALLBACK_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_FALLBACK_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_FALLBACK_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_FALLBACK_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
