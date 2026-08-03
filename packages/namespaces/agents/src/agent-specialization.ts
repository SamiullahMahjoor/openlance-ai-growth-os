/**
 * Agent specialization: agent role ownership, role composition, and specialization
 * (ai/agents/agent-specialization.md, OL-AI-AGENTS-AGENT-SPECIALIZATION).
 *
 * The Specification narrates the specialization model as heterogeneous facets (role ownership,
 * specialization, role composition, specialization and the category map), not a closed taxonomy the model
 * refers to by identity, so this concern is definitions only (principles and invariants), consistent with
 * the modeling rule recorded in docs/implementation/13-retrieval.md section 4. Role composition resolves
 * overlaps by higher authority, then single owner, then specificity - stated as prose and never recreated as
 * an executable precedence (referenced-model non-restatement; ADR-0025). The capabilities and permissions a
 * role draws on are owned by ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md, and the
 * mapping of agent categories to namespaces by ai/architecture/agent-map.md (ADR-0020).
 */

/**
 * An agent-specialization principle: a permanent rule the specialization model upholds, each instantiating
 * an agent invariant (ai/agents/agent-specialization.md, "Principles").
 */
export type AgentSpecializationPrinciple =
  | 'an-agent-is-specialized-to-a-role'
  | 'a-role-is-single-owned'
  | 'roles-compose-without-ambiguity'
  | 'specialization-draws-capability-not-authority';

/** The agent-specialization principles, in constitutional order; frozen. */
export const AGENT_SPECIALIZATION_PRINCIPLES: readonly AgentSpecializationPrinciple[] = Object.freeze(
  [
    'an-agent-is-specialized-to-a-role',
    'a-role-is-single-owned',
    'roles-compose-without-ambiguity',
    'specialization-draws-capability-not-authority',
  ],
);

/** What each agent-specialization principle requires (ai/agents/agent-specialization.md, "Principles"). */
export const AGENT_SPECIALIZATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentSpecializationPrinciple, string>
> = Object.freeze({
  'an-agent-is-specialized-to-a-role':
    'An agent holds a defined role that determines its purpose as an actor, so its responsibility is explicit.',
  'a-role-is-single-owned':
    'Each role has one owning definition, so no role is ambiguous and no responsibility is owned by two roles.',
  'roles-compose-without-ambiguity':
    'A specialization may compose more than one role, and the composition resolves to a single, unambiguous responsibility.',
  'specialization-draws-capability-not-authority':
    'A role determines the capabilities and permissions an agent needs, drawn from ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md, and never redefines them.',
});

/**
 * An agent-specialization invariant: a guarantee the specialization model always upholds
 * (ai/agents/agent-specialization.md, "Invariants").
 */
export type AgentSpecializationInvariant =
  | 'each-role-has-exactly-one-owning-definition'
  | 'specialization-narrows-never-widens-beyond-role'
  | 'composed-roles-resolve-by-authority-owner-specificity'
  | 'specialization-draws-on-capabilities-and-permissions-never-redefines'
  | 'defining-specialization-is-inert';

/** The agent-specialization invariants, in constitutional order; frozen. */
export const AGENT_SPECIALIZATION_INVARIANTS: readonly AgentSpecializationInvariant[] = Object.freeze(
  [
    'each-role-has-exactly-one-owning-definition',
    'specialization-narrows-never-widens-beyond-role',
    'composed-roles-resolve-by-authority-owner-specificity',
    'specialization-draws-on-capabilities-and-permissions-never-redefines',
    'defining-specialization-is-inert',
  ],
);

/** What each agent-specialization invariant guarantees (ai/agents/agent-specialization.md, "Invariants"). */
export const AGENT_SPECIALIZATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentSpecializationInvariant, string>
> = Object.freeze({
  'each-role-has-exactly-one-owning-definition':
    'Each role has exactly one owning definition, so no role is ambiguous.',
  'specialization-narrows-never-widens-beyond-role':
    "An agent's specialization narrows it to a defined responsibility and never widens it beyond its role.",
  'composed-roles-resolve-by-authority-owner-specificity':
    'Composed roles resolve to a single, unambiguous responsibility by authority, then owner, then specificity.',
  'specialization-draws-on-capabilities-and-permissions-never-redefines':
    'Specialization draws on capabilities and permissions and never redefines them.',
  'defining-specialization-is-inert':
    'Defining specialization never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
