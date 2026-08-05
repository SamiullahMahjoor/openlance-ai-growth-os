import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ToolError } from './errors.js';
import { ToolNormalizer } from './normalizer.js';
import type {
  ToolCapability,
  ToolDefinition,
  ToolDefinitionInput,
  ToolParameter,
} from './types.js';

/**
 * The tool factory: it validates a `ToolDefinitionInput` and builds an immutable `ToolDefinition`, normalizing the id,
 * each capability and parameter name, and any base id. It fails closed on a blank id, no capabilities, a blank
 * capability name, a duplicate capability name, or a blank parameter name. It builds a capability declaration only; it
 * selects, executes, and interacts with nothing.
 */
export class ToolFactory {
  readonly #normalizer = new ToolNormalizer();

  /** Validate an input and build a frozen `ToolDefinition`, failing closed on an invalid input. */
  create(input: ToolDefinitionInput): Result<ToolDefinition, ToolError> {
    const id = this.#normalizer.normalize(input.id);
    if (id === '') {
      return err(new ToolError('TOOL.BLANK_ID', 'A tool has a blank id.', {}));
    }
    if (input.capabilities.length === 0) {
      return err(
        new ToolError('TOOL.NO_CAPABILITIES', `Tool '${input.id}' declares no capabilities.`, {
          id: input.id,
        }),
      );
    }
    const capabilities: ToolCapability[] = [];
    const capabilityNames = new Set<string>();
    for (const capability of input.capabilities) {
      const name = this.#normalizer.normalize(capability.name);
      if (name === '') {
        return err(
          new ToolError(
            'TOOL.BLANK_CAPABILITY',
            `Tool '${input.id}' has a blank capability name.`,
            {
              id: input.id,
            },
          ),
        );
      }
      if (capabilityNames.has(name)) {
        return err(
          new ToolError(
            'TOOL.DUPLICATE_CAPABILITY',
            `Tool '${input.id}' declares capability '${name}' more than once.`,
            { id: input.id, capability: name },
          ),
        );
      }
      capabilityNames.add(name);
      const parameters: ToolParameter[] = [];
      for (const parameter of capability.parameters) {
        const parameterName = this.#normalizer.normalize(parameter.name);
        if (parameterName === '') {
          return err(
            new ToolError(
              'TOOL.BLANK_PARAMETER',
              `Tool '${input.id}' capability '${name}' has a blank parameter name.`,
              { id: input.id, capability: name },
            ),
          );
        }
        parameters.push(Object.freeze({ name: parameterName, required: parameter.required }));
      }
      capabilities.push(Object.freeze({ name, parameters: Object.freeze(parameters) }));
    }
    const basedOn =
      input.basedOn === undefined ? undefined : this.#normalizer.normalize(input.basedOn);
    const tool: ToolDefinition = {
      id,
      capabilities: Object.freeze(capabilities),
      requiresClearance: input.requiresClearance ?? false,
      ...(basedOn !== undefined ? { basedOn } : {}),
    };
    return ok(Object.freeze(tool));
  }
}
