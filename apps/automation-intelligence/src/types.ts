import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * An automation capability: one governed-automation-opportunity planning behavior the subsystem frames as a governed
 * platform task. It names a behavior the AI performs (preparing a governed automation opportunity by consuming a completed
 * growth workflow and knowledge); it is never a Growth Workflows behavior, a planner behavior, an execution, a schedule, a
 * trigger, a governance decision, or business truth. Each capability is a plan or recommendation the platform later acts
 * on through its governed runtime; none schedules, triggers, executes, or governs anything.
 */
export type AutomationCapability =
  | 'automation-opportunity-analysis'
  | 'workflow-automation-planning'
  | 'task-automation-planning'
  | 'trigger-recommendation'
  | 'handoff-planning'
  | 'guardrail-recommendation'
  | 'escalation-recommendation'
  | 'monitoring-recommendation'
  | 'rollout-planning'
  | 'automation-roadmap-planning'
  | 'automation-evaluation';

/**
 * An automation request: the automation `capability` to frame, the `objective`, the automation `agent`, a reference to the
 * `workflow` (a Growth Workflows `GrowthWorkflow` id, consumed by reference and carrying the six planner references
 * transitively), and any additional canonical `knowledge` references. It consumes the growth workflow and business truth
 * by reference and owns none.
 */
export interface AutomationRequest {
  readonly capability: AutomationCapability;
  readonly objective: string;
  readonly agent: string;
  readonly workflow: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable automation plan: the framed, governed automation opportunity. It records the capability, objective, agent,
 * the `workflow` it consumes by reference, any additional knowledge references, a plain-language deliverable, the frozen
 * Agent Engine `AgentRequest` the platform composes and executes, and its content-addressed id. It carries no business
 * truth; it references it. It is a plan, never an execution: it schedules, triggers, and governs nothing.
 */
export interface AutomationPlan {
  readonly capability: AutomationCapability;
  readonly objective: string;
  readonly agent: string;
  readonly workflow: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface AutomationStatistics {
  readonly framed: number;
  readonly rejected: number;
}
