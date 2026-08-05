/**
 * @packageDocumentation
 * `@openlance/aios-agent-engine`
 *
 * The AIOS Agent Engine (Phase 4, Stage 7): the Runtime's operational agent subsystem and the first orchestration
 * engine, the operational realization of the frozen Agents namespace. As the composition owner it composes an agent's
 * steps over the six foundational engines' public request contracts (register, compose, validate against capabilities
 * and permissions, coordinate an acyclic topology, plan), driving the frozen `@openlance/aios-agents` model, and produces
 * an immutable `AgentExecutionPlan`. It **composes and stops**: it never executes, orchestrates, schedules, combines
 * results, or selects a provider.
 *
 * It consumes the six engines (Provider, Prompt, Memory, Retrieval, Tool, Reasoning) through the first legal `app -> app`
 * edges in the repository, recreates none of them, and keeps each independently replaceable. Per the frozen
 * `agent-boundaries`, an agent composes the operational namespaces and owns none, and never orchestrates, schedules, or
 * executes; executing the plan is the runtime's, a later stage. It contains no vendor knowledge (ADR-0041). This file is
 * the single supported public API (Engineering Rule 1).
 */

export type {
  AgentId,
  AgentCapability,
  AgentDefinition,
  AgentDefinitionInput,
  AgentStep,
  AgentLink,
  AgentRequest,
  AgentExecutionPlan,
  AgentStatistics,
  AgentDiagnostics,
} from './types.js';

export { AgentError } from './errors.js';
export { AgentNormalizer } from './normalizer.js';
export { AgentRegistry } from './registry.js';
export { AgentFactory, AGENT_CAPABILITIES } from './factory.js';
export { AgentLifecycle } from './lifecycle.js';
export { AgentComposer } from './composer.js';
export { AgentValidator } from './validator.js';
export { AgentCoordinator } from './coordinator.js';
export { AgentPlanner } from './planner.js';
export { AgentMetrics } from './metrics.js';
export { AgentEvents, AGENT_EVENT_TYPES } from './events.js';
export { AgentConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { AgentSettings } from './configuration.js';
export { AgentPluginBridge } from './plugin-bridge.js';
export type { AgentPlugin } from './plugin-bridge.js';
export { AgentManager } from './manager.js';
export type { AgentManagerOptions } from './manager.js';
export { agentEngineModule, AGENT_MANAGER } from './module.js';
