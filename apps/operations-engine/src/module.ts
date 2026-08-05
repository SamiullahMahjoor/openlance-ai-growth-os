import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { OperationsManager } from './manager.js';

/** The DI token under which the Operations Engine's manager is registered (a singleton). */
export const OPERATIONS_MANAGER: Token<OperationsManager> = token<OperationsManager>(
  'aios.operations-engine.manager',
);

/**
 * The Operations Engine's DI module. It registers the {@link OperationsManager} under {@link OPERATIONS_MANAGER}, so the
 * engine is wired into the object graph through the frozen composition root's extension seam (ADR-0026
 * `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const operationsEngineModule = (manager: OperationsManager): Module => ({
  name: 'operations-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(OPERATIONS_MANAGER, { useValue: manager });
  },
});
