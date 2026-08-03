/**
 * Agent permissions: what an agent may do under least privilege, and permission inheritance
 * (ai/agents/agent-permissions.md, OL-AI-AGENTS-AGENT-PERMISSIONS).
 *
 * The Specification narrates the permission model as heterogeneous facets (the permission model, least
 * privilege, no self-escalation, permission inheritance), not a closed taxonomy the model refers to by
 * identity, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. The permission philosophy, least privilege,
 * delegated authority, and authority boundaries are owned by ai/governance/permission-governance.md and
 * applied here; permission inheritance resolves overlaps by higher authority, then single owner, then
 * narrower scope, stated as prose and never recreated as an executable precedence (referenced-model
 * non-restatement; ADR-0025). What an agent can do is owned by ai/agents/agent-capabilities.md (ADR-0020).
 */

/**
 * An agent-permissions principle: a permanent rule the permission model upholds, each instantiating an
 * agent invariant (ai/agents/agent-permissions.md, "Principles").
 */
export type AgentPermissionsPrinciple =
  | 'a-permission-is-authority-not-ability'
  | 'least-privilege-is-the-default'
  | 'an-agent-never-escalates-its-own-permissions'
  | 'permission-inheritance-is-single-and-acyclic';

/** The agent-permissions principles, in constitutional order; frozen. */
export const AGENT_PERMISSIONS_PRINCIPLES: readonly AgentPermissionsPrinciple[] = Object.freeze([
  'a-permission-is-authority-not-ability',
  'least-privilege-is-the-default',
  'an-agent-never-escalates-its-own-permissions',
  'permission-inheritance-is-single-and-acyclic',
]);

/** What each agent-permissions principle requires (ai/agents/agent-permissions.md, "Principles"). */
export const AGENT_PERMISSIONS_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentPermissionsPrinciple, string>
> = Object.freeze({
  'a-permission-is-authority-not-ability':
    'A permission is what an agent may do; what it can do is owned by ai/agents/agent-capabilities.md.',
  'least-privilege-is-the-default':
    'An agent holds the minimum permissions its role requires and no more, applying the least privilege owned by ai/governance/permission-governance.md.',
  'an-agent-never-escalates-its-own-permissions':
    'An agent cannot grant itself authority; a permission is granted by delegated authority under ai/agents/agent-delegation.md and never assumed.',
  'permission-inheritance-is-single-and-acyclic':
    'A permission inherited from a role or a base agent resolves through a single, acyclic inheritance, so permissions never conflict or cycle.',
});

/**
 * An agent-permissions invariant: a guarantee the permission model always upholds
 * (ai/agents/agent-permissions.md, "Invariants").
 */
export type AgentPermissionsInvariant =
  | 'a-permission-is-granted-authority-under-least-privilege-distinct-from-capability'
  | 'acts-only-where-holds-both-capability-and-permission'
  | 'never-escalates-own-permissions-over-authority-refused-or-escalated'
  | 'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-narrower-scope'
  | 'defining-permissions-is-inert';

/** The agent-permissions invariants, in constitutional order; frozen. */
export const AGENT_PERMISSIONS_INVARIANTS: readonly AgentPermissionsInvariant[] = Object.freeze([
  'a-permission-is-granted-authority-under-least-privilege-distinct-from-capability',
  'acts-only-where-holds-both-capability-and-permission',
  'never-escalates-own-permissions-over-authority-refused-or-escalated',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-narrower-scope',
  'defining-permissions-is-inert',
]);

/** What each agent-permissions invariant guarantees (ai/agents/agent-permissions.md, "Invariants"). */
export const AGENT_PERMISSIONS_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentPermissionsInvariant, string>
> = Object.freeze({
  'a-permission-is-granted-authority-under-least-privilege-distinct-from-capability':
    'A permission is granted authority under least privilege, distinct from a capability.',
  'acts-only-where-holds-both-capability-and-permission':
    'An agent acts only where it holds both the capability and the permission.',
  'never-escalates-own-permissions-over-authority-refused-or-escalated':
    'An agent never escalates its own permissions, and any attempt to exceed granted authority is refused or escalated.',
  'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-narrower-scope':
    'Permission inheritance is single and acyclic, and overlapping permissions resolve by authority, then owner, then narrower scope.',
  'defining-permissions-is-inert':
    'Defining permissions never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
