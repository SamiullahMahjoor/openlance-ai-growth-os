/**
 * @packageDocumentation
 * `@openlance/aios-agents`
 *
 * The immutable, technology-neutral domain model of the AI layer's agent abstraction (Specification
 * authority, ai/agents/). It states what an agent is as an actor within the AI Operating System, and how an
 * agent is composed, identified, capable, permitted, specialized, coordinated, communicating, delegating, and
 * evolved, as strongly-typed classifications, immutable definitions and invariants, and one pure ordering
 * predicate: the lifecycle-phase ordering, which expresses the agent specification verbatim.
 *
 * It performs no orchestration, no execution, and no IO: an agent is a composition of the operational
 * namespaces under governance, and the runtime orchestrates and executes it; the namespace defines no
 * orchestration system, framework, protocol, provider, model, or code (ADR-0020; the namespace is ADR-0024
 * category 1, Pure Domain Model, declared per §42, realized here as an immutable stateless domain model with
 * no IO). It composes reasoning, retrieval, memory, prompts, and, in future, tools and providers, and owns
 * none of them; the models owned by ai/governance/, ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/,
 * ai/tools/, ai/providers/, ai/runtime/, the Authority Hierarchy (ai/README.md), and the knowledge repository
 * are referenced in prose and never restated as agent classifications.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-AGENTS-README.
 */

export type { AgentInvariant, AgentConcern } from './namespace.js';
export {
  AGENT_INVARIANTS,
  AGENT_INVARIANT_DESCRIPTIONS,
  AGENT_CONCERNS,
  AGENT_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  AgentArchitecturePrinciple,
  AgentPart,
  AgentArchitectureInvariant,
} from './agent-architecture.js';
export {
  AGENT_ARCHITECTURE_PRINCIPLES,
  AGENT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  AGENT_PARTS,
  AGENT_PART_DESCRIPTIONS,
  AGENT_ARCHITECTURE_INVARIANTS,
  AGENT_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './agent-architecture.js';

export type {
  AgentLifecyclePrinciple,
  AgentLifecyclePhase,
  AgentLifecycleInvariant,
} from './agent-lifecycle.js';
export {
  AGENT_LIFECYCLE_PRINCIPLES,
  AGENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  AGENT_LIFECYCLE_PHASES,
  AGENT_LIFECYCLE_PHASE_DESCRIPTIONS,
  agentPhaseAtOrAfter,
  AGENT_LIFECYCLE_INVARIANTS,
  AGENT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './agent-lifecycle.js';

export type {
  AgentCapabilitiesPrinciple,
  AgentCapabilitiesInvariant,
} from './agent-capabilities.js';
export {
  AGENT_CAPABILITIES_PRINCIPLES,
  AGENT_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
  AGENT_CAPABILITIES_INVARIANTS,
  AGENT_CAPABILITIES_INVARIANT_DESCRIPTIONS,
} from './agent-capabilities.js';

export type {
  AgentPermissionsPrinciple,
  AgentPermissionsInvariant,
} from './agent-permissions.js';
export {
  AGENT_PERMISSIONS_PRINCIPLES,
  AGENT_PERMISSIONS_PRINCIPLE_DESCRIPTIONS,
  AGENT_PERMISSIONS_INVARIANTS,
  AGENT_PERMISSIONS_INVARIANT_DESCRIPTIONS,
} from './agent-permissions.js';

export type {
  AgentCoordinationPrinciple,
  AgentCoordinationInvariant,
} from './agent-coordination.js';
export {
  AGENT_COORDINATION_PRINCIPLES,
  AGENT_COORDINATION_PRINCIPLE_DESCRIPTIONS,
  AGENT_COORDINATION_INVARIANTS,
  AGENT_COORDINATION_INVARIANT_DESCRIPTIONS,
} from './agent-coordination.js';

export type {
  AgentCommunicationPrinciple,
  AgentCommunicationInvariant,
} from './agent-communication.js';
export {
  AGENT_COMMUNICATION_PRINCIPLES,
  AGENT_COMMUNICATION_PRINCIPLE_DESCRIPTIONS,
  AGENT_COMMUNICATION_INVARIANTS,
  AGENT_COMMUNICATION_INVARIANT_DESCRIPTIONS,
} from './agent-communication.js';

export type {
  AgentDelegationPrinciple,
  AgentDelegationInvariant,
} from './agent-delegation.js';
export {
  AGENT_DELEGATION_PRINCIPLES,
  AGENT_DELEGATION_PRINCIPLE_DESCRIPTIONS,
  AGENT_DELEGATION_INVARIANTS,
  AGENT_DELEGATION_INVARIANT_DESCRIPTIONS,
} from './agent-delegation.js';

export type {
  AgentSpecializationPrinciple,
  AgentSpecializationInvariant,
} from './agent-specialization.js';
export {
  AGENT_SPECIALIZATION_PRINCIPLES,
  AGENT_SPECIALIZATION_PRINCIPLE_DESCRIPTIONS,
  AGENT_SPECIALIZATION_INVARIANTS,
  AGENT_SPECIALIZATION_INVARIANT_DESCRIPTIONS,
} from './agent-specialization.js';

export type {
  AgentBoundaryPrinciple,
  AgentBoundary,
  AgentBoundaryInvariant,
} from './agent-boundaries.js';
export {
  AGENT_BOUNDARY_PRINCIPLES,
  AGENT_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  AGENT_BOUNDARIES,
  AGENT_BOUNDARY_DESCRIPTIONS,
  AGENT_BOUNDARY_INVARIANTS,
  AGENT_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './agent-boundaries.js';

export type {
  AgentVersioningPrinciple,
  AgentVersioningInvariant,
} from './agent-versioning.js';
export {
  AGENT_VERSIONING_PRINCIPLES,
  AGENT_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  AGENT_VERSIONING_INVARIANTS,
  AGENT_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './agent-versioning.js';
