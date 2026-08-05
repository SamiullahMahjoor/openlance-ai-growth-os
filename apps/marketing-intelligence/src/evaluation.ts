import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';

import type { MarketingBrief } from './types.js';

/**
 * Frame a marketing-output evaluation as the frozen Evaluation Engine's `EvaluationRequest`: the subject is the marketing
 * output (referenced by the brief id), and the caller supplies the framed metric measurements. It frames the evaluation
 * only; it defines no evaluation model, computes no score, and decides nothing. The Evaluation Engine assesses it.
 */
export const marketingEvaluationRequest = (
  brief: MarketingBrief,
  metrics: readonly MetricMeasurement[],
): EvaluationRequest => {
  const request: EvaluationRequest = {
    evaluation: `marketing:${brief.id}`,
    subject: { kind: 'agent', reference: brief.id },
    metrics,
  };
  return Object.freeze(request);
};
