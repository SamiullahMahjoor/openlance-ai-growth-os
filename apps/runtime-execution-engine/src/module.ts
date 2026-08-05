import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { RuntimeExecutionManager } from './manager.js';

/** The DI token under which the Runtime Execution Engine's manager is registered (a singleton). */
export const RUNTIME_EXECUTION_MANAGER: Token<RuntimeExecutionManager> =
  token<RuntimeExecutionManager>('aios.runtime-execution-engine.manager');

/**
 * The Runtime Execution Engine's DI module. It registers the {@link RuntimeExecutionManager} under
 * {@link RUNTIME_EXECUTION_MANAGER}, so the engine is wired into the object graph through the frozen composition root's
 * extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const runtimeExecutionEngineModule = (manager: RuntimeExecutionManager): Module => ({
  name: 'runtime-execution-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(RUNTIME_EXECUTION_MANAGER, { useValue: manager });
  },
});
