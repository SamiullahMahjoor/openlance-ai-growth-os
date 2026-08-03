import { describe, expect, it } from 'vitest';

import {
  SAFETY_CONCERNS,
  SAFETY_CONCERN_DESCRIPTIONS,
  SAFETY_INVARIANTS,
  SAFETY_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('safety / namespace (ai/safety/README.md, ai/safety/safety.md)', () => {
  it('defines exactly the eight safety invariants in constitutional order', () => {
    expect(SAFETY_INVARIANTS).toEqual([
      'fails-closed',
      'deterministic',
      'layered',
      'protects-never-performs',
      'consumes-rules-and-truth-owns-neither',
      'surfaces-uncertainty',
      'escalation-bounded-and-acyclic',
      'single-owned-neutral-scalable',
    ]);
  });

  it('defines exactly the ten safety concerns in inventory order', () => {
    expect(SAFETY_CONCERNS).toEqual([
      'safety-principles',
      'risk-classification',
      'hazard-identification',
      'boundary-enforcement',
      'refusal-model',
      'escalation-model',
      'impact-assessment',
      'uncertainty-management',
      'safe-degradation',
      'safety-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of SAFETY_INVARIANTS) {
      expect(SAFETY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SAFETY_CONCERNS) {
      expect(SAFETY_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(SAFETY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(SAFETY_CONCERNS)).toBe(true);
    expect(Object.isFrozen(SAFETY_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SAFETY_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
