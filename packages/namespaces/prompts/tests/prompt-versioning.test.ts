import { describe, expect, it } from 'vitest';

import {
  PROMPT_VERSIONING_INVARIANTS,
  PROMPT_VERSIONING_INVARIANT_DESCRIPTIONS,
  PROMPT_VERSIONING_PRINCIPLES,
  PROMPT_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt versioning (ai/prompts/prompt-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_VERSIONING_PRINCIPLES).toEqual([
      'a-prompt-definition-is-versioned',
      'change-is-governed',
      'compatibility-is-preserved-or-versioned',
      'versioning-governs-definitions-not-truth',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_VERSIONING_INVARIANTS).toEqual([
      'a-durable-definition-carries-a-version',
      'evolves-only-under-governed-change',
      'incompatible-change-is-a-new-version',
      'versioning-applies-to-architecture-not-truth-or-transient-prompt',
      'versioning-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROMPT_VERSIONING_PRINCIPLES) {
      expect(PROMPT_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_VERSIONING_INVARIANTS) {
      expect(PROMPT_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
