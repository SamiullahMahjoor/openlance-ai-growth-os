import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * A social-media capability: one social behavior the subsystem frames as a governed platform task. It names a behavior
 * the AI performs (planning distribution and engagement across social platforms by consuming a marketing direction, a
 * content plan, an SEO plan, and knowledge); it is never marketing strategy (owned by knowledge/marketing/), content
 * (owned by Content Intelligence), an SEO behavior, nor a brand standard (owned by knowledge/brand/). `platform-strategy`
 * is social-platform strategy (which platforms and how), never marketing strategy.
 */
export type SocialCapability =
  | 'platform-strategy'
  | 'post-planning'
  | 'campaign-framing'
  | 'content-calendar'
  | 'audience-engagement-recommendations'
  | 'hashtag-planning'
  | 'posting-schedule-recommendations'
  | 'community-growth-recommendations'
  | 'influencer-collaboration-planning'
  | 'platform-specific-adaptation'
  | 'campaign-evaluation';

/**
 * A social request: the social `capability` to frame, the `objective`, the growth `agent`, references to the `marketing`
 * direction, the `content` plan, and the `seo` plan it works from (all Growth OS outputs, consumed by reference), and any
 * additional canonical `knowledge` references. It consumes marketing, content, SEO, and business truth by reference and
 * owns none.
 */
export interface SocialRequest {
  readonly capability: SocialCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable social plan: the framed, governed social task. It records the capability, objective, agent, the marketing
 * direction, content plan, and SEO plan it consumes by reference, any additional knowledge references, a plain-language
 * deliverable, and the frozen Agent Engine `AgentRequest` the platform composes and executes. It carries no business
 * truth; it references it.
 */
export interface SocialPlan {
  readonly capability: SocialCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly seo: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface SocialStatistics {
  readonly framed: number;
  readonly rejected: number;
}
