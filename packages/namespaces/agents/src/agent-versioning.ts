/**
 * Agent versioning: how an agent definition is versioned and evolves, change governance consumption, and
 * version compatibility (ai/agents/agent-versioning.md, OL-AI-AGENTS-AGENT-VERSIONING).
 *
 * The Specification narrates agent versioning, agent evolution, version compatibility, and change governance
 * and conflict; these are heterogeneous facets (a mechanism, an evolution, a relation, and a governance
 * deferral), not a closed homogeneous aspect-taxonomy the model refers to by identity, so this concern is
 * definitions only (principles and invariants), consistent with the modeling rule recorded in
 * docs/implementation/13-retrieval.md section 4 and with the parallel prompt-versioning concern. (This differs
 * from the provider/tool versioning concerns, whose Specification enumerated a clean {version-rules,
 * evolution, migration, deprecation} aspect set.) What change is permitted, reviewed, and approved is owned by
 * ai/governance/change-governance.md (applied not restated), and a change conflicting with a higher-authority
 * definition resolves by the authority-then-owner-then-specificity precedence used across the agent model,
 * stated as prose (ADR-0020, ADR-0025).
 */

/**
 * An agent-versioning principle: a permanent rule agent versioning upholds, each instantiating an agent
 * invariant (ai/agents/agent-versioning.md, "Principles").
 */
export type AgentVersioningPrinciple =
  | 'an-agent-definition-is-versioned'
  | 'change-is-governed'
  | 'compatibility-is-preserved-or-versioned'
  | 'versioning-governs-definitions-not-truth';

/** The agent-versioning principles, in constitutional order; frozen. */
export const AGENT_VERSIONING_PRINCIPLES: readonly AgentVersioningPrinciple[] = Object.freeze([
  'an-agent-definition-is-versioned',
  'change-is-governed',
  'compatibility-is-preserved-or-versioned',
  'versioning-governs-definitions-not-truth',
]);

/** What each agent-versioning principle requires (ai/agents/agent-versioning.md, "Principles"). */
export const AGENT_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<AgentVersioningPrinciple, string>
> = Object.freeze({
  'an-agent-definition-is-versioned':
    'An agent, role, capability set, or permission set carries a version, so a change is identified and traceable.',
  'change-is-governed':
    'An agent definition evolves only under the change rules owned by ai/governance/, never arbitrarily and never by an agent changing itself outside its authority.',
  'compatibility-is-preserved-or-versioned':
    'A change a dependent agent or role can still rely on preserves compatibility; a change it cannot is a new version, so a dependent agent is never silently broken.',
  'versioning-governs-definitions-not-truth':
    'Versioning applies to agent architecture, never to business truth, which is versioned by the knowledge repository.',
});

/**
 * An agent-versioning invariant: a guarantee agent versioning always upholds (ai/agents/agent-versioning.md,
 * "Invariants").
 */
export type AgentVersioningInvariant =
  | 'an-agent-definition-carries-a-version'
  | 'evolves-only-under-governed-change-never-by-agent-beyond-authority'
  | 'incompatible-change-is-a-new-version'
  | 'versioning-applies-to-architecture-not-truth'
  | 'versioning-an-agent-is-inert';

/** The agent-versioning invariants, in constitutional order; frozen. */
export const AGENT_VERSIONING_INVARIANTS: readonly AgentVersioningInvariant[] = Object.freeze([
  'an-agent-definition-carries-a-version',
  'evolves-only-under-governed-change-never-by-agent-beyond-authority',
  'incompatible-change-is-a-new-version',
  'versioning-applies-to-architecture-not-truth',
  'versioning-an-agent-is-inert',
]);

/** What each agent-versioning invariant guarantees (ai/agents/agent-versioning.md, "Invariants"). */
export const AGENT_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<AgentVersioningInvariant, string>
> = Object.freeze({
  'an-agent-definition-carries-a-version':
    'An agent definition carries a version, so a change to it is explicit and traceable.',
  'evolves-only-under-governed-change-never-by-agent-beyond-authority':
    'An agent definition evolves only under the governed change rules, and never by an agent changing itself beyond its authority.',
  'incompatible-change-is-a-new-version':
    'A change a dependent agent or role cannot absorb is a new version, so no dependent is broken silently.',
  'versioning-applies-to-architecture-not-truth':
    'Versioning applies to agent architecture, never to business truth.',
  'versioning-an-agent-is-inert':
    'Versioning an agent never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
