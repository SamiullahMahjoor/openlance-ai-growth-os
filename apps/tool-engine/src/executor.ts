import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ToolError } from './errors.js';
import type { ToolNormalizer } from './normalizer.js';
import type { ToolRegistry } from './registry.js';
import type { ToolResolver } from './resolver.js';
import type { ToolSelector } from './selector.js';
import type { ToolExecution, ToolRequest, ToolResponse } from './types.js';
import type { ToolValidator } from './validator.js';

/**
 * The tool executor: it prepares the validated tool execution over a request and the registry, in order: normalize the
 * requested capability, discover the tools that declare it, select one deterministically, resolve its capability
 * inheritance, validate it through the four frozen checks, then assemble the {@link ToolExecution} and the validated
 * {@link ToolResponse}. It **prepares and stops**: it opens no network, produces no outside effect, and carries out
 * nothing. It fails closed at every step, terminating in a validated preparation or a refusal.
 */
export class ToolExecutor {
  readonly #selector: ToolSelector;
  readonly #resolver: ToolResolver;
  readonly #validator: ToolValidator;
  readonly #normalizer: ToolNormalizer;

  constructor(
    selector: ToolSelector,
    resolver: ToolResolver,
    validator: ToolValidator,
    normalizer: ToolNormalizer,
  ) {
    this.#selector = selector;
    this.#resolver = resolver;
    this.#validator = validator;
    this.#normalizer = normalizer;
  }

  /** Prepare the validated tool execution for a request over the registry, failing closed. */
  prepare(
    request: ToolRequest,
    registry: ToolRegistry,
    strictPermission: boolean,
  ): Result<ToolResponse, ToolError> {
    if (strictPermission && request.permitted === undefined) {
      return err(
        new ToolError(
          'TOOL.PERMISSION_REQUIRED',
          'A tool preparation requires an explicit permission set.',
          { capability: request.capability },
        ),
      );
    }
    const capability = this.#normalizer.normalize(request.capability);
    const normalized: ToolRequest = { ...request, capability };
    const discovered = this.#selector.discover(registry.list(), capability);
    const chosen = this.#selector.select(discovered);
    if (chosen === undefined) {
      return err(
        new ToolError('TOOL.NO_TOOL', `No registered tool declares capability '${capability}'.`, {
          capability,
        }),
      );
    }
    const resolved = this.#resolver.resolve(chosen, registry);
    if (isErr(resolved)) {
      return err(resolved.error);
    }
    const validation = this.#validator.validate(resolved.value, normalized);
    if (isErr(validation)) {
      return err(validation.error);
    }
    const execution: ToolExecution = Object.freeze({
      tool: resolved.value.id,
      capability,
      arguments: Object.freeze({ ...(request.arguments ?? {}) }),
      clearanceRequired: resolved.value.requiresClearance,
    });
    const response: ToolResponse = Object.freeze({ execution, validated: true });
    return ok(response);
  }
}
