import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ToolError } from './errors.js';
import type { ToolRegistry } from './registry.js';
import type { ToolCapability, ToolDefinition, ToolId } from './types.js';

/**
 * Tool capability-inheritance resolution. It resolves a tool's effective capabilities by following its single `basedOn`
 * chain, so an inherited capability is available and a derived capability of the same name overrides a base one (by
 * specificity). The chain is single and acyclic: it fails closed on an unknown base (`TOOL.UNKNOWN_BASE`) or an
 * inheritance cycle (`TOOL.INHERITANCE_CYCLE`). It reads the registry only; it selects, executes, and interacts with
 * nothing.
 */
export class ToolResolver {
  /** Resolve a tool's effective capabilities through its `basedOn` chain, failing closed. */
  resolve(tool: ToolDefinition, registry: ToolRegistry): Result<ToolDefinition, ToolError> {
    const chain: ToolDefinition[] = [];
    const visited = new Set<ToolId>();
    let current: ToolDefinition | undefined = tool;
    while (current !== undefined) {
      if (visited.has(current.id)) {
        return err(
          new ToolError(
            'TOOL.INHERITANCE_CYCLE',
            `Tool '${current.id}' is part of a capability inheritance cycle.`,
            { id: current.id },
          ),
        );
      }
      visited.add(current.id);
      chain.push(current);
      if (current.basedOn === undefined) {
        break;
      }
      const base = registry.get(current.basedOn);
      if (base === undefined) {
        return err(
          new ToolError(
            'TOOL.UNKNOWN_BASE',
            `Tool '${current.id}' is based on unknown tool '${current.basedOn}'.`,
            { id: current.id, base: current.basedOn },
          ),
        );
      }
      current = base;
    }
    // Merge from the root down to the derived tool, so a derived capability overrides a base one of the same name.
    const merged = new Map<string, ToolCapability>();
    for (const link of [...chain].reverse()) {
      for (const capability of link.capabilities) {
        merged.set(capability.name, capability);
      }
    }
    const effective: ToolDefinition = Object.freeze({
      id: tool.id,
      capabilities: Object.freeze([...merged.values()]),
      requiresClearance: tool.requiresClearance,
    });
    return ok(effective);
  }
}
