import { describe, expect, it } from 'vitest';

import {
  TOOL_VERSIONING_ASPECTS,
  TOOL_VERSIONING_ASPECT_DESCRIPTIONS,
  TOOL_VERSIONING_INVARIANTS,
  TOOL_VERSIONING_INVARIANT_DESCRIPTIONS,
  TOOL_VERSIONING_PRINCIPLES,
  TOOL_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool versioning (ai/tools/tool-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_VERSIONING_PRINCIPLES).toEqual([
      'a-tool-definition-is-versioned',
      'change-is-governed',
      'compatibility-is-preserved-or-migrated',
      'churn-is-absorbed-here-not-in-the-foundations',
    ]);
  });

  it('defines exactly the four versioning aspects in constitutional order', () => {
    expect(TOOL_VERSIONING_ASPECTS).toEqual([
      'version-rules',
      'evolution',
      'migration',
      'deprecation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_VERSIONING_INVARIANTS).toEqual([
      'a-tool-definition-carries-a-version',
      'evolves-only-under-governed-change',
      'compatibility-breaking-change-versioned-and-migrated-never-silent',
      'deprecated-tool-serves-compatible-consumers-until-migrated',
      'versioning-a-tool-is-inert',
    ]);
  });

  it('gives every principle, aspect, and invariant a non-empty description', () => {
    for (const id of TOOL_VERSIONING_PRINCIPLES) {
      expect(TOOL_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_VERSIONING_ASPECTS) {
      expect(TOOL_VERSIONING_ASPECT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_VERSIONING_INVARIANTS) {
      expect(TOOL_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_VERSIONING_ASPECTS)).toBe(true);
    expect(Object.isFrozen(TOOL_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_VERSIONING_ASPECT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
