import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ReasoningError } from './errors.js';
import { ReasoningNormalizer } from './normalizer.js';

/**
 * Reasoning decomposition: the `decompose` step. It structures the provided sub-problems into normalized parts, so each
 * part can be reasoned about on its own (the decomposition strategy). When no parts are provided, the whole task is the
 * single part. It fails closed on a part that is empty once normalized. It structures the problem only; it reasons,
 * concludes, executes, and invents nothing.
 */
export class ReasoningDecomposer {
  readonly #normalizer = new ReasoningNormalizer();

  /** Break the task into its normalized parts, or the whole task as one part; fail closed on a blank part. */
  decompose(
    task: string,
    parts: readonly string[] | undefined,
  ): Result<readonly string[], ReasoningError> {
    if (parts === undefined || parts.length === 0) {
      const whole = this.#normalizer.normalize(task);
      if (whole === '') {
        return err(new ReasoningError('REASONING.BLANK_PART', 'A reasoning part is blank.', {}));
      }
      return ok(Object.freeze([whole]));
    }
    const decomposed: string[] = [];
    for (const part of parts) {
      const normalized = this.#normalizer.normalize(part);
      if (normalized === '') {
        return err(new ReasoningError('REASONING.BLANK_PART', 'A reasoning part is blank.', {}));
      }
      decomposed.push(normalized);
    }
    return ok(Object.freeze(decomposed));
  }
}
