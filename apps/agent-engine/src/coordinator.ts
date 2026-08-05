import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AgentError } from './errors.js';
import type { AgentRegistry } from './registry.js';
import type { AgentId, AgentLink } from './types.js';

/**
 * Agent coordination: it validates a multi-agent coordination topology, the directed supervisor -> worker edges by
 * which agents direct one another. The topology is bounded (no unbounded delegation), every referenced agent must be
 * registered, no agent may coordinate itself, and the directed topology must be acyclic. It fails closed on a topology
 * that exceeds the bound, an unknown agent, self-coordination, or a coordination cycle. It defines who directs whom,
 * never the execution of the work (that is the runtime's); validating coordination never executes.
 */
export class AgentCoordinator {
  /** Validate the coordination links as a bounded, directed, acyclic topology over registered agents; fail closed. */
  coordinate(
    links: readonly AgentLink[],
    registry: AgentRegistry,
    maxLinks: number,
  ): Result<readonly AgentLink[], AgentError> {
    if (links.length > maxLinks) {
      return err(
        new AgentError(
          'AGENT.COORDINATION_TOO_LARGE',
          `The coordination topology has ${links.length} links, exceeding the bound of ${maxLinks}.`,
          { links: links.length, maxLinks },
        ),
      );
    }
    const adjacency = new Map<AgentId, AgentId[]>();
    for (const link of links) {
      if (!registry.has(link.supervisor) || !registry.has(link.worker)) {
        return err(
          new AgentError(
            'AGENT.UNKNOWN_AGENT',
            `Coordination references an unregistered agent ('${link.supervisor}' -> '${link.worker}').`,
            { supervisor: link.supervisor, worker: link.worker },
          ),
        );
      }
      if (link.supervisor === link.worker) {
        return err(
          new AgentError(
            'AGENT.SELF_COORDINATION',
            `Agent '${link.supervisor}' cannot coordinate itself.`,
            { agent: link.supervisor },
          ),
        );
      }
      const workers = adjacency.get(link.supervisor) ?? [];
      workers.push(link.worker);
      adjacency.set(link.supervisor, workers);
    }
    const visiting = new Set<AgentId>();
    const visited = new Set<AgentId>();
    const reachesCycle = (node: AgentId): boolean => {
      if (visiting.has(node)) {
        return true;
      }
      if (visited.has(node)) {
        return false;
      }
      visiting.add(node);
      for (const next of adjacency.get(node) ?? []) {
        if (reachesCycle(next)) {
          return true;
        }
      }
      visiting.delete(node);
      visited.add(node);
      return false;
    };
    for (const supervisor of adjacency.keys()) {
      if (reachesCycle(supervisor)) {
        return err(
          new AgentError(
            'AGENT.COORDINATION_CYCLE',
            'The coordination topology contains a cycle.',
            {},
          ),
        );
      }
    }
    // Freeze each link wrapper (a fresh copy), so a caller retaining an input link cannot reassign a validated link's
    // supervisor or worker after the plan is built; the array is a copy, independent of the caller's input.
    return ok(Object.freeze(links.map((link) => Object.freeze({ ...link }))));
  }
}
