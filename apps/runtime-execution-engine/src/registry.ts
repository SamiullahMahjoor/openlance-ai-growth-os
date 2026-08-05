import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ExecutionError } from './errors.js';
import type { ExecutionPolicy } from './types.js';

/**
 * The execution policy registry: registration and deterministic lookup of named execution policies. It preserves
 * registration order (Map insertion order), so the resolved barrier set is deterministic. It holds orchestration
 * constraints (barrier capabilities); it holds no plan, no decision, and no execution truth.
 */
export class ExecutionPolicyRegistry {
  readonly #byName = new Map<string, ExecutionPolicy>();

  /** Register a policy. Fails closed on a duplicate name (`EXECUTION.DUPLICATE_POLICY`). */
  register(policy: ExecutionPolicy): Result<void, ExecutionError> {
    if (this.#byName.has(policy.name)) {
      return err(
        new ExecutionError(
          'EXECUTION.DUPLICATE_POLICY',
          `An execution policy named '${policy.name}' is already registered.`,
          { policy: policy.name },
        ),
      );
    }
    this.#byName.set(policy.name, policy);
    return ok(undefined);
  }

  /** Whether a policy with the given name is registered. */
  has(name: string): boolean {
    return this.#byName.has(name);
  }

  /** All registered policies, in registration order. */
  list(): readonly ExecutionPolicy[] {
    return [...this.#byName.values()];
  }

  /** The effective barrier-capability set across every registered policy. */
  barriers(): ReadonlySet<string> {
    const set = new Set<string>();
    for (const policy of this.#byName.values()) {
      for (const capability of policy.barrierCapabilities) {
        set.add(capability);
      }
    }
    return set;
  }

  /** Remove a policy by name; returns whether one was removed. */
  unregister(name: string): boolean {
    return this.#byName.delete(name);
  }
}
