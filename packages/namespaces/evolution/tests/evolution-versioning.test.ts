import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_VERSIONING_INVARIANTS,
  EVOLUTION_VERSIONING_INVARIANT_DESCRIPTIONS,
  EVOLUTION_VERSIONING_PRINCIPLES,
  EVOLUTION_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / versioning (ai/evolution/evolution-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVOLUTION_VERSIONING_PRINCIPLES).toEqual([
      'the-architecture-is-versioned-across-generations',
      'change-is-governed',
      'compatibility-spans-generations',
      'versioning-changes-the-architecture-not-behavior',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVOLUTION_VERSIONING_INVARIANTS).toEqual([
      'the-architecture-advances-through-defined-identified-generations',
      'a-change-of-generation-evolves-only-under-governed-change-rules-and-human-governance',
      'a-new-generation-preserves-compatibility-or-migrates-and-deprecates-never-silent',
      'versioning-never-changes-namespace-behavior-or-knowledge-business-truth',
      'versioning-the-architecture-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVOLUTION_VERSIONING_PRINCIPLES) {
      expect(EVOLUTION_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_VERSIONING_INVARIANTS) {
      expect(EVOLUTION_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
