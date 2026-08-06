import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * An analytics capability: one analytics behavior the subsystem frames as a governed platform task. It names a behavior
 * the AI performs (producing an analytics planning output by consuming the upstream growth plans and knowledge); it is
 * never marketing strategy, content, an SEO or social behavior, or business truth. `analytics-evaluation` frames an
 * analytics-quality evaluation; it never performs or scores an evaluation.
 */
export type AnalyticsCapability =
  | 'kpi-planning'
  | 'funnel-analysis'
  | 'attribution-planning'
  | 'conversion-analysis'
  | 'event-planning'
  | 'dashboard-framing'
  | 'metric-recommendation'
  | 'performance-interpretation'
  | 'cohort-analysis'
  | 'retention-planning'
  | 'experiment-recommendation'
  | 'analytics-evaluation';

/**
 * An analytics request: the analytics `capability` to frame, the `objective`, the growth `agent`, references to the
 * `marketing` direction, the `content` plan, the `seo` plan, and the `social` plan it works from (all Growth OS outputs,
 * consumed by reference), and any additional canonical `knowledge` references. It consumes marketing, content, SEO,
 * social, and business truth by reference and owns none.
 */
export interface AnalyticsRequest {
  readonly capability: AnalyticsCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly social: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable analytics plan: the framed, governed analytics task. It records the capability, objective, agent, the
 * marketing, content, SEO, and social plans it consumes by reference, any additional knowledge references, a
 * plain-language deliverable, and the frozen Agent Engine `AgentRequest` the platform composes and executes. It carries
 * no business truth; it references it.
 */
export interface AnalyticsPlan {
  readonly capability: AnalyticsCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly social: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface AnalyticsStatistics {
  readonly framed: number;
  readonly rejected: number;
}
