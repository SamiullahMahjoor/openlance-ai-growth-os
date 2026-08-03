import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_SELECTION_INVARIANTS,
  KNOWLEDGE_SELECTION_INVARIANT_DESCRIPTIONS,
  KNOWLEDGE_SELECTION_PRINCIPLES,
  KNOWLEDGE_SELECTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / knowledge selection (ai/retrieval/knowledge-selection.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(KNOWLEDGE_SELECTION_PRINCIPLES).toEqual([
      'by-relevance-and-eligibility',
      'minimal',
      'governance-permits-or-denies',
      'deterministic',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(KNOWLEDGE_SELECTION_INVARIANTS).toEqual([
      'only-relevant-eligible-permitted',
      'selection-is-minimal',
      'deterministic-over-candidates',
      'selecting-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of KNOWLEDGE_SELECTION_PRINCIPLES) {
      expect(KNOWLEDGE_SELECTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of KNOWLEDGE_SELECTION_INVARIANTS) {
      expect(KNOWLEDGE_SELECTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(KNOWLEDGE_SELECTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_SELECTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_SELECTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_SELECTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
