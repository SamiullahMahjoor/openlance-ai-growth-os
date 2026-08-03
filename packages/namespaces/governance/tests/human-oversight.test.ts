import { describe, expect, it } from 'vitest';

import {
  HUMAN_OVERSIGHT_MANDATES,
  HUMAN_OVERSIGHT_MANDATE_DESCRIPTIONS,
  HUMAN_OVERSIGHT_PRINCIPLES,
  HUMAN_OVERSIGHT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / human oversight (ai/governance/human-oversight.md)', () => {
  it('defines exactly the five human-oversight principles in constitutional order', () => {
    expect(HUMAN_OVERSIGHT_PRINCIPLES).toEqual([
      'accountability-never-disappears',
      'humans-hold-final-authority',
      'approval-precedes-significant-change',
      'override-is-always-available',
      'oversight-is-real-not-nominal',
    ]);
  });

  it('defines exactly the six human-oversight mandates in constitutional order', () => {
    expect(HUMAN_OVERSIGHT_MANDATES).toEqual([
      'accountable-owner',
      'human-approval',
      'human-override',
      'informed-review',
      'legal-and-safety-accountability',
      'non-delegable-accountability',
    ]);
  });

  it('gives every principle and mandate a non-empty description', () => {
    for (const id of HUMAN_OVERSIGHT_PRINCIPLES) {
      expect(HUMAN_OVERSIGHT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of HUMAN_OVERSIGHT_MANDATES) {
      expect(HUMAN_OVERSIGHT_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(HUMAN_OVERSIGHT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(HUMAN_OVERSIGHT_MANDATES)).toBe(true);
    expect(Object.isFrozen(HUMAN_OVERSIGHT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(HUMAN_OVERSIGHT_MANDATE_DESCRIPTIONS)).toBe(true);
  });
});
