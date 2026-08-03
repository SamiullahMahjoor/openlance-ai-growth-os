import { describe, expect, it } from 'vitest';

import {
  COMPATIBILITY_KINDS,
  COMPATIBILITY_KIND_DESCRIPTIONS,
  PROVIDER_COMPATIBILITY_INVARIANTS,
  PROVIDER_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
  PROVIDER_COMPATIBILITY_PRINCIPLES,
  PROVIDER_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider compatibility (ai/providers/provider-compatibility.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_COMPATIBILITY_PRINCIPLES).toEqual([
      'defined-relation',
      'rests-on-declared-capabilities',
      'neutral',
      'incompatibility-explicit',
    ]);
  });

  it('defines exactly the two kinds of compatibility in constitutional order', () => {
    expect(COMPATIBILITY_KINDS).toEqual(['capability', 'version']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_COMPATIBILITY_INVARIANTS).toEqual([
      'capability-compatible-when-satisfies-need',
      'version-compatible-when-requirements-hold',
      'compatible-are-interchangeable',
      'incompatible-identified-not-used',
      'determining-is-inert',
    ]);
  });

  it('gives every principle, kind, and invariant a non-empty description', () => {
    for (const id of PROVIDER_COMPATIBILITY_PRINCIPLES) {
      expect(PROVIDER_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of COMPATIBILITY_KINDS) {
      expect(COMPATIBILITY_KIND_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_COMPATIBILITY_INVARIANTS) {
      expect(PROVIDER_COMPATIBILITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_COMPATIBILITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(COMPATIBILITY_KINDS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_COMPATIBILITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(COMPATIBILITY_KIND_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_COMPATIBILITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
