import { describe, expect, it } from 'vitest';

import {
  RETRIEVAL_CONCERNS,
  RETRIEVAL_CONCERN_DESCRIPTIONS,
  RETRIEVAL_INVARIANTS,
  RETRIEVAL_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / namespace (ai/retrieval/README.md, ai/retrieval/retrieval.md)', () => {
  it('defines exactly the nine retrieval invariants in constitutional order', () => {
    expect(RETRIEVAL_INVARIANTS).toEqual([
      'consumes-never-owns',
      'cross-layer-one-directional',
      'determines-runtime-loads',
      'authority-and-ownership-aware',
      'dependency-complete',
      'minimal',
      'validated-before-loading',
      'deterministic',
      'scales-without-redesign',
    ]);
  });

  it('defines exactly the ten retrieval concerns in inventory order', () => {
    expect(RETRIEVAL_CONCERNS).toEqual([
      'retrieval-lifecycle',
      'retrieval-workflow',
      'knowledge-discovery',
      'knowledge-selection',
      'context-assembly',
      'context-prioritization',
      'dependency-resolution',
      'loading-strategy',
      'retrieval-boundaries',
      'retrieval-validation',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of RETRIEVAL_INVARIANTS) {
      expect(RETRIEVAL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_CONCERNS) {
      expect(RETRIEVAL_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RETRIEVAL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_CONCERNS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
