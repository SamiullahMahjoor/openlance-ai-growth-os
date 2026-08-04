import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_PLANNING_INVARIANTS,
  EVOLUTION_PLANNING_INVARIANT_DESCRIPTIONS,
  EVOLUTION_PLANNING_PRINCIPLES,
  EVOLUTION_PLANNING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / planning (ai/evolution/evolution-planning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVOLUTION_PLANNING_PRINCIPLES).toEqual([
      'planning-is-forward-looking-not-a-change',
      'planning-applies-the-roadmap-it-does-not-own-it',
      'sequencing-respects-dependencies',
      'planning-is-acyclic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVOLUTION_PLANNING_INVARIANTS).toEqual([
      'arranges-and-sequences-change-never-makes-a-change',
      'applies-the-future-architecture-roadmap-never-redefines-it',
      'a-change-is-sequenced-after-the-changes-and-namespaces-it-depends-on',
      'a-plan-is-acyclic-no-change-depends-on-itself',
      'planning-evolution-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of EVOLUTION_PLANNING_PRINCIPLES) {
      expect(EVOLUTION_PLANNING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_PLANNING_INVARIANTS) {
      expect(EVOLUTION_PLANNING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_PLANNING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_PLANNING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_PLANNING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_PLANNING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
