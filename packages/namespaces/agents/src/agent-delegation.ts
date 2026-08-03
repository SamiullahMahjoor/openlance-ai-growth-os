/**
 * Agent delegation: the delegation chain and delegated authority, bounded so delegation is finite
 * (ai/agents/agent-delegation.md, OL-AI-AGENTS-AGENT-DELEGATION).
 *
 * The Specification narrates the delegation model as heterogeneous facets (delegated authority, the
 * delegation chain, bounded and acyclic delegation, accountability), not a closed taxonomy the model refers
 * to by identity, so this concern is definitions only (principles and invariants), consistent with the
 * modeling rule recorded in docs/implementation/13-retrieval.md section 4. The permission philosophy and
 * delegated authority are owned by ai/governance/permission-governance.md and applied here; the coordination
 * topology is owned by ai/agents/agent-coordination.md, referenced not restated (ADR-0020).
 */

/**
 * An agent-delegation principle: a permanent rule the delegation model upholds, each instantiating an agent
 * invariant (ai/agents/agent-delegation.md, "Principles").
 */
export type AgentDelegationPrinciple =
  | 'delegation-passes-authority-within-authority'
  | 'delegation-narrows-or-preserves-it-never-widens'
  | 'the-delegation-chain-is-bounded-and-acyclic'
  | 'delegation-is-revocable-and-accountable';

/** The agent-delegation principles, in constitutional order; frozen. */
export const AGENT_DELEGATION_PRINCIPLES: readonly AgentDelegationPrinciple[] = Object.freeze([
  'delegation-passes-authority-within-authority',
  'delegation-narrows-or-preserves-it-never-widens',
  'the-delegation-chain-is-bounded-and-acyclic',
  'delegation-is-revocable-and-accountable',
]);

/** What each agent-delegation principle requires (ai/agents/agent-delegation.md, "Principles"). */
export const AGENT_DELEGATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentDelegationPrinciple, string>
> = Object.freeze({
  'delegation-passes-authority-within-authority':
    'An agent delegates only authority it holds, and never more, applying the delegated authority owned by ai/governance/permission-governance.md.',
  'delegation-narrows-or-preserves-it-never-widens':
    'A delegated permission is at most what the delegator holds, so authority never grows down a delegation chain.',
  'the-delegation-chain-is-bounded-and-acyclic':
    'Delegation forms a finite, acyclic chain, so no infinite delegation and no delegation cycle are possible.',
  'delegation-is-revocable-and-accountable':
    'A delegation is traceable to its delegator, and the delegator remains accountable for the authority it passed.',
});

/**
 * An agent-delegation invariant: a guarantee the delegation model always upholds
 * (ai/agents/agent-delegation.md, "Invariants").
 */
export type AgentDelegationInvariant =
  | 'delegates-only-authority-held-never-exceeds-delegators'
  | 'authority-never-widens-along-a-delegation-chain'
  | 'delegation-chain-finite-and-acyclic'
  | 'every-delegation-traceable-to-delegator-who-remains-accountable'
  | 'delegating-authority-is-inert';

/** The agent-delegation invariants, in constitutional order; frozen. */
export const AGENT_DELEGATION_INVARIANTS: readonly AgentDelegationInvariant[] = Object.freeze([
  'delegates-only-authority-held-never-exceeds-delegators',
  'authority-never-widens-along-a-delegation-chain',
  'delegation-chain-finite-and-acyclic',
  'every-delegation-traceable-to-delegator-who-remains-accountable',
  'delegating-authority-is-inert',
]);

/** What each agent-delegation invariant guarantees (ai/agents/agent-delegation.md, "Invariants"). */
export const AGENT_DELEGATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentDelegationInvariant, string>
> = Object.freeze({
  'delegates-only-authority-held-never-exceeds-delegators':
    "An agent delegates only authority it holds, and a delegated permission never exceeds the delegator's.",
  'authority-never-widens-along-a-delegation-chain':
    'Authority never widens along a delegation chain.',
  'delegation-chain-finite-and-acyclic':
    'A delegation chain is finite and acyclic, so infinite delegation and delegation cycles are impossible.',
  'every-delegation-traceable-to-delegator-who-remains-accountable':
    'Every delegation is traceable to its delegator, who remains accountable for it.',
  'delegating-authority-is-inert':
    'Delegating authority never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
