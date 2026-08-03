import { describe, expect, it } from 'vitest';

import {
  PROVIDER_CONCERNS,
  PROVIDER_CONCERN_DESCRIPTIONS,
  PROVIDER_INVARIANTS,
  PROVIDER_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('providers / namespace (ai/providers/README.md, ai/providers/providers.md)', () => {
  it('defines exactly the seven provider invariants in constitutional order', () => {
    expect(PROVIDER_INVARIANTS).toEqual([
      'abstraction-not-vendor',
      'uniquely-identified-and-neutral',
      'deterministic-selection-routing-fallback',
      'governed-and-bounded',
      'bounded-acyclic-fallback-and-routing',
      'serves-owns-nothing',
      'single-owned-neutral-scalable',
    ]);
  });

  it('defines exactly the ten provider concerns in inventory order', () => {
    expect(PROVIDER_CONCERNS).toEqual([
      'provider-architecture',
      'provider-lifecycle',
      'provider-capabilities',
      'provider-abstraction',
      'provider-selection',
      'provider-routing',
      'provider-fallback',
      'provider-compatibility',
      'provider-boundaries',
      'provider-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of PROVIDER_INVARIANTS) {
      expect(PROVIDER_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_CONCERNS) {
      expect(PROVIDER_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_CONCERNS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
