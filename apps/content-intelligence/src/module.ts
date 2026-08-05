import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { ContentIntelligence } from './manager.js';

/** The DI token under which the Content Intelligence subsystem is registered (a singleton). */
export const CONTENT_MANAGER: Token<ContentIntelligence> = token<ContentIntelligence>(
  'aios.content-intelligence.manager',
);

/**
 * The Content Intelligence DI module. It registers the {@link ContentIntelligence} facade under {@link CONTENT_MANAGER}
 * through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container
 * and registers nothing else.
 */
export const contentIntelligenceModule = (manager: ContentIntelligence): Module => ({
  name: 'content-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(CONTENT_MANAGER, { useValue: manager });
  },
});
