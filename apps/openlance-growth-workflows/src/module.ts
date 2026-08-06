import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { OpenLanceGrowthWorkflows } from './manager.js';

/** The DI token under which the OpenLance Growth Workflows subsystem is registered (a singleton). */
export const WORKFLOW_MANAGER: Token<OpenLanceGrowthWorkflows> = token<OpenLanceGrowthWorkflows>(
  'aios.openlance-growth-workflows.manager',
);

/**
 * The OpenLance Growth Workflows DI module. It registers the {@link OpenLanceGrowthWorkflows} facade under
 * {@link WORKFLOW_MANAGER} through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`).
 * It defines no container and registers nothing else.
 */
export const workflowModule = (manager: OpenLanceGrowthWorkflows): Module => ({
  name: 'openlance-growth-workflows',
  version: '1.0.0',
  register(registry) {
    registry.register(WORKFLOW_MANAGER, { useValue: manager });
  },
});
