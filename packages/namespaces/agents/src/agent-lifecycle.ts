/**
 * Agent lifecycle: the phases of an agent, from registration to retirement, and agent discovery
 * (ai/agents/agent-lifecycle.md, OL-AI-AGENTS-AGENT-LIFECYCLE).
 *
 * An agent passes through a fixed order of phases; each phase precedes the next, and an agent never acts
 * outside activation and operation. This module defines the ordered phases, their principles, and their
 * invariants, plus the pure ordering predicate the document's ordering states. The execution an active agent
 * serves is owned by ai/runtime/ and the versioning of an agent definition by ai/agents/agent-versioning.md,
 * referenced not restated (ADR-0020).
 */

/**
 * An agent-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating an agent
 * invariant (ai/agents/agent-lifecycle.md, "Principles").
 */
export type AgentLifecyclePrinciple =
  | 'an-agent-has-a-defined-beginning-and-end'
  | 'registration-precedes-activation'
  | 'discovery-follows-registration'
  | 'retirement-is-clean';

/** The agent-lifecycle principles, in constitutional order; frozen. */
export const AGENT_LIFECYCLE_PRINCIPLES: readonly AgentLifecyclePrinciple[] = Object.freeze([
  'an-agent-has-a-defined-beginning-and-end',
  'registration-precedes-activation',
  'discovery-follows-registration',
  'retirement-is-clean',
]);

/** What each agent-lifecycle principle requires (ai/agents/agent-lifecycle.md, "Principles"). */
export const AGENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentLifecyclePrinciple, string>
> = Object.freeze({
  'an-agent-has-a-defined-beginning-and-end':
    'An agent begins when it is registered and ends when it is retired; an agent never acts before activation or after retirement.',
  'registration-precedes-activation':
    'An agent exists and is discoverable before it is activated to act.',
  'discovery-follows-registration':
    'A registered agent is discoverable by its identity; an unregistered agent is not.',
  'retirement-is-clean':
    'A retired agent releases its identity and holdings and acts no more, and its retirement never corrupts another agent.',
});

/**
 * An agent-lifecycle phase, in constitutional order from earliest to latest (ai/agents/agent-lifecycle.md,
 * "Specification"). The order is the document's; it is total and is exposed by {@link agentPhaseAtOrAfter}.
 */
export type AgentLifecyclePhase =
  | 'registration'
  | 'discovery'
  | 'activation'
  | 'operation'
  | 'retirement';

/** The agent-lifecycle phases, earliest to latest; frozen. */
export const AGENT_LIFECYCLE_PHASES: readonly AgentLifecyclePhase[] = Object.freeze([
  'registration',
  'discovery',
  'activation',
  'operation',
  'retirement',
]);

/** What each agent-lifecycle phase is (ai/agents/agent-lifecycle.md, "Specification"). */
export const AGENT_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<Record<AgentLifecyclePhase, string>> =
  Object.freeze({
    registration:
      'An agent is registered with its distinct identity under ai/agents/agent-architecture.md, so that it exists as an actor and is discoverable; registration records that the agent exists, and never activates or executes it.',
    discovery:
      'A registered agent is discoverable by its identity and specialization, so that the runtime and other agents can find it to orchestrate or coordinate with it; discovery finds a registered agent, and never grants it capability or permission.',
    activation:
      'A registered agent is activated, becoming able to act within its capabilities and permissions; an agent acts only while active, and activation never widens its capabilities or permissions.',
    operation:
      'An active agent performs work by composing the operational namespaces, orchestrated and executed by ai/runtime/; this document owns that the agent is in operation, and the execution itself is owned by ai/runtime/.',
    retirement:
      'An agent is retired: it is deactivated, releases its identity and holdings, and acts no more; retirement is bounded to the agent and never corrupts another, upholding the fault isolation owned by ai/agents/agent-boundaries.md.',
  });

/**
 * An agent-lifecycle invariant: a guarantee the lifecycle always upholds (ai/agents/agent-lifecycle.md,
 * "Invariants").
 */
export type AgentLifecycleInvariant =
  | 'registered-before-discoverable-discoverable-before-activated'
  | 'acts-only-while-active-activation-never-widens-capabilities-or-permissions'
  | 'retired-agent-releases-identity-and-holdings-acts-no-more'
  | 'retirement-bounded-never-corrupts-another-agent'
  | 'a-lifecycle-transition-is-inert';

/** The agent-lifecycle invariants, in constitutional order; frozen. */
export const AGENT_LIFECYCLE_INVARIANTS: readonly AgentLifecycleInvariant[] = Object.freeze([
  'registered-before-discoverable-discoverable-before-activated',
  'acts-only-while-active-activation-never-widens-capabilities-or-permissions',
  'retired-agent-releases-identity-and-holdings-acts-no-more',
  'retirement-bounded-never-corrupts-another-agent',
  'a-lifecycle-transition-is-inert',
]);

/** What each agent-lifecycle invariant guarantees (ai/agents/agent-lifecycle.md, "Invariants"). */
export const AGENT_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentLifecycleInvariant, string>
> = Object.freeze({
  'registered-before-discoverable-discoverable-before-activated':
    'An agent is registered before it is discoverable, and discoverable before it is activated.',
  'acts-only-while-active-activation-never-widens-capabilities-or-permissions':
    'An agent acts only while active, and activation never widens its capabilities or permissions.',
  'retired-agent-releases-identity-and-holdings-acts-no-more':
    'A retired agent releases its identity and holdings and acts no more.',
  'retirement-bounded-never-corrupts-another-agent':
    "An agent's retirement is bounded to it and never corrupts another agent.",
  'a-lifecycle-transition-is-inert':
    'A lifecycle transition never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const AGENT_LIFECYCLE_PHASE_RANK: Readonly<Record<AgentLifecyclePhase, number>> = Object.freeze({
  registration: 0,
  discovery: 1,
  activation: 2,
  operation: 3,
  retirement: 4,
});

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/agents/agent-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the document
 * defines and expresses that order verbatim. It states no policy of its own.
 */
export function agentPhaseAtOrAfter(a: AgentLifecyclePhase, b: AgentLifecyclePhase): boolean {
  return AGENT_LIFECYCLE_PHASE_RANK[a] >= AGENT_LIFECYCLE_PHASE_RANK[b];
}
