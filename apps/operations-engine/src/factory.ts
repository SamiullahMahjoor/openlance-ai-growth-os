import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { OperationsError } from './errors.js';
import { OperationsNormalizer } from './normalizer.js';
import type { OperationsPolicy, OperationsPolicyInput } from './types.js';

/**
 * The operations policy factory: it validates an `OperationsPolicyInput` and builds an immutable, normalized
 * `OperationsPolicy` (a named set of alert keys to mute). It fails closed on a blank policy name or a blank muted-alert
 * entry. An empty muted set is a valid but inert policy. It builds a policy record only; it monitors and executes
 * nothing.
 */
export class OperationsPolicyFactory {
  readonly #normalizer = new OperationsNormalizer();

  /** Validate an input and build a frozen `OperationsPolicy`, failing closed on an invalid input. */
  create(input: OperationsPolicyInput): Result<OperationsPolicy, OperationsError> {
    const name = this.#normalizer.normalize(input.name);
    if (name === '') {
      return err(
        new OperationsError(
          'OPERATIONS.BLANK_POLICY_NAME',
          'An operations policy has a blank name.',
          {},
        ),
      );
    }
    const mutedAlerts: string[] = [];
    for (const alert of input.mutedAlerts ?? []) {
      const normalized = this.#normalizer.normalize(alert);
      if (normalized === '') {
        return err(
          new OperationsError(
            'OPERATIONS.BLANK_POLICY_ENTRY',
            `Operations policy '${name}' has a blank muted-alert entry.`,
            { policy: name },
          ),
        );
      }
      mutedAlerts.push(normalized);
    }
    const policy: OperationsPolicy = { name, mutedAlerts: Object.freeze(mutedAlerts) };
    return ok(Object.freeze(policy));
  }
}
