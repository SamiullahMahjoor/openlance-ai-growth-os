/**
 * Agent coordination: the coordination model, the agent hierarchy, supervisor and worker and peer
 * topologies, and the coordination topology (ai/agents/agent-coordination.md,
 * OL-AI-AGENTS-AGENT-COORDINATION).
 *
 * The Specification narrates the coordination model as heterogeneous facets (the coordination model, the
 * supervisor and worker topology, the peer topology, acyclic coordination). It describes two topologies
 * rather than enumerating a single closed set of named topologies or roles restated in the invariants: the
 * supervisor/worker roles live within one hierarchical topology and peer within another, and the invariants
 * state acyclicity and direction-follows-authority rather than a {supervisor, worker, peer} taxonomy. Per the
 * modeling rule recorded in docs/implementation/13-retrieval.md section 4, choosing a specific enumeration
 * (2 topologies vs 3 roles) is not dictated by the text, so this concern is definitions only (principles and
 * invariants) and the topologies are stated as prose. The message exchange is owned by
 * ai/agents/agent-communication.md and the orchestration by ai/runtime/, referenced not restated (ADR-0020).
 */

/**
 * An agent-coordination principle: a permanent rule the coordination model upholds, each instantiating an
 * agent invariant (ai/agents/agent-coordination.md, "Principles").
 */
export type AgentCoordinationPrinciple =
  | 'coordination-is-structure-not-execution'
  | 'the-coordination-topology-is-acyclic'
  | 'direction-follows-authority'
  | 'peers-coordinate-without-a-cycle';

/** The agent-coordination principles, in constitutional order; frozen. */
export const AGENT_COORDINATION_PRINCIPLES: readonly AgentCoordinationPrinciple[] = Object.freeze([
  'coordination-is-structure-not-execution',
  'the-coordination-topology-is-acyclic',
  'direction-follows-authority',
  'peers-coordinate-without-a-cycle',
]);

/** What each agent-coordination principle requires (ai/agents/agent-coordination.md, "Principles"). */
export const AGENT_COORDINATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentCoordinationPrinciple, string>
> = Object.freeze({
  'coordination-is-structure-not-execution':
    'Coordination defines how agents relate and direct one another; the scheduling and execution of their work is owned by ai/runtime/.',
  'the-coordination-topology-is-acyclic':
    'Agents coordinate through a directed, acyclic topology, so no circular coordination is possible.',
  'direction-follows-authority':
    'In a hierarchy, a supervising agent directs a working agent only within the authority it holds, never beyond it.',
  'peers-coordinate-without-a-cycle':
    'Peer agents coordinate as equals through a topology that remains acyclic, so mutual direction never forms a loop.',
});

/**
 * An agent-coordination invariant: a guarantee the coordination model always upholds
 * (ai/agents/agent-coordination.md, "Invariants").
 */
export type AgentCoordinationInvariant =
  | 'coordination-defines-who-directs-whom-never-the-execution'
  | 'coordination-topology-directed-and-acyclic'
  | 'supervising-agent-directs-only-within-authority-held'
  | 'a-coordination-that-would-form-a-cycle-refused-or-escalated'
  | 'defining-coordination-is-inert';

/** The agent-coordination invariants, in constitutional order; frozen. */
export const AGENT_COORDINATION_INVARIANTS: readonly AgentCoordinationInvariant[] = Object.freeze([
  'coordination-defines-who-directs-whom-never-the-execution',
  'coordination-topology-directed-and-acyclic',
  'supervising-agent-directs-only-within-authority-held',
  'a-coordination-that-would-form-a-cycle-refused-or-escalated',
  'defining-coordination-is-inert',
]);

/** What each agent-coordination invariant guarantees (ai/agents/agent-coordination.md, "Invariants"). */
export const AGENT_COORDINATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentCoordinationInvariant, string>
> = Object.freeze({
  'coordination-defines-who-directs-whom-never-the-execution':
    'Coordination defines the structure of who directs whom, never the execution of the work.',
  'coordination-topology-directed-and-acyclic':
    'The coordination topology is directed and acyclic, so no circular coordination is possible.',
  'supervising-agent-directs-only-within-authority-held':
    'A supervising agent directs a working agent only within the authority it holds.',
  'a-coordination-that-would-form-a-cycle-refused-or-escalated':
    'A coordination that would form a cycle is refused or escalated, never established.',
  'defining-coordination-is-inert':
    'Defining coordination never executes, orchestrates, schedules, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
