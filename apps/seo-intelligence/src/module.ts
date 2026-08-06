import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { SeoIntelligence } from './manager.js';

/** The DI token under which the SEO Intelligence subsystem is registered (a singleton). */
export const SEO_MANAGER: Token<SeoIntelligence> = token<SeoIntelligence>(
  'aios.seo-intelligence.manager',
);

/**
 * The SEO Intelligence DI module. It registers the {@link SeoIntelligence} facade under {@link SEO_MANAGER} through the
 * frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container and registers
 * nothing else.
 */
export const seoIntelligenceModule = (manager: SeoIntelligence): Module => ({
  name: 'seo-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(SEO_MANAGER, { useValue: manager });
  },
});
