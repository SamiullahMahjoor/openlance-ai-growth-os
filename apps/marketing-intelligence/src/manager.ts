import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { MARKETING_AGENT } from './agent.js';
import type { MarketingError } from './errors.js';
import { marketingEvaluationRequest } from './evaluation.js';
import { MarketingFramer } from './framing.js';
import { MarketingHash } from './hash.js';
import type { MarketingBrief, MarketingRequest, MarketingStatistics } from './types.js';

/**
 * The Marketing Intelligence facade and DI entry. It owns the marketing-intelligence behavior: it frames a marketing
 * request into a governed platform task (an immutable `MarketingBrief` carrying an Agent Engine `AgentRequest`), exposes
 * the marketing growth agent, and frames a marketing-output `EvaluationRequest` for the frozen Evaluation Engine. It
 * consumes knowledge-owned truth by reference and produces governed AI outputs; it owns no business truth, executes
 * nothing, selects no provider, and decides nothing.
 */
export class MarketingIntelligence {
  readonly #framer = new MarketingFramer(new MarketingHash());
  #framed = 0;
  #rejected = 0;

  /** Frame a marketing request into an immutable brief; fail closed on an unknown, blank, or ungrounded request. */
  plan(request: MarketingRequest): Result<MarketingBrief, MarketingError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The marketing growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return MARKETING_AGENT;
  }

  /** Frame a marketing-output evaluation for the frozen Evaluation Engine. */
  evaluationRequest(
    brief: MarketingBrief,
    metrics: readonly MetricMeasurement[],
  ): EvaluationRequest {
    return marketingEvaluationRequest(brief, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): MarketingStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
