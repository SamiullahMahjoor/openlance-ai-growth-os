import { err, map, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import {
  CONTEXT_INPUTS,
  EXECUTION_WORKFLOW_STEPS,
  RUNTIME_EVENTS,
  VALIDATION_STAGES,
  workflowStepAtOrAfter,
} from '@openlance/aios-runtime';
import type {
  ContextInput,
  ExecutionWorkflowStep,
  RuntimeEvent,
  ValidationStage,
} from '@openlance/aios-runtime';
import type { RuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import { ExecutionPipelineError } from './errors.js';

/**
 * The immutable execution pipeline plan: a reference view onto the frozen runtime pipeline model, bound to the
 * Stage 4 runtime lifecycle plan. Descriptive planning metadata only: it references the frozen ordered workflow
 * steps, validation stages, context inputs, and lifecycle events, holds no runtime state, drives no step, and
 * executes nothing. Stage 5 produces the plan a future runtime engine would drive, once the operational service
 * stages exist.
 */
export interface ExecutionPipelinePlan {
  readonly lifecycle: RuntimeLifecyclePlan;
  readonly workflow: readonly ExecutionWorkflowStep[];
  readonly validationStages: readonly ValidationStage[];
  readonly contextInputs: readonly ContextInput[];
  readonly events: readonly RuntimeEvent[];
  readonly validated: true;
}

/**
 * Validate that a proposed sequence of workflow steps is in the frozen constitutional execution order, failing
 * closed. Pure: it delegates entirely to the frozen `workflowStepAtOrAfter` for each consecutive pair, and
 * aggregates one `EXECUTION_PIPELINE.OUT_OF_ORDER_STEP` error per pair whose later step precedes its earlier one.
 * It re-declares no step or order, drives nothing, and holds no state. On any out-of-order pair it returns the
 * aggregated errors and no validated order; otherwise it returns the frozen order. Pure; no IO.
 */
export function validateWorkflowOrder(
  steps: readonly ExecutionWorkflowStep[],
): Result<readonly ExecutionWorkflowStep[], ExecutionPipelineError[]> {
  const errors: ExecutionPipelineError[] = [];
  let previous: ExecutionWorkflowStep | undefined;
  for (const step of steps) {
    if (previous !== undefined && !workflowStepAtOrAfter(step, previous)) {
      errors.push(
        new ExecutionPipelineError(
          'EXECUTION_PIPELINE.OUT_OF_ORDER_STEP',
          `Workflow step '${step}' may not follow '${previous}': it precedes it in the execution order.`,
          { previous, step },
        ),
      );
    }
    previous = step;
  }
  return errors.length > 0 ? err(errors) : ok(Object.freeze([...steps]));
}

/**
 * Build the immutable execution pipeline plan from a Stage 4 runtime lifecycle plan, failing closed. It proves
 * the frozen workflow order is well-formed against the frozen ordering relation (via {@link validateWorkflowOrder}),
 * references the frozen workflow steps, validation stages, context inputs, and lifecycle events, and returns an
 * immutable {@link ExecutionPipelinePlan} binding the consumed `RuntimeLifecyclePlan` to the referenced pipeline
 * model. It holds no runtime state, drives no step, orchestrates nothing, evaluates no governance rule, and
 * executes nothing; it produces the plan a future runtime engine would drive. On a malformed frozen order it
 * returns `ExecutionPipelineError[]` and builds no partial plan. Pure; no IO.
 */
export function buildExecutionPipelinePlan(
  lifecycle: RuntimeLifecyclePlan,
): Result<ExecutionPipelinePlan, ExecutionPipelineError[]> {
  return map(validateWorkflowOrder(EXECUTION_WORKFLOW_STEPS), () =>
    Object.freeze({
      lifecycle,
      workflow: EXECUTION_WORKFLOW_STEPS,
      validationStages: VALIDATION_STAGES,
      contextInputs: CONTEXT_INPUTS,
      events: RUNTIME_EVENTS,
      validated: true,
    }),
  );
}
