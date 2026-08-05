import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ExecutionError } from './errors.js';
import type { ExecutionPolicy, ExecutionPolicyInput } from './types.js';

/** Settle a name to a consistent structural form (collapse whitespace, trim, lowercase). */
const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * The execution policy factory: it validates an `ExecutionPolicyInput` and builds an immutable, normalized
 * `ExecutionPolicy`. It fails closed on a blank policy name or a blank barrier-capability entry. An empty barrier list is
 * a valid but inert policy. It builds a policy record only; it schedules and executes nothing.
 */
export class ExecutionPolicyFactory {
  /** Validate an input and build a frozen `ExecutionPolicy`, failing closed on an invalid input. */
  create(input: ExecutionPolicyInput): Result<ExecutionPolicy, ExecutionError> {
    const name = normalize(input.name);
    if (name === '') {
      return err(
        new ExecutionError(
          'EXECUTION.BLANK_POLICY_NAME',
          'An execution policy has a blank name.',
          {},
        ),
      );
    }
    const barrierCapabilities: string[] = [];
    for (const capability of input.barrierCapabilities ?? []) {
      const normalized = normalize(capability);
      if (normalized === '') {
        return err(
          new ExecutionError(
            'EXECUTION.BLANK_POLICY_ENTRY',
            `Execution policy '${name}' has a blank barrier capability.`,
            { policy: name },
          ),
        );
      }
      barrierCapabilities.push(normalized);
    }
    const policy: ExecutionPolicy = {
      name,
      barrierCapabilities: Object.freeze(barrierCapabilities),
    };
    return ok(Object.freeze(policy));
  }
}
