import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { RetrievalManager } from './manager.js';

/** The DI token under which the Retrieval Engine's manager is registered (a singleton). */
export const RETRIEVAL_MANAGER: Token<RetrievalManager> = token<RetrievalManager>(
  'aios.retrieval-engine.manager',
);

/**
 * The Retrieval Engine's DI module. It registers the {@link RetrievalManager} under
 * {@link RETRIEVAL_MANAGER}, so the engine is wired into the object graph through the frozen composition
 * root's extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container and registers
 * nothing else.
 */
export const retrievalEngineModule = (manager: RetrievalManager): Module => ({
  name: 'retrieval-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(RETRIEVAL_MANAGER, { useValue: manager });
  },
});
