/**
 * The Agents namespace, namespace-wide truth (ai/agents/README.md, OL-AI-AGENTS-README; ai/agents/agents.md,
 * OL-AI-AGENTS-AGENTS).
 *
 * The agent invariants every agent concern upholds, and the canonical inventory of the agent concerns, as
 * immutable definitions (ADR-0020). The namespace is the actor model of the AI layer: it defines what an
 * agent is as an actor within the AI Operating System, and how an agent is composed, identified, capable,
 * permitted, specialized, coordinated, and evolved, so that work is performed by governed, bounded,
 * deterministic actors. An agent composes the operational namespaces (reasoning, retrieval, memory, prompts,
 * and, in future, tools and providers) under governance and owns none of them; it never orchestrates,
 * schedules, or executes (ai/runtime/), never reasons or retrieves or composes a prompt itself, and never
 * defines an orchestration system, a framework, a protocol, a provider, a model, or code (ai/agents/README.md).
 * An agent is a deterministic composition: the same definition under the same governing rules resolves and
 * behaves the same way, and the model holds for one agent or tens of thousands (ai/agents/agents.md).
 *
 * ADR-0024 classifies Agents as category 1 (Pure Domain Model, declared per ADR-0024 §42; not among the
 * ADR's enumerated examples). Its executable surface is one pure ordering predicate over an agent-owned
 * classification - the lifecycle-phase ordering - realized per ADR-0020 as an immutable stateless domain
 * model with no IO; the orchestration and execution of a concrete agent are the runtime's.
 */

/**
 * An agent invariant: a permanent guarantee every agent document upholds and no agent may violate
 * (ai/agents/README.md, "Agent Invariants"). Every agent concern's principles instantiate these.
 */
export type AgentInvariant =
  | 'distinct-uniquely-identified-actor'
  | 'acts-only-within-capabilities-and-permissions'
  | 'composes-operational-namespaces-owns-none'
  | 'governed-and-bounded'
  | 'coordination-acyclic-delegation-bounded'
  | 'deterministic-composition'
  | 'fault-is-isolated'
  | 'single-owned-provider-neutral-scalable';

/** The eight agent invariants, in constitutional order; frozen. */
export const AGENT_INVARIANTS: readonly AgentInvariant[] = Object.freeze([
  'distinct-uniquely-identified-actor',
  'acts-only-within-capabilities-and-permissions',
  'composes-operational-namespaces-owns-none',
  'governed-and-bounded',
  'coordination-acyclic-delegation-bounded',
  'deterministic-composition',
  'fault-is-isolated',
  'single-owned-provider-neutral-scalable',
]);

/** The guarantee each agent invariant states (ai/agents/README.md, "Agent Invariants"). */
export const AGENT_INVARIANT_DESCRIPTIONS: Readonly<Record<AgentInvariant, string>> = Object.freeze({
  'distinct-uniquely-identified-actor':
    'An agent is a distinct, uniquely identified actor; no two agents share one identity, and no concern is owned by two agents.',
  'acts-only-within-capabilities-and-permissions':
    'An agent acts only within its granted capabilities and permissions, and never beyond them; capabilities and permissions follow least privilege and never exceed what is delegated.',
  'composes-operational-namespaces-owns-none':
    'An agent composes the operational namespaces and owns none of them; it uses reasoning, retrieval, memory, prompts, and, in future, tools and providers, and performs none of their internal work.',
  'governed-and-bounded':
    'An agent acts within its autonomy bounds and escalates rather than act outside them, and it never escalates its own permissions.',
  'coordination-acyclic-delegation-bounded':
    'Agent coordination is acyclic and agent delegation is bounded; no circular coordination and no unbounded or infinite delegation are possible.',
  'deterministic-composition':
    'An agent is a deterministic composition; the same agent definition, under the same governing rules and inputs, resolves and behaves the same way, with no randomness.',
  'fault-is-isolated':
    "An agent's fault is isolated; a failing agent never corrupts another agent, and its failure is bounded to it.",
  'single-owned-provider-neutral-scalable':
    'Agent architecture is single-owned, provider-neutral, and scalable; each agent concern has exactly one owning document, and the model holds for one agent or tens of thousands.',
});

/**
 * An agent concern: one aspect of the agent model, each owned by exactly one document (ai/agents/agents.md,
 * "The Agent Concerns"). This is the namespace inventory identity; the model of each concern is owned by its
 * named document and this package's corresponding module.
 */
export type AgentConcern =
  | 'agent-architecture'
  | 'agent-lifecycle'
  | 'agent-capabilities'
  | 'agent-permissions'
  | 'agent-coordination'
  | 'agent-communication'
  | 'agent-delegation'
  | 'agent-specialization'
  | 'agent-boundaries'
  | 'agent-versioning';

/** The ten agent concerns, in inventory order; frozen. */
export const AGENT_CONCERNS: readonly AgentConcern[] = Object.freeze([
  'agent-architecture',
  'agent-lifecycle',
  'agent-capabilities',
  'agent-permissions',
  'agent-coordination',
  'agent-communication',
  'agent-delegation',
  'agent-specialization',
  'agent-boundaries',
  'agent-versioning',
]);

/** What each agent concern owns (ai/agents/agents.md, "The Agent Concerns"). */
export const AGENT_CONCERN_DESCRIPTIONS: Readonly<Record<AgentConcern, string>> = Object.freeze({
  'agent-architecture':
    'The architectural definition of an agent: its identity and the parts it is composed of, and how it composes the operational namespaces.',
  'agent-lifecycle':
    'The phases of an agent, including registration, activation, operation, and retirement, and agent discovery.',
  'agent-capabilities': 'The capability model: what an agent can do, and capability inheritance.',
  'agent-permissions':
    'The permission model: what an agent may do under least privilege, and permission inheritance.',
  'agent-coordination':
    'The coordination model: the agent hierarchy, supervisor and worker and peer topologies, and the coordination topology.',
  'agent-communication':
    'The communication model: how agents exchange information, and the communication topology.',
  'agent-delegation':
    'The delegation model: the delegation chain and delegated authority, bounded so delegation is finite.',
  'agent-specialization':
    'The specialization model: agent role ownership, role composition, and specialization.',
  'agent-boundaries': 'What agents never own, where an agent stops, and agent fault isolation.',
  'agent-versioning':
    'Agent versioning, evolution, change governance consumption, and version compatibility.',
});
