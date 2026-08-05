import { RETRIEVAL_WORKFLOW_STEPS, retrievalStepAtOrAfter } from '@openlance/aios-retrieval';
import type { RetrievalWorkflowStep } from '@openlance/aios-retrieval';

/**
 * Retrieval planning: it exposes the frozen ordered `RETRIEVAL_WORKFLOW_STEPS` that a retrieval follows
 * (receive-request, discover, select, resolve-dependencies, prioritize, assemble, validate,
 * produce-result) and consumes `retrievalStepAtOrAfter` to prove that order. It defines no step and
 * re-owns no ordering; the executor carries the steps out.
 */
export class RetrievalPlanner {
  /** The frozen, ordered retrieval workflow steps (the plan a retrieval follows). */
  plan(): readonly RetrievalWorkflowStep[] {
    return RETRIEVAL_WORKFLOW_STEPS;
  }

  /** Whether the frozen workflow steps are in constitutional order (consumes `retrievalStepAtOrAfter`). */
  stepsInConstitutionalOrder(): boolean {
    return RETRIEVAL_WORKFLOW_STEPS.every((step, index) => {
      const previous = RETRIEVAL_WORKFLOW_STEPS[index - 1];
      return previous === undefined || retrievalStepAtOrAfter(step, previous);
    });
  }
}
