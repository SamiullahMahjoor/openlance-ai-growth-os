import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { PROMPT_VALIDATION_CHECKS, validationCheckAtOrAfter } from '@openlance/aios-prompts';
import type { PromptValidationCheck } from '@openlance/aios-prompts';

import { PromptError } from './errors.js';
import type { PromptPart } from './types.js';

/** A residual, unresolved variable placeholder (boundary-conformance rejects it). */
const RESIDUAL_PLACEHOLDER = /\{\{\w+\}\}/;

/**
 * The `PROMPT.*` codes produced by the validation checks, so callers can distinguish a validation
 * failure from another compilation failure. Frozen.
 */
export const VALIDATION_ERROR_CODES: ReadonlySet<string> = new Set([
  'PROMPT.GOVERNANCE_LAYER_MISSING',
  'PROMPT.UNRESOLVED_PLACEHOLDER',
  'PROMPT.INCOMPLETE',
  'PROMPT.CONTEXT_NOT_SEPARATED',
]);

/**
 * Prompt validation: it runs the frozen `PROMPT_VALIDATION_CHECKS` in order (governance-conformance,
 * boundary-conformance, structural-completeness, grounding-and-separation), consuming
 * `validationCheckAtOrAfter`. The checks are conjunctive and fail-closed: a prompt that fails any check
 * is not expressed. Each check is structural: it applies, never restates, governance
 * (ai/prompts/prompt-validation.md, "validation defines what and order, never the rule").
 */
export class PromptValidator {
  /** The frozen, ordered validation checks. */
  checks(): readonly PromptValidationCheck[] {
    return PROMPT_VALIDATION_CHECKS;
  }

  /** Whether the frozen checks are in constitutional order (consumes `validationCheckAtOrAfter`). */
  checksInConstitutionalOrder(): boolean {
    return PROMPT_VALIDATION_CHECKS.every((check, index) => {
      const previous = PROMPT_VALIDATION_CHECKS[index - 1];
      return previous === undefined || validationCheckAtOrAfter(check, previous);
    });
  }

  /** Validate the composed prompt through the frozen checks, in order, failing closed. */
  validate(parts: readonly PromptPart[], content: string): Result<void, PromptError> {
    if (!parts.some((part) => part.layer === 'governing')) {
      return err(
        new PromptError(
          'PROMPT.GOVERNANCE_LAYER_MISSING',
          'The prompt has no governing layer; an ungoverned prompt is rejected.',
          {},
        ),
      );
    }
    if (RESIDUAL_PLACEHOLDER.test(content)) {
      return err(
        new PromptError(
          'PROMPT.UNRESOLVED_PLACEHOLDER',
          'The composed prompt has an unresolved variable placeholder.',
          {},
        ),
      );
    }
    if (!parts.some((part) => part.layer === 'task') || content.trim() === '') {
      return err(
        new PromptError(
          'PROMPT.INCOMPLETE',
          'The prompt is incomplete: it needs a task layer and non-empty content.',
          {},
        ),
      );
    }
    if (parts.some((part) => part.layer === 'context' && part.reference !== true)) {
      return err(
        new PromptError(
          'PROMPT.CONTEXT_NOT_SEPARATED',
          'A context-layer part embeds content; context must be referenced, not embedded.',
          {},
        ),
      );
    }
    return ok(undefined);
  }
}
