import { describe, expect, it } from 'vitest';

import {
  TOOL_CONCERNS,
  TOOL_CONCERN_DESCRIPTIONS,
  TOOL_INVARIANTS,
  TOOL_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('tools / namespace (ai/tools/README.md, ai/tools/tools.md)', () => {
  it('defines exactly the eight tool invariants in constitutional order', () => {
    expect(TOOL_INVARIANTS).toEqual([
      'capability-never-actor-reasoner-or-implementation',
      'uniquely-identified-and-declares-capabilities',
      'performs-no-reasoning-makes-no-decision',
      'holds-no-permission-no-policy',
      'validated-before-execution',
      'selection-composition-execution-deterministic-and-bounded',
      'executed-by-runtime-owns-no-intelligence',
      'single-owned-technology-neutral-scalable',
    ]);
  });

  it('defines exactly the ten tool concerns in inventory order', () => {
    expect(TOOL_CONCERNS).toEqual([
      'tool-architecture',
      'tool-lifecycle',
      'tool-capabilities',
      'tool-selection',
      'tool-execution',
      'tool-validation',
      'tool-composition',
      'tool-compatibility',
      'tool-boundaries',
      'tool-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of TOOL_INVARIANTS) {
      expect(TOOL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_CONCERNS) {
      expect(TOOL_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_CONCERNS)).toBe(true);
    expect(Object.isFrozen(TOOL_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
