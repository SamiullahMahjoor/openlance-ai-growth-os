/**
 * Agent boundaries: what agents never own, where an agent stops, and agent fault isolation
 * (ai/agents/agent-boundaries.md, OL-AI-AGENTS-AGENT-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries an agent operates within.
 * This module owns the boundaries; the rules that set them are owned by ai/governance/, and the concerns
 * beyond them by their namespaces. An action that would cross any boundary does not proceed; it is refused or
 * escalated (ai/governance/escalation.md). The boundaries carry no ordering and no predicate; how a boundary
 * is enforced is the runtime's, and this module is their immutable definition (ADR-0020).
 */

/**
 * An agent-boundaries principle: a permanent rule the boundaries uphold, each instantiating an agent
 * invariant (ai/agents/agent-boundaries.md, "Principles").
 */
export type AgentBoundaryPrinciple =
  | 'an-agent-composes-it-does-not-own'
  | 'an-agent-acts-within-its-bounds'
  | 'an-agent-does-not-execute-itself'
  | 'an-agents-fault-is-isolated';

/** The agent-boundaries principles, in constitutional order; frozen. */
export const AGENT_BOUNDARY_PRINCIPLES: readonly AgentBoundaryPrinciple[] = Object.freeze([
  'an-agent-composes-it-does-not-own',
  'an-agent-acts-within-its-bounds',
  'an-agent-does-not-execute-itself',
  'an-agents-fault-is-isolated',
]);

/** What each agent-boundaries principle requires (ai/agents/agent-boundaries.md, "Principles"). */
export const AGENT_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<Record<AgentBoundaryPrinciple, string>> =
  Object.freeze({
    'an-agent-composes-it-does-not-own':
      'An agent composes the operational namespaces and owns none of them, and it never owns business truth.',
    'an-agent-acts-within-its-bounds':
      'An agent acts only within its capabilities, permissions, and autonomy bounds, and escalates rather than exceed them.',
    'an-agent-does-not-execute-itself':
      'An agent is orchestrated and executed by the runtime; it never orchestrates, schedules, or executes.',
    'an-agents-fault-is-isolated':
      'A failing agent is bounded so that its failure does not corrupt another agent or the shared layers.',
  });

/**
 * An agent boundary: one architectural boundary an agent operates within, in constitutional listing order
 * (ai/agents/agent-boundaries.md, "Specification"). The set is unordered.
 */
export type AgentBoundary =
  | 'composition'
  | 'truth'
  | 'governance'
  | 'execution'
  | 'fault-isolation'
  | 'implementation';

/** The agent boundaries, in constitutional listing order; frozen. */
export const AGENT_BOUNDARIES: readonly AgentBoundary[] = Object.freeze([
  'composition',
  'truth',
  'governance',
  'execution',
  'fault-isolation',
  'implementation',
]);

/** What each agent boundary is (ai/agents/agent-boundaries.md, "Specification"). */
export const AGENT_BOUNDARY_DESCRIPTIONS: Readonly<Record<AgentBoundary, string>> = Object.freeze({
  composition:
    'An agent composes reasoning, retrieval, memory, and prompts, and, in future, tools and providers, and owns none of them; it never performs the internal work of a composed namespace, which each namespace owns.',
  truth:
    'An agent consumes business truth by reference and never owns, restates, amends, or becomes it, which is owned by the knowledge repository.',
  governance:
    'An agent acts within its capabilities (ai/agents/agent-capabilities.md), its permissions (ai/agents/agent-permissions.md), and the autonomy bounds owned by ai/governance/autonomy-boundaries.md; it never escalates its own authority and escalates rather than exceed its bounds, under ai/governance/escalation.md.',
  execution:
    'An agent is orchestrated, scheduled, and executed by ai/runtime/; an agent never orchestrates, schedules, or executes, and it never selects a provider or model, which is owned by the Providers namespace.',
  'fault-isolation':
    "An agent's failure is bounded to the agent; a failing agent never corrupts another agent, the shared namespaces, or business truth, its fault is contained, and its work is escalated or retired under governance rather than propagated.",
  implementation:
    'An agent is a model of an actor, never an orchestration system, a framework, a protocol, a provider, a model, or code.',
});

/**
 * An agent-boundaries invariant: a guarantee the boundaries always uphold (ai/agents/agent-boundaries.md,
 * "Invariants").
 */
export type AgentBoundaryInvariant =
  | 'composes-the-operational-namespaces-owns-none-never-owns-truth'
  | 'acts-only-within-capabilities-permissions-autonomy-never-escalates-authority'
  | 'never-orchestrates-schedules-executes-or-selects-provider-or-model'
  | 'a-failing-agents-fault-bounded-never-corrupts-another'
  | 'enforcing-a-boundary-is-inert';

/** The agent-boundaries invariants, in constitutional order; frozen. */
export const AGENT_BOUNDARY_INVARIANTS: readonly AgentBoundaryInvariant[] = Object.freeze([
  'composes-the-operational-namespaces-owns-none-never-owns-truth',
  'acts-only-within-capabilities-permissions-autonomy-never-escalates-authority',
  'never-orchestrates-schedules-executes-or-selects-provider-or-model',
  'a-failing-agents-fault-bounded-never-corrupts-another',
  'enforcing-a-boundary-is-inert',
]);

/** What each agent-boundaries invariant guarantees (ai/agents/agent-boundaries.md, "Invariants"). */
export const AGENT_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentBoundaryInvariant, string>
> = Object.freeze({
  'composes-the-operational-namespaces-owns-none-never-owns-truth':
    'An agent composes the operational namespaces and owns none of them, and never owns business truth.',
  'acts-only-within-capabilities-permissions-autonomy-never-escalates-authority':
    'An agent acts only within its capabilities, permissions, and autonomy bounds, and never escalates its own authority.',
  'never-orchestrates-schedules-executes-or-selects-provider-or-model':
    'An agent never orchestrates, schedules, executes, or selects a provider or model.',
  'a-failing-agents-fault-bounded-never-corrupts-another':
    "A failing agent's fault is bounded to it and never corrupts another agent or the shared layers.",
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
