import { describe, expect, it } from 'vitest';

import {
  MEMORY_LIFECYCLE_INVARIANTS,
  MEMORY_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  MEMORY_LIFECYCLE_PHASES,
  MEMORY_LIFECYCLE_PHASE_DESCRIPTIONS,
  MEMORY_LIFECYCLE_PRINCIPLES,
  MEMORY_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  lifecyclePhaseAtOrAfter,
} from '../src/index';

describe('memory / memory lifecycle (ai/memory/memory-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_LIFECYCLE_PRINCIPLES).toEqual([
      'defined-beginning-and-end',
      'grounded-at-formation',
      'retention-is-scoped',
      'yields-to-knowledge-throughout',
    ]);
  });

  it('defines exactly the three ordered lifecycle phases', () => {
    expect(MEMORY_LIFECYCLE_PHASES).toEqual(['formation', 'retention', 'removal']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-memory',
      'formation-precedes-retention-precedes-removal',
      'grounded-and-never-truth',
      'retention-activities-preserve-identity',
      'lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of MEMORY_LIFECYCLE_PRINCIPLES) {
      expect(MEMORY_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_LIFECYCLE_PHASES) {
      expect(MEMORY_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_LIFECYCLE_INVARIANTS) {
      expect(MEMORY_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('lifecyclePhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(lifecyclePhaseAtOrAfter('removal', 'formation')).toBe(true);
      expect(lifecyclePhaseAtOrAfter('retention', 'retention')).toBe(true);
      expect(lifecyclePhaseAtOrAfter('formation', 'removal')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      MEMORY_LIFECYCLE_PHASES.forEach((a, i) => {
        MEMORY_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(lifecyclePhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(MEMORY_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
