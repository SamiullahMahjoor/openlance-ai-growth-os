import { describe, expect, it } from 'vitest';

import {
  CONTEXT_ASSEMBLY_INVARIANTS,
  CONTEXT_ASSEMBLY_INVARIANT_DESCRIPTIONS,
  CONTEXT_ASSEMBLY_PRINCIPLES,
  CONTEXT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('retrieval / context assembly (ai/retrieval/context-assembly.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(CONTEXT_ASSEMBLY_PRINCIPLES).toEqual([
      'produces-determination-not-truth',
      'preserves-authority-and-order',
      'preserves-completeness',
      'by-canonical-reference',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(CONTEXT_ASSEMBLY_INVARIANTS).toEqual([
      'result-is-prioritized-complete-minimal',
      'each-piece-named-by-owner',
      'names-not-truth-or-context',
      'assembling-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of CONTEXT_ASSEMBLY_PRINCIPLES) {
      expect(CONTEXT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CONTEXT_ASSEMBLY_INVARIANTS) {
      expect(CONTEXT_ASSEMBLY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CONTEXT_ASSEMBLY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CONTEXT_ASSEMBLY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CONTEXT_ASSEMBLY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
