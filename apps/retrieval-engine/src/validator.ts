import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { RETRIEVAL_VALIDATION_DIMENSIONS } from '@openlance/aios-retrieval';
import type { RetrievalValidationDimension } from '@openlance/aios-retrieval';

import { RetrievalError } from './errors.js';
import type { RetrievalCandidate, RetrievalId } from './types.js';

/**
 * The `RETRIEVAL.*` codes produced by the validation dimensions, so callers can distinguish a validation
 * failure from another retrieval failure. Frozen.
 */
export const VALIDATION_ERROR_CODES: ReadonlySet<string> = new Set([
  'RETRIEVAL.OWNERSHIP',
  'RETRIEVAL.AUTHORITY_ORDER',
  'RETRIEVAL.DEPENDENCY_INCOMPLETE',
  'RETRIEVAL.BOUNDARY',
  'RETRIEVAL.NOT_PERMITTED',
]);

/**
 * Retrieval validation: the `validate` step. It runs the frozen `RETRIEVAL_VALIDATION_DIMENSIONS` in order
 * (ownership, authority, dependency-completeness, boundaries, governance-permission), conjunctive and
 * fail-closed: a result that fails any dimension is refused, never handed off. Each dimension is a
 * structural check that applies, never restates, the rules owned by the knowledge repository and
 * ai/governance/.
 */
export class RetrievalValidator {
  /** The frozen, ordered validation dimensions. */
  dimensions(): readonly RetrievalValidationDimension[] {
    return RETRIEVAL_VALIDATION_DIMENSIONS;
  }

  /** Validate the assembled result against the frozen dimensions, in order, failing closed. */
  validate(
    candidates: readonly RetrievalCandidate[],
    permitted: readonly RetrievalId[] | undefined,
  ): Result<void, RetrievalError> {
    // ownership: every piece is a single canonical owner (no duplicate owner).
    const owners = new Set<string>();
    for (const candidate of candidates) {
      if (owners.has(candidate.owner)) {
        return err(
          new RetrievalError(
            'RETRIEVAL.OWNERSHIP',
            `The result names canonical owner '${candidate.owner}' more than once.`,
            { owner: candidate.owner },
          ),
        );
      }
      owners.add(candidate.owner);
    }
    // authority: governing knowledge first (authority is non-increasing).
    let previous: RetrievalCandidate | undefined;
    for (const candidate of candidates) {
      if (previous !== undefined && candidate.authority > previous.authority) {
        return err(
          new RetrievalError(
            'RETRIEVAL.AUTHORITY_ORDER',
            'The result is not ordered by authority (governing knowledge first).',
            {},
          ),
        );
      }
      previous = candidate;
    }
    // dependency-completeness: every declared dependency is present.
    const ids = new Set(candidates.map((candidate) => candidate.id));
    for (const candidate of candidates) {
      for (const dependencyId of candidate.dependsOn) {
        if (!ids.has(dependencyId)) {
          return err(
            new RetrievalError(
              'RETRIEVAL.DEPENDENCY_INCOMPLETE',
              `The result is missing dependency '${dependencyId}' of '${candidate.id}'.`,
              { id: candidate.id, dependency: dependencyId },
            ),
          );
        }
      }
    }
    // boundaries: the result contains only knowledge (non-empty content).
    for (const candidate of candidates) {
      if (candidate.content.trim() === '') {
        return err(
          new RetrievalError(
            'RETRIEVAL.BOUNDARY',
            `Retrieval candidate '${candidate.id}' has empty content and is not knowledge.`,
            { id: candidate.id },
          ),
        );
      }
    }
    // governance-permission: the execution is permitted to consume every piece (when a set is given).
    if (permitted !== undefined) {
      for (const candidate of candidates) {
        if (!permitted.includes(candidate.id)) {
          return err(
            new RetrievalError(
              'RETRIEVAL.NOT_PERMITTED',
              `The execution is not permitted to consume '${candidate.id}'.`,
              { id: candidate.id },
            ),
          );
        }
      }
    }
    return ok(undefined);
  }
}
