import { describe, expect, it } from 'vitest';

import {
  TOOL_COMPATIBILITY_INVARIANTS,
  TOOL_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
  TOOL_COMPATIBILITY_KINDS,
  TOOL_COMPATIBILITY_KIND_DESCRIPTIONS,
  TOOL_COMPATIBILITY_PRINCIPLES,
  TOOL_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool compatibility (ai/tools/tool-compatibility.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_COMPATIBILITY_PRINCIPLES).toEqual([
      'compatibility-is-a-defined-relation',
      'compatibility-rests-on-declared-capabilities',
      'compatibility-is-neutral',
      'incompatibility-is-explicit',
    ]);
  });

  it('defines exactly the two compatibility kinds in constitutional order', () => {
    expect(TOOL_COMPATIBILITY_KINDS).toEqual(['capability', 'version']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_COMPATIBILITY_INVARIANTS).toEqual([
      'compatible-with-need-only-when-capabilities-satisfy-requirements',
      'version-compatible-only-when-consumer-requirements-hold',
      'compatible-tools-interchangeable-for-need',
      'incompatible-identified-never-used-as-compatible',
      'determining-compatibility-is-inert',
    ]);
  });

  it('gives every principle, kind, and invariant a non-empty description', () => {
    for (const id of TOOL_COMPATIBILITY_PRINCIPLES) {
      expect(TOOL_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_COMPATIBILITY_KINDS) {
      expect(TOOL_COMPATIBILITY_KIND_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_COMPATIBILITY_INVARIANTS) {
      expect(TOOL_COMPATIBILITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_COMPATIBILITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPATIBILITY_KINDS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPATIBILITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPATIBILITY_KIND_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_COMPATIBILITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
