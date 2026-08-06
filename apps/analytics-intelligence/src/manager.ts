import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ANALYTICS_AGENT } from './agent.js';
import type { AnalyticsError } from './errors.js';
import { analyticsEvaluationRequest } from './evaluation.js';
import { AnalyticsFramer } from './framing.js';
import { AnalyticsHash } from './hash.js';
import type { AnalyticsPlan, AnalyticsRequest, AnalyticsStatistics } from './types.js';

/**
 * The Analytics Intelligence facade and DI entry. It owns the analytics behavior: it frames an analytics request into a
 * governed analytics task (an immutable `AnalyticsPlan` carrying an Agent Engine `AgentRequest`), exposes the analytics
 * growth agent, and frames an analytics-quality `EvaluationRequest` for the frozen Evaluation Engine. It consumes a
 * marketing direction, a content plan, an SEO plan, and a social plan by reference and owns none; it produces governed AI
 * outputs, executes nothing, evaluates nothing, orchestrates nothing, selects no provider, and decides nothing.
 */
export class AnalyticsIntelligence {
  readonly #framer = new AnalyticsFramer(new AnalyticsHash());
  #framed = 0;
  #rejected = 0;

  /** Frame an analytics request into an immutable plan; fail closed on an unknown, blank, or invalid request. */
  plan(request: AnalyticsRequest): Result<AnalyticsPlan, AnalyticsError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The analytics growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return ANALYTICS_AGENT;
  }

  /** Frame an analytics-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(plan: AnalyticsPlan, metrics: readonly MetricMeasurement[]): EvaluationRequest {
    return analyticsEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): AnalyticsStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
