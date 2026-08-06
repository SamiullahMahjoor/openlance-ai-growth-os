import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { AnalyticsIntelligence } from './manager.js';

/** The DI token under which the Analytics Intelligence subsystem is registered (a singleton). */
export const ANALYTICS_MANAGER: Token<AnalyticsIntelligence> = token<AnalyticsIntelligence>(
  'aios.analytics-intelligence.manager',
);

/**
 * The Analytics Intelligence DI module. It registers the {@link AnalyticsIntelligence} facade under
 * {@link ANALYTICS_MANAGER} through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const analyticsIntelligenceModule = (manager: AnalyticsIntelligence): Module => ({
  name: 'analytics-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(ANALYTICS_MANAGER, { useValue: manager });
  },
});
