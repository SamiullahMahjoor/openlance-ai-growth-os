import type { MemoryRequest } from '@openlance/aios-memory-engine';
import type { CompositionInput } from '@openlance/aios-prompt-engine';
import type { ProviderNeed } from '@openlance/aios-provider-engine';
import type { ReasoningRequest } from '@openlance/aios-reasoning-engine';
import type { RetrievalRequest } from '@openlance/aios-retrieval-engine';
import type { ToolRequest } from '@openlance/aios-tool-engine';

/** An agent's stable identity within the engine. */
export type AgentId = string;

/**
 * An agent capability: one of the six operational namespaces an agent may compose, per the frozen `agent-boundaries`
 * composition boundary ("reasoning, retrieval, memory, and prompts, and, in future, tools and providers"). It names a
 * namespace the agent uses; the agent performs none of that namespace's internal work.
 */
export type AgentCapability = 'reasoning' | 'retrieval' | 'memory' | 'prompt' | 'tool' | 'provider';

/**
 * An agent: a uniquely identified actor composed of its identity, the `capabilities` it holds (what it can do), the
 * `permissions` it is granted (what it may do, least privilege, a subset of its capabilities), and its `specialization`
 * (its role). An agent composes the operational namespaces and owns none of them.
 */
export interface AgentDefinition {
  readonly id: AgentId;
  readonly capabilities: readonly AgentCapability[];
  readonly permissions: readonly AgentCapability[];
  readonly specialization: string;
}

/** An agent's registration input; the factory validates it, normalizes its specialization, and freezes it. */
export interface AgentDefinitionInput {
  readonly id: AgentId;
  readonly capabilities: readonly AgentCapability[];
  readonly permissions?: readonly AgentCapability[];
  readonly specialization: string;
}

/**
 * An agent step: one unit of an agent's composition, a typed request for one of the six operational engines. It carries
 * the engine's own public request contract; the Agent Engine composes the step and never executes it, and the runtime
 * later invokes the named engine with the step's request. A provider step carries a provider-neutral `ProviderNeed`; the
 * agent never selects a provider or model.
 */
export type AgentStep =
  | { readonly capability: 'reasoning'; readonly request: ReasoningRequest }
  | { readonly capability: 'retrieval'; readonly request: RetrievalRequest }
  | { readonly capability: 'memory'; readonly request: MemoryRequest }
  | { readonly capability: 'prompt'; readonly request: CompositionInput }
  | { readonly capability: 'tool'; readonly request: ToolRequest }
  | { readonly capability: 'provider'; readonly request: ProviderNeed };

/** A directed coordination edge: a supervising agent directs a working agent, within the authority it holds. */
export interface AgentLink {
  readonly supervisor: AgentId;
  readonly worker: AgentId;
}

/**
 * A request to compose an agent execution plan: the `agent` to act, the `task`, the composition `steps`, and any
 * multi-agent `coordinate` topology (directed supervisor -> worker edges, which must be acyclic).
 */
export interface AgentRequest {
  readonly agent: AgentId;
  readonly task: string;
  readonly steps: readonly AgentStep[];
  readonly coordinate?: readonly AgentLink[];
}

/**
 * An immutable agent execution plan: the composed, validated blueprint the runtime is to execute. It names the `agent`,
 * the `task`, the validated `steps` (each a typed engine request), and the validated `coordination` (a directed, acyclic
 * topology). `validated: true` marks that every step is within the agent's capabilities and permissions and the
 * coordination is acyclic. It is a plan the agent composed; the runtime executes it, and the agent executes nothing.
 */
export interface AgentExecutionPlan {
  readonly agent: AgentId;
  readonly task: string;
  readonly steps: readonly AgentStep[];
  readonly coordination: readonly AgentLink[];
  readonly validated: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface AgentStatistics {
  readonly registrations: number;
  readonly plans: number;
  readonly successes: number;
  readonly failures: number;
}

/** A read-only operational view of the engine. */
export interface AgentDiagnostics {
  readonly agentCount: number;
  readonly statistics: AgentStatistics;
}
