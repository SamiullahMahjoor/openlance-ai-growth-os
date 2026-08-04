import { describe, expect, it } from 'vitest';

import {
  MIGRATION_MODEL_INVARIANTS,
  MIGRATION_MODEL_INVARIANT_DESCRIPTIONS,
  MIGRATION_MODEL_PRINCIPLES,
  MIGRATION_MODEL_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / migration model (ai/evolution/migration-model.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MIGRATION_MODEL_PRINCIPLES).toEqual([
      'migration-moves-it-does-not-break',
      'migration-is-phased',
      'migration-is-safe-by-construction',
      'migration-is-deliberate-and-reversible-until-committed',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MIGRATION_MODEL_INVARIANTS).toEqual([
      'moves-to-a-replacement-without-breaking-what-depends-on-it',
      'proceeds-through-defined-phases-never-abrupt',
      'at-every-phase-stays-consistent-superseded-works-until-dependents-moved',
      'a-migration-that-cannot-preserve-safety-does-not-proceed-and-is-escalated',
      'migrating-the-architecture-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MIGRATION_MODEL_PRINCIPLES) {
      expect(MIGRATION_MODEL_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MIGRATION_MODEL_INVARIANTS) {
      expect(MIGRATION_MODEL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MIGRATION_MODEL_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MIGRATION_MODEL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MIGRATION_MODEL_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MIGRATION_MODEL_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
