import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { RetrievalError } from './errors.js';
import { RetrievalNormalizer } from './normalizer.js';
import type { RetrievalCandidate, RetrievalCandidateInput } from './types.js';

/**
 * The retrieval candidate factory: it validates a `RetrievalCandidateInput` and builds an immutable
 * `RetrievalCandidate`, normalizing its content. It fails closed on a blank id, a blank owner, a
 * non-finite or negative authority, no topics, or content that is empty once normalized. It builds a
 * candidate reference only; it reads, discovers, and loads nothing.
 */
export class RetrievalFactory {
  readonly #normalizer = new RetrievalNormalizer();

  /** Validate an input and build a frozen `RetrievalCandidate`, failing closed on an invalid input. */
  create(input: RetrievalCandidateInput): Result<RetrievalCandidate, RetrievalError> {
    if (input.id.trim() === '') {
      return err(
        new RetrievalError('RETRIEVAL.BLANK_ID', 'A retrieval candidate has a blank id.', {}),
      );
    }
    if (input.owner.trim() === '') {
      return err(
        new RetrievalError(
          'RETRIEVAL.BLANK_OWNER',
          `Retrieval candidate '${input.id}' has a blank canonical owner.`,
          { id: input.id },
        ),
      );
    }
    if (!Number.isFinite(input.authority) || input.authority < 0) {
      return err(
        new RetrievalError(
          'RETRIEVAL.INVALID_AUTHORITY',
          `Retrieval candidate '${input.id}' has an invalid authority '${input.authority}'.`,
          { id: input.id, authority: input.authority },
        ),
      );
    }
    if (input.topics.length === 0) {
      return err(
        new RetrievalError(
          'RETRIEVAL.NO_TOPICS',
          `Retrieval candidate '${input.id}' declares no topics.`,
          { id: input.id },
        ),
      );
    }
    const content = this.#normalizer.normalize(input.content);
    if (content === '') {
      return err(
        new RetrievalError(
          'RETRIEVAL.BLANK_CONTENT',
          `Retrieval candidate '${input.id}' has empty content.`,
          { id: input.id },
        ),
      );
    }
    const candidate: RetrievalCandidate = {
      id: input.id,
      owner: input.owner,
      authority: input.authority,
      topics: Object.freeze([...input.topics]),
      dependsOn: Object.freeze([...(input.dependsOn ?? [])]),
      content,
    };
    return ok(Object.freeze(candidate));
  }
}
