import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { OperationsError } from './errors.js';
import type { OperationsPolicy } from './types.js';

/**
 * The operations policy registry: registration and deterministic lookup of named operations policies. It preserves
 * registration order, so the effective muted-alert set is deterministic. It holds monitoring constraints (muted alert
 * keys); it holds no runtime output and no operational truth.
 */
export class OperationsPolicyRegistry {
  readonly #byName = new Map<string, OperationsPolicy>();

  /** Register a policy. Fails closed on a duplicate name (`OPERATIONS.DUPLICATE_POLICY`). */
  register(policy: OperationsPolicy): Result<void, OperationsError> {
    if (this.#byName.has(policy.name)) {
      return err(
        new OperationsError(
          'OPERATIONS.DUPLICATE_POLICY',
          `An operations policy named '${policy.name}' is already registered.`,
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
  list(): readonly OperationsPolicy[] {
    return [...this.#byName.values()];
  }

  /** The effective set of muted alert keys across every registered policy. */
  mutedAlerts(): ReadonlySet<string> {
    const muted = new Set<string>();
    for (const policy of this.#byName.values()) {
      for (const alert of policy.mutedAlerts) {
        muted.add(alert);
      }
    }
    return muted;
  }

  /** Remove a policy by name; returns whether one was removed. */
  unregister(name: string): boolean {
    return this.#byName.delete(name);
  }
}
