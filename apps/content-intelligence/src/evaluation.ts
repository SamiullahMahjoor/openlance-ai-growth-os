import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';

import type { ContentPlan } from './types.js';

/**
 * Frame a content-quality evaluation as the frozen Evaluation Engine's `EvaluationRequest`: the subject is the content
 * output (referenced by the plan id), and the caller supplies the framed quality, grounding, and brand-fidelity metric
 * measurements. It frames the evaluation only; it defines no evaluation model, computes no score, and decides nothing.
 */
export const contentEvaluationRequest = (
  plan: ContentPlan,
  metrics: readonly MetricMeasurement[],
): EvaluationRequest => {
  const request: EvaluationRequest = {
    evaluation: `content:${plan.id}`,
    subject: { kind: 'agent', reference: plan.id },
    metrics,
  };
  return Object.freeze(request);
};
