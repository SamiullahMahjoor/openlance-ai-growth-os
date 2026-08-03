import { describe, expect, it } from 'vitest';

import {
  PROVIDER_VERSIONING_ASPECTS,
  PROVIDER_VERSIONING_ASPECT_DESCRIPTIONS,
  PROVIDER_VERSIONING_INVARIANTS,
  PROVIDER_VERSIONING_INVARIANT_DESCRIPTIONS,
  PROVIDER_VERSIONING_PRINCIPLES,
  PROVIDER_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider versioning (ai/providers/provider-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_VERSIONING_PRINCIPLES).toEqual([
      'definition-is-versioned',
      'change-is-governed',
      'compatibility-preserved-or-migrated',
      'churn-absorbed-here',
    ]);
  });

  it('defines exactly the four versioning aspects in constitutional order', () => {
    expect(PROVIDER_VERSIONING_ASPECTS).toEqual([
      'version-rules',
      'evolution',
      'migration',
      'deprecation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_VERSIONING_INVARIANTS).toEqual([
      'carries-a-version',
      'evolves-only-under-governed-change',
      'breaking-change-versioned-and-migrated',
      'deprecated-serves-until-migrated',
      'versioning-is-inert',
    ]);
  });

  it('gives every principle, aspect, and invariant a non-empty description', () => {
    for (const id of PROVIDER_VERSIONING_PRINCIPLES) {
      expect(PROVIDER_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_VERSIONING_ASPECTS) {
      expect(PROVIDER_VERSIONING_ASPECT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_VERSIONING_INVARIANTS) {
      expect(PROVIDER_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_VERSIONING_ASPECTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_VERSIONING_ASPECT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
