import { describe, expect, it } from 'vitest';

import {
  TOOL_COMPOSITION_INVARIANTS,
  TOOL_COMPOSITION_INVARIANT_DESCRIPTIONS,
  TOOL_COMPOSITION_PRINCIPLES,
  TOOL_COMPOSITION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool composition (ai/tools/tool-composition.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_COMPOSITION_PRINCIPLES).toEqual([
      'composition-chains-tools-it-does-not-execute-one',
      'a-composition-is-bounded-and-acyclic',
      'a-composition-is-governed-and-validated-throughout',
      'a-composition-is-reusable-and-deterministic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_COMPOSITION_INVARIANTS).toEqual([
      'a-composition-is-finite-acyclic-chain',
      'every-tool-selected-validated-executed-same-rules',
      'never-escalates-authority-or-bypasses-validation-or-safety',
      'same-composition-same-inputs-orders-same-tools',
      'composing-tools-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of TOOL_COMPOSITION_PRINCIPLES) {
      expect(TOOL_COMPOSITION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_COMPOSITION_INVARIANTS) {
      expect(TOOL_COMPOSITION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_COMPOSITION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPOSITION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPOSITION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPOSITION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
