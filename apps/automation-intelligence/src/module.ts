import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { AutomationIntelligence } from './manager.js';

/** The DI token under which the Automation Intelligence subsystem is registered (a singleton). */
export const AUTOMATION_MANAGER: Token<AutomationIntelligence> = token<AutomationIntelligence>(
  'aios.automation-intelligence.manager',
);

/**
 * The Automation Intelligence DI module. It registers the {@link AutomationIntelligence} facade under
 * {@link AUTOMATION_MANAGER} through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const automationIntelligenceModule = (manager: AutomationIntelligence): Module => ({
  name: 'automation-intelligence',
  version: '1.0.0',
  register(registry) {
    registry.register(AUTOMATION_MANAGER, { useValue: manager });
  },
});
