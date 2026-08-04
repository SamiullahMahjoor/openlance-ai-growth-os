import { PROMPT_LIFECYCLE_PHASES, promptPhaseAtOrAfter } from '@openlance/aios-prompts';
import type { PromptLifecyclePhase } from '@openlance/aios-prompts';

import type { PromptDefinition } from './types.js';

/**
 * Prompt lifecycle evaluation over the frozen prompt-lifecycle model. It consumes the frozen ordered
 * `PROMPT_LIFECYCLE_PHASES` and the pure predicate `promptPhaseAtOrAfter`; it defines no phase and
 * re-owns no ordering (ai/prompts/prompt-lifecycle.md, ADR-0020). A definition is composable while it has
 * not yet reached expression.
 */
export class PromptLifecycle {
  /** The frozen, ordered prompt lifecycle phases. */
  phases(): readonly PromptLifecyclePhase[] {
    return PROMPT_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: PromptLifecyclePhase, b: PromptLifecyclePhase): boolean {
    return promptPhaseAtOrAfter(a, b);
  }

  /** Whether a definition may still be composed for an execution (it has not reached expression). */
  isComposable(definition: PromptDefinition): boolean {
    return !promptPhaseAtOrAfter(definition.phase, 'expression');
  }
}
