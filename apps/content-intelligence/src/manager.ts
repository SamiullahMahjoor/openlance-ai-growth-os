import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { CONTENT_AGENT } from './agent.js';
import type { ContentError } from './errors.js';
import { contentEvaluationRequest } from './evaluation.js';
import { ContentFramer } from './framing.js';
import { ContentHash } from './hash.js';
import type { ContentPlan, ContentRequest, ContentStatistics } from './types.js';

/**
 * The Content Intelligence facade and DI entry. It owns the content-creation behavior: it frames a content request into a
 * governed content-generation task (an immutable `ContentPlan` carrying an Agent Engine `AgentRequest`), exposes the
 * content growth agent, and frames a content-quality `EvaluationRequest` for the frozen Evaluation Engine. It consumes a
 * marketing direction and the brand voice by reference and owns neither; it produces governed AI outputs, executes
 * nothing, selects no provider, and decides nothing.
 */
export class ContentIntelligence {
  readonly #framer = new ContentFramer(new ContentHash());
  #framed = 0;
  #rejected = 0;

  /** Frame a content request into an immutable plan; fail closed on an unknown, blank, or invalid request. */
  plan(request: ContentRequest): Result<ContentPlan, ContentError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The content growth agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return CONTENT_AGENT;
  }

  /** Frame a content-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(plan: ContentPlan, metrics: readonly MetricMeasurement[]): EvaluationRequest {
    return contentEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): ContentStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
