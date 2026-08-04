import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { ProviderManager } from './manager.js';

/** The DI token under which the Provider Engine's manager is registered (a singleton). */
export const PROVIDER_MANAGER: Token<ProviderManager> = token<ProviderManager>(
  'aios.provider-engine.manager',
);

/**
 * The Provider Engine's DI module. It registers the {@link ProviderManager} under
 * {@link PROVIDER_MANAGER}, so the engine is wired into the object graph through the frozen
 * composition root's extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container
 * and registers nothing else.
 */
export const providerEngineModule = (manager: ProviderManager): Module => ({
  name: 'provider-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(PROVIDER_MANAGER, { useValue: manager });
  },
});
