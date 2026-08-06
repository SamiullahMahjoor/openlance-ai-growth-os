import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';

import type { GrowthWorkflow } from './types.js';

/**
 * Frame a workflow-quality evaluation as the frozen Evaluation Engine's `EvaluationRequest`: the subject is the workflow
 * output (referenced by the workflow id), and the caller supplies the framed metric measurements. It frames the
 * evaluation only; it defines no evaluation model, computes no score, and decides nothing. The Evaluation Engine assesses
 * it.
 */
export const workflowEvaluationRequest = (
  workflow: GrowthWorkflow,
  metrics: readonly MetricMeasurement[],
): EvaluationRequest => {
  const request: EvaluationRequest = {
    evaluation: `workflow:${workflow.id}`,
    subject: { kind: 'agent', reference: workflow.id },
    metrics,
  };
  return Object.freeze(request);
};
