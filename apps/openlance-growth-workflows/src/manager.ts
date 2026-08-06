import type { AgentDefinitionInput } from '@openlance/aios-agent-engine';
import type { EvaluationRequest, MetricMeasurement } from '@openlance/aios-evaluation-engine';
import { isErr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { WORKFLOW_AGENT } from './agent.js';
import type { GrowthWorkflowError } from './errors.js';
import { workflowEvaluationRequest } from './evaluation.js';
import { GrowthWorkflowFramer } from './framing.js';
import { GrowthWorkflowHash } from './hash.js';
import type { GrowthWorkflow, GrowthWorkflowRequest, WorkflowStatistics } from './types.js';

/**
 * The OpenLance Growth Workflows facade and DI entry. It owns the growth-workflow behavior: it frames a growth-workflow
 * request into a governed workflow (an immutable `GrowthWorkflow` composing the six frozen planners by reference and
 * carrying an Agent Engine `AgentRequest`), exposes the growth-workflow agent, and frames a workflow-quality
 * `EvaluationRequest` for the frozen Evaluation Engine. It consumes the planner outputs and knowledge by reference and
 * owns none; it produces governed AI outputs, executes nothing, schedules nothing, automates nothing, orchestrates no
 * runtime, selects no provider, and decides nothing.
 */
export class OpenLanceGrowthWorkflows {
  readonly #framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());
  #framed = 0;
  #rejected = 0;

  /** Frame a growth-workflow request into an immutable workflow; fail closed on an unknown, blank, or invalid request. */
  plan(request: GrowthWorkflowRequest): Result<GrowthWorkflow, GrowthWorkflowError> {
    const result = this.#framer.frame(request);
    if (isErr(result)) {
      this.#rejected += 1;
    } else {
      this.#framed += 1;
    }
    return result;
  }

  /** The growth-workflow agent definition, for the caller to register with the Agent Engine. */
  agentDefinition(): AgentDefinitionInput {
    return WORKFLOW_AGENT;
  }

  /** Frame a workflow-quality evaluation for the frozen Evaluation Engine. */
  evaluationRequest(
    workflow: GrowthWorkflow,
    metrics: readonly MetricMeasurement[],
  ): EvaluationRequest {
    return workflowEvaluationRequest(workflow, metrics);
  }

  /** A frozen snapshot of the subsystem's own counters. */
  statistics(): WorkflowStatistics {
    return Object.freeze({ framed: this.#framed, rejected: this.#rejected });
  }
}
