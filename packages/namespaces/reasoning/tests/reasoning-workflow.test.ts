import { describe, expect, it } from 'vitest';

import {
  REASONING_WORKFLOW_INVARIANTS,
  REASONING_WORKFLOW_INVARIANT_DESCRIPTIONS,
  REASONING_WORKFLOW_PRINCIPLES,
  REASONING_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  REASONING_WORKFLOW_STEPS,
  REASONING_WORKFLOW_STEP_DESCRIPTIONS,
  reasoningStepAtOrAfter,
} from '../src/index';

describe('reasoning / reasoning workflow (ai/reasoning/reasoning-workflow.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(REASONING_WORKFLOW_PRINCIPLES).toEqual([
      'order-is-fixed-and-deterministic',
      'framing-precedes-transformation',
      'sufficiency-precedes-conclusion',
      'validation-precedes-acceptance',
      'order-holds-at-any-scale',
    ]);
  });

  it('defines exactly the nine ordered workflow steps', () => {
    expect(REASONING_WORKFLOW_STEPS).toEqual([
      'receive-request',
      'frame',
      'decompose',
      'analyze',
      'synthesize',
      'handle-uncertainty',
      'form-conclusion',
      'validate',
      'produce-outcome',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(REASONING_WORKFLOW_INVARIANTS).toEqual([
      'steps-occur-in-order',
      'no-conclusion-accepted-before-validate',
      'same-inputs-same-ordered-outcome',
      'order-is-inert',
    ]);
  });

  it('gives every principle, step, and invariant a non-empty description', () => {
    for (const id of REASONING_WORKFLOW_PRINCIPLES) {
      expect(REASONING_WORKFLOW_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_WORKFLOW_STEPS) {
      expect(REASONING_WORKFLOW_STEP_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_WORKFLOW_INVARIANTS) {
      expect(REASONING_WORKFLOW_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('reasoningStepAtOrAfter', () => {
    it('holds for a later or equal step and is false for an earlier step', () => {
      expect(reasoningStepAtOrAfter('produce-outcome', 'receive-request')).toBe(true);
      expect(reasoningStepAtOrAfter('analyze', 'analyze')).toBe(true);
      expect(reasoningStepAtOrAfter('form-conclusion', 'handle-uncertainty')).toBe(true);
      expect(reasoningStepAtOrAfter('receive-request', 'produce-outcome')).toBe(false);
    });

    it('agrees with the declared step order across the whole workflow', () => {
      REASONING_WORKFLOW_STEPS.forEach((a, i) => {
        REASONING_WORKFLOW_STEPS.forEach((b, j) => {
          expect(reasoningStepAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_WORKFLOW_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_WORKFLOW_STEPS)).toBe(true);
    expect(Object.isFrozen(REASONING_WORKFLOW_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_WORKFLOW_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_WORKFLOW_STEP_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_WORKFLOW_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
