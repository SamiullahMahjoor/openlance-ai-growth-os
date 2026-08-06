import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { CampaignIntelligence } from './manager.js';

/** The DI token under which the Campaign Intelligence subsystem is registered (a singleton). */
export const CAMPAIGN_MANAGER: Token<CampaignIntelligence> = token<CampaignIntelligence>(
  'aios.campaign-intelligence.manager',
);

/**
 * The Campaign Intelligence DI module. It registers the {@link CampaignIntelligence} facade under
 * {@link CAMPAIGN_MANAGER} through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const campaignIntelligenceModule = (manager: CampaignIntelligence): Module => ({
  name: 'campaign-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(CAMPAIGN_MANAGER, { useValue: manager });
  },
});
