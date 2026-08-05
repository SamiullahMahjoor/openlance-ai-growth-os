import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { MarketingIntelligence } from './manager.js';

/** The DI token under which the Marketing Intelligence subsystem is registered (a singleton). */
export const MARKETING_MANAGER: Token<MarketingIntelligence> = token<MarketingIntelligence>(
  'aios.marketing-intelligence.manager',
);

/**
 * The Marketing Intelligence DI module. It registers the {@link MarketingIntelligence} facade under
 * {@link MARKETING_MANAGER} through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const marketingIntelligenceModule = (manager: MarketingIntelligence): Module => ({
  name: 'marketing-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(MARKETING_MANAGER, { useValue: manager });
  },
});
