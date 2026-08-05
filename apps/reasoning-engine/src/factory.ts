import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ReasoningError } from './errors.js';
import { ReasoningNormalizer } from './normalizer.js';
import type { Premise, PremiseInput } from './types.js';

/**
 * The premise factory: it validates a `PremiseInput` and builds an immutable `Premise`, normalizing its statement. It
 * fails closed on a blank id, a statement that is empty once normalized, or a blank source. It builds a knowledge
 * reference only; it reasons, retrieves, and invents nothing.
 */
export class ReasoningFactory {
  readonly #normalizer = new ReasoningNormalizer();

  /** Validate an input and build a frozen `Premise`, failing closed on an invalid input. */
  create(input: PremiseInput): Result<Premise, ReasoningError> {
    if (input.id.trim() === '') {
      return err(new ReasoningError('REASONING.BLANK_ID', 'A premise has a blank id.', {}));
    }
    const statement = this.#normalizer.normalize(input.statement);
    if (statement === '') {
      return err(
        new ReasoningError(
          'REASONING.BLANK_STATEMENT',
          `Premise '${input.id}' has an empty statement.`,
          { id: input.id },
        ),
      );
    }
    if (input.source.trim() === '') {
      return err(
        new ReasoningError('REASONING.BLANK_SOURCE', `Premise '${input.id}' has a blank source.`, {
          id: input.id,
        }),
      );
    }
    const premise: Premise = { id: input.id, statement, source: input.source };
    return ok(Object.freeze(premise));
  }
}
