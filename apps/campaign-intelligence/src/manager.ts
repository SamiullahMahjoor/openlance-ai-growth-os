import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { CAMPAIGN_AGENT } from './agent.js';
import type { CampaignError } from './errors.js';
import { campaignEvaluationRequest } from './evaluation.js';
import { CampaignFramer } from './framing.js';
import { CampaignHash } from './hash.js';
import type { CampaignPlan, CampaignRequest, CampaignStatistics } from './types.js';

/**
 * The Campaign Intelligence facade and DI entry. It owns the campaign planning behavior: it frames a campaign request
 * into a governed campaign task (an immutable `CampaignPlan` carrying an Agent Engine `AgentRequest`), exposes the
 * campaign growth agent, and frames a campaign-quality `EvaluationRequest` for the frozen Evaluation Engine. It consumes a
 * marketing direction, a content plan, an SEO plan, a social plan, and an analytics plan by reference and owns none; it
 * produces governed AI outputs, executes nothing, schedules nothing, selects no provider, and decides nothing.
 */
export class CampaignIntelligence {
  readonly #framer = new CampaignFramer(new CampaignHash());
  #framed = 0;
  #rejected = 0;

  /** Frame a campaign request into an immutable plan; fail closed on an unknown, blank, or invalid request. */
  plan(request: CampaignRequest): Result<CampaignPlan, CampaignError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The campaign growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return CAMPAIGN_AGENT;
  }

  /** Frame a campaign-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(plan: CampaignPlan, metrics: readonly MetricMeasurement[]): EvaluationRequest {
    return campaignEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): CampaignStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
