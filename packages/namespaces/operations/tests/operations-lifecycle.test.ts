import { describe, expect, it } from 'vitest';

import {
  OPERATIONS_LIFECYCLE_INVARIANTS,
  OPERATIONS_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  OPERATIONS_LIFECYCLE_PHASES,
  OPERATIONS_LIFECYCLE_PHASE_DESCRIPTIONS,
  OPERATIONS_LIFECYCLE_PRINCIPLES,
  OPERATIONS_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  operationsPhaseAtOrAfter,
} from '../src/index';

describe('operations / lifecycle (ai/operations/operations-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(OPERATIONS_LIFECYCLE_PRINCIPLES).toEqual([
      'operation-has-a-defined-beginning-and-end',
      'startup-precedes-steady-state',
      'steady-state-is-observed-and-kept-healthy',
      'retirement-is-orderly',
    ]);
  });

  it('defines exactly the four ordered phases, startup to retirement', () => {
    expect(OPERATIONS_LIFECYCLE_PHASES).toEqual([
      'startup',
      'steady-state',
      'maintenance',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(OPERATIONS_LIFECYCLE_INVARIANTS).toEqual([
      'begins-at-startup-ends-at-retirement',
      'startup-precedes-steady-state-and-returns-from-maintenance-to-steady-state',
      'every-phase-observes-and-maintains-without-changing-behavior',
      'retirement-is-orderly-and-leaves-nothing-running-unattended',
      'a-phase-transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of OPERATIONS_LIFECYCLE_PRINCIPLES) {
      expect(OPERATIONS_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_LIFECYCLE_PHASES) {
      expect(OPERATIONS_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_LIFECYCLE_INVARIANTS) {
      expect(OPERATIONS_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('operationsPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(operationsPhaseAtOrAfter('retirement', 'startup')).toBe(true);
      expect(operationsPhaseAtOrAfter('maintenance', 'maintenance')).toBe(true);
      expect(operationsPhaseAtOrAfter('startup', 'retirement')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      OPERATIONS_LIFECYCLE_PHASES.forEach((a, i) => {
        OPERATIONS_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(operationsPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
