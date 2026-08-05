import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { GovernanceManager } from './manager.js';

/** The DI token under which the Governance Enforcement Engine's manager is registered (a singleton). */
export const GOVERNANCE_MANAGER: Token<GovernanceManager> = token<GovernanceManager>(
  'aios.governance-engine.manager',
);

/**
 * The Governance Enforcement Engine's DI module. It registers the {@link GovernanceManager} under
 * {@link GOVERNANCE_MANAGER}, so the engine is wired into the object graph through the frozen composition root's
 * extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const governanceEngineModule = (manager: GovernanceManager): Module => ({
  name: 'governance-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(GOVERNANCE_MANAGER, { useValue: manager });
  },
});
