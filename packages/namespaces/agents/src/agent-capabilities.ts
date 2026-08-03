/**
 * Agent capabilities: what an agent can do, and capability inheritance (ai/agents/agent-capabilities.md,
 * OL-AI-AGENTS-AGENT-CAPABILITIES).
 *
 * The Specification narrates the capability model as heterogeneous facets (the capability model, bounded
 * ability, capability inheritance, capability against permission), not a closed taxonomy the model refers to
 * by identity, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. Capability inheritance resolves overlaps by
 * higher authority, then single owner, then specificity - applying the Authority Hierarchy owned by
 * ai/README.md and the ownership owned by ai/architecture/ - and is stated as prose, never recreated as an
 * executable precedence (referenced-model non-restatement; ADR-0025). What an agent may do is owned by
 * ai/agents/agent-permissions.md and the internal work of a composed namespace by that namespace (ADR-0020).
 */

/**
 * An agent-capabilities principle: a permanent rule the capability model upholds, each instantiating an
 * agent invariant (ai/agents/agent-capabilities.md, "Principles").
 */
export type AgentCapabilitiesPrinciple =
  | 'a-capability-is-an-ability-not-a-permission'
  | 'a-capability-composes-a-namespace-it-never-owns-it'
  | 'capabilities-are-explicit-and-bounded'
  | 'capability-inheritance-is-single-and-acyclic';

/** The agent-capabilities principles, in constitutional order; frozen. */
export const AGENT_CAPABILITIES_PRINCIPLES: readonly AgentCapabilitiesPrinciple[] = Object.freeze([
  'a-capability-is-an-ability-not-a-permission',
  'a-capability-composes-a-namespace-it-never-owns-it',
  'capabilities-are-explicit-and-bounded',
  'capability-inheritance-is-single-and-acyclic',
]);

/** What each agent-capabilities principle requires (ai/agents/agent-capabilities.md, "Principles"). */
export const AGENT_CAPABILITIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentCapabilitiesPrinciple, string>
> = Object.freeze({
  'a-capability-is-an-ability-not-a-permission':
    'A capability is what an agent can do; whether it may do it is owned by ai/agents/agent-permissions.md.',
  'a-capability-composes-a-namespace-it-never-owns-it':
    "A capability is an agent's ability to use an operational namespace, and it performs none of that namespace's internal work.",
  'capabilities-are-explicit-and-bounded':
    'An agent holds a defined set of capabilities, and it can do nothing outside them.',
  'capability-inheritance-is-single-and-acyclic':
    'A capability inherited from a role or a base agent resolves through a single, acyclic inheritance, so capabilities never conflict or cycle.',
});

/**
 * An agent-capabilities invariant: a guarantee the capability model always upholds
 * (ai/agents/agent-capabilities.md, "Invariants").
 */
export type AgentCapabilitiesInvariant =
  | 'a-capability-names-an-ability-never-performs-that-work'
  | 'nothing-outside-defined-set-of-capabilities'
  | 'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity'
  | 'acts-only-where-holds-capability-and-permitted'
  | 'defining-capabilities-is-inert';

/** The agent-capabilities invariants, in constitutional order; frozen. */
export const AGENT_CAPABILITIES_INVARIANTS: readonly AgentCapabilitiesInvariant[] = Object.freeze([
  'a-capability-names-an-ability-never-performs-that-work',
  'nothing-outside-defined-set-of-capabilities',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity',
  'acts-only-where-holds-capability-and-permitted',
  'defining-capabilities-is-inert',
]);

/** What each agent-capabilities invariant guarantees (ai/agents/agent-capabilities.md, "Invariants"). */
export const AGENT_CAPABILITIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentCapabilitiesInvariant, string>
> = Object.freeze({
  'a-capability-names-an-ability-never-performs-that-work':
    "A capability names an agent's ability to use a namespace or perform a class of action, and never performs that work.",
  'nothing-outside-defined-set-of-capabilities':
    'An agent can do nothing outside its defined set of capabilities.',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity':
    'Capability inheritance is single and acyclic, and overlapping capabilities resolve by authority, then owner, then specificity.',
  'acts-only-where-holds-capability-and-permitted':
    'An agent acts only where it both holds the capability and is permitted, so ability never implies authority.',
  'defining-capabilities-is-inert':
    'Defining capabilities never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
