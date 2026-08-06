import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';

import type { SeoPlan } from './types.js';

/**
 * Frame an SEO-quality evaluation as the frozen Evaluation Engine's `EvaluationRequest`: the subject is the SEO output
 * (referenced by the plan id), and the caller supplies the framed metric measurements. It frames the evaluation only; it
 * defines no evaluation model, computes no score, and decides nothing. The Evaluation Engine assesses it.
 */
export const seoEvaluationRequest = (
  plan: SeoPlan,
  metrics: readonly MetricMeasurement[],
): EvaluationRequest => {
  const request: EvaluationRequest = {
    evaluation: `seo:${plan.id}`,
    subject: { kind: 'agent', reference: plan.id },
    metrics,
  };
  return Object.freeze(request);
};
