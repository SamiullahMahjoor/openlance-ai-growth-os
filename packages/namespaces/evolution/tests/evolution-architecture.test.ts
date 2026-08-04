import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_ARCHITECTURE_INVARIANTS,
  EVOLUTION_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  EVOLUTION_ARCHITECTURE_PRINCIPLES,
  EVOLUTION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  EVOLUTION_PARTS,
  EVOLUTION_PART_DESCRIPTIONS,
} from '../src/index';

describe('evolution / architecture (ai/evolution/evolution-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVOLUTION_ARCHITECTURE_PRINCIPLES).toEqual([
      'evolution-is-a-discipline-not-a-behavior',
      'evolution-has-a-distinct-identity',
      'evolution-is-composed-of-defined-parts',
      'the-evolution-structure-is-deterministic',
    ]);
  });

  it('defines exactly the seven parts the evolution model is composed of', () => {
    expect(EVOLUTION_PARTS).toEqual([
      'planning',
      'lifecycle',
      'change',
      'compatibility',
      'migration',
      'deprecation',
      'growth',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVOLUTION_ARCHITECTURE_INVARIANTS).toEqual([
      'a-distinct-identifiable-discipline-separate-from-operations-workflow-and-behavior',
      'composed-of-planning-lifecycle-change-compatibility-migration-deprecation-and-growth',
      'changes-the-architecture-without-eroding-the-constitution-or-owning-knowledge',
      'same-change-same-current-architecture-same-evolution-model',
      'defining-structure-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of EVOLUTION_ARCHITECTURE_PRINCIPLES) {
      expect(EVOLUTION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_PARTS) {
      expect(EVOLUTION_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_ARCHITECTURE_INVARIANTS) {
      expect(EVOLUTION_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_PARTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
