import { describe, expect, it } from 'vitest';

import {
  PROVIDER_LIFECYCLE_INVARIANTS,
  PROVIDER_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  PROVIDER_LIFECYCLE_PHASES,
  PROVIDER_LIFECYCLE_PHASE_DESCRIPTIONS,
  PROVIDER_LIFECYCLE_PRINCIPLES,
  PROVIDER_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  phaseAtOrAfter,
  usableInPhase,
} from '../src/index';

describe('providers / provider lifecycle (ai/providers/provider-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_LIFECYCLE_PRINCIPLES).toEqual([
      'defined-beginning-and-end',
      'registration-precedes-availability',
      'discovery-follows-registration',
      'retirement-is-clean',
    ]);
  });

  it('defines exactly the five ordered lifecycle phases', () => {
    expect(PROVIDER_LIFECYCLE_PHASES).toEqual([
      'registration',
      'discovery',
      'activation',
      'operation',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_LIFECYCLE_INVARIANTS).toEqual([
      'registered-then-discoverable-then-active',
      'used-only-while-active',
      'retired-not-selected-or-routed',
      'retirement-is-orderly',
      'transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of PROVIDER_LIFECYCLE_PRINCIPLES) {
      expect(PROVIDER_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_LIFECYCLE_PHASES) {
      expect(PROVIDER_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_LIFECYCLE_INVARIANTS) {
      expect(PROVIDER_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('phaseAtOrAfter', () => {
    it('holds for a later phase and for equal phases', () => {
      expect(phaseAtOrAfter('operation', 'registration')).toBe(true);
      expect(phaseAtOrAfter('retirement', 'activation')).toBe(true);
      expect(phaseAtOrAfter('discovery', 'discovery')).toBe(true);
    });

    it('is false for an earlier phase', () => {
      expect(phaseAtOrAfter('registration', 'operation')).toBe(false);
      expect(phaseAtOrAfter('activation', 'retirement')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      PROVIDER_LIFECYCLE_PHASES.forEach((a, i) => {
        PROVIDER_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(phaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  describe('usableInPhase', () => {
    it('is usable only in activation and operation', () => {
      expect(usableInPhase('activation')).toBe(true);
      expect(usableInPhase('operation')).toBe(true);
    });

    it('is not usable in registration, discovery, or retirement', () => {
      expect(usableInPhase('registration')).toBe(false);
      expect(usableInPhase('discovery')).toBe(false);
      expect(usableInPhase('retirement')).toBe(false);
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
