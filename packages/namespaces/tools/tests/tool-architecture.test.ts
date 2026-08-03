import { describe, expect, it } from 'vitest';

import {
  TOOL_ARCHITECTURE_INVARIANTS,
  TOOL_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  TOOL_ARCHITECTURE_PRINCIPLES,
  TOOL_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  TOOL_PARTS,
  TOOL_PART_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool architecture (ai/tools/tool-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_ARCHITECTURE_PRINCIPLES).toEqual([
      'a-tool-is-a-capability-not-an-actor',
      'a-tool-has-a-distinct-identity',
      'a-tool-is-composed-of-defined-parts',
      'a-tools-structure-is-deterministic',
    ]);
  });

  it('defines exactly the two parts a tool is composed of', () => {
    expect(TOOL_PARTS).toEqual(['identity', 'capabilities']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_ARCHITECTURE_INVARIANTS).toEqual([
      'every-tool-has-a-distinct-stable-identity-never-shared',
      'composed-of-identity-and-declared-capabilities',
      'stands-for-external-interaction-never-the-system',
      'same-definition-same-structure',
      'defining-structure-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of TOOL_ARCHITECTURE_PRINCIPLES) {
      expect(TOOL_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_PARTS) {
      expect(TOOL_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_ARCHITECTURE_INVARIANTS) {
      expect(TOOL_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_PARTS)).toBe(true);
    expect(Object.isFrozen(TOOL_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
