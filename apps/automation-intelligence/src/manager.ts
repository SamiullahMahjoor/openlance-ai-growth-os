import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AUTOMATION_AGENT } from './agent.js';
import type { AutomationError } from './errors.js';
import { automationEvaluationRequest } from './evaluation.js';
import { AutomationFramer } from './framing.js';
import { AutomationHash } from './hash.js';
import type { AutomationPlan, AutomationRequest, AutomationStatistics } from './types.js';

/**
 * The Automation Intelligence facade and DI entry. It owns the automation-planning behavior: it frames an automation
 * request into a governed automation opportunity (an immutable `AutomationPlan` carrying an Agent Engine `AgentRequest`),
 * exposes the automation agent, and frames an automation-quality `EvaluationRequest` for the frozen Evaluation Engine. It
 * consumes a growth workflow by reference and owns none; it produces governed AI outputs, executes nothing, schedules
 * nothing, orchestrates nothing, mints no governance clearance, selects no provider, and decides nothing.
 */
export class AutomationIntelligence {
  readonly #framer = new AutomationFramer(new AutomationHash());
  #framed = 0;
  #rejected = 0;

  /** Frame an automation request into an immutable plan; fail closed on an unknown, blank, or invalid request. */
  plan(request: AutomationRequest): Result<AutomationPlan, AutomationError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The automation agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return AUTOMATION_AGENT;
  }

  /** Frame an automation-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(
    plan: AutomationPlan,
    metrics: readonly MetricMeasurement[],
  ): EvaluationRequest {
    return automationEvaluationRequest(plan, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): AutomationStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
