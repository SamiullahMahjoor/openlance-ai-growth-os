import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * A campaign capability: one campaign planning behavior the subsystem frames as a governed platform task. It names a
 * behavior the AI performs (producing a cross-channel campaign planning output by consuming the upstream growth plans and
 * knowledge); it is never marketing strategy, content, an SEO, social, or analytics behavior, or business truth.
 * `campaign-orchestration-planning` is the final cross-channel assembly (distinct from Marketing's frozen
 * `campaign-planning`); `campaign-plan-evaluation` frames an evaluation of the campaign plan (distinct from Social's
 * frozen `campaign-evaluation`); neither performs or scores an evaluation.
 */
export type CampaignCapability =
  | 'campaign-orchestration-planning'
  | 'launch-planning'
  | 'multi-channel-planning'
  | 'funnel-planning'
  | 'audience-sequencing'
  | 'lifecycle-planning'
  | 'budget-recommendations'
  | 'experiment-planning'
  | 'optimization-planning'
  | 'campaign-plan-evaluation';

/**
 * A campaign request: the campaign `capability` to frame, the `objective`, the growth `agent`, references to the
 * `marketing` direction, the `content` plan, the `seo` plan, the `social` plan, and the `analytics` plan it works from
 * (all Growth OS outputs, consumed by reference), and any additional canonical `knowledge` references. It consumes
 * marketing, content, SEO, social, analytics, and business truth by reference and owns none.
 */
export interface CampaignRequest {
  readonly capability: CampaignCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly social: string;
  readonly analytics: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable campaign plan: the framed, governed campaign task. It records the capability, objective, agent, the
 * marketing, content, SEO, social, and analytics plans it consumes by reference, any additional knowledge references, a
 * plain-language deliverable, and the frozen Agent Engine `AgentRequest` the platform composes and executes. It carries
 * no business truth; it references it.
 */
export interface CampaignPlan {
  readonly capability: CampaignCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly social: string;
  readonly analytics: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface CampaignStatistics {
  readonly framed: number;
  readonly rejected: number;
}
