import type { CompositionInput } from '@openlance/aios-prompt-engine';

import { SafetyNormalizer } from './normalizer.js';
import type { EffectivePolicy } from './policy.js';
import type { Hazard } from './types.js';

/**
 * Prompt safety inspection: it inspects a prompt step's composition input for a runtime prompt hazard, applying the
 * effective policy deterministically. It detects a restricted instruction token embedded in a variable value or a
 * context reference (prompt injection or instruction hijacking, `SANITIZE`), a context reference that names one of the
 * step's own variables (recursive prompt abuse, `REFUSE`), and a context-reference count beyond the bound (unbounded
 * references, `UNSAFE`). It reads the composition input; it composes and executes nothing.
 */
export class PromptSafetyInspector {
  readonly #normalizer = new SafetyNormalizer();

  /** Identify the prompt hazards a composition input carries under the effective policy. */
  inspect(request: CompositionInput, source: string, policy: EffectivePolicy): readonly Hazard[] {
    const hazards: Hazard[] = [];
    const references = request.contextReferences ?? [];
    if (references.length > policy.maxContextReferences) {
      hazards.push({
        category: 'prompt',
        source,
        code: 'SAFETY.PROMPT_REFERENCE_OVERFLOW',
        response: 'UNSAFE',
        detail: `The prompt has ${references.length} context references, beyond the bound of ${policy.maxContextReferences}.`,
      });
    }
    const variableNames = new Set(
      Object.keys(request.variables).map((name) => this.#normalizer.normalize(name)),
    );
    for (const reference of references) {
      const normalized = this.#normalizer.normalize(reference);
      if (variableNames.has(normalized)) {
        hazards.push({
          category: 'prompt',
          source,
          code: 'SAFETY.PROMPT_RECURSIVE',
          response: 'REFUSE',
          detail: `The context reference '${reference}' names one of the prompt's own variables (recursive composition).`,
        });
      }
    }
    for (const token of policy.restrictedPromptTokens) {
      if (this.#containsToken(request, references, token)) {
        hazards.push({
          category: 'prompt',
          source,
          code: 'SAFETY.PROMPT_RESTRICTED_TOKEN',
          response: 'SANITIZE',
          detail: `The prompt embeds the restricted instruction token '${token}'.`,
        });
      }
    }
    return hazards;
  }

  #containsToken(request: CompositionInput, references: readonly string[], token: string): boolean {
    for (const value of Object.values(request.variables)) {
      if (this.#normalizer.normalize(value).includes(token)) {
        return true;
      }
    }
    for (const reference of references) {
      if (this.#normalizer.normalize(reference).includes(token)) {
        return true;
      }
    }
    return false;
  }
}
