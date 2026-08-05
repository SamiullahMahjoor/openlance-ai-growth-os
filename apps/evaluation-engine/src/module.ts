import { token } from '@openlance/aios-di';
import type { Module, Token } from '@openlance/aios-di';

import type { EvaluationManager } from './manager.js';

/** The DI token under which the Evaluation Engine's manager is registered (a singleton). */
export const EVALUATION_MANAGER: Token<EvaluationManager> = token<EvaluationManager>(
  'aios.evaluation-engine.manager',
);

/**
 * The Evaluation Engine's DI module. It registers the {@link EvaluationManager} under {@link EVALUATION_MANAGER}, so the
 * engine is wired into the object graph through the frozen composition root's extension seam (ADR-0026
 * `CompositionConfig.modules`). It defines no container and registers nothing else.
 */
export const evaluationEngineModule = (manager: EvaluationManager): Module => ({
  name: 'evaluation-engine',
  version: '1.0.0',
  register(registry) {
    registry.register(EVALUATION_MANAGER, { useValue: manager });
  },
});
