import { describe, expect, it } from 'vitest';

import {
  TOOL_CAPABILITIES_INVARIANTS,
  TOOL_CAPABILITIES_INVARIANT_DESCRIPTIONS,
  TOOL_CAPABILITIES_PRINCIPLES,
  TOOL_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool capabilities (ai/tools/tool-capabilities.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_CAPABILITIES_PRINCIPLES).toEqual([
      'a-capability-is-a-declared-ability',
      'a-capability-describes-it-does-not-act',
      'capabilities-are-neutral',
      'capability-inheritance-is-single-and-acyclic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_CAPABILITIES_INVARIANTS).toEqual([
      'offers-only-declared-capabilities-never-selected-for-undeclared',
      'a-capability-names-an-ability-never-performs-the-interaction',
      'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity',
      'capabilities-described-technology-neutral',
      'declaring-capabilities-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of TOOL_CAPABILITIES_PRINCIPLES) {
      expect(TOOL_CAPABILITIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_CAPABILITIES_INVARIANTS) {
      expect(TOOL_CAPABILITIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_CAPABILITIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_CAPABILITIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_CAPABILITIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_CAPABILITIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
