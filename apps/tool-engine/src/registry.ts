import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ToolError } from './errors.js';
import type { ToolDefinition, ToolId } from './types.js';

/**
 * The tool registry: registration, discovery, and deterministic lookup of tools by id. It preserves registration order
 * (Map insertion order), so discovery and selection are deterministic. It holds tool definitions (capability
 * declarations), never business truth and never the outside system a tool interacts with.
 */
export class ToolRegistry {
  readonly #byId = new Map<ToolId, ToolDefinition>();

  /** Register a tool. Fails closed on a duplicate id (`TOOL.DUPLICATE_ID`). */
  register(tool: ToolDefinition): Result<void, ToolError> {
    if (this.#byId.has(tool.id)) {
      return err(
        new ToolError('TOOL.DUPLICATE_ID', `A tool with id '${tool.id}' is already registered.`, {
          id: tool.id,
        }),
      );
    }
    this.#byId.set(tool.id, tool);
    return ok(undefined);
  }

  /** Whether a tool with the given id is registered. */
  has(id: ToolId): boolean {
    return this.#byId.has(id);
  }

  /** The registered tool for an id, or `undefined`. */
  get(id: ToolId): ToolDefinition | undefined {
    return this.#byId.get(id);
  }

  /** All registered tools, in registration order. */
  list(): readonly ToolDefinition[] {
    return [...this.#byId.values()];
  }

  /** Remove a tool by id; returns whether one was removed. */
  unregister(id: ToolId): boolean {
    return this.#byId.delete(id);
  }
}
