import { describe, expect, it } from 'vitest';

import {
  PROMPT_BOUNDARIES,
  PROMPT_BOUNDARY_DESCRIPTIONS,
  PROMPT_BOUNDARY_INVARIANTS,
  PROMPT_BOUNDARY_INVARIANT_DESCRIPTIONS,
  PROMPT_BOUNDARY_PRINCIPLES,
  PROMPT_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('prompts / prompt boundaries (ai/prompts/prompt-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_BOUNDARY_PRINCIPLES).toEqual([
      'express-not-execute-reason-retrieve-or-persist',
      'point-to-truth-never-own-it',
      'transient-never-stored-as-truth',
      'stay-within-governance',
    ]);
  });

  it('defines exactly the six architectural boundaries in constitutional order', () => {
    expect(PROMPT_BOUNDARIES).toEqual([
      'truth',
      'reasoning',
      'retrieval-and-memory',
      'execution',
      'governance',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_BOUNDARY_INVARIANTS).toEqual([
      'points-to-truth-never-owns-it',
      'never-executes-reasons-retrieves-persists-or-selects',
      'transient-never-stored-or-promoted',
      'exceeding-rules-refused-or-escalated',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of PROMPT_BOUNDARY_PRINCIPLES) {
      expect(PROMPT_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_BOUNDARIES) {
      expect(PROMPT_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_BOUNDARY_INVARIANTS) {
      expect(PROMPT_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(PROMPT_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
