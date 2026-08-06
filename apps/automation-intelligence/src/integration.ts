import type { GrowthWorkflow } from '@openlance/aios-openlance-growth-workflows';

import type { AutomationCapability, AutomationRequest } from './types.js';

/** The automation framing supplied alongside a Growth Workflows output to build an automation request. */
export interface AutomationFraming {
  readonly capability: AutomationCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build an automation request from a Growth Workflows output, consuming the growth workflow and, through it, the six
 * planner references by reference through the public `GrowthWorkflow` contract (the workflow id, which carries the planner
 * references transitively). Automation consumes the growth workflow; it never owns it and never executes it. This is a
 * pure translation; it frames nothing and decides nothing. It is the `Growth Workflows -> Automation` step of the chain.
 */
export const automationRequestFromWorkflow = (
  workflow: GrowthWorkflow,
  framing: AutomationFraming,
): AutomationRequest => ({
  capability: framing.capability,
  objective: framing.objective,
  agent: framing.agent,
  workflow: workflow.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
