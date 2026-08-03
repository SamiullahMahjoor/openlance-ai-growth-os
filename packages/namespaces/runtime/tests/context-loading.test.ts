import { describe, expect, it } from 'vitest';

import {
  CONTEXT_INPUTS,
  CONTEXT_INPUT_DESCRIPTIONS,
  CONTEXT_LOADING_INVARIANTS,
  CONTEXT_LOADING_INVARIANT_DESCRIPTIONS,
  CONTEXT_LOADING_PRINCIPLES,
  CONTEXT_LOADING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('runtime / context loading (ai/runtime/context-loading.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(CONTEXT_LOADING_PRINCIPLES).toEqual([
      'the-runtime-assembles-it-does-not-source',
      'context-is-composed-from-canonical-sources',
      'higher-authority-frames-the-context',
      'context-is-assembled-after-loading-and-before-execution',
      'assembly-is-technology-neutral',
    ]);
  });

  it('defines exactly the four kinds of context input in constitutional order', () => {
    expect(CONTEXT_INPUTS).toEqual(['loaded-knowledge', 'memory', 'task', 'governing-context']);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(CONTEXT_LOADING_INVARIANTS).toEqual([
      'every-piece-loaded-from-canonical-owner-never-restated',
      'context-complete-before-the-execution-phase',
      'lower-authority-never-assembled-without-higher',
      'assembling-context-is-inert',
    ]);
  });

  it('gives every principle, input, and invariant a non-empty description', () => {
    for (const id of CONTEXT_LOADING_PRINCIPLES) {
      expect(CONTEXT_LOADING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CONTEXT_INPUTS) {
      expect(CONTEXT_INPUT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CONTEXT_LOADING_INVARIANTS) {
      expect(CONTEXT_LOADING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CONTEXT_LOADING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CONTEXT_INPUTS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_LOADING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_LOADING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_INPUT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_LOADING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
