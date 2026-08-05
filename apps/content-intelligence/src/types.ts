import type { AgentRequest } from '@openlance/aios-agent-engine';

/**
 * A content-creation capability: one content behavior the subsystem frames as a governed platform task. It names a
 * behavior the AI performs (producing content by consuming a marketing direction and the brand voice); it is never a
 * marketing strategy (owned by knowledge/marketing/) nor a brand standard (owned by knowledge/brand/).
 */
export type ContentCapability =
  | 'blog'
  | 'landing-page'
  | 'website-copy'
  | 'product-copy'
  | 'email-campaign'
  | 'newsletter'
  | 'case-study'
  | 'documentation'
  | 'knowledge-article'
  | 'rewrite'
  | 'tone-adaptation';

/**
 * A content request: the content `capability` to frame, the `objective`, the growth `agent`, a reference to the
 * `marketing` direction it works from (a Marketing Intelligence output, consumed by reference), the `brandVoice` it
 * applies (a canonical knowledge/brand reference), and any additional canonical `knowledge` references. It consumes
 * marketing strategy and brand truth by reference and owns neither.
 */
export interface ContentRequest {
  readonly capability: ContentCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly brandVoice: string;
  readonly knowledge?: readonly string[];
}

/**
 * An immutable content plan: the framed, governed content-generation task. It records the capability, objective, agent,
 * the marketing direction and brand voice it consumes by reference, any additional knowledge references, a plain-language
 * deliverable, and the frozen Agent Engine `AgentRequest` the platform composes and executes. It carries no business
 * truth; it references it.
 */
export interface ContentPlan {
  readonly capability: ContentCapability;
  readonly objective: string;
  readonly agent: string;
  readonly marketing: string;
  readonly brandVoice: string;
  readonly knowledge: readonly string[];
  readonly deliverable: string;
  readonly request: AgentRequest;
  readonly id: string;
}

/** A read-only snapshot of the subsystem's own counters. */
export interface ContentStatistics {
  readonly framed: number;
  readonly rejected: number;
}
