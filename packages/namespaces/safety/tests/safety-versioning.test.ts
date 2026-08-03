import { describe, expect, it } from 'vitest';

import {
  SAFETY_VERSIONING_INVARIANTS,
  SAFETY_VERSIONING_INVARIANT_DESCRIPTIONS,
  SAFETY_VERSIONING_PRINCIPLES,
  SAFETY_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / safety versioning (ai/safety/safety-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(SAFETY_VERSIONING_PRINCIPLES).toEqual([
      'change-never-lowers-protection',
      'versioned',
      'change-is-governed',
      'compatibility-preserved-or-migrated',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(SAFETY_VERSIONING_INVARIANTS).toEqual([
      'change-never-lowers-protection-outside-amendment',
      'each-definition-versioned',
      'incompatible-versioned-and-migrated',
      'deprecated-protects-until-migrated',
      'versioning-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of SAFETY_VERSIONING_PRINCIPLES) {
      expect(SAFETY_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SAFETY_VERSIONING_INVARIANTS) {
      expect(SAFETY_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(SAFETY_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(SAFETY_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(SAFETY_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SAFETY_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
