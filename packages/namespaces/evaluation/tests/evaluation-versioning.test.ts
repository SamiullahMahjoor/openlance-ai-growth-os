import { describe, expect, it } from 'vitest';

import {
  EVALUATION_VERSIONING_ASPECTS,
  EVALUATION_VERSIONING_ASPECT_DESCRIPTIONS,
  EVALUATION_VERSIONING_INVARIANTS,
  EVALUATION_VERSIONING_INVARIANT_DESCRIPTIONS,
  EVALUATION_VERSIONING_PRINCIPLES,
  EVALUATION_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evaluation / versioning (ai/evaluation/evaluation-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVALUATION_VERSIONING_PRINCIPLES).toEqual([
      'an-evaluation-definition-is-versioned',
      'change-is-governed',
      'comparability-is-preserved-or-migrated',
      'results-record-their-version',
    ]);
  });

  it('defines exactly the four aspects of evaluation versioning', () => {
    expect(EVALUATION_VERSIONING_ASPECTS).toEqual([
      'version-rules',
      'evolution',
      'migration',
      'deprecation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EVALUATION_VERSIONING_INVARIANTS).toEqual([
      'each-part-carries-a-version-change-explicit-and-traceable',
      'evolves-only-under-governed-change',
      'comparability-breaking-change-versioned-and-migrated-never-silent',
      'every-result-records-the-version-it-was-produced-under',
      'versioning-an-evaluation-is-inert',
    ]);
  });

  it('gives every principle, aspect, and invariant a non-empty description', () => {
    for (const id of EVALUATION_VERSIONING_PRINCIPLES) {
      expect(EVALUATION_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_VERSIONING_ASPECTS) {
      expect(EVALUATION_VERSIONING_ASPECT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVALUATION_VERSIONING_INVARIANTS) {
      expect(EVALUATION_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVALUATION_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VERSIONING_ASPECTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VERSIONING_ASPECT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVALUATION_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
