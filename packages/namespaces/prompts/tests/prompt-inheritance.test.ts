import { describe, expect, it } from 'vitest';

import {
  PROMPT_INHERITANCE_INVARIANTS,
  PROMPT_INHERITANCE_INVARIANT_DESCRIPTIONS,
  PROMPT_INHERITANCE_PRINCIPLES,
  PROMPT_INHERITANCE_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt inheritance (ai/prompts/prompt-inheritance.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_INHERITANCE_PRINCIPLES).toEqual([
      'inheritance-is-derivation-not-duplication',
      'hierarchy-descends-general-to-specific',
      'a-derived-prompt-depends-on-its-base',
      'conflicts-resolve-by-authority-then-owner-then-specificity',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_INHERITANCE_INVARIANTS).toEqual([
      'derived-inherits-shared-parts-not-restates',
      'derived-depends-explicitly-on-base',
      'conflict-resolves-by-authority-then-owner-then-specificity',
      'unresolvable-conflict-escalated-never-guessed',
      'resolving-inheritance-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROMPT_INHERITANCE_PRINCIPLES) {
      expect(PROMPT_INHERITANCE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_INHERITANCE_INVARIANTS) {
      expect(PROMPT_INHERITANCE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_INHERITANCE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_INHERITANCE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_INHERITANCE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_INHERITANCE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
