import { describe, expect, it } from 'vitest';

import {
  RISK_CLASSIFICATION_INVARIANTS,
  RISK_CLASSIFICATION_INVARIANT_DESCRIPTIONS,
  RISK_CLASSIFICATION_PRINCIPLES,
  RISK_CLASSIFICATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / risk classification (ai/safety/risk-classification.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(RISK_CLASSIFICATION_PRINCIPLES).toEqual([
      'classified-not-guessed',
      'applies-governance-not-replaces',
      'carries-confidence',
      'higher-risk-raises-protection',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(RISK_CLASSIFICATION_INVARIANTS).toEqual([
      'one-classified-level-ordered-by-protection',
      'applies-governed-categories-never-redefines',
      'low-confidence-raises-level',
      'threshold-crossing-escalates-inherited-never-lowers',
      'classifying-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of RISK_CLASSIFICATION_PRINCIPLES) {
      expect(RISK_CLASSIFICATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RISK_CLASSIFICATION_INVARIANTS) {
      expect(RISK_CLASSIFICATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RISK_CLASSIFICATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RISK_CLASSIFICATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RISK_CLASSIFICATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RISK_CLASSIFICATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
