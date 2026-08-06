import { describe, expect, it } from 'vitest';

import { CANONICAL_CHAIN, WORKFLOW_DEFINITIONS, WORKFLOW_TYPES } from '../src/index';
import type { PlannerStage } from '../src/index';

/**
 * Workflow sequencing and dependency guards (ADR-0055): every growth workflow composes an ordered subsequence of the
 * frozen planner chain (Marketing -> Content -> SEO -> Social -> Analytics -> Campaign). A sequence must be a
 * canonical-order subsequence (never reordered, never a fan-in, no duplicates), begin at `marketing` (the chain root),
 * and end at `campaign` (the terminal planner). These invariants keep every workflow aligned to the ratified linear
 * chain.
 */
const CHAIN_INDEX = new Map<PlannerStage, number>(
  CANONICAL_CHAIN.map((stage, index) => [stage, index]),
);

const isCanonicalSubsequence = (sequence: readonly PlannerStage[]): boolean => {
  let last = -1;
  for (const stage of sequence) {
    const index = CHAIN_INDEX.get(stage);
    if (index === undefined || index <= last) return false; // unknown stage, reorder, or duplicate
    last = index;
  }
  return true;
};

describe('workflow sequencing / dependency guard (ratified planner chain)', () => {
  it('the canonical chain is exactly the six planners in order', () => {
    expect(CANONICAL_CHAIN).toEqual([
      'marketing',
      'content',
      'seo',
      'social',
      'analytics',
      'campaign',
    ]);
  });

  it('every workflow type has a definition with a category and a non-empty sequence', () => {
    expect(Object.keys(WORKFLOW_DEFINITIONS).sort()).toEqual([...WORKFLOW_TYPES].sort());
    for (const type of WORKFLOW_TYPES) {
      const definition = WORKFLOW_DEFINITIONS[type];
      expect(typeof definition.category).toBe('string');
      expect(definition.sequence.length).toBeGreaterThan(0);
    }
  });

  it('every workflow sequence is a canonical-order subsequence starting at marketing and ending at campaign', () => {
    for (const type of WORKFLOW_TYPES) {
      const sequence = WORKFLOW_DEFINITIONS[type].sequence;
      expect(
        isCanonicalSubsequence(sequence),
        `${type} sequence must be a canonical-order subsequence`,
      ).toBe(true);
      expect(sequence[0], `${type} must start at marketing`).toBe('marketing');
      expect(sequence[sequence.length - 1], `${type} must end at campaign`).toBe('campaign');
      // No duplicate stages (a set of the stages has the same size as the sequence).
      expect(new Set(sequence).size).toBe(sequence.length);
    }
  });

  it('rejects a reordered or duplicated sequence (the guard is non-vacuous)', () => {
    expect(isCanonicalSubsequence(['content', 'marketing'])).toBe(false); // reversed
    expect(isCanonicalSubsequence(['marketing', 'marketing'])).toBe(false); // duplicate
    expect(isCanonicalSubsequence(['marketing', 'campaign'])).toBe(true); // valid subsequence
  });
});
