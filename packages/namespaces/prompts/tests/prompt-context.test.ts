import { describe, expect, it } from 'vitest';

import {
  PROMPT_CONTEXT_INVARIANTS,
  PROMPT_CONTEXT_INVARIANT_DESCRIPTIONS,
  PROMPT_CONTEXT_PRINCIPLES,
  PROMPT_CONTEXT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt context (ai/prompts/prompt-context.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_CONTEXT_PRINCIPLES).toEqual([
      'points-to-knowledge-never-embeds',
      'context-separated-from-instruction',
      'context-consumed-never-owned',
      'context-is-deterministic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_CONTEXT_INVARIANTS).toEqual([
      'context-enters-as-reference-never-embedded',
      'referenced-context-held-separately',
      'references-determined-and-retained-owns-none',
      'never-promoted-into-knowledge-repository',
      'separating-context-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROMPT_CONTEXT_PRINCIPLES) {
      expect(PROMPT_CONTEXT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_CONTEXT_INVARIANTS) {
      expect(PROMPT_CONTEXT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_CONTEXT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_CONTEXT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_CONTEXT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_CONTEXT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
