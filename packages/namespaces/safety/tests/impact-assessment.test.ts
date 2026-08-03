import { describe, expect, it } from 'vitest';

import {
  IMPACT_ASSESSMENT_INVARIANTS,
  IMPACT_ASSESSMENT_INVARIANT_DESCRIPTIONS,
  IMPACT_ASSESSMENT_PRINCIPLES,
  IMPACT_ASSESSMENT_PRINCIPLE_DESCRIPTIONS,
  IMPACT_DIMENSIONS,
  IMPACT_DIMENSION_DESCRIPTIONS,
} from '../src/index';

describe('safety / impact assessment (ai/safety/impact-assessment.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(IMPACT_ASSESSMENT_PRINCIPLES).toEqual([
      'assessed-along-dimensions',
      'references-truth-never-defines',
      'irreversible-far-reaching-weighs-heaviest',
      'informs-not-classifies',
    ]);
  });

  it('defines exactly the eight impact dimensions in constitutional order', () => {
    expect(IMPACT_DIMENSIONS).toEqual([
      'severity',
      'likelihood',
      'reversibility',
      'propagation',
      'scope',
      'human',
      'organizational',
      'long-term',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(IMPACT_ASSESSMENT_INVARIANTS).toEqual([
      'described-along-dimensions-never-vague',
      'irreversible-or-far-reaching-weighs-heavier',
      'references-consequences-never-restates',
      'measures-not-classifies',
      'assessing-is-inert',
    ]);
  });

  it('gives every principle, dimension, and invariant a non-empty description', () => {
    for (const id of IMPACT_ASSESSMENT_PRINCIPLES) {
      expect(IMPACT_ASSESSMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of IMPACT_DIMENSIONS) {
      expect(IMPACT_DIMENSION_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of IMPACT_ASSESSMENT_INVARIANTS) {
      expect(IMPACT_ASSESSMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(IMPACT_ASSESSMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(IMPACT_DIMENSIONS)).toBe(true);
    expect(Object.isFrozen(IMPACT_ASSESSMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(IMPACT_ASSESSMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(IMPACT_DIMENSION_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(IMPACT_ASSESSMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
