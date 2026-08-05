import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { GovernanceError } from './errors.js';
import type { GovernanceGrant, GovernanceId } from './types.js';

/**
 * The governance grant registry: registration and deterministic lookup of grants by subject id. It preserves
 * registration order (Map insertion order), so authorization is deterministic. It holds grants (a subject's granted
 * permissions and autonomy), never the governance policy that authorized the grant, which is owned by ai/governance/.
 */
export class GovernanceRegistry {
  readonly #bySubject = new Map<GovernanceId, GovernanceGrant>();

  /** Register a grant. Fails closed on a duplicate subject (`GOVERNANCE.DUPLICATE_SUBJECT`). */
  register(grant: GovernanceGrant): Result<void, GovernanceError> {
    if (this.#bySubject.has(grant.subject)) {
      return err(
        new GovernanceError(
          'GOVERNANCE.DUPLICATE_SUBJECT',
          `A grant for subject '${grant.subject}' is already registered.`,
          { subject: grant.subject },
        ),
      );
    }
    this.#bySubject.set(grant.subject, grant);
    return ok(undefined);
  }

  /** Whether a grant for the given subject is registered. */
  has(subject: GovernanceId): boolean {
    return this.#bySubject.has(subject);
  }

  /** The registered grant for a subject, or `undefined`. */
  get(subject: GovernanceId): GovernanceGrant | undefined {
    return this.#bySubject.get(subject);
  }

  /** All registered grants, in registration order. */
  list(): readonly GovernanceGrant[] {
    return [...this.#bySubject.values()];
  }

  /** Remove a grant by subject; returns whether one was removed. */
  unregister(subject: GovernanceId): boolean {
    return this.#bySubject.delete(subject);
  }
}
