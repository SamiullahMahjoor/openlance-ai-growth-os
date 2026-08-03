/**
 * Agent architecture: the architectural definition of an agent, its identity and the parts it is composed
 * of, and how it composes the operational namespaces (ai/agents/agent-architecture.md,
 * OL-AI-AGENTS-AGENT-ARCHITECTURE).
 *
 * An agent is a uniquely identified actor composed of its identity, capabilities, permissions, and
 * specialization, that composes the operational namespaces under governance. This module defines the closed
 * set of parts an agent is composed of, plus the structural principles and invariants. The parts are
 * unordered and carry no predicate; each part beyond identity is owned by its named document (capabilities,
 * permissions, specialization), and the composed operational namespaces are referenced in prose, never
 * restated (ADR-0020, ADR-0025).
 */

/**
 * An agent-architecture principle: a permanent rule the structural model upholds, each instantiating an
 * agent invariant (ai/agents/agent-architecture.md, "Principles").
 */
export type AgentArchitecturePrinciple =
  | 'an-agent-has-a-distinct-identity'
  | 'an-agent-is-composed-not-monolithic'
  | 'an-agent-composes-it-never-owns'
  | 'an-agents-structure-is-deterministic';

/** The agent-architecture principles, in constitutional order; frozen. */
export const AGENT_ARCHITECTURE_PRINCIPLES: readonly AgentArchitecturePrinciple[] = Object.freeze([
  'an-agent-has-a-distinct-identity',
  'an-agent-is-composed-not-monolithic',
  'an-agent-composes-it-never-owns',
  'an-agents-structure-is-deterministic',
]);

/** What each agent-architecture principle requires (ai/agents/agent-architecture.md, "Principles"). */
export const AGENT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentArchitecturePrinciple, string>
> = Object.freeze({
  'an-agent-has-a-distinct-identity':
    'Every agent is uniquely identified as an actor, so no two agents are the same and no concern is owned by two agents.',
  'an-agent-is-composed-not-monolithic':
    'An agent is composed of an identity, a set of capabilities, a set of permissions, and a specialization, and it composes the operational namespaces to act.',
  'an-agent-composes-it-never-owns':
    'An agent uses the reasoning, retrieval, memory, and prompt namespaces, and performs none of their internal work.',
  'an-agents-structure-is-deterministic':
    'The same definition resolves to the same identity, parts, and composition, with no randomness.',
});

/**
 * An agent part: one of the parts an agent is composed of, in constitutional listing order
 * (ai/agents/agent-architecture.md, "Specification"). The set is closed and unordered; each part is owned by
 * its named document (identity here; capabilities, permissions, and specialization by their concern
 * documents).
 */
export type AgentPart = 'identity' | 'capabilities' | 'permissions' | 'specialization';

/** The parts an agent is composed of, in constitutional listing order; frozen. */
export const AGENT_PARTS: readonly AgentPart[] = Object.freeze([
  'identity',
  'capabilities',
  'permissions',
  'specialization',
]);

/** What each agent part is (ai/agents/agent-architecture.md, "Specification"). */
export const AGENT_PART_DESCRIPTIONS: Readonly<Record<AgentPart, string>> = Object.freeze({
  identity:
    'An agent has a distinct, stable identity that uniquely identifies it as an actor, so it can be registered, addressed, coordinated, and held accountable as one actor; how an identity is registered and discovered is owned by ai/agents/agent-lifecycle.md.',
  capabilities:
    'An agent is composed of the capabilities it holds under ai/agents/agent-capabilities.md; this document owns that an agent is composed of them, and the capability model is owned there.',
  permissions:
    'An agent is composed of the permissions it holds under ai/agents/agent-permissions.md; this document owns that an agent is composed of them, and the permission model is owned there.',
  specialization:
    'An agent is composed of the specialization it holds under ai/agents/agent-specialization.md; this document owns that an agent is composed of it, and the specialization model is owned there.',
});

/**
 * An agent-architecture invariant: a guarantee the structural model always upholds
 * (ai/agents/agent-architecture.md, "Invariants").
 */
export type AgentArchitectureInvariant =
  | 'every-agent-has-a-distinct-stable-identity-never-shared'
  | 'composed-of-identity-capabilities-permissions-and-specialization'
  | 'composes-the-operational-namespaces-owns-none'
  | 'same-definition-same-structure'
  | 'defining-structure-is-inert';

/** The agent-architecture invariants, in constitutional order; frozen. */
export const AGENT_ARCHITECTURE_INVARIANTS: readonly AgentArchitectureInvariant[] = Object.freeze([
  'every-agent-has-a-distinct-stable-identity-never-shared',
  'composed-of-identity-capabilities-permissions-and-specialization',
  'composes-the-operational-namespaces-owns-none',
  'same-definition-same-structure',
  'defining-structure-is-inert',
]);

/** What each agent-architecture invariant guarantees (ai/agents/agent-architecture.md, "Invariants"). */
export const AGENT_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentArchitectureInvariant, string>
> = Object.freeze({
  'every-agent-has-a-distinct-stable-identity-never-shared':
    'Every agent has a distinct, stable identity that is never shared.',
  'composed-of-identity-capabilities-permissions-and-specialization':
    'An agent is composed of its identity, capabilities, permissions, and specialization, each owned by its named document.',
  'composes-the-operational-namespaces-owns-none':
    'An agent composes the operational namespaces and owns none of them.',
  'same-definition-same-structure':
    'The same agent definition resolves to the same structure, with no randomness.',
  'defining-structure-is-inert':
    "Defining an agent's structure never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.",
});
