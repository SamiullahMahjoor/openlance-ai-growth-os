import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_LIFECYCLE_INVARIANTS,
  EVOLUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  EVOLUTION_LIFECYCLE_PHASES,
  EVOLUTION_LIFECYCLE_PHASE_DESCRIPTIONS,
  EVOLUTION_LIFECYCLE_PRINCIPLES,
  EVOLUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  evolutionPhaseAtOrAfter,
} from '../src/index';

describe('evolution / lifecycle (ai/evolution/evolution-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVOLUTION_LIFECYCLE_PRINCIPLES).toEqual([
      'a-change-has-a-defined-beginning-and-end',
      'review-and-approval-precede-introduction',
      'introduction-is-additive-and-stabilized',
      'retirement-is-orderly',
    ]);
  });

  it('defines exactly the six ordered phases, proposal to retirement', () => {
    expect(EVOLUTION_LIFECYCLE_PHASES).toEqual([
      'proposal',
      'review',
      'approval',
      'introduction',
      'stabilization',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVOLUTION_LIFECYCLE_INVARIANTS).toEqual([
      'begins-at-proposal-ends-at-stabilization-or-retirement',
      'review-and-approval-precede-introduction-nothing-enters-ungoverned',
      'introduced-additively-and-stabilized-before-relied-on',
      'a-part-is-retired-only-after-deprecated-and-dependents-migrated',
      'a-phase-transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of EVOLUTION_LIFECYCLE_PRINCIPLES) {
      expect(EVOLUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_LIFECYCLE_PHASES) {
      expect(EVOLUTION_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_LIFECYCLE_INVARIANTS) {
      expect(EVOLUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('evolutionPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(evolutionPhaseAtOrAfter('retirement', 'proposal')).toBe(true);
      expect(evolutionPhaseAtOrAfter('approval', 'approval')).toBe(true);
      expect(evolutionPhaseAtOrAfter('proposal', 'retirement')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      EVOLUTION_LIFECYCLE_PHASES.forEach((a, i) => {
        EVOLUTION_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(evolutionPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
