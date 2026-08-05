import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * A marketing-intelligence capability: one marketing behavior the subsystem frames as a governed platform task. It names
 * a behavior the AI performs (producing a marketing output by consuming knowledge); it is never a marketing strategy,
 * which is owned by knowledge/marketing/.
 */
export type MarketingCapability =
  | 'market-research'
  | 'icp-discovery'
  | 'competitor-analysis'
  | 'positioning'
  | 'messaging'
  | 'offer-strategy'
  | 'funnel-strategy'
  | 'campaign-planning'
  | 'gtm-planning'
  | 'recommendation'
  | 'evaluation';

/**
 * A marketing request: the marketing `capability` to frame, the `objective` to achieve, the growth `agent` to act, the
 * canonical `knowledge` references the behavior consumes (business truth owned by the knowledge repository, consumed by
 * reference and never restated), and an optional `audience`.
 */
export interface MarketingRequest {
  readonly capability: MarketingCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge: readonly string[];
  readonly audience?: string;
}

/**
 * An immutable marketing brief: the framed, governed marketing task. It records the capability, objective, agent, the
 * knowledge it consumes by reference, the audience, a plain-language deliverable, and the frozen Agent Engine
 * `AgentRequest` the platform composes and executes. It carries no business truth; it references it.
 */
export interface MarketingBrief {
  readonly capability: MarketingCapability;
  readonly objective: string;
  readonly agent: string;
  readonly knowledge: readonly string[];
  readonly audience: string | null;
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface MarketingStatistics {
  readonly framed: number;
  readonly rejected: number;
}
