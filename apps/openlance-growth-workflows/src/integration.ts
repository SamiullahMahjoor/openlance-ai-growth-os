import type { CampaignPlan } from '@openlance/aios-campaign-intelligence';

import type { GrowthWorkflowRequest, WorkflowType } from './types.js';

/** The workflow framing supplied alongside a Campaign Intelligence output to build a growth-workflow request. */
export interface WorkflowFraming {
  readonly type: WorkflowType;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge?: readonly string[];
}

/**
 * Build a growth-workflow request from a Campaign Intelligence output, consuming the campaign plan and, through it, the
 * analytics, social, SEO, content, and marketing references by reference through the public `CampaignPlan` contract (the
 * campaign plan id and its own analytics, social, seo, content, and marketing references). The workflow composes the six
 * planner outputs; it never owns any of them and never executes them. This is a pure translation; it frames nothing and
 * decides nothing. It is the `Campaign -> Growth Workflows` step of the chain.
 */
export const workflowFromCampaign = (
  plan: CampaignPlan,
  framing: WorkflowFraming,
): GrowthWorkflowRequest => ({
  type: framing.type,
  objective: framing.objective,
  agent: framing.agent,
  marketing: plan.marketing,
  content: plan.content,
  seo: plan.seo,
  social: plan.social,
  analytics: plan.analytics,
  campaign: plan.id,
  ...(framing.knowledge === undefined ? {} : { knowledge: framing.knowledge }),
});
