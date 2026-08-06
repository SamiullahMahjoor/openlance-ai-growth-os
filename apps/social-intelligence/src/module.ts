import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { SocialIntelligence } from './manager.js';

/** The DI token under which the Social Intelligence subsystem is registered (a singleton). */
export const SOCIAL_MANAGER: Token<SocialIntelligence> = token<SocialIntelligence>(
  'aios.social-intelligence.manager',
);

/**
 * The Social Intelligence DI module. It registers the {@link SocialIntelligence} facade under {@link SOCIAL_MANAGER}
 * through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container
 * and registers nothing else.
 */
export const socialIntelligenceModule = (manager: SocialIntelligence): Module => ({
  name: 'social-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(SOCIAL_MANAGER, { useValue: manager });
  },
});
