import { describe, expect, it } from 'vitest';

import {
  TOOL_SELECTION_INVARIANTS,
  TOOL_SELECTION_INVARIANT_DESCRIPTIONS,
  TOOL_SELECTION_PRINCIPLES,
  TOOL_SELECTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool selection (ai/tools/tool-selection.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_SELECTION_PRINCIPLES).toEqual([
      'selection-is-deterministic',
      'selection-chooses-from-the-compatible',
      'selection-is-governed-and-bounded',
      'selection-matches-it-does-not-reason',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_SELECTION_INVARIANTS).toEqual([
      'same-need-same-tools-same-rules-same-choice',
      'chosen-only-from-active-and-compatible',
      'chosen-tool-permitted-under-governance-and-safety',
      'settled-by-defined-tiebreak-never-ambiguous-or-random',
      'choosing-a-tool-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of TOOL_SELECTION_PRINCIPLES) {
      expect(TOOL_SELECTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_SELECTION_INVARIANTS) {
      expect(TOOL_SELECTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_SELECTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_SELECTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_SELECTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_SELECTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
