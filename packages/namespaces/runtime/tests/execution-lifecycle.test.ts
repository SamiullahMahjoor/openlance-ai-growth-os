import { describe, expect, it } from 'vitest';

import {
  EXECUTION_LIFECYCLE_INVARIANTS,
  EXECUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  EXECUTION_LIFECYCLE_PHASES,
  EXECUTION_LIFECYCLE_PHASE_DESCRIPTIONS,
  EXECUTION_LIFECYCLE_PRINCIPLES,
  EXECUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  executionPhaseAtOrAfter,
} from '../src/index';

describe('runtime / execution lifecycle (ai/runtime/execution-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EXECUTION_LIFECYCLE_PRINCIPLES).toEqual([
      'every-execution-has-a-defined-beginning-and-end',
      'governance-precedes-execution',
      'every-execution-terminates',
      'resources-are-released',
    ]);
  });

  it('defines exactly the five ordered phases, initialization to finalization', () => {
    expect(EXECUTION_LIFECYCLE_PHASES).toEqual([
      'initialization',
      'loading',
      'validation',
      'execution',
      'finalization',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EXECUTION_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-execution',
      'validation-always-precedes-execution',
      'always-reaches-finalization',
      'finalization-always-releases-resources',
      'lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of EXECUTION_LIFECYCLE_PRINCIPLES) {
      expect(EXECUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_LIFECYCLE_PHASES) {
      expect(EXECUTION_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_LIFECYCLE_INVARIANTS) {
      expect(EXECUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('executionPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(executionPhaseAtOrAfter('finalization', 'initialization')).toBe(true);
      expect(executionPhaseAtOrAfter('validation', 'validation')).toBe(true);
      expect(executionPhaseAtOrAfter('initialization', 'finalization')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      EXECUTION_LIFECYCLE_PHASES.forEach((a, i) => {
        EXECUTION_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(executionPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
