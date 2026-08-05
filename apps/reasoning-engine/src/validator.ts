import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { REASONING_VALIDATION_DIMENSIONS } from '@openlance/aios-reasoning';
import type {
  ReasoningStage,
  ReasoningValidationDimension,
  UncertaintyKind,
} from '@openlance/aios-reasoning';

import { ReasoningError } from './errors.js';
import type { ReasoningId } from './types.js';

/**
 * The governed disposition a validation yields: the terminal stage the reasoning reaches, and, when it is inconclusive,
 * the classified kind of uncertainty. Internal to the engine; the planner builds a plan from it.
 */
export interface ReasoningDisposition {
  readonly stage: ReasoningStage;
  readonly uncertainty?: UncertaintyKind;
}

/**
 * Reasoning validation: it runs the frozen `REASONING_VALIDATION_DIMENSIONS` in order (assumption identification,
 * grounding, evidence sufficiency, governed validation), conjunctive and fail-closed, and determines the governed
 * disposition. A hidden (blank) assumption fails closed; an ungrounded or evidence-insufficient reasoning yields a
 * governed absence (`inconclusive`, with a classified `knowledge` uncertainty) rather than an invented conclusion; a
 * denied governance verdict `escalates`. It applies, never restates, the governance rule owned by ai/governance/.
 */
export class ReasoningValidator {
  /** The frozen, ordered validation dimensions. */
  dimensions(): readonly ReasoningValidationDimension[] {
    return REASONING_VALIDATION_DIMENSIONS;
  }

  /** Validate a reasoning against the frozen dimensions, in order, and determine its governed disposition. */
  validate(
    premises: readonly ReasoningId[],
    assumptions: readonly string[],
    permitted: boolean | undefined,
  ): Result<ReasoningDisposition, ReasoningError> {
    // assumption-identification: every assumption is surfaced and explicit (never blank/hidden).
    for (const assumption of assumptions) {
      if (assumption.trim() === '') {
        return err(
          new ReasoningError(
            'REASONING.ASSUMPTION_UNIDENTIFIED',
            'A reasoning depends on a hidden (blank) assumption.',
            {},
          ),
        );
      }
    }
    // grounding and evidence-sufficiency: a reasoning concludes only on sufficient retrieved knowledge (at least one
    // premise). Grounded only on assumptions, or on nothing, it rests on insufficient evidence and yields a governed
    // absence (a classified `knowledge` uncertainty) rather than an invented conclusion, before any governance verdict
    // is reached. Both frozen dimensions fail closed to this same governed absence.
    if (premises.length === 0) {
      return ok({ stage: 'inconclusive', uncertainty: 'knowledge' });
    }
    // governed-validation: a denied governance verdict escalates rather than conclude outside the rules.
    if (permitted === false) {
      return ok({ stage: 'escalated' });
    }
    return ok({ stage: 'concluded' });
  }
}
