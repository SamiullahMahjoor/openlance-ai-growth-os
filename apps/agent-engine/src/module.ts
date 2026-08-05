import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { AgentManager } from './manager.js';

/** The DI token under which the Agent Engine's manager is registered (a singleton). */
export const AGENT_MANAGER: Token<AgentManager> = token<AgentManager>('aios.agent-engine.manager');

/**
 * The Agent Engine's DI module. It registers the {@link AgentManager} under {@link AGENT_MANAGER}, so the engine is
 * wired into the object graph through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const agentEngineModule = (manager: AgentManager): Module => ({
  name: 'agent-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(AGENT_MANAGER, { useValue: manager });
  },
});
