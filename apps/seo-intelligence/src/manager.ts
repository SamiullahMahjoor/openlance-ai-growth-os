import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { SEO_AGENT } from './agent.js';
import type { SeoError } from './errors.js';
import { seoEvaluationRequest } from './evaluation.js';
import { SeoFramer } from './framing.js';
import { SeoHash } from './hash.js';
import type { SeoPlan, SeoRequest, SeoStatistics } from './types.js';

/**
 * The SEO Intelligence facade and DI entry. It owns the SEO behavior: it frames an SEO request into a governed SEO task
 * (an immutable `SeoPlan` carrying an Agent Engine `AgentRequest`), exposes the SEO growth agent, and frames an SEO-quality
 * `EvaluationRequest` for the frozen Evaluation Engine. It consumes a marketing direction, a content plan, and knowledge
 * by reference and owns none; it produces governed AI outputs, executes nothing, retrieves nothing, selects no provider,
 * and decides nothing.
 */
export class SeoIntelligence {
  readonly #framer = new SeoFramer(new SeoHash());
  #framed = 0;
  #rejected = 0;

  /** Frame an SEO request into an immutable plan; fail closed on an unknown, blank, or ungrounded request. */
  plan(request: SeoRequest): Result<SeoPlan, SeoError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The SEO growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return SEO_AGENT;
  }

  /** Frame an SEO-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(plan: SeoPlan, metrics: readonly MetricMeasurement[]): EvaluationRequest {
    return seoEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): SeoStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
