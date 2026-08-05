import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { ReasoningManager } from './manager.js';

/** The DI token under which the Reasoning Engine's manager is registered (a singleton). */
export const REASONING_MANAGER: Token<ReasoningManager> = token<ReasoningManager>(
  'aios.reasoning-engine.manager',
);

/**
 * The Reasoning Engine's DI module. It registers the {@link ReasoningManager} under {@link REASONING_MANAGER}, so the
 * engine is wired into the object graph through the frozen composition root's extension seam (ADR-0026
 * `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const reasoningEngineModule = (manager: ReasoningManager): Module => ({
  name: 'reasoning-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(REASONING_MANAGER, { useValue: manager });
  },
});
