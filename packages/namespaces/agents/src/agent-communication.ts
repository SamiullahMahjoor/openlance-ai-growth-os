/**
 * Agent communication: how agents exchange information, and the communication topology
 * (ai/agents/agent-communication.md, OL-AI-AGENTS-AGENT-COMMUNICATION).
 *
 * The Specification narrates the communication model as heterogeneous facets (the communication model,
 * unambiguous addressing, communication topology, governed and grounded exchange). The communication
 * topology is described as a range "from direct exchange between two agents to broadcast among many", not a
 * closed enumerated set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4.
 * The coordination structure is owned by ai/agents/agent-coordination.md and any transport or protocol is
 * implementation, referenced not restated (ADR-0020).
 */

/**
 * An agent-communication principle: a permanent rule the communication model upholds, each instantiating an
 * agent invariant (ai/agents/agent-communication.md, "Principles").
 */
export type AgentCommunicationPrinciple =
  | 'communication-is-information-exchange-not-control'
  | 'communication-is-unambiguous'
  | 'communication-is-bounded-and-governed'
  | 'communication-carries-no-truth-of-its-own';

/** The agent-communication principles, in constitutional order; frozen. */
export const AGENT_COMMUNICATION_PRINCIPLES: readonly AgentCommunicationPrinciple[] = Object.freeze([
  'communication-is-information-exchange-not-control',
  'communication-is-unambiguous',
  'communication-is-bounded-and-governed',
  'communication-carries-no-truth-of-its-own',
]);

/** What each agent-communication principle requires (ai/agents/agent-communication.md, "Principles"). */
export const AGENT_COMMUNICATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentCommunicationPrinciple, string>
> = Object.freeze({
  'communication-is-information-exchange-not-control':
    'Communication carries information between agents; the structure of who directs whom is owned by ai/agents/agent-coordination.md.',
  'communication-is-unambiguous':
    'Every exchange has a defined sender and recipient identified by agent identity, so no message is ambiguous as to its parties.',
  'communication-is-bounded-and-governed':
    'An agent communicates only within its permissions, and information exchanged points to knowledge rather than restating business truth.',
  'communication-carries-no-truth-of-its-own':
    'A message references knowledge by its canonical owner; it never becomes or amends business truth.',
});

/**
 * An agent-communication invariant: a guarantee the communication model always upholds
 * (ai/agents/agent-communication.md, "Invariants").
 */
export type AgentCommunicationInvariant =
  | 'every-exchange-has-defined-sender-and-recipient'
  | 'exchange-without-both-parties-identified-is-not-made'
  | 'communicates-only-within-permissions-message-points-to-knowledge'
  | 'communication-topology-never-contradicts-coordination-topology'
  | 'defining-communication-is-inert';

/** The agent-communication invariants, in constitutional order; frozen. */
export const AGENT_COMMUNICATION_INVARIANTS: readonly AgentCommunicationInvariant[] = Object.freeze([
  'every-exchange-has-defined-sender-and-recipient',
  'exchange-without-both-parties-identified-is-not-made',
  'communicates-only-within-permissions-message-points-to-knowledge',
  'communication-topology-never-contradicts-coordination-topology',
  'defining-communication-is-inert',
]);

/** What each agent-communication invariant guarantees (ai/agents/agent-communication.md, "Invariants"). */
export const AGENT_COMMUNICATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentCommunicationInvariant, string>
> = Object.freeze({
  'every-exchange-has-defined-sender-and-recipient':
    'Every exchange has a defined sender and recipient, each identified by agent identity.',
  'exchange-without-both-parties-identified-is-not-made':
    'An exchange whose parties are not both identified is not made.',
  'communicates-only-within-permissions-message-points-to-knowledge':
    'An agent communicates only within its permissions, and a message points to knowledge rather than restating business truth.',
  'communication-topology-never-contradicts-coordination-topology':
    'The communication topology never contradicts the coordination topology.',
  'defining-communication-is-inert':
    'Defining communication never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
