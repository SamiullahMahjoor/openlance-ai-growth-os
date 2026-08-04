import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_BOUNDARIES,
  EVOLUTION_BOUNDARY_DESCRIPTIONS,
  EVOLUTION_BOUNDARY_INVARIANTS,
  EVOLUTION_BOUNDARY_INVARIANT_DESCRIPTIONS,
  EVOLUTION_BOUNDARY_PRINCIPLES,
  EVOLUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / boundaries (ai/evolution/evolution-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVOLUTION_BOUNDARY_PRINCIPLES).toEqual([
      'evolution-defines-change-it-does-not-perform-behavior',
      'evolution-changes-the-architecture-not-the-behavior',
      'evolution-owns-no-workflow-rule-or-map',
      'evolution-owns-no-truth',
    ]);
  });

  it('defines exactly the six architectural boundaries', () => {
    expect(EVOLUTION_BOUNDARIES).toEqual([
      'behavior',
      'runtime-and-operations',
      'governance',
      'workflow-and-map',
      'knowledge',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVOLUTION_BOUNDARY_INVARIANTS).toEqual([
      'defines-change-never-executes-reasons-operates-or-performs-runtime-behavior',
      'changes-the-architecture-additively-never-the-behavior-of-a-namespace',
      'owns-no-workflow-rule-or-map-defers-each-to-its-owner',
      'owns-no-business-truth-only-describes-structural-integration-with-knowledge',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of EVOLUTION_BOUNDARY_PRINCIPLES) {
      expect(EVOLUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_BOUNDARIES) {
      expect(EVOLUTION_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_BOUNDARY_INVARIANTS) {
      expect(EVOLUTION_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
