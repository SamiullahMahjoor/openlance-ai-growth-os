import { describe, expect, it } from 'vitest';

import {
  PROMPT_LIFECYCLE_INVARIANTS,
  PROMPT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  PROMPT_LIFECYCLE_PHASES,
  PROMPT_LIFECYCLE_PHASE_DESCRIPTIONS,
  PROMPT_LIFECYCLE_PRINCIPLES,
  PROMPT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  promptPhaseAtOrAfter,
} from '../src/index';

describe('prompts / prompt lifecycle (ai/prompts/prompt-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_LIFECYCLE_PRINCIPLES).toEqual([
      'defined-beginning-and-end',
      'definition-precedes-composition',
      'validation-precedes-expression',
      'every-prompt-is-transient',
    ]);
  });

  it('defines exactly the five ordered phases, definition to retirement', () => {
    expect(PROMPT_LIFECYCLE_PHASES).toEqual([
      'definition',
      'composition',
      'validation',
      'expression',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-prompt',
      'phases-occur-in-order',
      'validated-before-expressed',
      'transient-retired-never-promoted',
      'lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of PROMPT_LIFECYCLE_PRINCIPLES) {
      expect(PROMPT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_LIFECYCLE_PHASES) {
      expect(PROMPT_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_LIFECYCLE_INVARIANTS) {
      expect(PROMPT_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('promptPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(promptPhaseAtOrAfter('retirement', 'definition')).toBe(true);
      expect(promptPhaseAtOrAfter('validation', 'validation')).toBe(true);
      expect(promptPhaseAtOrAfter('definition', 'expression')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      PROMPT_LIFECYCLE_PHASES.forEach((a, i) => {
        PROMPT_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(promptPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(PROMPT_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
