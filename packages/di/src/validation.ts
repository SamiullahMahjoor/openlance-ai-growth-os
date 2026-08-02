import { BaseError } from '@openlance/aios-errors';

import type { Lifetime } from './provider.js';
import { describeToken } from './token.js';

/**
 * A dependency-graph problem: a missing dependency, a cycle, or a lifetime mismatch.
 * It is a domain error (a wiring rule was violated). Instances are distinguished by
 * their stable `DI.*` code, consistent with the error taxonomy where the code is the
 * discriminant. Graph problems are returned in a `Result`, never thrown, by
 * `validate()` and `build()`.
 */
export class DependencyError extends BaseError {
  readonly category = 'domain';
}

/** Internal: the shape the validator inspects for one registered service. */
export interface GraphNode {
  readonly lifetime: Lifetime;
  readonly dependencies: readonly symbol[];
}

/**
 * Internal: validates a resolved dependency graph and returns every problem found,
 * deterministically (nodes are visited in registration order). Missing dependencies
 * are reported first, then cycles, then lifetime mismatches.
 */
export const validateGraph = (nodes: ReadonlyMap<symbol, GraphNode>): DependencyError[] => {
  const errors: DependencyError[] = [];

  for (const [tokenSym, node] of nodes) {
    for (const dep of node.dependencies) {
      if (!nodes.has(dep)) {
        errors.push(
          new DependencyError(
            'DI.MISSING_DEPENDENCY',
            `Service '${describeToken(tokenSym)}' depends on unregistered '${describeToken(dep)}'.`,
            { token: describeToken(tokenSym), missing: describeToken(dep) },
          ),
        );
      }
    }
  }

  const VISITING = 1;
  const VISITED = 2;
  const state = new Map<symbol, number>();
  const path: symbol[] = [];

  const visit = (current: symbol, node: GraphNode): void => {
    state.set(current, VISITING);
    path.push(current);
    for (const dep of node.dependencies) {
      const depNode = nodes.get(dep);
      if (!depNode) {
        continue;
      }
      const depState = state.get(dep) ?? 0;
      if (depState === VISITING) {
        const cycle = path.slice(path.indexOf(dep)).concat(dep).map(describeToken);
        errors.push(
          new DependencyError(
            'DI.CIRCULAR_DEPENDENCY',
            `Circular dependency: ${cycle.join(' -> ')}.`,
            {
              cycle,
            },
          ),
        );
      } else if (depState !== VISITED) {
        visit(dep, depNode);
      }
    }
    path.pop();
    state.set(current, VISITED);
  };

  for (const [tokenSym, node] of nodes) {
    if ((state.get(tokenSym) ?? 0) !== VISITED) {
      visit(tokenSym, node);
    }
  }

  for (const [tokenSym, node] of nodes) {
    if (node.lifetime !== 'singleton') {
      continue;
    }
    for (const dep of node.dependencies) {
      if (nodes.get(dep)?.lifetime === 'scoped') {
        errors.push(
          new DependencyError(
            'DI.LIFETIME_MISMATCH',
            `Singleton '${describeToken(tokenSym)}' must not depend on scoped '${describeToken(dep)}'.`,
            { token: describeToken(tokenSym), dependency: describeToken(dep) },
          ),
        );
      }
    }
  }

  return errors;
};
