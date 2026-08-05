import type { AgentExecutionPlan, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ExecutionError } from './errors.js';

/** A plan step paired with its stable plan index; the index makes aggregation deterministic. */
export interface ResolvedStep {
  readonly index: number;
  readonly step: AgentStep;
}

/**
 * The dependency resolver: it resolves an execution plan's steps into the deterministic order the runtime executes them
 * in, and re-verifies the plan's coordination topology is acyclic. The plan's steps carry no explicit inter-step
 * dependency, so the resolved order is the plan's own step order, which the runtime never violates. The coordination
 * (supervisor to worker) edges are re-checked for a cycle as an execution-boundary guard (the Agent Engine already
 * guarantees acyclicity; the runtime fails closed on a cycle rather than trusting it). It resolves order only; it
 * executes nothing.
 */
export class DependencyResolver {
  /** Resolve the plan into its ordered steps, failing closed on a coordination cycle. */
  resolve(plan: AgentExecutionPlan): Result<readonly ResolvedStep[], ExecutionError> {
    const cycle = this.#coordinationCycle(plan);
    if (cycle !== null) {
      return err(
        new ExecutionError(
          'EXECUTION.COORDINATION_CYCLE',
          `The plan's coordination topology contains a cycle involving '${cycle}'; execution fails closed.`,
          { agent: cycle },
        ),
      );
    }
    const resolved = plan.steps.map((step, index) => ({ index, step }));
    return ok(Object.freeze(resolved));
  }

  /** The id of an agent on a coordination cycle, or `null` if the directed topology is acyclic (DFS). */
  #coordinationCycle(plan: AgentExecutionPlan): string | null {
    const adjacency = new Map<string, string[]>();
    for (const link of plan.coordination) {
      const workers = adjacency.get(link.supervisor) ?? [];
      workers.push(link.worker);
      adjacency.set(link.supervisor, workers);
    }
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const walk = (node: string): string | null => {
      if (visiting.has(node)) {
        return node;
      }
      if (visited.has(node)) {
        return null;
      }
      visiting.add(node);
      for (const worker of adjacency.get(node) ?? []) {
        const found = walk(worker);
        if (found !== null) {
          return found;
        }
      }
      visiting.delete(node);
      visited.add(node);
      return null;
    };
    for (const supervisor of adjacency.keys()) {
      const found = walk(supervisor);
      if (found !== null) {
        return found;
      }
    }
    return null;
  }
}
