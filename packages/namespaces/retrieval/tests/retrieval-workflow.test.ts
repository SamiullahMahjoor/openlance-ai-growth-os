import { describe, expect, it } from 'vitest';

import {
  RETRIEVAL_WORKFLOW_INVARIANTS,
  RETRIEVAL_WORKFLOW_INVARIANT_DESCRIPTIONS,
  RETRIEVAL_WORKFLOW_PRINCIPLES,
  RETRIEVAL_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  RETRIEVAL_WORKFLOW_STEPS,
  RETRIEVAL_WORKFLOW_STEP_DESCRIPTIONS,
  retrievalStepAtOrAfter,
} from '../src/index';

describe('retrieval / retrieval workflow (ai/retrieval/retrieval-workflow.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(RETRIEVAL_WORKFLOW_PRINCIPLES).toEqual([
      'order-is-fixed-and-deterministic',
      'discovery-precedes-selection',
      'dependencies-resolved-before-prioritization',
      'assembly-then-validation-then-handoff',
      'order-holds-at-any-scale',
    ]);
  });

  it('defines exactly the eight ordered workflow steps', () => {
    expect(RETRIEVAL_WORKFLOW_STEPS).toEqual([
      'receive-request',
      'discover',
      'select',
      'resolve-dependencies',
      'prioritize',
      'assemble',
      'validate',
      'produce-result',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(RETRIEVAL_WORKFLOW_INVARIANTS).toEqual([
      'discover-through-produce-result-in-order',
      'no-handoff-before-validate',
      'same-inputs-same-ordered-result',
      'order-is-inert',
    ]);
  });

  it('gives every principle, step, and invariant a non-empty description', () => {
    for (const id of RETRIEVAL_WORKFLOW_PRINCIPLES) {
      expect(RETRIEVAL_WORKFLOW_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_WORKFLOW_STEPS) {
      expect(RETRIEVAL_WORKFLOW_STEP_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RETRIEVAL_WORKFLOW_INVARIANTS) {
      expect(RETRIEVAL_WORKFLOW_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('retrievalStepAtOrAfter', () => {
    it('holds for a later or equal step and is false for an earlier step', () => {
      expect(retrievalStepAtOrAfter('assemble', 'discover')).toBe(true);
      expect(retrievalStepAtOrAfter('validate', 'validate')).toBe(true);
      expect(retrievalStepAtOrAfter('select', 'prioritize')).toBe(false);
    });

    it('agrees with the declared step order across the whole workflow', () => {
      RETRIEVAL_WORKFLOW_STEPS.forEach((a, i) => {
        RETRIEVAL_WORKFLOW_STEPS.forEach((b, j) => {
          expect(retrievalStepAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_STEPS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_STEP_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RETRIEVAL_WORKFLOW_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
