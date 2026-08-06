import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * An SEO capability: one SEO behavior the subsystem frames as a governed platform task. It names a behavior the AI
 * performs (producing an SEO output by consuming a marketing direction, a content plan, and knowledge); it is never
 * marketing strategy, content creation, a social behavior, or business truth (owned by knowledge/marketing/,
 * knowledge/product/, knowledge/competitors/, knowledge/customers/, and knowledge/brand/).
 */
export type SeoCapability =
  | 'keyword-research'
  | 'search-intent-analysis'
  | 'topical-clustering'
  | 'semantic-clustering'
  | 'content-gap-analysis'
  | 'technical-seo-planning'
  | 'on-page-optimization-planning'
  | 'internal-linking-strategy'
  | 'schema-recommendations'
  | 'serp-opportunity-analysis'
  | 'backlink-opportunity-recommendations'
  | 'seo-roadmap-planning'
  | 'seo-evaluation';

/**
 * An SEO request: the SEO `capability` to frame, the `objective`, the growth `agent`, a reference to the `marketing`
 * direction it works from (a Marketing Intelligence output) and the `content` plan it optimizes (a Content Intelligence
 * output), both consumed by reference, and any additional canonical `knowledge` references. It consumes marketing,
 * content, and business truth by reference and owns none.
 */
export interface SeoRequest {
  readonly capability: SeoCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable SEO plan: the framed, governed SEO task. It records the capability, objective, agent, the marketing
 * direction and content plan it consumes by reference, any additional knowledge references, a plain-language deliverable,
 * and the frozen Agent Engine `AgentRequest` the platform composes and executes. It carries no business truth; it
 * references it.
 */
export interface SeoPlan {
  readonly capability: SeoCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly content: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface SeoStatistics {
  readonly framed: number;
  readonly rejected: number;
}
