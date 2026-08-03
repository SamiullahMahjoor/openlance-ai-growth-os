import { describe, expect, it } from 'vitest';

import {
  OPERATIONS_VERSIONING_ASPECTS,
  OPERATIONS_VERSIONING_ASPECT_DESCRIPTIONS,
  OPERATIONS_VERSIONING_INVARIANTS,
  OPERATIONS_VERSIONING_INVARIANT_DESCRIPTIONS,
  OPERATIONS_VERSIONING_PRINCIPLES,
  OPERATIONS_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / versioning (ai/operations/operations-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(OPERATIONS_VERSIONING_PRINCIPLES).toEqual([
      'an-operational-definition-is-versioned',
      'change-is-governed',
      'compatibility-is-preserved-or-migrated',
      'versioning-changes-operation-not-behavior',
    ]);
  });

  it('defines exactly the four aspects of operations versioning', () => {
    expect(OPERATIONS_VERSIONING_ASPECTS).toEqual([
      'version-rules',
      'evolution',
      'migration',
      'compatibility-and-deprecation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(OPERATIONS_VERSIONING_INVARIANTS).toEqual([
      'an-operational-definition-and-runtime-artifact-version-carry-a-version',
      'evolves-only-under-the-governed-change-rules',
      'a-change-that-breaks-operating-consistency-is-versioned-and-migrated-never-silent',
      'versioning-changes-how-the-layer-is-operated-never-the-behavior-of-a-namespace',
      'versioning-an-operational-definition-is-inert',
    ]);
  });

  it('gives every principle, aspect, and invariant a non-empty description', () => {
    for (const id of OPERATIONS_VERSIONING_PRINCIPLES) {
      expect(OPERATIONS_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_VERSIONING_ASPECTS) {
      expect(OPERATIONS_VERSIONING_ASPECT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_VERSIONING_INVARIANTS) {
      expect(OPERATIONS_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OPERATIONS_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_VERSIONING_ASPECTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_VERSIONING_ASPECT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
