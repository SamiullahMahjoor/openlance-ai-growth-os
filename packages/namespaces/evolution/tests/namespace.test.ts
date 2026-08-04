import { describe, expect, it } from 'vitest';

import {
  EVOLUTION_CONCERNS,
  EVOLUTION_CONCERN_DESCRIPTIONS,
  EVOLUTION_INVARIANTS,
  EVOLUTION_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('evolution / namespace (ai/evolution/README.md, ai/evolution/evolution.md)', () => {
  it('defines exactly the eight evolution invariants in constitutional order', () => {
    expect(EVOLUTION_INVARIANTS).toEqual([
      'defines-change-never-performs-behavior',
      'controlled-and-additive',
      'preserves-constitutional-stability',
      'preserves-compatibility-or-migrates',
      'acyclic',
      'deterministic',
      'defers-workflow-rules-map-and-truth',
      'single-owned-technology-neutral-and-scalable',
    ]);
  });

  it('defines exactly the ten evolution concerns in inventory order', () => {
    expect(EVOLUTION_CONCERNS).toEqual([
      'evolution-architecture',
      'evolution-lifecycle',
      'evolution-planning',
      'change-management',
      'compatibility-management',
      'migration-model',
      'deprecation-model',
      'repository-growth',
      'evolution-boundaries',
      'evolution-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of EVOLUTION_INVARIANTS) {
      expect(EVOLUTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVOLUTION_CONCERNS) {
      expect(EVOLUTION_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVOLUTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_CONCERNS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVOLUTION_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
