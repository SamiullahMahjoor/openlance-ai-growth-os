import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { SafetyManager } from './manager.js';

/** The DI token under which the Safety Engine's manager is registered (a singleton). */
export const SAFETY_MANAGER: Token<SafetyManager> = token<SafetyManager>(
  'aios.safety-engine.manager',
);

/**
 * The Safety Engine's DI module. It registers the {@link SafetyManager} under {@link SAFETY_MANAGER}, so the engine is
 * wired into the object graph through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const safetyEngineModule = (manager: SafetyManager): Module => ({
  name: 'safety-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(SAFETY_MANAGER, { useValue: manager });
  },
});
