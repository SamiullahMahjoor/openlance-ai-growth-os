import { describe, expect, it } from 'vitest';

import {
  PROMPT_CONCERNS,
  PROMPT_CONCERN_DESCRIPTIONS,
  PROMPT_INVARIANTS,
  PROMPT_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('prompts / namespace (ai/prompts/README.md, ai/prompts/prompts.md)', () => {
  it('defines exactly the eight prompt invariants in constitutional order', () => {
    expect(PROMPT_INVARIANTS).toEqual([
      'transient-never-truth',
      'points-never-embeds',
      'composed-deterministically',
      'governed-and-validated',
      'provider-neutral',
      'content-is-operational-output',
      'single-owned',
      'repeatable-and-scalable',
    ]);
  });

  it('defines exactly the ten prompt concerns in inventory order', () => {
    expect(PROMPT_CONCERNS).toEqual([
      'prompt-architecture',
      'prompt-lifecycle',
      'prompt-composition',
      'prompt-assembly',
      'prompt-templates',
      'prompt-context',
      'prompt-validation',
      'prompt-inheritance',
      'prompt-boundaries',
      'prompt-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of PROMPT_INVARIANTS) {
      expect(PROMPT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_CONCERNS) {
      expect(PROMPT_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_CONCERNS)).toBe(true);
    expect(Object.isFrozen(PROMPT_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
