import { describe, expect, it } from 'vitest';

import {
  COMPATIBILITY_MANAGEMENT_INVARIANTS,
  COMPATIBILITY_MANAGEMENT_INVARIANT_DESCRIPTIONS,
  COMPATIBILITY_MANAGEMENT_PRINCIPLES,
  COMPATIBILITY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / compatibility management (ai/evolution/compatibility-management.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(COMPATIBILITY_MANAGEMENT_PRINCIPLES).toEqual([
      'compatibility-is-a-defined-relationship',
      'compatibility-is-preserved-by-default',
      'a-guarantee-is-honored-across-change',
      'compatibility-spans-the-architecture',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(COMPATIBILITY_MANAGEMENT_INVARIANTS).toEqual([
      'compatibility-between-parts-is-a-defined-relationship-never-assumed',
      'a-change-preserves-compatibility-or-is-migrated-and-deprecated-never-silent',
      'a-guarantee-is-honored-until-deliberately-retired',
      'governs-compatibility-across-the-architecture-above-internal-compatibility',
      'managing-compatibility-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of COMPATIBILITY_MANAGEMENT_PRINCIPLES) {
      expect(COMPATIBILITY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of COMPATIBILITY_MANAGEMENT_INVARIANTS) {
      expect(COMPATIBILITY_MANAGEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(COMPATIBILITY_MANAGEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(COMPATIBILITY_MANAGEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(COMPATIBILITY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(COMPATIBILITY_MANAGEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
