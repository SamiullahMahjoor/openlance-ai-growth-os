import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_RESOLUTION_INVARIANTS,
  KNOWLEDGE_RESOLUTION_INVARIANT_DESCRIPTIONS,
  KNOWLEDGE_RESOLUTION_PRINCIPLES,
  KNOWLEDGE_RESOLUTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('runtime / knowledge resolution (ai/runtime/knowledge-resolution.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(KNOWLEDGE_RESOLUTION_PRINCIPLES).toEqual([
      'the-runtime-orchestrates-it-does-not-own-knowledge',
      'loading-follows-the-knowledge-loading-strategy',
      'top-of-the-hierarchy-downward',
      'required-before-contextual',
      'loading-is-one-directional',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(KNOWLEDGE_RESOLUTION_INVARIANTS).toEqual([
      'knowledge-loaded-from-canonical-owner-never-restated',
      'higher-authority-loaded-before-lower',
      'required-loaded-before-contextual',
      'loading-read-only-across-the-layer-boundary',
      'resolving-knowledge-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of KNOWLEDGE_RESOLUTION_PRINCIPLES) {
      expect(KNOWLEDGE_RESOLUTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of KNOWLEDGE_RESOLUTION_INVARIANTS) {
      expect(KNOWLEDGE_RESOLUTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(KNOWLEDGE_RESOLUTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_RESOLUTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_RESOLUTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_RESOLUTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
