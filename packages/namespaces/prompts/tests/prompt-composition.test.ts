import { describe, expect, it } from 'vitest';

import {
  PROMPT_COMPOSITION_INVARIANTS,
  PROMPT_COMPOSITION_INVARIANT_DESCRIPTIONS,
  PROMPT_COMPOSITION_PRINCIPLES,
  PROMPT_COMPOSITION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt composition (ai/prompts/prompt-composition.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_COMPOSITION_PRINCIPLES).toEqual([
      'composition-is-deterministic',
      'combines-parts-never-invents',
      'preserves-separation',
      'governed-and-bounded',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_COMPOSITION_INVARIANTS).toEqual([
      'same-parts-compose-same-prompt',
      'composed-only-from-defined-parts',
      'context-composed-as-reference',
      'exceeding-rules-or-boundaries-yields-no-prompt',
      'composing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROMPT_COMPOSITION_PRINCIPLES) {
      expect(PROMPT_COMPOSITION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_COMPOSITION_INVARIANTS) {
      expect(PROMPT_COMPOSITION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_COMPOSITION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_COMPOSITION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_COMPOSITION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_COMPOSITION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
