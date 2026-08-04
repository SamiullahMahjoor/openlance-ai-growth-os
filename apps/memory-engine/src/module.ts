import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { MemoryManager } from './manager.js';

/** The DI token under which the Memory Engine's manager is registered (a singleton). */
export const MEMORY_MANAGER: Token<MemoryManager> = token<MemoryManager>(
  'aios.memory-engine.manager',
);

/**
 * The Memory Engine's DI module. It registers the {@link MemoryManager} under {@link MEMORY_MANAGER}, so
 * the engine is wired into the object graph through the frozen composition root's extension seam
 * (ADR-0026 `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const memoryEngineModule = (manager: MemoryManager): Module => ({
  name: 'memory-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(MEMORY_MANAGER, { useValue: manager });
  },
});
