import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { PromptManager } from './manager.js';

/** The DI token under which the Prompt Engine's manager is registered (a singleton). */
export const PROMPT_MANAGER: Token<PromptManager> = token<PromptManager>(
  'aios.prompt-engine.manager',
);

/**
 * The Prompt Engine's DI module. It registers the {@link PromptManager} under {@link PROMPT_MANAGER}, so
 * the engine is wired into the object graph through the frozen composition root's extension seam
 * (ADR-0026 `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const promptEngineModule = (manager: PromptManager): Module => ({
  name: 'prompt-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(PROMPT_MANAGER, { useValue: manager });
  },
});
