import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { PromptError } from './errors.js';
import type { PromptDefinition, PromptId } from './types.js';

/**
 * The prompt definition registry: registration, discovery, and deterministic lookup of durable prompt
 * definitions by id. It preserves registration order (Map insertion order), so discovery is
 * deterministic. It holds durable architecture (definitions), never a composed prompt; the composed
 * prompt is transient and is never stored here.
 */
export class PromptRegistry {
  readonly #byId = new Map<PromptId, PromptDefinition>();

  /** Register a definition. Fails closed on a duplicate id (`PROMPT.DUPLICATE_ID`). */
  register(definition: PromptDefinition): Result<void, PromptError> {
    if (this.#byId.has(definition.id)) {
      return err(
        new PromptError(
          'PROMPT.DUPLICATE_ID',
          `A prompt definition with id '${definition.id}' is already registered.`,
          { id: definition.id },
        ),
      );
    }
    this.#byId.set(definition.id, definition);
    return ok(undefined);
  }

  /** Whether a definition with the given id is registered. */
  has(id: PromptId): boolean {
    return this.#byId.has(id);
  }

  /** The registered definition for an id, or `undefined`. */
  get(id: PromptId): PromptDefinition | undefined {
    return this.#byId.get(id);
  }

  /** All registered definitions, in registration order. */
  list(): readonly PromptDefinition[] {
    return [...this.#byId.values()];
  }

  /** Remove a definition by id; returns whether one was removed (retirement of the durable architecture). */
  unregister(id: PromptId): boolean {
    return this.#byId.delete(id);
  }
}
