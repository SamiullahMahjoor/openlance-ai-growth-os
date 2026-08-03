import { describe, expect, it } from 'vitest';

import {
  EXECUTION_WORKFLOW_INVARIANTS,
  EXECUTION_WORKFLOW_INVARIANT_DESCRIPTIONS,
  EXECUTION_WORKFLOW_PRINCIPLES,
  EXECUTION_WORKFLOW_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_WORKFLOW_STEPS,
  EXECUTION_WORKFLOW_STEP_DESCRIPTIONS,
  workflowStepAtOrAfter,
} from '../src/index';

describe('runtime / execution workflow (ai/runtime/execution-workflow.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(EXECUTION_WORKFLOW_PRINCIPLES).toEqual([
      'the-order-is-fixed-and-governed',
      'governance-is-loaded-and-validated-before-the-task-runs',
      'knowledge-is-loaded-before-context-is-assembled',
      'validation-precedes-execution',
      'the-order-holds-at-any-scale',
    ]);
  });

  it('defines exactly the fourteen ordered steps, initialize to finalize-session', () => {
    expect(EXECUTION_WORKFLOW_STEPS).toEqual([
      'initialize',
      'validate-constitution',
      'load-governance',
      'resolve-task',
      'load-required-knowledge',
      'load-contextual-knowledge',
      'assemble-execution-context',
      'validate-permissions',
      'validate-policies',
      'execute',
      'monitor-state',
      'handle-failures',
      'return-result',
      'finalize-session',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(EXECUTION_WORKFLOW_INVARIANTS).toEqual([
      'validate-constitution-load-governance-validate-permissions-and-policies-precede-execute',
      'knowledge-loaded-before-context-assembled-before-execute',
      'no-execution-reaches-execute-without-passing-every-validation-before-it',
      'the-order-is-inert',
    ]);
  });

  it('gives every principle, step, and invariant a non-empty description', () => {
    for (const id of EXECUTION_WORKFLOW_PRINCIPLES) {
      expect(EXECUTION_WORKFLOW_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_WORKFLOW_STEPS) {
      expect(EXECUTION_WORKFLOW_STEP_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_WORKFLOW_INVARIANTS) {
      expect(EXECUTION_WORKFLOW_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('workflowStepAtOrAfter', () => {
    it('holds for a later or equal step and is false for an earlier step', () => {
      expect(workflowStepAtOrAfter('finalize-session', 'initialize')).toBe(true);
      expect(workflowStepAtOrAfter('execute', 'execute')).toBe(true);
      expect(workflowStepAtOrAfter('execute', 'validate-policies')).toBe(true);
      expect(workflowStepAtOrAfter('initialize', 'execute')).toBe(false);
    });

    it('agrees with the declared step order across the whole workflow', () => {
      EXECUTION_WORKFLOW_STEPS.forEach((a, i) => {
        EXECUTION_WORKFLOW_STEPS.forEach((b, j) => {
          expect(workflowStepAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EXECUTION_WORKFLOW_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_WORKFLOW_STEPS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_WORKFLOW_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_WORKFLOW_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_WORKFLOW_STEP_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_WORKFLOW_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
