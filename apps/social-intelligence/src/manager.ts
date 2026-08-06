import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { SOCIAL_AGENT } from './agent.js';
import type { SocialError } from './errors.js';
import { socialEvaluationRequest } from './evaluation.js';
import { SocialFramer } from './framing.js';
import { SocialHash } from './hash.js';
import type { SocialPlan, SocialRequest, SocialStatistics } from './types.js';

/**
 * The Social Intelligence facade and DI entry. It owns the social-media behavior: it frames a social request into a
 * governed social task (an immutable `SocialPlan` carrying an Agent Engine `AgentRequest`), exposes the social growth
 * agent, and frames a social-quality `EvaluationRequest` for the frozen Evaluation Engine. It consumes a marketing
 * direction, a content plan, and an SEO plan by reference and owns none; it produces governed AI outputs, executes
 * nothing, publishes nothing, schedules nothing, selects no provider, and decides nothing.
 */
export class SocialIntelligence {
  readonly #framer = new SocialFramer(new SocialHash());
  #framed = 0;
  #rejected = 0;

  /** Frame a social request into an immutable plan; fail closed on an unknown, blank, or invalid request. */
  plan(request: SocialRequest): Result<SocialPlan, SocialError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The social growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return SOCIAL_AGENT;
  }

  /** Frame a social-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(plan: SocialPlan, metrics: readonly MetricMeasurement[]): EvaluationRequest {
    return socialEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): SocialStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
