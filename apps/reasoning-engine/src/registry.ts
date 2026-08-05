import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ReasoningError } from './errors.js';
import type { Premise, ReasoningId } from './types.js';

/**
 * The premise registry: registration and deterministic lookup of the retrieved knowledge a reasoning consumes, by id.
 * It preserves registration order (Map insertion order), so reasoning is deterministic. It holds premises (references to
 * retrieved knowledge), never business truth; it neither invents nor amends the knowledge it holds.
 */
export class ReasoningRegistry {
  readonly #byId = new Map<ReasoningId, Premise>();

  /** Register a premise. Fails closed on a duplicate id (`REASONING.DUPLICATE_ID`). */
  register(premise: Premise): Result<void, ReasoningError> {
    if (this.#byId.has(premise.id)) {
      return err(
        new ReasoningError(
          'REASONING.DUPLICATE_ID',
          `A premise with id '${premise.id}' is already registered.`,
          { id: premise.id },
        ),
      );
    }
    this.#byId.set(premise.id, premise);
    return ok(undefined);
  }

  /** Whether a premise with the given id is registered. */
  has(id: ReasoningId): boolean {
    return this.#byId.has(id);
  }

  /** The registered premise for an id, or `undefined`. */
  get(id: ReasoningId): Premise | undefined {
    return this.#byId.get(id);
  }

  /** All registered premises, in registration order. */
  list(): readonly Premise[] {
    return [...this.#byId.values()];
  }

  /** Remove a premise by id; returns whether one was removed. */
  unregister(id: ReasoningId): boolean {
    return this.#byId.delete(id);
  }
}
