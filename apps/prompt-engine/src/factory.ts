import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { PromptError } from './errors.js';
import type { PromptDefinition, PromptDefinitionInput, PromptPart } from './types.js';

/**
 * The prompt definition factory: it validates a `PromptDefinitionInput` and produces an immutable
 * `PromptDefinition`, filling a default lifecycle phase (`definition`). It fails closed on a blank id, a
 * blank capability, or no parts. It defines the durable architecture only; it composes and executes
 * nothing.
 */
export class PromptFactory {
  /** Validate an input and build a frozen `PromptDefinition`, failing closed on an invalid input. */
  create(input: PromptDefinitionInput): Result<PromptDefinition, PromptError> {
    if (input.id.trim() === '') {
      return err(new PromptError('PROMPT.BLANK_ID', 'A prompt definition has a blank id.', {}));
    }
    if (input.capability.trim() === '') {
      return err(
        new PromptError(
          'PROMPT.BLANK_CAPABILITY',
          `Prompt definition '${input.id}' has a blank capability.`,
          { id: input.id },
        ),
      );
    }
    if (input.parts.length === 0) {
      return err(
        new PromptError('PROMPT.NO_PARTS', `Prompt definition '${input.id}' declares no parts.`, {
          id: input.id,
        }),
      );
    }
    const parts: readonly PromptPart[] = Object.freeze(
      input.parts.map((part) => Object.freeze({ ...part })),
    );
    const definition: PromptDefinition = {
      id: input.id,
      capability: input.capability,
      parts,
      requiredVariables: Object.freeze([...(input.requiredVariables ?? [])]),
      phase: input.phase ?? 'definition',
      ...(input.inheritsFrom !== undefined ? { inheritsFrom: input.inheritsFrom } : {}),
    };
    return ok(Object.freeze(definition));
  }
}
