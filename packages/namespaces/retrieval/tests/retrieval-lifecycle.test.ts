import { describe, expect, it } from 'vitest';

import {
  RETRIEVAL_LIFECYCLE_INVARIANTS,
  RETRIEVAL_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  RETRIEVAL_LIFECYCLE_PHASES,
  RETRIEVAL_LIFECYCLE_PHASE_DESCRIPTIONS,
  RETRIEVAL_LIFECYCLE_PRINCIPLES,
  RETRIEVAL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  retrievalPhaseAtOrAfter,
} from '../src/index';

describe('retrieval / retrieval lifecycle (ai/retrieval/retrieval-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(RETRIEVAL_LIFECYCLE_PRINCIPLES).toEqual([
      'defined-beginning-and-end',
      'determination-precedes-result',
      'validation-precedes-handoff',
      'produces-determination-not-truth',
    ]);
  });

  it('defines exactly the five ordered lifecycle phases', () => {
    expect(RETRIEVAL_LIFECYCLE_PHASES).toEqual([
      'request',
      'determination',
      'assembly',
      'validation',
      'result',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(RETRIEVAL_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-retrieval',
      'validation-precedes-result',
      'terminates-in-validated-result-or-refusal',
      'lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of RETRIEVAL_LIFECYCLE_PRINCIPLES) {
      expect(RETRIEVAL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_LIFECYCLE_PHASES) {
      expect(RETRIEVAL_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_LIFECYCLE_INVARIANTS) {
      expect(RETRIEVAL_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('retrievalPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(retrievalPhaseAtOrAfter('result', 'request')).toBe(true);
      expect(retrievalPhaseAtOrAfter('validation', 'validation')).toBe(true);
      expect(retrievalPhaseAtOrAfter('request', 'result')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      RETRIEVAL_LIFECYCLE_PHASES.forEach((a, i) => {
        RETRIEVAL_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(retrievalPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
