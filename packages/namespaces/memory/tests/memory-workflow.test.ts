import { describe, expect, it } from 'vitest';

import {
  MEMORY_WORKFLOW_INVARIANTS,
  MEMORY_WORKFLOW_INVARIANT_DESCRIPTIONS,
  MEMORY_WORKFLOW_PRINCIPLES,
  MEMORY_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  MEMORY_WORKFLOW_STEPS,
  MEMORY_WORKFLOW_STEP_DESCRIPTIONS,
  workflowStepAtOrAfter,
} from '../src/index';

describe('memory / memory workflow (ai/memory/memory-workflow.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(MEMORY_WORKFLOW_PRINCIPLES).toEqual([
      'order-is-fixed-and-deterministic',
      'validation-precedes-retention',
      'reconciliation-precedes-reliance',
      'removal-is-governed',
      'order-holds-at-any-scale',
    ]);
  });

  it('defines exactly the seven ordered workflow steps', () => {
    expect(MEMORY_WORKFLOW_STEPS).toEqual([
      'receive',
      'classify',
      'validate',
      'retain',
      'recall',
      'reconcile',
      'evolve-or-remove',
    ]);
  });

  it('defines exactly the six invariants in constitutional order', () => {
    expect(MEMORY_WORKFLOW_INVARIANTS).toEqual([
      'classify-and-validate-precede-retain-precede-recall',
      'validated-before-retained',
      'reconciled-before-relied-on',
      'removed-only-under-rules',
      'same-inputs-same-context',
      'order-is-inert',
    ]);
  });

  it('gives every principle, step, and invariant a non-empty description', () => {
    for (const id of MEMORY_WORKFLOW_PRINCIPLES) {
      expect(MEMORY_WORKFLOW_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_WORKFLOW_STEPS) {
      expect(MEMORY_WORKFLOW_STEP_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_WORKFLOW_INVARIANTS) {
      expect(MEMORY_WORKFLOW_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('workflowStepAtOrAfter', () => {
    it('holds for a later or equal step and is false for an earlier step', () => {
      expect(workflowStepAtOrAfter('retain', 'receive')).toBe(true);
      expect(workflowStepAtOrAfter('recall', 'recall')).toBe(true);
      expect(workflowStepAtOrAfter('validate', 'reconcile')).toBe(false);
    });

    it('agrees with the declared step order across the whole workflow', () => {
      MEMORY_WORKFLOW_STEPS.forEach((a, i) => {
        MEMORY_WORKFLOW_STEPS.forEach((b, j) => {
          expect(workflowStepAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_WORKFLOW_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_WORKFLOW_STEPS)).toBe(true);
    expect(Object.isFrozen(MEMORY_WORKFLOW_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_WORKFLOW_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_WORKFLOW_STEP_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_WORKFLOW_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
