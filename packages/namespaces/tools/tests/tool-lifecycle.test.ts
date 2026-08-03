import { describe, expect, it } from 'vitest';

import {
  TOOL_LIFECYCLE_INVARIANTS,
  TOOL_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  TOOL_LIFECYCLE_PHASES,
  TOOL_LIFECYCLE_PHASE_DESCRIPTIONS,
  TOOL_LIFECYCLE_PRINCIPLES,
  TOOL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  toolPhaseAtOrAfter,
} from '../src/index';

describe('tools / tool lifecycle (ai/tools/tool-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_LIFECYCLE_PRINCIPLES).toEqual([
      'a-tool-has-a-defined-beginning-and-end',
      'registration-precedes-availability',
      'every-execution-is-bounded',
      'retirement-is-clean',
    ]);
  });

  it('defines exactly the five ordered phases, registration to retirement', () => {
    expect(TOOL_LIFECYCLE_PHASES).toEqual([
      'registration',
      'discovery',
      'activation',
      'execution-lifecycle',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_LIFECYCLE_INVARIANTS).toEqual([
      'registered-before-discoverable-discoverable-before-activated',
      'used-only-while-active-activation-never-widens-capabilities',
      'each-execution-bounded-within-operation-phase',
      'retired-tool-not-selected-or-executed-retirement-non-disruptive',
      'a-lifecycle-transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of TOOL_LIFECYCLE_PRINCIPLES) {
      expect(TOOL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_LIFECYCLE_PHASES) {
      expect(TOOL_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_LIFECYCLE_INVARIANTS) {
      expect(TOOL_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('toolPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(toolPhaseAtOrAfter('retirement', 'registration')).toBe(true);
      expect(toolPhaseAtOrAfter('activation', 'activation')).toBe(true);
      expect(toolPhaseAtOrAfter('registration', 'retirement')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      TOOL_LIFECYCLE_PHASES.forEach((a, i) => {
        TOOL_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(toolPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(TOOL_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
