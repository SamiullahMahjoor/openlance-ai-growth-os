import { describe, expect, it } from 'vitest';

import {
  DECISION_MAKING_MANDATES,
  DECISION_MAKING_MANDATE_DESCRIPTIONS,
  DECISION_MAKING_PRINCIPLES,
  DECISION_MAKING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / decision-making (ai/governance/decision-making.md)', () => {
  it('defines exactly the five decision-making principles in constitutional order', () => {
    expect(DECISION_MAKING_PRINCIPLES).toEqual([
      'governed-not-improvised',
      'accountable',
      'consistent',
      'traceable',
      'never-invent',
    ]);
  });

  it('defines exactly the seven decision-making mandates in constitutional order', () => {
    expect(DECISION_MAKING_MANDATES).toEqual([
      'authorized',
      'owned',
      'governed-by-policy',
      'reviewable',
      'consistent',
      'validated',
      'safe-under-uncertainty',
    ]);
  });

  it('gives every principle and mandate a non-empty description', () => {
    for (const id of DECISION_MAKING_PRINCIPLES) {
      expect(DECISION_MAKING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of DECISION_MAKING_MANDATES) {
      expect(DECISION_MAKING_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(DECISION_MAKING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(DECISION_MAKING_MANDATES)).toBe(true);
    expect(Object.isFrozen(DECISION_MAKING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(DECISION_MAKING_MANDATE_DESCRIPTIONS)).toBe(true);
  });
});
