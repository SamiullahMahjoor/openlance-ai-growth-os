import { describe, expect, it } from 'vitest';

import {
  PROMPT_TEMPLATE_INVARIANTS,
  PROMPT_TEMPLATE_INVARIANT_DESCRIPTIONS,
  PROMPT_TEMPLATE_PRINCIPLES,
  PROMPT_TEMPLATE_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt templates (ai/prompts/prompt-templates.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_TEMPLATE_PRINCIPLES).toEqual([
      'a-template-is-a-reusable-form-not-content',
      'templates-provide-reuse',
      'templates-provide-consistency',
      'templates-hold-references-not-truth',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_TEMPLATE_INVARIANTS).toEqual([
      'a-template-is-a-form-with-places-never-content',
      'defined-once-used-by-many',
      'same-template-shared-consistent-structure',
      'holds-places-never-embeds-truth',
      'defining-a-template-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROMPT_TEMPLATE_PRINCIPLES) {
      expect(PROMPT_TEMPLATE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_TEMPLATE_INVARIANTS) {
      expect(PROMPT_TEMPLATE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_TEMPLATE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_TEMPLATE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_TEMPLATE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_TEMPLATE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
