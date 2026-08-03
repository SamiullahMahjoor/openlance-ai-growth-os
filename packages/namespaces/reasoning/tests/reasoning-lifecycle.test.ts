import { describe, expect, it } from 'vitest';

import {
  REASONING_LIFECYCLE_INVARIANTS,
  REASONING_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  REASONING_LIFECYCLE_PHASES,
  REASONING_LIFECYCLE_PHASE_DESCRIPTIONS,
  REASONING_LIFECYCLE_PRINCIPLES,
  REASONING_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  reasoningPhaseAtOrAfter,
} from '../src/index';

describe('reasoning / reasoning lifecycle (ai/reasoning/reasoning-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_LIFECYCLE_PRINCIPLES).toEqual([
      'defined-beginning-and-end',
      'framing-precedes-transformation',
      'conclusion-precedes-validation',
      'every-reasoning-terminates',
    ]);
  });

  it('defines exactly the four ordered lifecycle phases', () => {
    expect(REASONING_LIFECYCLE_PHASES).toEqual([
      'framing',
      'transformation',
      'conclusion',
      'validation',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(REASONING_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-reasoning',
      'phases-occur-in-order',
      'terminates-in-conclusion-escalation-or-governed-absence',
      'lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of REASONING_LIFECYCLE_PRINCIPLES) {
      expect(REASONING_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_LIFECYCLE_PHASES) {
      expect(REASONING_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_LIFECYCLE_INVARIANTS) {
      expect(REASONING_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('reasoningPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(reasoningPhaseAtOrAfter('validation', 'framing')).toBe(true);
      expect(reasoningPhaseAtOrAfter('conclusion', 'conclusion')).toBe(true);
      expect(reasoningPhaseAtOrAfter('framing', 'validation')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      REASONING_LIFECYCLE_PHASES.forEach((a, i) => {
        REASONING_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(reasoningPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(REASONING_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
