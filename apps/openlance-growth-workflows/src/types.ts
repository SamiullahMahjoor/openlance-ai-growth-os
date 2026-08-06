import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * A planner stage: one of the six frozen AI Growth OS planners, in canonical chain order. A growth workflow composes an
 * ordered subsequence of these stages by reference. It is never a planner capability and never business truth.
 */
export type PlannerStage = 'marketing' | 'content' | 'seo' | 'social' | 'analytics' | 'campaign';

/** A structural classification of a growth workflow (workflow-definition metadata; never business truth). */
export type WorkflowCategory =
  'acquisition' | 'activation' | 'retention' | 'growth' | 'launch' | 'campaign' | 'optimization';

/**
 * An OpenLance growth workflow type: one reusable, marketplace-oriented growth workflow the subsystem frames by composing
 * the frozen planners. It names a workflow behavior the AI frames; it is never a planner capability, an execution, or
 * business truth.
 */
export type WorkflowType =
  | 'freelancer-acquisition'
  | 'employer-acquisition'
  | 'founder-campaign'
  | 'marketplace-liquidity'
  | 'freelancer-activation'
  | 'employer-activation'
  | 'user-onboarding'
  | 'reactivation'
  | 'referral-growth'
  | 'product-launch'
  | 'feature-announcement'
  | 'seasonal-promotion'
  | 'email-nurture'
  | 'retention'
  | 'conversion-optimization';

/**
 * A growth-workflow request: the workflow `type` to frame, the `objective`, the growth `agent`, references to the six
 * planner outputs it composes by reference (a `MarketingBrief`, `ContentPlan`, `SeoPlan`, `SocialPlan`, `AnalyticsPlan`,
 * and `CampaignPlan` id), and any additional canonical `knowledge` references. It consumes the planner outputs and
 * business truth by reference and owns none.
 */
export interface GrowthWorkflowRequest {
  readonly type: WorkflowType;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly social: string;
  readonly analytics: string;
  readonly campaign: string;
  readonly knowledge?: readonly string[];
}

/** The immutable metadata of a growth workflow (its structural classification and composed-planner count). */
export interface WorkflowMetadata {
  readonly category: WorkflowCategory;
  readonly plannerCount: number;
}

/**
 * An immutable growth workflow: the framed, governed workflow. It records the workflow type, the ordered planner
 * `sequence` it composes, the `plannerReferences` for that sequence (in order), the full `upstream` planner ids it
 * consumes by reference, any additional knowledge references, immutable `metadata`, a plain-language deliverable, and the
 * frozen Agent Engine `AgentRequest` the platform composes and executes. It carries no business truth; it references it.
 */
export interface GrowthWorkflow {
  readonly id: string;
  readonly type: WorkflowType;
  readonly objective: string;
  readonly agent: string;
  readonly sequence: readonly PlannerStage[];
  readonly plannerReferences: readonly string[];
  readonly upstream: Readonly<Record<PlannerStage, string>>;
  readonly knowledge: readonly string[];
  readonly metadata: WorkflowMetadata;
  readonly deliverable: string;
  readonly request: AgentRequest;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface WorkflowStatistics {
  readonly framed: number;
  readonly rejected: number;
}
