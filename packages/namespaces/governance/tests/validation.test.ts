import { describe, expect, it } from 'vitest';

import {
  VALIDATION_DIMENSIONS,
  VALIDATION_DIMENSION_DESCRIPTIONS,
  VALIDATION_MANDATES,
  VALIDATION_MANDATE_DESCRIPTIONS,
  VALIDATION_PRINCIPLES,
  VALIDATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / constitutional validation (ai/governance/constitutional-validation.md)', () => {
  it('defines exactly the four validation principles in constitutional order', () => {
    expect(VALIDATION_PRINCIPLES).toEqual([
      'governance-precedes-execution',
      'nothing-bypasses-validation',
      'against-canonical-sources',
      'failure-is-safe',
    ]);
  });

  it('defines exactly the eight validation mandates in constitutional order', () => {
    expect(VALIDATION_MANDATES).toEqual([
      'against-ai-constitution',
      'against-knowledge-constitution',
      'against-governance',
      'against-authority',
      'against-ownership',
      'against-boundaries',
      'ordered-before-execution',
      'reviewable',
    ]);
  });

  it('defines exactly the six canonical validation dimensions in constitutional order', () => {
    expect(VALIDATION_DIMENSIONS).toEqual([
      'ai-constitution',
      'knowledge-constitution',
      'governance',
      'authority',
      'ownership',
      'boundaries',
    ]);
  });

  it('gives every principle, mandate, and dimension a non-empty description', () => {
    for (const id of VALIDATION_PRINCIPLES) {
      expect(VALIDATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of VALIDATION_MANDATES) {
      expect(VALIDATION_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of VALIDATION_DIMENSIONS) {
      expect(VALIDATION_DIMENSION_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(VALIDATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(VALIDATION_MANDATES)).toBe(true);
    expect(Object.isFrozen(VALIDATION_DIMENSIONS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_MANDATE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(VALIDATION_DIMENSION_DESCRIPTIONS)).toBe(true);
  });
});
