import { describe, expect, it } from 'vitest';

import {
  PROVIDER_ARCHITECTURE_INVARIANTS,
  PROVIDER_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  PROVIDER_ARCHITECTURE_PRINCIPLES,
  PROVIDER_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_PARTS,
  PROVIDER_PART_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider architecture (ai/providers/provider-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_ARCHITECTURE_PRINCIPLES).toEqual([
      'abstraction-not-vendor',
      'distinct-identity',
      'composed-of-defined-parts',
      'deterministic-structure',
    ]);
  });

  it('defines exactly the three provider parts in constitutional order', () => {
    expect(PROVIDER_PARTS).toEqual(['identity', 'capabilities', 'abstraction']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_ARCHITECTURE_INVARIANTS).toEqual([
      'distinct-stable-identity',
      'composed-of-parts',
      'stands-for-source-not-output',
      'same-definition-same-structure',
      'structural-definition-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of PROVIDER_ARCHITECTURE_PRINCIPLES) {
      expect(PROVIDER_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_PARTS) {
      expect(PROVIDER_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_ARCHITECTURE_INVARIANTS) {
      expect(PROVIDER_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_PARTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
