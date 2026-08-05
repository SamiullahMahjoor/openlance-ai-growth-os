import { AUTONOMY_LEVELS } from '@openlance/aios-governance';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { GovernanceError } from './errors.js';
import { GovernanceNormalizer } from './normalizer.js';
import type { GovernanceGrant, GovernanceGrantInput } from './types.js';

/**
 * The governance grant factory: it validates a `GovernanceGrantInput` and builds an immutable `GovernanceGrant`,
 * normalizing its subject and granted capability names. It fails closed on a blank subject, a granted capability that is
 * blank once normalized, or an autonomy level outside the frozen `AUTONOMY_LEVELS`. An empty permission set is a valid
 * grant (the subject is granted nothing, the least-privilege extreme). It builds a grant record only; it authorizes,
 * enforces, and executes nothing.
 */
export class GovernanceFactory {
  readonly #normalizer = new GovernanceNormalizer();

  /** Validate an input and build a frozen `GovernanceGrant`, failing closed on an invalid input. */
  create(input: GovernanceGrantInput): Result<GovernanceGrant, GovernanceError> {
    const subject = this.#normalizer.normalize(input.subject);
    if (subject === '') {
      return err(
        new GovernanceError('GOVERNANCE.BLANK_SUBJECT', 'A grant has a blank subject.', {}),
      );
    }
    if (!AUTONOMY_LEVELS.includes(input.autonomy)) {
      return err(
        new GovernanceError(
          'GOVERNANCE.INVALID_AUTONOMY',
          `Grant for subject '${subject}' has an invalid autonomy level '${input.autonomy}'.`,
          { subject, autonomy: input.autonomy },
        ),
      );
    }
    const permissions: string[] = [];
    for (const permission of input.permissions) {
      const normalized = this.#normalizer.normalize(permission);
      if (normalized === '') {
        return err(
          new GovernanceError(
            'GOVERNANCE.BLANK_CAPABILITY',
            `Grant for subject '${subject}' has a blank granted capability.`,
            { subject },
          ),
        );
      }
      permissions.push(normalized);
    }
    const grant: GovernanceGrant = {
      subject,
      permissions: Object.freeze(permissions),
      autonomy: input.autonomy,
    };
    return ok(Object.freeze(grant));
  }
}
