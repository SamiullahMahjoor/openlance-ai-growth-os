import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { RetrievalError } from './errors.js';
import type { RetrievalRegistry } from './registry.js';
import type { RetrievalCandidate } from './types.js';

/**
 * Retrieval dependency resolution: the `resolve-dependencies` step. It expands the selected set to include
 * every declared dependency of every piece, so the set is dependency-complete. The expansion is bounded
 * and acyclic: it fails closed on an unknown dependency (`RETRIEVAL.UNKNOWN_DEPENDENCY`) or a dependency
 * cycle (`RETRIEVAL.DEPENDENCY_CYCLE`). It reads declared dependencies from the registry only; it loads
 * and executes nothing.
 */
export class RetrievalResolver {
  /** Expand the selected candidates to a dependency-complete set, failing closed. */
  resolve(
    selected: readonly RetrievalCandidate[],
    registry: RetrievalRegistry,
  ): Result<readonly RetrievalCandidate[], RetrievalError> {
    const collected = new Map<string, RetrievalCandidate>();
    const inProgress = new Set<string>();
    const visit = (candidate: RetrievalCandidate): RetrievalError | undefined => {
      if (collected.has(candidate.id)) {
        return undefined;
      }
      if (inProgress.has(candidate.id)) {
        return new RetrievalError(
          'RETRIEVAL.DEPENDENCY_CYCLE',
          `Retrieval candidate '${candidate.id}' is part of a dependency cycle.`,
          { id: candidate.id },
        );
      }
      inProgress.add(candidate.id);
      for (const dependencyId of candidate.dependsOn) {
        const dependency = registry.get(dependencyId);
        if (dependency === undefined) {
          return new RetrievalError(
            'RETRIEVAL.UNKNOWN_DEPENDENCY',
            `Retrieval candidate '${candidate.id}' depends on unknown candidate '${dependencyId}'.`,
            { id: candidate.id, dependency: dependencyId },
          );
        }
        const error = visit(dependency);
        if (error !== undefined) {
          return error;
        }
      }
      inProgress.delete(candidate.id);
      collected.set(candidate.id, candidate);
      return undefined;
    };
    for (const candidate of selected) {
      const error = visit(candidate);
      if (error !== undefined) {
        return err(error);
      }
    }
    return ok([...collected.values()]);
  }
}
