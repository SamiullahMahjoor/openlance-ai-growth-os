import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { ToolManager } from './manager.js';

/** The DI token under which the Tool Engine's manager is registered (a singleton). */
export const TOOL_MANAGER: Token<ToolManager> = token<ToolManager>('aios.tool-engine.manager');

/**
 * The Tool Engine's DI module. It registers the {@link ToolManager} under {@link TOOL_MANAGER}, so the engine is wired
 * into the object graph through the frozen composition root's extension seam (ADR-0026 `CompositionConfig.modules`). It
 * defines no container and registers nothing else.
 */
export const toolEngineModule = (manager: ToolManager): Module => ({
  name: 'tool-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(TOOL_MANAGER, { useValue: manager });
  },
});
