import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';

import type { SocialPlan } from './types.js';

/**
 * Frame a social-quality evaluation as the frozen Evaluation Engine's `EvaluationRequest`: the subject is the social
 * output (referenced by the plan id), and the caller supplies the framed metric measurements. It frames the evaluation
 * only; it defines no evaluation model, computes no score, and decides nothing. The Evaluation Engine assesses it.
 */
export const socialEvaluationRequest = (
  plan: SocialPlan,
  metrics: readonly MetricMeasurement[],
): EvaluationRequest => {
  const request: EvaluationRequest = {
    evaluation: `social:${plan.id}`,
    subject: { kind: 'agent', reference: plan.id },
    metrics,
  };
  return Object.freeze(request);
};
