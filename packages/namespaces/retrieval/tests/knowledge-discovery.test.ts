import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_DISCOVERY_INVARIANTS,
  KNOWLEDGE_DISCOVERY_INVARIANT_DESCRIPTIONS,
  KNOWLEDGE_DISCOVERY_PRINCIPLES,
  KNOWLEDGE_DISCOVERY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / knowledge discovery (ai/retrieval/knowledge-discovery.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(KNOWLEDGE_DISCOVERY_PRINCIPLES).toEqual([
      'by-ownership',
      'reads-never-authors',
      'authority-aware',
      'complete-over-canonical-sources',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(KNOWLEDGE_DISCOVERY_INVARIANTS).toEqual([
      'candidate-is-canonical-owner',
      'yields-candidates-only',
      'read-only-across-layer',
      'discovering-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of KNOWLEDGE_DISCOVERY_PRINCIPLES) {
      expect(KNOWLEDGE_DISCOVERY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of KNOWLEDGE_DISCOVERY_INVARIANTS) {
      expect(KNOWLEDGE_DISCOVERY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(KNOWLEDGE_DISCOVERY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_DISCOVERY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_DISCOVERY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(KNOWLEDGE_DISCOVERY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
