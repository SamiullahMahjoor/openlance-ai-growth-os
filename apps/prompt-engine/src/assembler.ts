import { PROMPT_LAYERS, promptLayerAtOrAfter } from '@openlance/aios-prompts';
import type { PromptLayer } from '@openlance/aios-prompts';

import type { PromptPart } from './types.js';

/** The separator placed between layers in the composed prompt. Structure only; not a template language. */
const LAYER_SEPARATOR = '\n\n';

/**
 * Prompt assembly: it composes the resolved parts into one prompt in the frozen `PROMPT_LAYERS` order,
 * from the most authoritative (governing) to the most specific (task), consuming `promptLayerAtOrAfter`.
 * The order is stable within a layer, so the same parts produce the same composed prompt. It combines
 * content only; it invents nothing and executes nothing.
 */
export class PromptAssembler {
  /** The frozen, ordered prompt layers. */
  layers(): readonly PromptLayer[] {
    return PROMPT_LAYERS;
  }

  /** Compose the parts into one prompt string, ordered by the frozen layer order (stable within a layer). */
  assemble(parts: readonly PromptPart[]): string {
    const ordered = [...parts].sort((a, b) =>
      a.layer === b.layer ? 0 : promptLayerAtOrAfter(a.layer, b.layer) ? 1 : -1,
    );
    return ordered.map((part) => part.content).join(LAYER_SEPARATOR);
  }
}
